#!/bin/bash

# Ensure ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
  echo "ffmpeg could not be found. Please install it to use this script."
  exit 1
fi
# Loop through all .mov files in the folder
VIDEO_DIR="videos"
for input in "$VIDEO_DIR"/*.mov; do
  # Skip if no .mov files found
  [ -e "$input" ] || continue

  # Extract base filename (remove folder and extension)
  filename=$(basename "$input" .mov)

  echo "🎬 Converting: $filename.mov → $filename.mp4"

  ffmpeg -i "$input" -vcodec libx264 -acodec aac "$VIDEO_DIR/$filename.mp4"

  # if conversion was successful, delete the original .mov
  if [ $? -eq 0 ]; then
    echo "🧹 Deleting: $filename.mov"
    rm "$input"
  else
    echo "⚠️  Failed to convert $filename.mov — not deleting."
  fi
  echo "-----------------------------------"
done

echo "✅ All conversions complete!"
