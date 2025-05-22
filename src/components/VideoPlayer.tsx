import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { Socket } from 'socket.io-client';

interface VideoPlayerProps {
  videoFile: File;
  socket: Socket;
  roomCode: string;
}

const VideoPlayer = ({ videoFile, socket, roomCode }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const lastSyncTime = useRef<number>(0);
  const isPlaying = useRef<boolean>(false);
  const isUserAction = useRef<boolean>(false);

  useEffect(() => {
    // Create a new URL for the video file
    const url = URL.createObjectURL(new Blob([videoFile], { type: videoFile.type }));
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [videoFile]);

  useEffect(() => {
    if (!videoRef.current || !videoUrl) return;

    const video = videoRef.current;

    const handlePlay = () => {
      if (!isUserAction.current) return;
      
      const currentTime = video.currentTime;
      const now = Date.now();
      
      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current > 1000) {
        lastSyncTime.current = now;
        isPlaying.current = true;
        socket.emit('videoAction', {
          roomCode,
          action: 'play',
          time: currentTime
        });
      }
    };

    const handlePause = () => {
      if (!isUserAction.current) return;
      
      const currentTime = video.currentTime;
      const now = Date.now();
      
      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current > 1000) {
        lastSyncTime.current = now;
        isPlaying.current = false;
        socket.emit('videoAction', {
          roomCode,
          action: 'pause',
          time: currentTime
        });
      }
    };

    const handleSeek = () => {
      if (!isUserAction.current) return;
      
      const currentTime = video.currentTime;
      const now = Date.now();
      
      // Only sync if enough time has passed since last sync
      if (now - lastSyncTime.current > 1000) {
        lastSyncTime.current = now;
        socket.emit('videoAction', {
          roomCode,
          action: 'seek',
          time: currentTime,
          isPlaying: isPlaying.current
        });
      }
    };

    socket.on('videoAction', ({ action, time }) => {
      const now = Date.now();
      
      // Only process sync if enough time has passed since last sync
      if (now - lastSyncTime.current > 1000) {
        lastSyncTime.current = now;
        isUserAction.current = false;
        
        switch (action) {
          case 'play':
            if (Math.abs(video.currentTime - time) > 0.5) {
              video.currentTime = time;
            }
            video.play();
            isPlaying.current = true;
            break;
          case 'pause':
            if (Math.abs(video.currentTime - time) > 0.5) {
              video.currentTime = time;
            }
            video.pause();
            isPlaying.current = false;
            break;
          case 'seek':
            if (Math.abs(video.currentTime - time) > 0.5) {
              video.currentTime = time;
            }
            break;
        }
        
        // Reset the user action flag after a short delay
        setTimeout(() => {
          isUserAction.current = true;
        }, 100);
      }
    });

    // Set up event listeners
    const setupListeners = () => {
      isUserAction.current = true;
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('seeked', handleSeek);
    };

    setupListeners();

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeek);
      socket.off('videoAction');
    };
  }, [socket, roomCode, videoUrl]);

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', margin: '0 auto' }}>
      <video
        ref={videoRef}
        controls
        style={{ width: '100%', maxHeight: '70vh' }}
        src={videoUrl}
      />
    </Box>
  );
};

export default VideoPlayer; 