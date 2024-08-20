import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleStop = (blobUrl, blob) => {
    setAudioBlob(blob);
    // Optionally, you can play the recorded audio
    // const audio = new Audio(blobUrl);
    // audio.play();
    console.log("rec stopped")
    sendAudioToBackend(blob);
  };

  const sendAudioToBackend = async (blob) => {
    console.log("sending audio...");
    if (!blob) return;

    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');

    try {
      const response = await fetch('http://localhost:5000/sendaudio', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Audio sent successfully!');
        console.log("response: ", data);
      } else {
        console.error('Failed to send audio.');
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const handleRecordingClick = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      sendAudioToBackend();
    }
  };

  return (
    <div>
      <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({ status, startRecording, stopRecording }) => (
          <div>
            <p>Status: {status}</p>
            <button
              onClick={() => {
                if (!isRecording) {
                  startRecording();
                } else {
                  stopRecording();
                }
                handleRecordingClick();
              }}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default App;