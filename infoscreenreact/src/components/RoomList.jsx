import React, { useRef, useMemo, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,
  faBuilding,
  faRulerCombined,
  faClock,
  faUserTie,
  faUserGraduate
} from "@fortawesome/free-solid-svg-icons";
import roomImages from "../roomImages"; // Import room images
import { useAutoScroll } from "../hooks/useAutoScroll"; // Import the optimized hook

// Translation object for room types
const detailsTranslations = {
  "Yhteistyötila": { en: "Collaboration Space", fi: "Yhteistyötila" },
  "Työtila": { en: "Workspace", fi: "Työtila" },
  "Oppimistila": { en: "Learning Space", fi: "Oppimistila" },
  "Henkilöstön työtila": { en: "Staff Workspace", fi: "Henkilöstön työtila" },
  "VR/AR -laboratorio": { en: "VR/AR Laboratory", fi: "VR/AR -laboratorio" },
  "Ryhmätyötila": { en: "Group Workspace", fi: "Ryhmätyötila" },
};

// Helper function to generate Tuudo link
const generateTuudoLink = (roomNumber) => {
  const toHex = (text) => {
    return [...text]
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase())
      .join("");
  };
  return `https://l14k.tuudo.fi/b004/?ix=3130303635&rx=${toHex(roomNumber)}`;
};

// Function to check if the room is currently reserved
export const isRoomReserved = (room) => {
  const now = new Date(); // Hanki nykyhetki

  // Tarkista, onko nykyinen varaus voimassa
  if (room.currentReservation) {
    const currentStart = new Date(room.currentReservation.startDate);
    const currentEnd = new Date(room.currentReservation.endDate);
    if (now >= currentStart && now < currentEnd) {
      return true;
    }
  }

  // Tarkista, onko seuraava varaus alkanut, mutta sitä ei ole siirretty currentReservationiin
  if (room.nextReservation) {
    const nextStart = new Date(room.nextReservation.startDate);
    const nextEnd = new Date(room.nextReservation.endDate);

    if (now >= nextStart && now < nextEnd) {
      return true; // Tämä varaus on jo alkanut
    }
  }

  return false; // Huone on vapaa
};

/**
 * RoomList component displays a list of rooms with their details, availability, and QR codes.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.rooms - Array of room objects containing details about each room.
 * @param {string} props.language - The language to display the room details ("fi" for Finnish, "en" for English).
 * @param {boolean} props.autoScroll - Whether the room list should auto-scroll.
 * @param {boolean} props.reservableStudents - Whether to filter rooms reservable by students.
 * @param {boolean} props.reservableStaff - Whether to filter rooms reservable by staff.
 * @param {boolean} props.showMap - Whether to display the map view.
 * @param {boolean} props.isLargeView - Whether to display the large view layout.
 *
 * @returns {JSX.Element} A scrollable grid of room cards with details and QR codes.
 */

const RoomList = ({ rooms, language, autoScroll, reservableStudents, reservableStaff, showMap, isLargeView }) => {

  const scrollRef = useRef(null);
  useAutoScroll(scrollRef, autoScroll, 25); // Use the optimized hook
  const excludedRoomNumbers = ["KMC590", "KMD558", "KMD590", "KMC501", "KMD616", "KMD716", "KMC591"];

  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      !isRoomReserved(room) &&
      !excludedRoomNumbers.includes(room.roomNumber) &&
      (
        (!reservableStudents && !reservableStaff) ||
        (reservableStudents &&
          room.reservableStudents === "true" &&
          (room.details === "Yhteistyötila" || room.details === "Ryhmätyötila")
        ) ||
        (reservableStaff &&
          room.reservableStaff === "true" &&
          room.details === "Henkilöstön työtila")
      )
    );
  }, [rooms, reservableStudents, reservableStaff]);



  const translateDetails = useCallback((details, language) => {
    return detailsTranslations[details]?.[language] || details;
  }, []);

  if (filteredRooms.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {language === "fi"
          ? "Ei saatavilla olevia huoneita valitulle kerrokselle."
          : "No rooms available for the selected floor."}
      </p>
    );
  }

  return (
    <div ref={scrollRef}
      className="overflow-auto h-full w-full"
      style={{ scrollBehavior: "auto", maxHeight: "90vh", willChange: "transform, scroll-position", transform: "translateZ(0)", }}>


      <div className={`grid gap-6 ${isLargeView ? "grid-cols-2" : showMap ? "grid-cols-3" : "room-grid"}`}>

        {filteredRooms.map((room) => {
          const roomReserved = isRoomReserved(room);
          const formattedRoomNumber = room.roomNumber.replace(/\./g, "_");
          const roomImage = roomImages[formattedRoomNumber];

          return (
            <div key={room.roomNumber} className={`${isLargeView ? "w-[500px] h-[400px]" : "w-[350px] h-[310px]"} p-1`}>
              <div className={`w-full h-full room-card bg-white shadow-lg rounded-2xl border-4 border-gray-200 flex flex-row p-3 ${isLargeView ? "shadow-2xl" : ""}`}>

                {/* Vasemman puolen sisältö */}
                <div className="flex-1">
                  <h3 className={`font-title font-bold text-orange-600 ${isLargeView ? "text-3xl" : "text-2xl"}`}>
                    {room.roomNumber || (language === "fi" ? "Nimetön huone" : "Unnamed Room")}
                  </h3>

                  <p className={`font-body text-gray-600 font-semibold underline ${isLargeView ? "text-2xl" : "text-sm"}`}>
                    {translateDetails(room.details, language)}
                  </p>

                  <p className={`font-body flex items-center text-gray-700 ${isLargeView ? "text-2xl" : "text-sm"}`}>
                    <FontAwesomeIcon icon={faBuilding} className={`mr-2 text-gray-500 ${isLargeView ? "text-2xl" : ""}`} />
                    {language === "fi" ? "Kerros" : "Floor"} {room.floor} | {room.wing || "?"}
                  </p>

                  <p className={`font-body flex items-center text-gray-700 ${isLargeView ? "text-2xl" : "text-base"}`}>
                    <FontAwesomeIcon icon={faUsers} className={`mr-2 text-gray-500 ${isLargeView ? "text-2xl" : ""}`} />
                    {room.persons || "?"} {language === "fi" ? "henkilöä" : "persons"}
                  </p>

                  <p className={`font-body flex items-center text-gray-700 ${isLargeView ? "text-2xl" : "text-base"}`}>
                    <FontAwesomeIcon icon={faRulerCombined} className={`mr-2 text-gray-500 ${isLargeView ? "text-2xl" : ""}`} />
                    {room.squareMeters || "0"} m²
                  </p>

                  {!roomReserved && (
                    <p className={`font-body flex items-center font-bold ${room.nextReservation ? "text-orange-500" : "text-blue-700"} ${isLargeView ? "text-2xl" : "text-sm"}`}>
                      <FontAwesomeIcon icon={faClock} className={`mr-2 ${isLargeView ? "text-xl" : ""}`} />
                      {room.nextReservation
                        ? language === "fi"
                          ? `Vapaa klo ${new Date(room.nextReservation.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} asti`
                          : `Available until ${new Date(room.nextReservation.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : language === "fi"
                          ? "Vapaana koko päivän"
                          : "Available all day"}
                    </p>
                  )}

                  {/* Varausikonit */}
                  <div className="font-body flex flex-col items-start mt-3">
                    {room.reservableStaff === "true" && (
                      <span className={`flex items-center font-semibold text-blue-800 ${isLargeView ? "text-2xl" : "text-base"}`}>
                        <FontAwesomeIcon icon={faUserTie} className={`mr-2 text-blue-800 ${isLargeView ? "text-2xl" : "text-lg"}`} />
                        {language === "fi" ? "Henkilökunta" : "Staff"}
                      </span>
                    )}
                    {room.reservableStudents === "true" && (
                      <span className={`flex items-center font-semibold text-orange-800 mt-2 ${isLargeView ? "text-2xl" : "text-sm"}`}>
                        <FontAwesomeIcon icon={faUserGraduate} className={`mr-2 text-orange-800 ${isLargeView ? "text-2xl" : "text-lg"}`} />
                        {language === "fi" ? "Opiskelijat" : "Students"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Oikea puoli: kuva ja QR */}
                <div className={`flex flex-col justify-between items-center sm:ml-4 flex-shrink-0 w-full ${isLargeView ? "sm:w-[180px]" : "sm:w-[140px]"} h-full`}>
                  {roomImage && (
                    <div className={`${isLargeView ? "w-[240px]" : "w-[205px]"} aspect-[3/2] rounded-md overflow-hidden bg-gray-100`}>
                      <img
                        src={roomImage}
                        className="w-full h-full object-cover rounded-md translate-x-[-35px]"
                        alt="Room"
                      />
                    </div>
                  )}
                  <div className="mt-auto">
                    <a href={generateTuudoLink(room.roomNumber)} target="_blank" rel="noopener noreferrer">
                      <QRCodeSVG
                        value={generateTuudoLink(room.roomNumber)}
                        size={isLargeView ? 160 : 130}
                        className="border border-gray-200 rounded-md shadow-sm"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomList;
