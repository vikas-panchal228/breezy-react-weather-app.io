
/**
 * Gets the current geolocation position
 * @returns Promise with coordinates
 */
export const getCurrentPosition = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    const timeoutId = setTimeout(() => {
      reject(new Error("Location request timed out. Please try again."));
    }, 10000); // 10 seconds timeout

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);
        resolve(position.coords);
      },
      (error) => {
        clearTimeout(timeoutId);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
};

/**
 * Checks if geolocation is available in the browser
 * @returns boolean indicating if geolocation is supported
 */
export const isGeolocationSupported = (): boolean => {
  return !!navigator.geolocation;
};

