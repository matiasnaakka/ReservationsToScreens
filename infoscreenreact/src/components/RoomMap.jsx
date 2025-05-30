import React, { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";
import Floor6SVG from "../assets/6thfloormap.svg";
import Floor5SVG from "../assets/5thfloormap.svg";
import { isRoomReserved } from "../utils/roomUtils";

/**
 * RoomMap component renders an interactive SVG map of a floor with room color coding
 * based on reservation status and filter criteria.
 *
 * @component
 * @param {Object[]} rooms - Array of room objects containing room details.
 * @param {string} rooms[].roomNumber - The unique identifier for the room.
 * @param {string} rooms[].reservableStudents - Indicates if the room is reservable by students ("true" or "false").
 * @param {string} rooms[].reservableStaff - Indicates if the room is reservable by staff ("true" or "false").
 * @param {string} selectedFloor - The currently selected floor ("5", "6", or "7").
 * @param {string} reservableFilter - Filter criteria for reservable rooms ("staff", "students", or undefined).
 *
 * @returns {JSX.Element} The rendered RoomMap component.
 *
 * @example
 * <RoomMap
 *   rooms={[
 *     { roomNumber: "KMC550", reservableStudents: "true", reservableStaff: "false" },
 *     { roomNumber: "KMC590", reservableStudents: "false", reservableStaff: "true" },
 *   ]}
 *   selectedFloor="5"
 *   reservableFilter="students"
 * />
 */

const RoomMap = ({ rooms, selectedFloor, reservableFilter }) => {
  const svgRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  const updateRoomColors = () => {
    if (!svgRef.current || !svgLoaded) return;

    const alwaysYellowRooms = ["KMC550", "KMC590"];
    const filterByStaff = reservableFilter === "staff";
    const filterByStudents = reservableFilter === "students";

    rooms.forEach((room) => {
      const normalizedId = room.roomNumber.replace(/\./g, "\\.");
      const roomElement = svgRef.current.querySelector(`#${normalizedId}`);

      if (roomElement) {
        let roomColor = "#4caf50"; // default: green
        let stroke = "#000000";
        let strokeWidth = "1";
        let dashArray = "none";

        if (alwaysYellowRooms.includes(room.roomNumber)) {
          roomColor = "#53565a"; // gray for manually set
        } else if (isRoomReserved(room)) {
          roomColor = "#f44336"; // red
          dashArray = "4,2"; // dashed outline for reserved
        } else if (filterByStudents && room.reservableStudents !== "true") {
          roomColor = "#53565a"; // gray
        } else if (filterByStaff && room.reservableStaff !== "true") {
          roomColor = "#53565a"; // gray
        }

        roomElement.setAttribute("fill", roomColor);
        roomElement.setAttribute("stroke", stroke);
        roomElement.setAttribute("stroke-width", strokeWidth);
        if (dashArray !== "none") {
          roomElement.setAttribute("stroke-dasharray", dashArray);
        } else {
          roomElement.removeAttribute("stroke-dasharray");
        }
      } else {
        console.warn(`⚠️ No SVG element found for room: ${room.roomNumber}`);
      }
    });
  };

  useEffect(() => {
    if (svgLoaded) {
      const frame = requestAnimationFrame(() => updateRoomColors());
      return () => cancelAnimationFrame(frame);
    }
  }, [rooms, selectedFloor, svgLoaded, reservableFilter]);

  const getFloorSVG = () => {
    switch (selectedFloor) {
      case "5":
        return Floor5SVG;
      case "6":
        return Floor6SVG;
      case "7":
        return Floor7SVG;
      default:
        return null;
    }
  };

  const floorSVG = getFloorSVG();

  if (!floorSVG) {
    return <div className="text-gray-500">No map available for this floor.</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <InlineSVG
        src={floorSVG}
        onLoad={() => setSvgLoaded(true)}
        innerRef={svgRef}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default RoomMap;
