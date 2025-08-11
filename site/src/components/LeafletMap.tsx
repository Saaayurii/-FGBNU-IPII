"use client";

import { useEffect, useRef, useState } from "react";

// Extend HTMLDivElement to include Leaflet properties
interface LeafletContainer extends HTMLDivElement {
  _leaflet_id?: number;
}

// Coordinates for Donetsk, ul. Artema 118B
const INSTITUTE_COORDINATES = [48.0073, 37.805] as [number, number];

interface LeafletMapProps {
  className?: string;
}

export function LeafletMap({ className = "" }: LeafletMapProps) {
  const mapRef = useRef<LeafletContainer>(null);
  const mapInstanceRef = useRef<any>(null);
  const isInitializingRef = useRef(false);
  const [mapId] = useState(
    () => `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Prevent multiple simultaneous initializations
    if (isInitializingRef.current || !mapRef.current) return;

    const container = mapRef.current;

    // Более агрессивная очистка контейнера
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn("Error removing existing map:", e);
      }
      mapInstanceRef.current = null;
    }

    // Полная очистка всех Leaflet свойств
    Object.keys(container).forEach((key) => {
      if (key.startsWith("_leaflet")) {
        delete (container as any)[key];
      }
    });

    // Очистка контейнера
    container.innerHTML = "";
    container.className = container.className
      .replace(/leaflet-[^\s]*/g, "")
      .trim();

    // Создание нового уникального ID
    container.id = mapId;
    container.removeAttribute("data-leaflet-id");

    // Mark as initializing
    isInitializingRef.current = true;

    // Dynamic import to avoid SSR issues
    const initMap = async () => {
      const L = await import("leaflet");

      // Import Leaflet CSS
      await import("leaflet/dist/leaflet.css" as any);

      // We'll use only custom icons, no default markers needed

      // Дополнительная проверка перед созданием карты
      if ((container as any)._leaflet_id) {
        console.warn("Container still has leaflet_id, forcing cleanup");
        delete (container as any)._leaflet_id;
      }

      // Create the map with container element directly
      try {
        const map = L.default.map(container, {
          center: INSTITUTE_COORDINATES,
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false, // Remove attribution control
        });

        // Add blue-themed tile layer
        L.default
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "", // Remove attribution text
            maxZoom: 19,
            className: "map-tiles",
          })
          .addTo(map);

        // Create simple blue dot marker
        const customIcon = L.default.divIcon({
          html: `
            <div style="
              width: 16px;
              height: 16px;
              background: #1d4ed8;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 6px rgba(29, 78, 216, 0.4);
            "></div>
          `,
          className: "custom-dot-icon",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8],
        });

        // Add marker with popup
        const marker = L.default
          .marker(INSTITUTE_COORDINATES, { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1e40af;">
                ФГБНУ "ИПИИ"
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #374151;">
                <strong>Адрес:</strong> ул. Артема, 118Б
              </p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #374151;">
                <strong>Город:</strong> Донецк, 83050
              </p>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                Институт проблем искусственного интеллекта
              </p>
            </div>
          `,
            {
              maxWidth: 250,
              className: "custom-popup",
            }
          );

        // Auto-open popup
        marker.openPopup();

        mapInstanceRef.current = map;

        // Mark initialization as complete
        isInitializingRef.current = false;
      } catch (error) {
        console.error("Failed to initialize map:", error);
        isInitializingRef.current = false;
        return;
      }

      // Add custom CSS for black, white, blue theme with minimal red
      const style = document.createElement("style");
      style.textContent = `
        .map-tiles {
          filter: grayscale(0.3) sepia(0.2) hue-rotate(200deg) saturate(1.2) brightness(0.95) contrast(1.15);
        }
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 2px solid #1d4ed8;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 2px solid #1d4ed8;
        }
        .leaflet-control-zoom a {
          background: white;
          border: 2px solid #1d4ed8;
          color: #1d4ed8;
          font-weight: bold;
        }
        .leaflet-control-zoom a:hover {
          background: #1d4ed8;
          color: white;
          border-color: #1d4ed8;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          font-size: 18px !important;
        }
      `;
      document.head.appendChild(style);
    };

    initMap().catch(console.error);

    // Cleanup function
    return () => {
      isInitializingRef.current = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error during cleanup:", e);
        }
        mapInstanceRef.current = null;
      }
      // Clean up container
      if (mapRef.current) {
        const container = mapRef.current;
        // Полная очистка всех Leaflet свойств
        Object.keys(container).forEach((key) => {
          if (key.startsWith("_leaflet")) {
            delete (container as any)[key];
          }
        });
        container.innerHTML = "";
        container.className = container.className
          .replace(/leaflet-[^\s]*/g, "")
          .trim();
        container.removeAttribute("data-leaflet-id");
      }
    };
  }, []); // Empty dependency array - component will only initialize once

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
}
