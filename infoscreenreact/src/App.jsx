import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { fetchAllRooms } from "./api";
const RoomList = lazy(() => import("./components/RoomList"));
const RoomMap = lazy(() => import("./components/RoomMap"));
const Instructions = lazy(() => import("./components/instructions"));
import { isRoomReserved } from "./components/RoomList";

const getInitialScreen = () => {
  const stored = sessionStorage.getItem("currentLoopScreen");
  return stored || "roomList";
};

const App = () => {
  const [error, setError] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen());

  const [searchParams, setSearchParams] = useSearchParams();
  const [autoScroll, setAutoScroll] = useState(searchParams.get("autoScroll") === "true");
  const loopMode = searchParams.get("loopMode") === "true"; // ✅ Read loop mode from URL
  const navigate = useNavigate();

  const loopTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  // Extract floor and reservable settings from URL parameters
  const showFree = !searchParams.has("floor") || searchParams.get("showFree") === "true";
  const reservableFilterFromURL = searchParams.get("reservable");
  const reservableStudentsFilter = reservableFilterFromURL === "students";
  const reservableStaffFilter = reservableFilterFromURL === "staff";
  // ✅ Define floorFromURL before using it
  const floorFromURL = searchParams.get("floor") || "all";
  const floorMapParam = searchParams.get("floorMap");

  const loopRoomTime = parseInt(searchParams.get("loopRoomTime")) || 20; //20
  const loopMapTime = parseInt(searchParams.get("loopMapTime")) || 10; //3

  // ✅ Add new state for filtering by staff
  const [floorMapInLoop, setFloorMapInLoop] = useState(floorMapParam || "5");
  const [reservableStudents, setReservableStudents] = useState(reservableStudentsFilter);
  const [reservableStaff, setReservableStaff] = useState(reservableStaffFilter);
  const [selectedFloor, setSelectedFloor] = useState(floorFromURL);
  const [reservableFilter, setReservableFilter] = useState(reservableFilterFromURL);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]); // ✅ Add this state
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showFullScreenMap, setShowFullScreenMap] = useState(loopMode);
  const [nextScreen, setNextScreen] = useState(""); // Text for what's next
  const [timeLeft, setTimeLeft] = useState(0);
  const [roomDetails, setRoomDetails] = useState([]); // Cached room details
  const [roomReservations, setRoomReservations] = useState([]);

  const [isLargeCountdown, setIsLargeCountdown] = useState(false);


  // Floors list for dropdown
  const floors = ["2", "5", "6", "7"];

  const reservableAudience =
    (reservableStudents || reservableStaff)
      ? reservableStudents
        ? language === "en"
          ? "Reservable for Students"
          : "Varattavissa opiskelijoille"
        : language === "en"
          ? "Reservable for Staff"
          : "Varattavissa henkilökunnalle"
      : "";

  const translations = {
    en: {
      title: "Campus Rooms Available",
      showInstructions: "Show Instructions",
      hideInstructions: "Hide Instructions",
      floor: "Floor",
      loading: "Loading rooms...",
      noRooms: "No rooms available for the selected criteria.",
      closeMap: "Close Map",
      filterStudents: "Show Student Reservable Rooms",
      allRooms: "Show All Rooms",
      scanQRCode: "📲 Scan the room's QR code to reserve it.",
      nextScreen: "Coming next:",
      timeLeft: "",
      roomList: "Room List",
      fullMap: "Full Map",
      map: "Map View",
      scanQRCodeHeader: "Scan the room's QR code to reserve it.",
    },
    fi: {
      title: "Kampuksen Vapaat Tilat",
      showInstructions: "Näytä ohjeet",
      hideInstructions: "Piilota ohjeet",
      floor: "Kerros",
      loading: "Ladataan huoneita...",
      noRooms: "Valitulla hakuehdolla ei ole vapaita huoneita.",
      closeMap: "Sulje kartta",
      filterStudents: "Näytä opiskelijoiden varattavat tilat",
      allRooms: "Näytä kaikki tilat",
      scanQRCode: "📲 Skannaa huoneen QR-koodi varataksesi sen.",
      nextScreen: "Seuraavaksi:",
      timeLeft: "",
      roomList: "Huonelista",
      fullMap: "Koko näytön kartta",
      map: "Karttanäkymä",
      scanQRCodeHeader: "Skannaa QR-koodi varataksesi huoneen.",
    },
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (reservableStudents) {
      params.set("reservable", "students");
    } else if (reservableStaff) {
      params.set("reservable", "staff");
    } else {
      params.delete("reservable");
    }

    if (selectedFloor !== "all") {
      params.set("floor", selectedFloor);
    } else {
      params.delete("floor");
    }

    if (autoScroll) { // ✅ Ensure autoScroll is in URL
      params.set("autoScroll", "true");
    } else {
      params.delete("autoScroll");
    }

    const newUrl = `?${params.toString()}`;
    if (window.location.search !== newUrl) {
      navigate(newUrl, { replace: true });
    }
  }, [reservableStudents, reservableStaff, selectedFloor, autoScroll, navigate]);

  const fetchData = async () => {
    if (loading) return; // 🔥 Älä hae uutta dataa, jos jo latauksessa!

    setLoading(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      let allRooms = [];

      if (selectedFloor !== "all") {
        allRooms = await fetchAllRooms(selectedFloor, `${currentDate}T00:00`, `${currentDate}T23:59`);
      } else {
        const floorsToFetch = ["2", "5", "6", "7"];
        const roomPromises = floorsToFetch.map(floor =>
          fetchAllRooms(floor, `${currentDate}T00:00`, `${currentDate}T23:59`)
        );
        const results = await Promise.all(roomPromises);
        allRooms = results.flat();
      }

      const now = new Date();
      allRooms = allRooms.map((room) => {
        if (room.nextReservation) {
          const nextEnd = new Date(room.nextReservation.endDate);
          if (now >= nextEnd) return { ...room, nextReservation: null };
        }
        return room;
      });

      const excludedRoomNumbers = ["KMC590", "KMD558", "KMD590", "KMC501", "KMD616", "KMD716", "KMC591"];

      const filteredRoomCards = allRooms.filter(room =>
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

      setRooms([...allRooms]);
      setFilteredRooms(filteredRoomCards);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Something went wrong while loading rooms. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomReservations = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const floorList = selectedFloor !== "all" ? [selectedFloor] : ["2", "5", "6", "7"];

      const reservationPromises = floorList.map(floor =>
        fetchAllRooms(floor, `${currentDate}T00:00`, `${currentDate}T23:59`)
      );

      const reservationResults = await Promise.all(reservationPromises);
      const updatedReservations = reservationResults.flat();

      setRoomReservations(updatedReservations);
    } catch (error) {
      console.error("Error fetching room reservations:", error);
      setError("Something went wrong while loading rooms. Please try again later.");
    }
  };

  // 🔹 Call it inside a useEffect when `selectedFloor` changes
  useEffect(() => {
    fetchRoomReservations();
  }, [selectedFloor]);

  useEffect(() => {
    if (roomDetails.length === 0) return; // Ensure we have room details

    const updatedRooms = roomDetails.map(room => {
      const updatedRoom = roomReservations.find(r => r.roomNumber === room.roomNumber);
      return updatedRoom ? { ...room, ...updatedRoom } : room;
    });

    setFilteredRooms(updatedRooms);
  }, [roomDetails, roomReservations]);


  // 🔹 Estä turhat kutsut useEffectissä:
  useEffect(() => {
    fetchRoomReservations(); // ✅ Fetch reservations when component mounts
    const interval = setInterval(fetchRoomReservations, 60000); // Refresh reservations every 60 sec
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Automatically switch language every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prevLanguage) => (prevLanguage === "en" ? "fi" : "en"));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 🔥 Vain kerran minuutissa
    return () => clearInterval(interval);
  }, [selectedFloor, reservableStudents, reservableStaff]); // 🔥 Varmista, että useEffect kutsuu API:ta vain tarpeen mukaan

  useEffect(() => {
    if (!loopMode) return;

    const screens = [
      { screen: "roomList", duration: loopRoomTime, next: "map" },
      { screen: "map", duration: loopMapTime, next: "roomList" },
    ];

    let currentIndex = screens.findIndex((s) => s.screen === currentScreen);
    if (currentIndex === -1) currentIndex = 0;

    const runLoop = () => {
      const current = screens[currentIndex];
      const next = screens.find((s) => s.screen === current.next);

      setCurrentScreen(current.screen);
      setTimeLeft(current.duration);
      setNextScreen(translations[language][next.screen]);
      setShowFullScreenMap(current.screen === "map");

      currentIndex = screens.findIndex((s) => s.screen === next.screen);
      loopTimeoutRef.current = setTimeout(runLoop, current.duration * 1000);
    };

    // ✅ Käynnistä loop asynkronisesti eikä heti
    loopTimeoutRef.current = setTimeout(runLoop, 0);

    return () => clearTimeout(loopTimeoutRef.current);
  }, [loopMode, currentScreen]); // 🛠 currentScreen mukaan, jotta indeksi pysyy syncissä


  useEffect(() => {
    if (loopMode) {
      sessionStorage.setItem("currentLoopScreen", currentScreen);
    }
  }, [currentScreen, loopMode]);

  useEffect(() => {
    if (!loopMode) return;

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(countdownIntervalRef.current);
  }, [loopMode]);

  // AutoScroll feature
  useEffect(() => {
    const newAutoScroll = searchParams.get("autoScroll") === "true";
    setAutoScroll(newAutoScroll);
  }, [searchParams]);

  const showFullWidthCards = !loopMode && (!showMap || selectedFloor === "all");

  useEffect(() => {
    const checkResolution = () => {
      const isTargetSize = window.innerWidth >= 1080 && window.innerHeight >= 1980 && window.innerHeight > window.innerWidth;
      setIsLargeCountdown(isTargetSize);
    };

    checkResolution();
    window.addEventListener("resize", checkResolution);
    return () => window.removeEventListener("resize", checkResolution);
  }, []);

  useEffect(() => {
    const newFloorMap = searchParams.get("floorMap");
    if (newFloorMap) setFloorMapInLoop(newFloorMap);
  }, [searchParams]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (

    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      {/* ✅ Countdown Banner (Only if loopMode is active) */}
      {loopMode && (
        <div className={`absolute bottom-4 right-4 bg-black bg-opacity-80 text-white font-bold rounded-xl shadow-lg transition-all duration-500 ease-in-out transform z-[9999] flex items-center space-x-4
    ${isLargeCountdown ? "px-10 py-6" : "px-10 py-3"}`}>

          {/* Tekstit vasemmalla */}
          <div className="text-right">
            <p className={`tracking-wide opacity-80 ${isLargeCountdown ? "text-2xl" : "text-xl"}`}>
              {translations[language].nextScreen}
            </p>
            <p className={`${isLargeCountdown ? "text-3xl" : "text-2xl"} font-extrabold tracking-widest`}>
              {nextScreen}
            </p>
          </div>

          {/* Ajan laskuri oikealla */}
          <div className={`flex items-center justify-center bg-white text-black rounded-full font-extrabold shadow-md
      ${isLargeCountdown ? "w-24 h-24 text-5xl" : "w-20 h-20 text-3xl"}`}>
            {timeLeft}
          </div>
        </div>
      )}

      {/* ✅ Video Overlay (Only if loopMode is active) */}
      {loopMode && showFullScreenMap ? (
        /* ✅ Fullscreen Map Mode */
        <div className="absolute inset-0 flex justify-center items-center bg-white transition-opacity duration-1000">
          <div className="w-[90vw] h-[90vh] flex justify-center items-center">
            <Suspense fallback={<p className="text-center text-gray-500">Loading map...</p>}>
              <RoomMap
                rooms={rooms}
                selectedFloor={loopMode ? floorMapInLoop : selectedFloor}
                reservableFilter={reservableFilter} // ✅ Pass this in
              />
            </Suspense>
          </div>
        </div>
      ) : (
        /* ✅ Normal Mode: Show Room List & Map */
        <div className={`relative w-full ${selectedFloor === "2" ? "md:w-full" : "md:w-5/7"} h-full p-4 overflow-auto`}>
          <header className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* 🔹 Pääotsikko */}
              <h1 className={`font-title text-metropoliaOrange font-bold drop-shadow-lg flex items-center 
  ${isLargeCountdown ? "text-6xl" : "text-4xl"}`}>
                {`${translations[language].title} - ${selectedFloor === "all"
                  ? language === "fi"
                    ? "Kaikki kerrokset"
                    : "All Floors"
                  : `${language === "fi" ? "Kerros" : "Floor"} ${selectedFloor}`
                  }`}
                {reservableAudience && (
                  <span className={`ml-4 font-title text-gray-600 bg-gray-200 px-3 py-1 rounded-md shadow-sm 
      ${isLargeCountdown ? "text-2xl" : "text-lg"}`}>
                    {reservableAudience}
                  </span>
                )}
              </h1>


              {/* 🔹 Ohjeet-nappi */}
              <div className="relative group">
                <button
                  className="text-sm bg-white border px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  {showInstructions ? translations[language].hideInstructions : translations[language].showInstructions}
                </button>
              </div>

              {/* 🔹 Kerrosvalikko */}
              <div className="relative group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <select
                    value={selectedFloor}
                    onChange={(e) => setSelectedFloor(e.target.value)}
                    className="text-sm bg-white border px-4 py-2 rounded shadow-md"
                  >
                    {floors.map((floor) => (
                      <option key={floor} value={floor}>
                        {`${translations[language].floor} ${floor}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 🔥 Lisätään teksti QR-koodista ohjeiden ja dropdownin oikealle puolelle */}
            {showFullWidthCards && (
              <h2 className="text-lg font-bold text-gray-700">
                {translations[language].scanQRCodeHeader}
              </h2>
            )}
          </header>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded shadow text-center">
              {error}
            </div>
          )}
          {/* ✅ Conditionally render Instructions with Lazy Loading */}
          {showInstructions && (
            <Suspense fallback={<p className="text-center text-gray-500">Loading instructions...</p>}>
              <Instructions />
            </Suspense>
          )}
          {/* ✅ Always render RoomList with Lazy Loading */}
          <main className="h-auto">
            {loading ? (
              <p className="text-center text-gray-800 font-body drop-shadow-lg">
                {translations[language].loading}
              </p>
            ) : (
              <Suspense fallback={<p className="text-center text-gray-500">Loading rooms...</p>}>
                <RoomList
                  rooms={filteredRooms}
                  language={language}
                  autoScroll={autoScroll}
                  reservableStudents={reservableStudents}
                  reservableStaff={reservableStaff}
                  showMap={!showFree && selectedFloor && !loopMode}
                  isLargeView={isLargeCountdown} // ⬅️ tämä lisätään
                />
              </Suspense>
            )}
          </main>
        </div>
      )}
      {/* ✅ Map Display (Normal Mode) */}
      {!showFree && selectedFloor && !loopMode && (
        <div className={`absolute md:static inset-0 md:w-2/7 h-full p-4 bg-gray-200 flex flex-col items-center ${showMap ? "flex" : "hidden md:flex"}`}>
          <div className="relative w-full h-full">
            <Suspense fallback={<p className="text-center text-gray-500">Loading map...</p>}>
              <RoomMap rooms={rooms} selectedFloor={selectedFloor} reservableFilter={reservableFilter} />
            </Suspense>
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg md:hidden"
              onClick={() => setShowMap(false)}
            >
              {translations[language].closeMap}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
