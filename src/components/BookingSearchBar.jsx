import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

const destinations = [
  { name: "London", subtitle: "Greater London, United Kingdom" },
  { name: "New York", subtitle: "New York State, United States" },
  { name: "Paris", subtitle: "France" },
  { name: "Madrid", subtitle: "Spain" },
];
// helper functions
const isSameDate = (d1, d2) =>
  d1 &&
  d2 &&
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isBetween = (date, start, end) =>
  start && end && date > start && date < end;

const formatDateLabel = (date) => {
  if (!date) return "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getDay()]} ${date.getDate()} ${
    months[date.getMonth()]
  }`;
};

const buildMonth = (year, monthIndex) => {
  const firstDay = new Date(year, monthIndex, 1).getDay(); // 0-6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, monthIndex, d));
  }

  return cells;
};

const BookingSearchBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [rooms, setRooms] = useState(1);

  const toggleDropdown = (type) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  const handleSelectLocation = (city) => {
    setSelectedLocation(city.name);
    setLocation(city.name);
    setActiveDropdown(null);
  };

  const handleDayClick = (date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
    } else if (checkIn && !checkOut) {
      if (date >= checkIn) {
        setCheckOut(date);
      } else {
        setCheckIn(date);
        setCheckOut(null);
      }
    }
  };

  const summaryGuests = `${adults} adults • ${children} children • ${rooms} room`;
  const dateSummary =
    checkIn && checkOut
      ? `${formatDateLabel(checkIn)} - ${formatDateLabel(checkOut)}`
      : "Add dates";

  const handleSearch = () => {
    console.log({
      location: selectedLocation || location,
      checkIn,
      checkOut,
      guests: { adults, children, rooms },
    });
  };

  const handleCount = (type, op) => {
    if (type === "adults") {
      setAdults((prev) => Math.max(1, prev + (op === "inc" ? 1 : -1)));
    }
    if (type === "children") {
      setChildren((prev) => Math.max(0, prev + (op === "inc" ? 1 : -1)));
    }
    if (type === "rooms") {
      setRooms((prev) => Math.max(1, prev + (op === "inc" ? 1 : -1)));
    }
  };

  const julyCells = buildMonth(2024, 6);
  const augustCells = buildMonth(2024, 7);

  return (
    <div className="w-full flex flex-col items-center justify-start text-gray-900 px-3">
      {/* Search Bar */}
      <div className="relative w-full max-w-5xl">
        <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-stretch lg:items-center lg:rounded-full shadow-xl overflow-hidden border border-gray-200 bg-gray-100 px-3 py-3 rounded-xl">
          {/* Location */}
          <button
            type="button"
            onClick={() => toggleDropdown("location")}
            className="w-full lg:flex-1 px-4 lg:px-6 py-3 text-left lg:border-r border-gray-200 hover:bg-gray-50 rounded-lg lg:rounded-none"
          >
            <div className="text-xs font-semibold uppercase text-gray-500">
              Location
            </div>
            <div className="text-sm text-gray-900 truncate">
              {selectedLocation || location || "Where are you going?"}
            </div>
          </button>

          {/* Dates */}
          <button
            type="button"
            onClick={() => toggleDropdown("dates")}
            className="w-full lg:flex-1 px-4 lg:px-6 py-3 text-left lg:border-r border-gray-200 hover:bg-gray-50 rounded-lg lg:rounded-none"
          >
            <div className="text-xs font-semibold uppercase text-gray-500">
              Check in - Check out
            </div>
            <div className="text-sm text-gray-900 truncate">
              {dateSummary}
            </div>
          </button>

          {/* Guests */}
          <button
            type="button"
            onClick={() => toggleDropdown("guests")}
            className="w-full lg:flex-1 px-4 lg:px-6 py-3 text-left hover:bg-gray-50 rounded-lg lg:rounded-none"
          >
            <div className="text-xs font-semibold uppercase text-gray-500">
              Guest
            </div>
            <div className="text-sm text-gray-900 truncate">
              {summaryGuests}
            </div>
          </button>

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto lg:px-9 lg:py-4 px-4 py-3 mt-1 lg:mt-0 bg-blue-600 text-white font-semibold rounded-full text-sm hover:bg-slate-900 transition cursor-pointer flex justify-center gap-2 items-center"
          >
            <FaSearch />
            Search
          </button>
        </div>

        {/* LOCATION DROPDOWN */}
        {activeDropdown === "location" && (
          <div className="absolute left-0 mt-3 w-full lg:w-96 bg-white rounded-2xl shadow-2xl p-5 z-20 border border-gray-200">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you going?"
              className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {destinations.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => handleSelectLocation(city)}
                  className="w-full flex flex-col items-start px-2 py-2 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      <FiMapPin />
                    </span>
                    <span className="text-sm font-medium">{city.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">
                    {city.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DATES DROPDOWN – SELECTABLE RANGE */}
        {activeDropdown === "dates" && (
          <div className="absolute left-0 mt-3 w-full bg-white rounded-2xl shadow-2xl p-4 lg:p-6 z-20 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-700">
                July 2024
              </span>
              <span className="text-sm font-semibold text-gray-700">
                August 2024
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 text-center text-xs text-gray-500">
              {/* July */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {julyCells.map((date, idx) =>
                    date ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDayClick(date)}
                        className={[
                          "aspect-square flex items-center justify-center rounded-full hover:ring-2 hover:ring-blue-500 text-xs lg:text-sm",
                          isSameDate(date, checkIn) ||
                          isSameDate(date, checkOut)
                            ? "bg-blue-600 text-white"
                            : isBetween(date, checkIn, checkOut)
                            ? "bg-blue-100 text-gray-900"
                            : "text-gray-700",
                        ].join(" ")}
                      >
                        {date.getDate()}
                      </button>
                    ) : (
                      <div key={idx}></div>
                    )
                  )}
                </div>
              </div>

              {/* August */}
              <div>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1 text-sm">
                  {augustCells.map((date, idx) =>
                    date ? (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDayClick(date)}
                        className={[
                          "aspect-square flex items-center justify-center rounded-full hover:ring-2 hover:ring-blue-500 text-xs lg:text-sm",
                          isSameDate(date, checkIn) ||
                          isSameDate(date, checkOut)
                            ? "bg-blue-600 text-white"
                            : isBetween(date, checkIn, checkOut)
                            ? "bg-blue-100 text-gray-900"
                            : "text-gray-700",
                        ].join(" ")}
                      >
                        {date.getDate()}
                      </button>
                    ) : (
                      <div key={idx}></div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GUESTS DROPDOWN */}
        {activeDropdown === "guests" && (
          <div className="absolute right-0 lg:right-24 mt-3 w-72 lg:w-80 bg-white rounded-2xl shadow-2xl p-6 z-20 border border-gray-200">
            {/* Adults */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-gray-800">Adults</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCount("adults", "dec")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  –
                </button>
                <span className="w-4 text-center text-sm">{adults}</span>
                <button
                  type="button"
                  onClick={() => handleCount("adults", "inc")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-gray-800">
                  Children
                </div>
                <div className="text-xs text-gray-500">Ages 0 - 17</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCount("children", "dec")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  –
                </button>
                <span className="w-4 text-center text-sm">{children}</span>
                <button
                  type="button"
                  onClick={() => handleCount("children", "inc")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Rooms */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Rooms</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCount("rooms", "dec")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  –
                </button>
                <span className="w-4 text-center text-sm">{rooms}</span>
                <button
                  type="button"
                  onClick={() => handleCount("rooms", "inc")}
                  className="w-8 h-8 border border-blue-500 rounded-md flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSearchBar;
