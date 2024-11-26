const Whammy = {
  Video: function (fps) {
    this.frames = [];
    this.duration = 1000 / fps;
    this.add = function (frame, duration) {
      if ("canvas" in frame) {
        this.frames.push({
          image: frame.toDataURL("image/webp", 1),
          duration: duration || this.duration,
        });
      } else if (typeof frame === "string") {
        this.frames.push({
          image: frame,
          duration: duration || this.duration,
        });
      }
    };
    this.compile = function () {
      return new Blob([...this.frames.map((frame) => frame.image)], {
        type: "video/webm",
      });
    };
  },
};

export default Whammy;
