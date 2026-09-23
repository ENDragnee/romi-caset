/**
 * Fast Client-Side Video Compressor using Browser MediaRecorder & Canvas
 */
export async function compressVideo(
  file: File,
  options: {
    maxBitrate?: number; // Default 2.5 Mbps
    maxWidth?: number; // Default 1920
    maxHeight?: number; // Default 1080
    onProgress?: (progressPercent: number) => void;
  } = {},
): Promise<File> {
  const {
    maxBitrate = 2500000,
    maxWidth = 1920,
    maxHeight = 1080,
    onProgress,
  } = options;

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = async () => {
      try {
        let width = video.videoWidth || 1280;
        let height = video.videoHeight || 720;
        const duration = video.duration || 1;

        // Downscale while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Determine browser supported format (MP4 or WebM)
        let mimeType = "video/webm;codecs=vp9";
        if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")) {
          mimeType = "video/mp4;codecs=avc1";
        } else if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8")) {
          mimeType = "video/webm;codecs=vp8";
        } else if (MediaRecorder.isTypeSupported("video/webm")) {
          mimeType = "video/webm";
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          URL.revokeObjectURL(url);
          return resolve(file);
        }

        const stream = canvas.captureStream(30);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: maxBitrate,
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          URL.revokeObjectURL(url);
          const compressedBlob = new Blob(chunks, {
            type: mimeType.split(";")[0],
          });

          if (compressedBlob.size > 0 && compressedBlob.size < file.size) {
            const ext = mimeType.includes("mp4") ? ".mp4" : ".webm";
            const baseName =
              file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const compressedFile = new File(
              [compressedBlob],
              `${baseName}${ext}`,
              {
                type: compressedBlob.type,
              },
            );
            resolve(compressedFile);
          } else {
            resolve(file); // Keep original if already small
          }
        };

        mediaRecorder.start(100);
        video.currentTime = 0;
        await video.play();

        const renderFrame = () => {
          if (video.paused || video.ended) {
            if (mediaRecorder.state !== "inactive") {
              mediaRecorder.stop();
            }
            return;
          }

          ctx.drawImage(video, 0, 0, width, height);

          if (onProgress && duration > 0) {
            const pct = Math.min(
              Math.round((video.currentTime / duration) * 100),
              99,
            );
            onProgress(pct);
          }

          requestAnimationFrame(renderFrame);
        };

        requestAnimationFrame(renderFrame);
      } catch (err) {
        URL.revokeObjectURL(url);
        console.warn("Client video compression fallback:", err);
        resolve(file);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
  });
}
