import React, { useState } from "react";
import useZoomStore from "../store/zoomStore";
import ZoomBlockEditor from "./ZoomBlockEditor";

interface TimelineProps {
  videoDuration: number; 
}

const Timeline: React.FC<TimelineProps> = ({ videoDuration }) => {
  const { zoomBlocks, addZoomBlock, updateZoomBlock, deleteZoomBlock } =
    useZoomStore();
  const [editingBlock, setEditingBlock] = useState<string | null>(null);

  const calculateLeftPosition = (startTime: number) => {
    return (startTime / videoDuration) * 100;
  };

  const calculateWidth = (startTime: number, endTime: number) => {
    return ((endTime - startTime) / videoDuration) * 100; 
  };

  const handleAddBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      startTime: 0,
      endTime: Math.min(5, videoDuration), 
      x: 50,
      y: 50,
      scale: 1.5,
    };
    addZoomBlock(newBlock);
  };

  const handleDeleteBlock = (id: string) => {
    deleteZoomBlock(id);
  };

  return (
    <div className="p-4 border-t border-gray-200 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Timeline</h2>
        <button
          onClick={handleAddBlock}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Add Zoom Block
        </button>
      </div>
      <div className="mt-4 relative h-16 bg-gray-100 rounded-md border border-gray-300">
        {zoomBlocks.map((block) => (
          <div
            key={block.id}
            style={{
              left: `${calculateLeftPosition(block.startTime)}%`,
              width: `${calculateWidth(block.startTime, block.endTime)}%`, 
            }}
            className="absolute top-0 h-full bg-blue-500 text-white rounded-md flex items-center justify-center cursor-pointer hover:bg-blue-600"
            onClick={() => setEditingBlock(block.id)}
          >
            <span className="text-xs">
              {block.startTime}s - {block.endTime}s
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBlock(block.id);
              }}
              className="ml-2 px-1 text-xs text-red-600 bg-white rounded-full shadow hover:bg-red-500 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0s</span>
        <span>{videoDuration}s</span>
      </div>
      {editingBlock && (
        <ZoomBlockEditor
          block={zoomBlocks.find((b) => b.id === editingBlock)!}
          onClose={() => setEditingBlock(null)}
          onSave={(updatedBlock) => {
            updateZoomBlock(editingBlock, updatedBlock);
            setEditingBlock(null);
          }}
        />
      )}
    </div>
  );
};

export default Timeline;
