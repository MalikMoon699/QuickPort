let mapsLoaded = false;
let mapsLoading = false;
let loadCallbacks = [];

export const loadGoogleMaps = () => {
  return new Promise((resolve, reject) => {
    if (mapsLoaded) {
      resolve();
      return;
    }

    if (mapsLoading) {
      loadCallbacks.push({ resolve, reject });
      return;
    }

    mapsLoading = true;

    if (window.google && window.google.maps) {
      mapsLoaded = true;
      mapsLoading = false;
      resolve();
      return;
    }

    const scriptId = "google-maps-script";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.onload = () => {
        mapsLoaded = true;
        mapsLoading = false;
        resolve();
        loadCallbacks.forEach((cb) => cb.resolve());
        loadCallbacks = [];
      };
      existingScript.onerror = (err) => {
        mapsLoading = false;
        reject(err);
        loadCallbacks.forEach((cb) => cb.reject(err));
        loadCallbacks = [];
      };
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      mapsLoaded = true;
      mapsLoading = false;
      resolve();
      loadCallbacks.forEach((cb) => cb.resolve());
      loadCallbacks = [];
    };

    script.onerror = (err) => {
      mapsLoading = false;
      reject(err);
      loadCallbacks.forEach((cb) => cb.reject(err));
      loadCallbacks = [];
    };

    document.head.appendChild(script);
  });
};

export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error("Google Maps not loaded"));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve({
          address: results[0].formatted_address,
          location: results[0].geometry.location,
        });
      } else if (status === "ZERO_RESULTS") {
        reject(
          new Error(
            `Address not found: "${address}". Please check for typos or try a more specific address.`
          )
        );
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

export const getPlaceDetails = (placeId) => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      reject(new Error("Google Maps Places not loaded"));
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails({ placeId }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        resolve(place.formatted_address);
      } else {
        reject(new Error(`Place details failed: ${status}`));
      }
    });
  });
};
