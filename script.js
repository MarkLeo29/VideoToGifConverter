const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

async function convertVideoToGif() {
    const videoInput = document.getElementById('videoInput').files[0];
    if (!videoInput) {
        alert('Please select a video file first.');
        return;
    }

    const gifOutput = document.getElementById('gifOutput');
    gifOutput.src = ''; // Clear any previous output

    await ffmpeg.load();

    // Read the file and write it to the ffmpeg FS
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoInput));

    // Run the ffmpeg command to convert the video to GIF
    await ffmpeg.run('-i', 'input.mp4', '-vf', 'fps=10,scale=320:-1:flags=lanczos', '-t', '5', 'output.gif');

    // Read the result and create a URL for it
    const data = ffmpeg.FS('readFile', 'output.gif');
    const gifBlob = new Blob([data.buffer], { type: 'image/gif' });
    const gifUrl = URL.createObjectURL(gifBlob);

    // Display the resulting GIF
    gifOutput.src = gifUrl;
}