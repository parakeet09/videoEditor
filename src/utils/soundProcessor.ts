import { FFmpeg } from "@ffmpeg/ffmpeg";

export const mergeAudioWithVideo = async (
  originalVideoFile: File,
  processedVideoBlobOrURL: Blob | string
): Promise<string> => {
  const ffmpeg = new FFmpeg();

  try {
    await ffmpeg.load();
    let processedVideoBlob: Blob;
    if (typeof processedVideoBlobOrURL === "string") {
      const response = await fetch(processedVideoBlobOrURL);
      if (!response.ok) {
        throw new Error("Failed to fetch processed video");
      }
      processedVideoBlob = await response.blob();
    } else {
      processedVideoBlob = processedVideoBlobOrURL;
    }
    await ffmpeg.writeFile(
      "original_video.mp4",
      new Uint8Array(await originalVideoFile.arrayBuffer())
    );
    await ffmpeg.writeFile(
      "processed_video.webm",
      new Uint8Array(await processedVideoBlob.arrayBuffer())
    );

    await ffmpeg.exec([
      "-i",
      "processed_video.webm", 
      "-i",
      "original_video.mp4",
      "-c:v",
      "copy", 
      "-c:a",
      "aac", 
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-shortest", 
      "output_video.mp4",
    ]);

    const outputData = await ffmpeg.readFile("output_video.mp4");

    const outputBlob = new Blob([outputData], { type: "video/mp4" });
    return URL.createObjectURL(outputBlob);
  } catch (error) {
    console.error("Error merging audio and video:", error);
    throw new Error("Failed to merge audio and video.");
  } finally {
    ffmpeg.terminate();
  }
};
