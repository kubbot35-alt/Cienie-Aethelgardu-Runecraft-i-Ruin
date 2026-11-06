import React from 'react';
import { Direction } from '../../domain/types/game.types';

interface MobileGamepadDockProps {
  onMove: (dir: Direction) => void;
  onInteract: () => void;
  onOpenInventory: () => void;
}

export const MobileGamepadDock: React.FC<MobileGamepadDockProps> = ({
  onMove,
  onInteract,
  onOpenInventory,
}) => {
  return (
    <div className="flex sm:hidden justify-between items-center w-full max-w-md mx-auto pt-2 px-2 select-none touch-none">
      <div className="grid grid-cols-3 gap-1.5 w-32 h-32 p-1 bg-slate-900/60 rounded-xl border border-slate-800 backdrop-blur-sm">
        <div />
        <button
          onClick={() => onMove('up')}
          className="flex items-center justify-center bg-slate-800 active:bg-amber-600 rounded-lg text-slate-200 text-sm font-bold shadow"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => onMove('left')}
          className="flex items-center justify-center bg-slate-800 active:bg-amber-600 rounded-lg text-slate-200 text-sm font-bold shadow"
        >
          ◀
        </button>
        <div className="bg-slate-950/40 rounded-lg" />
        <button
          onClick={() => onMove('right')}
          className="flex items-center justify-center bg-slate-800 active:bg-amber-600 rounded-lg text-slate-200 text-sm font-bold shadow"
        >
          ▶
        </button>
        <div />
        <button
          onClick={() => onMove('down')}
          className="flex items-center justify-center bg-slate-800 active:bg-amber-600 rounded-lg text-slate-200 text-sm font-bold shadow"
        >
          ▼
        </button>
        <div />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onInteract}
          className="w-14 h-14 rounded-full bg-amber-600 active:bg-amber-500 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg border border-amber-500"
        >
          <span>E</span>
          <span className="text-[9px] font-normal">Akcja</span>
        </button>
        <button
          onClick={onOpenInventory}
          className="w-14 h-14 rounded-full bg-slate-800 active:bg-slate-700 text-slate-200 font-bold text-xs flex flex-col items-center justify-center shadow-lg border border-slate-700"
        >
          <span>I</span>
          <span className="text-[9px] font-normal">Torba</span>
        </button>
      </div>
    </div>
  );
};
