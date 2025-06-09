import React from "react";

const DemoExplanation = () => {
  return (
    <div className="bg-white p-4 rounded shadow mb-24">
      <h2 className="text-lg font-bold mb-2">📝 What This Demo Shows</h2>
      <p className="text-gray-600 text-sm mb-2">
        This prototype simulates a delivery route with the ability to:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
        <li>🧭 Drop a starting point</li>
        <li>📍 Automatically sort stops by proximity</li>
        <li>🎨 Color code stops (pickups, call-ins, bulk, businesses)</li>
        <li>🔁 Regenerate stops within Willow Grove / Hatboro area</li>
      </ul>
      <p className="text-gray-500 text-xs mt-4">
        Built as a UX feedback tool for real courier workflow pain points.
      </p>
    </div>
  );
};

export default DemoExplanation;