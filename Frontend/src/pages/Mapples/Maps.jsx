import { useEffect, useRef } from "react";
import React from 'react';

export default function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load Mappls SDK
    const script = document.createElement("script");
    script.src =
      "https://apis.mappls.com/advancedmaps/api/aptkbekoldkqedvpgkikmudfomsjjbmuqwxh/map_sdk?v=3.0&layer=vector";
    script.async = true;

    script.onload = () => {
      console.log("✅ Mappls SDK loaded");
      initMap();
    };

    document.body.appendChild(script);

    function initMap() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const map = new window.mappls.Map({
            container: mapRef.current,
            center: [longitude, latitude],
            zoom: 15,
          });
          new window.mappls.Marker({ position: [longitude, latitude], map });
        },
        (err) => alert("Location access denied.")
      );
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
