"use client";

import Sprite from "@/components/images/Sprite";

// Updated data pointing to individual sliced images
const items = [
    { name: "Super Nintendo", num: 1, icon: "/sprites/supernintendo.png" },
    { name: "PlayStation", num: 87, icon: "/sprites/psone.png" },
    { name: "Sega Mega Drive", num: 7, icon: "/sprites/megadrive.png" },
    { name: "Nintendo 64", num: 37, icon: "/sprites/n64.png" },
    { name: "GameBoy", num: 99, icon: "/sprites/gameboy.png" },
    { name: "GameBoy Advance", num: 71, icon: "/sprites/gameboyadvance.png" },
    { name: "Nintendo DS", num: 65, icon: "/sprites/nintendods.png" },
    { name: "Nintendo 3DS", num: 33, icon: "/sprites/nintendo3ds.png" },
    { name: "Nintendo GameCube", num: 97, icon: "/sprites/gamecube.png" },
    { name: "Nintendo Wii", num: 61, icon: "/sprites/wii.png" },
    { name: "Nintendo Switch", num: 42, icon: "/sprites/switch.png" },
    { name: "Sega Master System", num: 8, icon: "/sprites/mastersystem.png" },
    { name: "Sega Game Gear", num: 12, icon: "/sprites/gamegear.png" },
    { name: "Sega Saturn", num: 73, icon: "/sprites/segaSaturn.png" },
    { name: "Dreamcast", num: 68, icon: "/sprites/dreamcast.png" },
    { name: "PlayStation 3", num: 75, icon: "/sprites/ps3.png" },
    { name: "PlayStation 4", num: 15, icon: "/sprites/ps4.png" },
    { name: "PlayStation 5", num: 2, icon: "/sprites/ps5.png" },
    { name: "Xbox", num: 27, icon: "/sprites/xbox.png" },
    { name: "Xbox 360", num: 56, icon: "/sprites/xbox360.png" },
];

export default function Home() {
    return (
        <div className="flex-1 flex flex-col w-full relative">
            {/* Items Grid */}
            <div className="absolute  left-3 z-20 px-1 font-pixel text-[10px] leading-none text-white jrpg-text-shadow tracking-widest uppercase">
                Consoles
            </div>
            <div className="jrpg-panel pb-2 mt-2 relative ![box-shadow:inset_0_0_0_2px_#7fc0ff,_inset_0_0_18px_rgba(255,255,255,0.15),_0_2px_12px_rgba(0,0,0,1.3)]">
                <div className="overflow-y-auto h-[260px] p-4 relative z-20" style={{ pointerEvents: 'auto' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 relative">
                        {[...items].sort((a, b) => b.num - a.num).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center group cursor-pointer px-2 py-1 hover:bg-white/5 rounded-sm transition-colors relative z-20">
                                <div className="flex items-center gap-3">
                                    {/* Hand pointer */}
                                    <div className="w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span style={{ fontSize: '1.25rem', lineHeight: 1, transform: 'scaleX(-1) rotate(-15deg)' }} className="text-white drop-shadow-md pb-1 pr-1">
                                            ☚
                                        </span>
                                    </div>
                                    <div className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)] flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] group-hover:animate-[scalePulse_1s_ease-in-out_infinite]">
                                        {/* Using individual image */}
                                        <Sprite
                                            src={item.icon}
                                            alt={item.name}
                                            width={32}
                                            height={32}
                                            className="object-contain w-full h-full max-w-[32px] max-h-[32px]"
                                        />
                                    </div>
                                    <span className={`${idx === 0 ? "text-white" : "text-gray-300 group-hover:text-white"} drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] leading-none pt-1 text-sm md:text-base`}>
                                        {item.name}
                                    </span>
                                </div>
                                <span className={`${idx === 0 ? "text-white" : "text-gray-300 group-hover:text-white"} drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] leading-none pt-1 text-sm md:text-base`}>
                                    {item.num}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                {/* <Sprite
                    src="/sprites/mogWalkFront.gif"
                    alt="Mog Walking"
                    width={64}
                    height={64}
                /> */}
            </div>
        </div>
    );
}
