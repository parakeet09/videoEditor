# video-editor
 
# Video Editor with Zoom and Audio Support

A web-based video editor that allows users to upload videos, apply zoom effects at specific time intervals, and retain the original audio. The processed video can be previewed and downloaded.

## Features

- **Upload Video**: Supports video uploads in common formats (e.g., MP4, WebM).
- **Timeline with Zoom Blocks**:
  - Add, edit, and delete zoom blocks on a visual timeline.
  - Zoom blocks include start time, end time, zoom coordinates, and scale.
- **Video Processing**:
  - Processes the video with the applied zoom effects.
  - Retains the original audio during processing.
- **Preview and Download**:
  - Preview the processed video.
  - Download the edited video with both visuals and audio.

## Tech Stack

- **Frontend**:
  - React (with TypeScript)
  - Zustand for state management
  - Tailwind CSS for styling
- **Video Processing**:
  - Canvas API for video manipulation
  - FFmpeg WebAssembly for audio and video merging

## Installation

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/video-editor.git
   cd video-editor
