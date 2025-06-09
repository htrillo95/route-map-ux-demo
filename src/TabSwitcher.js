// TabSwitcher.js
import React from "react";

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center h-14 border-t border-gray-700 z-50">
      <button
        onClick={() => setActiveTab("map")}
        className={`flex-1 py-2 text-sm ${
          activeTab === "map" ? "text-pink-400 font-bold" : "text-gray-400"
        }`}
      >
        Map
      </button>
      <button
        onClick={() => setActiveTab("list")}
        className={`flex-1 py-2 text-sm ${
          activeTab === "list" ? "text-pink-400 font-bold" : "text-gray-400"
        }`}
      >
        List
      </button>
    </div>
  );
};

export default TabSwitcher;