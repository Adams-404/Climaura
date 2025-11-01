import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { continentCoordinates, type ContinentKey } from "@shared/schema";

interface GlobeComponentProps {
  onContinentClick?: (continent: ContinentKey) => void;
  focusContinent?: ContinentKey | null;
  className?: string;
}

const continentMarkers = [
  { continent: "africa", lat: 0, lng: 20, name: "Africa", color: "#10b981" },
  { continent: "asia", lat: 34, lng: 100, name: "Asia", color: "#3b82f6" },
  { continent: "europe", lat: 54, lng: 15, name: "Europe", color: "#8b5cf6" },
  { continent: "northAmerica", lat: 54, lng: -105, name: "North America", color: "#f59e0b" },
  { continent: "southAmerica", lat: -15, lng: -60, name: "South America", color: "#ef4444" },
  { continent: "oceania", lat: -25, lng: 140, name: "Oceania", color: "#06b6d4" },
] as const;

export function GlobeComponent({ onContinentClick, focusContinent, className }: GlobeComponentProps) {
  const globeEl = useRef<any>();
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = isAutoRotating;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().minDistance = 180;
      globeEl.current.controls().maxDistance = 500;
    }
  }, [isAutoRotating]);

  useEffect(() => {
    if (focusContinent && globeEl.current) {
      const coords = continentCoordinates[focusContinent];
      if (coords) {
        setIsAutoRotating(false);
        globeEl.current.pointOfView(
          { lat: coords.lat, lng: coords.lng, altitude: coords.altitude },
          1500
        );
      }
    }
  }, [focusContinent]);

  const handleMarkerClick = (marker: any) => {
    if (onContinentClick) {
      onContinentClick(marker.continent as ContinentKey);
    }
  };

  const handleGlobeClick = () => {
    setIsAutoRotating(false);
  };

  return (
    <div className={className} data-testid="globe-container">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        htmlElementsData={continentMarkers}
        htmlElement={(d: any) => {
          const el = document.createElement("div");
          el.innerHTML = `
            <div 
              class="continent-marker ${hoveredMarker === d.continent ? 'hovered' : ''}"
              style="
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: ${d.color};
                border: 2px solid white;
                box-shadow: 0 0 12px ${d.color}, 0 0 24px ${d.color}80;
                cursor: pointer;
                transition: all 0.2s ease;
                animation: pulse-glow 2s ease-in-out infinite;
              "
              data-testid="marker-${d.continent}"
            />
          `;
          el.style.pointerEvents = "auto";
          el.style.cursor = "pointer";
          
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            handleMarkerClick(d);
          });
          
          el.addEventListener("mouseenter", () => {
            setHoveredMarker(d.continent);
          });
          
          el.addEventListener("mouseleave", () => {
            setHoveredMarker(null);
          });
          
          return el;
        }}
        onGlobeClick={handleGlobeClick}
        atmosphereColor="rgba(100, 200, 255, 0.3)"
        atmosphereAltitude={0.25}
      />
    </div>
  );
}
