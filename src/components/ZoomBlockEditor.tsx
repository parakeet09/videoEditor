import React, { useState } from "react";
import { ZoomBlock } from "../store/zoomStore";

interface ZoomBlockEditorProps {
  block: ZoomBlock;
  onClose: () => void;
  onSave: (updatedBlock: Partial<ZoomBlock>) => void;
}

const ZoomBlockEditor: React.FC<ZoomBlockEditorProps> = ({
  block,
  onClose,
  onSave,
}) => {
  const [startTime, setStartTime] = useState(block.startTime);
  const [endTime, setEndTime] = useState(block.endTime);
  const [x, setX] = useState(block.x);
  const [y, setY] = useState(block.y);
  const [scale, setScale] = useState(block.scale);

  const handleSave = () => {
    onSave({ startTime, endTime, x, y, scale });
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-md shadow-lg w-96">
        <h3 className="text-lg font-semibold border-b border-gray-700 pb-2 mb-4">
          Edit Zoom Block
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Start Time (s):</label>
            <input
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(Number(e.target.value))}
              className="w-24 p-1 text-black rounded-md border border-gray-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">End Time (s):</label>
            <input
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(Number(e.target.value))}
              className="w-24 p-1 text-black rounded-md border border-gray-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">X Offset:</label>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              className="w-24 p-1 text-black rounded-md border border-gray-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Y Offset:</label>
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              className="w-24 p-1 text-black rounded-md border border-gray-500"
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Scale:</label>
            <input
              type="number"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-24 p-1 text-black rounded-md border border-gray-500"
            />
          </div>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoomBlockEditor;
