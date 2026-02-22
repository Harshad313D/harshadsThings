import React from "react";
import FlipCard from "./FlipCard";

const CardGrid = ({ items, isVillain, title }) => {
  return (
    // FIX: Added scrollbar hiding classes for all browsers:
    // [&::-webkit-scrollbar]:hidden (Chrome/Safari)
    // [scrollbar-width:none] (Firefox)
    // [-ms-overflow-style:none] (IE/Edge)
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-8 pointer-events-auto animate-in fade-in duration-700 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
      <h2
        className={`text-4xl font-serif text-center mb-12 drop-shadow-[0_0_10px_currentColor] ${isVillain ? "text-red-600" : "text-blue-500"}`}
      >
        {title}
      </h2>

      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto pb-32">
        {items.map((item) => (
          <FlipCard key={item.id} data={item} isVillain={isVillain} />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;

// import React from "react";
// import FlipCard from "./FlipCard";

// const CardGrid = ({ items, isVillain, title }) => {
//   return (
//     // FIX: Added 'overflow-y-auto' to allow scrolling, and removed 'items-center' so it doesn't cut off the top.
//     <div className="w-full h-full overflow-y-auto overflow-x-hidden p-8 pointer-events-auto animate-in fade-in duration-700">
//       <h2
//         className={`text-4xl font-serif text-center mb-12 drop-shadow-[0_0_10px_currentColor] ${isVillain ? "text-red-600" : "text-blue-500"}`}
//       >
//         {title}
//       </h2>

//       {/* FIX: Added 'mx-auto' to center the grid, and 'pb-32' so you can scroll comfortably past the last row */}
//       <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto pb-32">
//         {items.map((item) => (
//           <FlipCard key={item.id} data={item} isVillain={isVillain} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CardGrid;
