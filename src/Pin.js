import React from "react";

function Pin({ x, y, color, label, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`absolute w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-md ${
        selected ? "ring-2 ring-black" : ""
      }`}
      style={{
        backgroundColor: color,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
      title={label}
    >
      {label}
    </div>
  );
}

export default Pin;