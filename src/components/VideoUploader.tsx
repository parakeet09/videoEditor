import React, { useState } from "react";

interface VideoUploaderProps {
  onUpload: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUpload }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setVideoUrl(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        className="file-input file-input-bordered w-full max-w-xs border border-gray-300 p-2 rounded-md"
      />
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};

export default VideoUploader;
