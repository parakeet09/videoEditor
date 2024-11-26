import { create } from "zustand";

export interface ZoomBlock {
  id: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  scale: number;
}

interface ZoomStore {
  zoomBlocks: ZoomBlock[];
  addZoomBlock: (block: ZoomBlock) => void;
  updateZoomBlock: (id: string, updatedBlock: Partial<ZoomBlock>) => void;
  deleteZoomBlock: (id: string) => void;
}

const useZoomStore = create<ZoomStore>((set) => ({
  zoomBlocks: [],
  addZoomBlock: (block) =>
    set((state) => {
      const newState = { zoomBlocks: [...state.zoomBlocks, block] };
      return newState;
    }),
  updateZoomBlock: (id, updatedBlock) =>
    set((state) => ({
      zoomBlocks: state.zoomBlocks.map((block) =>
        block.id === id ? { ...block, ...updatedBlock } : block
      ),
    })),
  deleteZoomBlock: (id) =>
    set((state) => ({
      zoomBlocks: state.zoomBlocks.filter((block) => block.id !== id),
    })),
}));

export default useZoomStore;
