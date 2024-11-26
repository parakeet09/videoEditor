import React, { useState } from "react";
import VideoUploader from "./components/VideoUploader";
import Timeline from "./components/Timeline";
import { processVideoWithMediaRecorder } from "./utils/canvasProcessor";
import useZoomStore from "./store/zoomStore";
import { mergeAudioWithVideo } from "./utils/soundProcessor";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  const { zoomBlocks } = useZoomStore();

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setProcessedVideo(null);

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.addEventListener("loadedmetadata", () => {
      setVideoDuration(video.duration);
    });
  };

  const handleProcessVideo = async () => {
    if (!uploadedFile) {
      console.error("No video file uploaded.");
      return;
    }

    try {
      const processedVideoURL = await processVideoWithMediaRecorder(
        uploadedFile,
        zoomBlocks,
        (progress) => {
          setProgress(progress);
        }
      );

      const finalVideoURL = await mergeAudioWithVideo(
        uploadedFile,
        processedVideoURL
      );
      setProcessedVideo(finalVideoURL);
    } catch (error) {
      console.error("Error processing video:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#d4d4d4] bg-opacity-40 flex flex-col items-center p-6">
        <header className="w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
            Video Editor
          </h1>
        </header>

        <main className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
          <VideoUploader onUpload={handleUpload} />

          {uploadedFile && (
            <>
              {videoDuration > 0 && (
                <div className="mt-6">
                  <Timeline videoDuration={videoDuration} />
                </div>
              )}

              <div className="mt-6 flex flex-col items-center space-y-4">
                <button
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition"
                  onClick={handleProcessVideo}
                >
                  Process Video
                </button>

                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}

                {processedVideo && (
                  <div className="mt-6 space-y-4">
                    <video
                      src={processedVideo}
                      controls
                      className="w-full max-w-lg rounded-lg shadow-md mb-5"
                    />
                    <a
                      href={processedVideo}
                      download="edited-video.webm"
                      className="px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition flex flex-col items-center"
                    >
                      Download Edited Video
                    </a>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
