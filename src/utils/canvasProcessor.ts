import { ZoomBlock } from "../store/zoomStore";

export const processVideoWithMediaRecorder = async (
  videoFile: File,
  zoomBlocks: ZoomBlock[],
  onProgress: (progress: number) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;

    video.onloadedmetadata = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to create canvas context."));
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const duration = video.duration;
      const fps = 60; // Fixed FPS
      const videoStream = canvas.captureStream(fps);
      const audioContext = new AudioContext();
      audioContext.resume();

      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);
      //   source.connect(audioContext.destination);
      const audioStream = destination.stream;
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      // const stream = canvas.captureStream(fps);
      const mimeType = "video/webm;codecs=vp9,opus";

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        reject(new Error(`MIME type ${mimeType} is not supported.`));
        return;
      }

      const recorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: Blob[] = [];

      recorder.onstart = () => console.log("Recorder started.");
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        if (chunks.length === 0) {
          reject(new Error("No data available for the video."));
          return;
        }

        const outputBlob = new Blob(chunks, { type: mimeType });
        const videoURL = URL.createObjectURL(outputBlob);
        resolve(videoURL);
      };
      recorder.onerror = (e) => console.error("Recorder error:", e);

      const getZoomForTime = (time: number): ZoomBlock | undefined => {
        if (zoomBlocks.length === 0) {
          return undefined;
        }
        return zoomBlocks.find(
          (block) => time >= block.startTime && time <= block.endTime
        );
      };

      video.addEventListener("timeupdate", () => {
        const currentTime = video.currentTime;

        if (currentTime >= duration) {
          console.log("Processing complete");
          recorder.stop();
          return;
        }

        const zoom = getZoomForTime(currentTime);
        if (zoom) {
          ctx.save();
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          ctx.translate(centerX, centerY);
          ctx.scale(zoom.scale, zoom.scale);
          ctx.translate(-centerX + zoom.x, -centerY + zoom.y);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        } else {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        const progress = Math.min((currentTime / duration) * 100, 100);
        onProgress(progress);
      });

      video.addEventListener("ended", () => {
        console.log("Video ended");
        recorder.stop();
      });

      recorder.start();
      video.play();
    };

    video.onerror = () => {
      reject(new Error("Failed to load video."));
    };
  });
};
