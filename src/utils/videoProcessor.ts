import { FFmpeg } from "@ffmpeg/ffmpeg";

const ffmpeg = new FFmpeg();

export const processVideo = async (file: File, zoomBlock: any) => {
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }
  const fileName = "input.mp4";
  const outputFileName = "output.mp4";
  await ffmpeg.writeFile(fileName, new Uint8Array(await file.arrayBuffer()));

  if (!zoomBlock) {
    console.error("No zoom block provided.");
    throw new Error("No zoom block to process.");
  }

  const { startTime, endTime, x, y, scale } = zoomBlock;

  const filterGraph = `
      [0:v]trim=start=0:end=${startTime},setpts=PTS-STARTPTS[v0];
      [0:v]trim=start=${startTime}:end=${endTime},setpts=PTS-STARTPTS,zoompan=z='${scale}':x='${x}':y='${y}'[v1];
      [0:v]trim=start=${endTime},setpts=PTS-STARTPTS[v2];
      [v0][v1][v2]concat=n=3:v=1:a=0[outv]
    `;

  try {
    const command = [
      "-i",
      fileName,
      "-filter_complex",
      filterGraph,
      "-map",
      "[outv]",
      "-preset",
      "ultrafast",
      outputFileName,
    ];

    const result = await ffmpeg.exec(command);

    if (result !== 0) {
      console.error("FFmpeg processing failed with error code:", result);
      throw new Error("FFmpeg processing failed.");
    }


    // Retrieve the processed video
    const outputData = await ffmpeg.readFile(outputFileName);
    if (outputData instanceof Uint8Array) {
      return URL.createObjectURL(new Blob([outputData], { type: "video/mp4" }));
    }

    throw new Error("Unexpected output format from FFmpeg.");
  } catch (error) {
    console.error("Error during FFmpeg execution:", error);
    throw error;
  }
};
