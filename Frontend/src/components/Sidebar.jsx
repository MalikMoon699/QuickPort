import React, { useState, useEffect, useRef } from "react";
import {
  CalendarDays,
  CircleDot,
  CirclePlus,
  Clock,
  LocateFixed,
  MapPin,
  Menu,
  SquareStop,
  Trash2,
} from "lucide-react";
import PickupTime from "./PickupTime";

const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const existingScript = document.getElementById("google-maps-script");
    if (existingScript) {
      existingScript.onload = () => resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);

    document.body.appendChild(script);
  });
};

const Sidebar = ({ setLocationType, locationType, startLocation, setStartLocation, endLocation, setEndLocation, stopLocation, setStopLocation }) => {
  const [isStopAdded, setIsStopAdded] = useState(false);
  const [isPickupTime, setIsPickupTime] = useState(false);
  const [pickupTime, setPickupTime] = useState("now");
  const [pickupDate, setPickupDate] = useState("Today");
  const [pickupSelection, setPickupSelection] = useState("");
  const [pickupSelectionModel, setPickupSelectionModel] = useState(false);
  const [isFocused, setIsFocused] = useState(null);
  const containerRef = useRef(null);

  const [suggestions, setSuggestions] = useState([]);
  const [mapsReady, setMapsReady] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(import.meta.env.VITE_GOOGLE_MAPS_API_KEY).then(() =>
      setMapsReady(true)
    );
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFocused(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setPickupTime("now");
    setPickupDate("Today");
    setIsPickupTime(false);
  };

  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const dateObj = new Date(pickupDate);
  const shortDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
                import.meta.env.VITE_GOOGLE_MAPS_API_KEY
              }`
            );
            const data = await res.json();
            if (data.results.length > 0) {
              setStartLocation(data.results[0].formatted_address);
            }
            setLocationType("start");
            setIsFocused(null);
          } catch (err) {
            console.error("Geocode error:", err);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (!mapsReady || !startLocation) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: startLocation, componentRestrictions: { country: "pk" } },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [startLocation, mapsReady]);

  useEffect(() => {
    if (!mapsReady || !endLocation) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: endLocation, componentRestrictions: { country: "pk" } },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [endLocation, mapsReady]);

  useEffect(() => {
    if (!mapsReady || !stopLocation) {
      setSuggestions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      { input: stopLocation, componentRestrictions: { country: "pk" } },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [stopLocation, mapsReady]);

  const handleFocus = (id) => {
    setIsFocused(id);
  };

  return (
    <>
      {!isPickupTime ? (
        <div className="home-sidebar-container">
          <span>Get a ride</span>
          <div className="home-sidebar-inputs">
            <CircleDot size={25} fill="black" color="white" />
            <input
              type="text"
              placeholder="Pickup location"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              onFocus={() => handleFocus("start")}
            />
            {isFocused === "start" &&
              (startLocation === "" ? (
                <div className="home-sidebar-inputs-location-options">
                  <div
                    onClick={handleUseCurrentLocation}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      <MapPin />
                    </span>
                    Use current location
                  </div>
                  <div
                    onClick={() => {
                      setLocationType("start");
                      setIsFocused(null);
                    }}
                  >
                    <span>
                      <LocateFixed />
                    </span>
                    Set location on map
                  </div>
                </div>
              ) : (
                <div className="home-sidebar-inputs-location-options">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug) => (
                      <div
                        key={sug.place_id}
                        onClick={() => {
                          setStartLocation(sug.description);
                          setLocationType("start");
                          setIsFocused(null);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <MapPin /> {sug.description}
                      </div>
                    ))
                  ) : (
                    <div style={{ justifyContent: "center" }}>
                      No matches found
                    </div>
                  )}
                </div>
              ))}
          </div>

          {isStopAdded && (
            <div className="home-sidebar-inputs">
              <Menu size={30} color="black" />
              <input
                type="text"
                placeholder="Add Stop"
                value={stopLocation}
                onChange={(e) => setStopLocation(e.target.value)}
                onFocus={() => handleFocus("stop")}
              />
              <Trash2
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setIsStopAdded(false);
                  setStopLocation("");
                }}
                size={35}
              />
              {isFocused === "stop" &&
                (stopLocation === "" ? (
                  <div className="home-sidebar-inputs-location-options">
                    <div
                      onClick={() => {
                        setLocationType("stop");
                        setIsFocused(null);
                      }}
                    >
                      <span>
                        <LocateFixed />
                      </span>
                      Set location on map
                    </div>
                  </div>
                ) : (
                  <div className="home-sidebar-inputs-location-options">
                    {suggestions.length > 0 ? (
                      suggestions.map((sug) => (
                        <div
                          key={sug.place_id}
                          onClick={() => {
                            setStopLocation(sug.description);
                            setLocationType("stop");
                            setIsFocused(null);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          <MapPin /> {sug.description}
                        </div>
                      ))
                    ) : (
                      <div style={{ justifyContent: "center" }}>
                        No matches found
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="home-sidebar-inputs">
            <SquareStop size={30} fill="black" color="white" />
            <input
              type="text"
              placeholder="Dropoff location"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              onFocus={() => handleFocus("end")}
            />
            {!isStopAdded && (
              <CirclePlus
                style={{ cursor: "pointer" }}
                onClick={() => setIsStopAdded(true)}
                size={35}
                fill="black"
                color="white"
              />
            )}
            {isFocused === "end" &&
              (endLocation === "" ? (
                <div className="home-sidebar-inputs-location-options">
                  <div
                    onClick={() => {
                      setLocationType("drop");
                        setLocationType("end");
                      setIsFocused(null);
                    }}
                  >
                    <span>
                      <LocateFixed />
                    </span>
                    Set location on map
                  </div>
                </div>
              ) : (
                <div className="home-sidebar-inputs-location-options">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug) => (
                      <div
                        key={sug.place_id}
                        onClick={() => {
                          setEndLocation(sug.description);
                          setLocationType("end");
                          setIsFocused(null);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <MapPin /> {sug.description}
                      </div>
                    ))
                  ) : (
                    <div style={{ justifyContent: "center" }}>
                      No matches found
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div
            onClick={() => {
              setIsPickupTime(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <Clock size={25} />
            <p>
              pickup{" "}
              {pickupDate === formattedCurrentDate || pickupDate === "Today"
                ? ""
                : shortDate}{" "}
              {pickupDate !== formattedCurrentDate ? pickupTime : "now"}
            </p>
            <span>❮</span>
          </div>

          <div className="search-ride-btn">
            <button
              className={
                startLocation &&
                endLocation &&
                ((isStopAdded && stopLocation) || !isStopAdded)
                  ? "active"
                  : ""
              }
            >
              Search
            </button>
          </div>
        </div>
      ) : (
        <div className="home-sidebar-container">
          {/* Pickup Time Section */}
          <div className="home-sidebar-header-container">
            <button
              onClick={() => {
                setIsPickupTime(false);
              }}
              className="modal-back-btn"
            >
              ❮
            </button>
            <button onClick={handleClear}>clear</button>
          </div>
          <h1 className="home-sidebar-pickup-title">
            When do you want to be picked up?
          </h1>
          <div
            onClick={() => {
              setPickupSelection("date");
              setPickupSelectionModel(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <CalendarDays size={25} />
            <p>{pickupDate === formattedCurrentDate ? "Today" : pickupDate}</p>
            <span>❮</span>
          </div>
          <div
            onClick={() => {
              setPickupSelection("time");
              setPickupSelectionModel(true);
            }}
            className="home-sidebar-inputs home-sidebar-selector-inputs"
          >
            <Clock size={25} />
            <p>{pickupTime === "00:00" ? "now" : pickupTime}</p>
            <span>❮</span>
          </div>
          <div className="search-ride-btn">
            <button
              onClick={() => {
                setIsPickupTime(false);
              }}
              className="active"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {pickupSelectionModel && (
        <PickupTime
          setPickupSelectionModel={setPickupSelectionModel}
          setPickupSelection={setPickupSelection}
          pickupSelection={pickupSelection}
          setPickupTime={setPickupTime}
          pickupTime={pickupTime}
          setPickupDate={setPickupDate}
          pickupDate={pickupDate}
        />
      )}
    </>
  );
};

export default Sidebar;
