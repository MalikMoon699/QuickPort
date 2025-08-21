import React, { useState, useEffect, useRef } from "react";
import Loader from "./Loader";
import { loadGoogleMaps, geocodeAddress } from "../utils/googleMaps";

const Map = ({
  setLocationType,
  locationType,
  startLocation,
  setStartLocation,
  endLocation,
  setEndLocation,
  stopLocation,
  setStopLocation,
}) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeError, setRouteError] = useState("");
  const mapRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    setLoading(true);

    loadGoogleMaps()
      .then(() => {
        if (!mapRef.current) return;

        try {
          const defaultCenter = { lat: 31.5204, lng: 74.3587 };

          const newMap = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          const newDirectionsService =
            new window.google.maps.DirectionsService();
          const newDirectionsRenderer =
            new window.google.maps.DirectionsRenderer({
              map: newMap,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#4F46E5",
                strokeWeight: 5,
              },
            });

          setMap(newMap);
          setDirectionsService(newDirectionsService);
          setDirectionsRenderer(newDirectionsRenderer);
          setLoading(false);
        } catch (error) {
          console.error("Error initializing map:", error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error);
        setLoading(false);
      });
  }, []);

  // Handle location selection on map click
  useEffect(() => {
    if (!map || !locationType) return;

    const handleMapClick = async (e) => {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: e.latLng }, async (results, status) => {
        if (status === "OK" && results[0]) {
          const address = results[0].formatted_address;

          try {
            switch (locationType) {
              case "start":
                setStartLocation(address);
                break;
              case "end":
                setEndLocation(address);
                break;
              case "stop":
                setStopLocation(address);
                break;
              default:
                break;
            }
          } catch (error) {
            console.error("Error setting location:", error);
          }

          setLocationType(null);
        }
      });
    };

    if (locationType) {
      mapRef.current.style.cursor = "crosshair";

      const clickListener = map.addListener("click", handleMapClick);

      return () => {
        window.google.maps.event.removeListener(clickListener);
        if (mapRef.current) {
          mapRef.current.style.cursor = "";
        }
      };
    }
  }, [
    map,
    locationType,
    setStartLocation,
    setEndLocation,
    setStopLocation,
    setLocationType,
  ]);

  // Safe geocode function with error handling
  const safeGeocodeAddress = async (address, locationName) => {
    try {
      return await geocodeAddress(address);
    } catch (error) {
      console.warn(
        `Could not geocode ${locationName} address: ${address}`,
        error
      );
      setRouteError(`Could not find location: ${address}`);
      return null;
    }
  };

  // Update markers when locations change
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers = [];

    const createMarker = async (address, title, iconConfig) => {
      try {
        const geocoded = await safeGeocodeAddress(address, title);
        if (!geocoded) return null;

        const marker = new window.google.maps.Marker({
          position: geocoded.location,
          map: map,
          title: title,
          icon: iconConfig,
        });
        newMarkers.push(marker);
        return marker;
      } catch (error) {
        console.warn(`Could not create marker for ${address}:`, error);
        return null;
      }
    };

    const createMarkers = async () => {
      if (startLocation) {
        await createMarker(startLocation, "Pickup Location", {
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#4F46E5" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
          anchor: new window.google.maps.Point(10, 10),
        });
      }

      if (endLocation) {
        await createMarker(endLocation, "Dropoff Location", {
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" fill="#EF4444" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(20, 20),
          anchor: new window.google.maps.Point(10, 10),
        });
      }

      if (stopLocation) {
        await createMarker(stopLocation, "Stop Location", {
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <circle cx="8" cy="8" r="7" fill="#10B981" stroke="white" stroke-width="2"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(16, 16),
          anchor: new window.google.maps.Point(8, 8),
        });
      }

      setMarkers(newMarkers.filter((marker) => marker !== null));
    };

    createMarkers();
  }, [map, startLocation, endLocation, stopLocation]);

  // Calculate and display route when all locations are set
  useEffect(() => {
    if (
      !directionsService ||
      !directionsRenderer ||
      !startLocation ||
      !endLocation ||
      !window.google
    ) {
      setRouteError("");
      return;
    }

    const calculateRoute = async () => {
      setRouteError("");

      try {
        // Geocode all addresses first to ensure they're valid
        const [startGeocode, endGeocode, stopGeocode] = await Promise.all([
          safeGeocodeAddress(startLocation, "start"),
          safeGeocodeAddress(endLocation, "end"),
          stopLocation
            ? safeGeocodeAddress(stopLocation, "stop")
            : Promise.resolve(null),
        ]);

        // Check if any geocoding failed
        if (!startGeocode || !endGeocode || (stopLocation && !stopGeocode)) {
          setRouteError(
            "Could not find one or more locations. Please check the addresses."
          );
          directionsRenderer.setDirections({ routes: [] });
          return;
        }

        const waypoints = [];
        if (stopGeocode) {
          waypoints.push({
            location: stopGeocode.location,
            stopover: true,
          });
        }

        directionsService.route(
          {
            origin: startGeocode.location,
            destination: endGeocode.location,
            waypoints: waypoints,
            travelMode: window.google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false,
          },
          (result, status) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);
              setRouteError("");

              // Adjust map bounds to show the entire route
              const bounds = new window.google.maps.LatLngBounds();
              result.routes[0].legs.forEach((leg) => {
                bounds.extend(leg.start_location);
                bounds.extend(leg.end_location);
              });
              map.fitBounds(bounds);
            } else {
              console.warn("Error calculating route:", status);
              setRouteError(`Could not calculate route: ${status}`);
              directionsRenderer.setDirections({ routes: [] });
            }
          }
        );
      } catch (error) {
        console.error("Error in route calculation:", error);
        setRouteError("Error calculating route. Please try again.");
        directionsRenderer.setDirections({ routes: [] });
      }
    };

    calculateRoute();
  }, [
    directionsService,
    directionsRenderer,
    map,
    startLocation,
    endLocation,
    stopLocation,
  ]);

  return (
    <div className="home-map-container">
      {loading && <Loader loading={true} />}
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {locationType && (
        <div className="map-selection-mode">
          <p>Click on the map to set {locationType} location</p>
          <button onClick={() => setLocationType(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Map;
