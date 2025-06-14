// src/MapCanvas.js
import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FlagIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

const colors = ["white", "red", "blue", "green", "yellow", "purple"];

const generateStops = (count = 35) => {
  const zipAreas = [
    [40.144, -75.115],
    [40.177, -75.106],
    [40.1785, -75.129],
  ];

  return Array.from({ length: count }, (_, i) => {
    const [latBase, lngBase] =
      zipAreas[Math.floor(Math.random() * zipAreas.length)];
    return {
      id: i + 1,
      name: `Stop ${i + 1}`,
      type: "residential",
      lat: latBase + (Math.random() - 0.5) * 0.03,
      lng: lngBase + (Math.random() - 0.5) * 0.03,
      color: "white",
    };
  });
};

const getDistance = (a, b) =>
  Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2);

const RouteNotes = () => {
  const legend = [
    { color: "red", label: "Pickup" },
    { color: "blue", label: "Call-In" },
    { color: "yellow", label: "Bulk Stop" },
    { color: "green", label: "Business" },
  ];

  return (
    <div className="text-sm bg-white p-4 rounded shadow max-w-xl mx-auto mb-6">
      <h3 className="font-bold mb-3">Color Logic & Route Notes</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {legend.map((item) => (
          <div key={item.color} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-400"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-700 text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        This is based on real courier work. Routes usually follow scanner order, but that doesn’t always make sense on the road. Pickups might get added in the middle of a run, bulk stops can slow things down, and business deliveries might get buried even if they need to be done early.
      </p>
      <p className="text-gray-700 text-sm leading-relaxed mt-2">
        Using color helps make that stuff clearer at a glance. Instead of reading every stop, you can quickly spot what’s what and plan ahead. It’s not perfect, but it gives the driver a little more control over how they move through the day.
      </p>
    </div>
  );
};

const MapCanvas = () => {
  const [stops, setStops] = useState(generateStops());
  const [startPoint, setStartPoint] = useState(null);
  const [dropMode, setDropMode] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [activeColor, setActiveColor] = useState("red");

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyColor = () => {
    setStops((prev) =>
      prev.map((s) =>
        selectedIds.includes(s.id) ? { ...s, color: activeColor } : s
      )
    );
    setSelectedIds([]);
  };

  const sortStops = () => {
    if (!startPoint) return;
    const unvisited = [...stops];
    const sorted = [];
    let current = startPoint;

    while (unvisited.length) {
      unvisited.sort(
        (a, b) => getDistance(a, current) - getDistance(b, current)
      );
      const next = unvisited.shift();
      sorted.push(next);
      current = next;
    }

    setStops(sorted.map((s, i) => ({ ...s, label: i + 1 })));
  };

  const regenerate = () => {
    setStops(generateStops());
    setStartPoint(null);
    setSelectedIds([]);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (dropMode) {
          setStartPoint(e.latlng);
          setDropMode(false);
        }
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 px-4 py-6 max-w-screen-lg mx-auto">
      <div className="text-center space-y-1 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">RouteMap UX Demo</h1>
        <p className="text-sm text-gray-600">
          A courier inspired routing prototype with live map interaction.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mb-6">
        <p className="font-semibold text-lg mb-2">Purpose</p>
        <p className="text-gray-700 mb-2">
          This visual demo explores flexible stop sorting, late arrival pickups, and oversized deliveries.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <img
              src="/Default.png"
              alt="Default pickups"
              className="rounded border shadow-sm w-full max-w-md mx-auto"
            />
            <p className="text-xs text-gray-600 mt-1 text-center">
              Red = pickups (standard scanner logic)
            </p>
          </div>
          <div>
            <img
              src="/Colored.png"
              alt="Color-coded"
              className="rounded border shadow-sm w-full max-w-md mx-auto scale-105"
            />
            <p className="text-xs text-gray-600 mt-1 text-center">
              Blue = call-ins | Yellow = bulk | Green = business
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-6 max-w-2xl mx-auto text-sm text-gray-700">
        <h3 className="font-semibold mb-2 text-base text-gray-800">How to Use</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Click <span className="font-medium text-gray-900">"Set Start Point"</span> and then click anywhere on the map to simulate your starting location.
          </li>
          <li>
            Press <span className="font-medium text-gray-900">"Sort by Distance"</span> to reorder based on distance from your starting point.
          </li>
          <li>
            Select <span className="font-medium text-gray-900">"Color Code Stops"</span> to highlight call-ins, bulk deliveries, and other categories for visual clarity.
          </li>
          <li>
            Experiment freely, this demo is meant to explore route behavior under real world delivery conditions.
          </li>
        </ul>
      </div>

      <p className="text-sm font-medium text-gray-700 mb-2 text-center">Interactive Demo</p>
      <div className="bg-white p-4 rounded-xl shadow-md border mb-6">
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <button onClick={() => setDropMode(true)} className="px-3 py-1 rounded shadow text-sm font-medium transition hover:opacity-90 bg-blue-600 text-white">
            Set Start Point
          </button>
          <button onClick={sortStops} className="px-3 py-1 rounded shadow text-sm font-medium transition hover:opacity-90 bg-white text-gray-800 border border-gray-300">
            Sort by Distance
          </button>
          <button onClick={regenerate} className="px-3 py-1 rounded shadow text-sm font-medium transition hover:opacity-90 bg-white text-gray-800 border border-gray-300">
            Regenerate Stops
          </button>
          <button onClick={() => setSelectMode((prev) => !prev)} className="px-3 py-1 rounded shadow text-sm font-medium transition hover:opacity-90 bg-gray-100 text-gray-800 border border-gray-300">
            {selectMode ? "Cancel Color Mode" : "Color Code Stops"}
          </button>
        </div>

        {selectMode && (
          <div className="flex flex-wrap justify-center gap-2 mb-4 items-center">
            <span>Select Color:</span>
            {colors.map((c) => (
              <button
                key={c}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${
                  activeColor === c ? "border-black" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setActiveColor(c)}
              />
            ))}
            <button
              onClick={applyColor}
              className="ml-2 bg-black text-white px-2 py-1 rounded"
            >
              Apply ({selectedIds.length})
            </button>
          </div>
        )}

        <div className="h-[400px] sm:h-[500px] rounded-xl shadow overflow-hidden">
          <MapContainer center={[40.155, -75.12]} zoom={12} className="h-full w-full">
            <MapClickHandler />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution=""
            />
            {startPoint && <Marker position={startPoint} icon={FlagIcon} />}
            {stops.map((stop) => (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={L.divIcon({
                  className: "",
                  html: `<div class='w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full border-2 shadow-md border-black' style='background-color:${stop.color}; color:${stop.color === "white" ? "black" : "white"}; box-shadow:${selectedIds.includes(stop.id) ? "0 0 0 3px rgba(0,0,0,0.5)" : "none"}'>${stop.label || ""}</div>`
                })}
                eventHandlers={{ click: () => selectMode && toggleSelect(stop.id) }}
              >
                <Popup>{stop.label ? `Stop ${stop.label}` : stop.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <RouteNotes />

      {/* Divider added before footer */}
      <hr className="mt-8 border-gray-200" />

      <footer className="text-center text-gray-400 text-xs py-6">
        Built for feedback.
      </footer>
    </div>
  );
};

export default MapCanvas;