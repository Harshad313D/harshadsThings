import React from "react";

const FlipCard = ({ data, isVillain }) => {
  const themeColor = isVillain ? "text-red-500" : "text-blue-400";
  const borderColor = isVillain ? "border-red-900" : "border-blue-900";
  const bgBack = isVillain ? "bg-red-950" : "bg-blue-950";

  return (
    <div className="group relative w-72 h-96 [perspective:1000px] cursor-pointer">
      <div className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* --- FRONT OF CARD --- */}
        {/* FIX: Used [backface-visibility:hidden] and the webkit equivalent to guarantee the back stays hidden */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] border-2 ${borderColor} bg-black overflow-hidden flex flex-col`}
        >
          <div className="h-2/3 w-full bg-gray-900 relative overflow-hidden">
            <img
              src={data.image}
              alt={data.name}
              className="object-cover w-full h-full opacity-80 group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
          </div>

          <div className="h-1/3 p-4 flex flex-col justify-center items-center text-center">
            <h3
              className={`font-serif text-xl font-black tracking-widest uppercase ${themeColor}`}
            >
              {data.name}
            </h3>
            <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase mt-2">
              Hover to decrypt
            </span>
          </div>
        </div>

        {/* --- BACK OF CARD --- */}
        {/* FIX: Hidden backface, and pre-rotated 180 degrees */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] border-2 ${borderColor} ${bgBack} p-6 flex flex-col justify-between`}
        >
          <div>
            <div className="text-[10px] tracking-[0.4em] text-white/50 border-b border-white/20 pb-2 mb-4">
              CLASSIFIED // {data.role.toUpperCase()}
            </div>

            <div className="space-y-2 mb-6 font-mono text-xs">
              {Object.entries(data.stats).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between items-center text-white/80"
                >
                  <span className="uppercase">{key}:</span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-3 ${i < val ? (isVillain ? "bg-red-500" : "bg-blue-400") : "bg-black/40"}`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white text-sm leading-relaxed font-serif italic">
              "{data.funFact}"
            </p>
          </div>

          <div
            className={`text-xs font-bold tracking-widest text-center ${themeColor}`}
          >
            {data.quote}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
