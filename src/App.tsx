import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { io } from 'socket.io-client';
import { Box, Container, TextField, Button, Typography, Paper, IconButton, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VideoPlayer from './components/VideoPlayer';

const socket = io('http://localhost:3001');

function App() {
  const [roomCode, setRoomCode] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [hostVideoInfo, setHostVideoInfo] = useState<{ name: string, size: number } | null>(null);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();

    socket.on('roomCreated', (code) => {
      setCurrentRoom(code);
      setIsHost(true);
    });

    socket.on('roomJoined', (code) => {
      setCurrentRoom(code);
      setIsHost(false);
    });

    socket.on('hostVideoInfo', (info) => {
      setHostVideoInfo(info);
    });

    socket.on('error', (message) => {
      alert(message);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('hostVideoInfo');
      socket.off('error');
    };
  }, []);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (roomCode) {
      socket.emit('joinRoom', roomCode);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      if (isHost) {
        // Send video info to other users
        socket.emit('hostVideoInfo', {
          roomCode,
          name: file.name,
          size: file.size
        });
      }
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoom);
    setShowCopySnackbar(true);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sync Video
        </Typography>

        {!currentRoom ? (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={createRoom}
                sx={{ mb: 2 }}
              >
                Create Room
              </Button>
              <TextField
                fullWidth
                label="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                fullWidth
                onClick={joinRoom}
                disabled={!roomCode}
              >
                Join Room
              </Button>
            </Box>
          </Paper>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Room Code: {currentRoom}
              </Typography>
              <IconButton onClick={copyRoomCode} color="primary">
                <ContentCopyIcon />
              </IconButton>
            </Box>
            {isHost && hostVideoInfo && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Host video: {hostVideoInfo.name}
              </Typography>
            )}
            <Box sx={{ mb: 2 }}>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="video-upload"
              />
              <label htmlFor="video-upload">
                <Button variant="contained" component="span" fullWidth>
                  Select Video
                </Button>
              </label>
            </Box>
            {videoFile && (
              <VideoPlayer
                videoFile={videoFile}
                socket={socket}
                roomCode={currentRoom}
                isHost={isHost}
              />
            )}
          </Box>
        )}
        <Snackbar
          open={showCopySnackbar}
          autoHideDuration={2000}
          onClose={() => setShowCopySnackbar(false)}
          message="Room code copied to clipboard"
        />
      </Box>
    </Container>
  );
}

export default App;
