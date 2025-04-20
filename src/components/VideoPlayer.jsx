// /client/src/components/VideoPlayer.jsx
import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Forward10,
  Replay10,
  Close,
} from '@mui/icons-material';

const VideoPlayer = ({ videoUrl, title, open = true, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
      setMuted(newValue === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMuted = !muted;
      videoRef.current.muted = newMuted;
      setMuted(newMuted);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95%', md: '80%' },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            outline: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6">{title || 'Now Playing'}</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <video
            ref={videoRef}
            width="100%"
            height="auto"
            controls={false}
            style={{ borderRadius: 12 }}
            src={videoUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <IconButton onClick={() => handleSkip(-10)}>
              <Replay10 />
            </IconButton>

            <IconButton onClick={handlePlayPause}>
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>

            <IconButton onClick={() => handleSkip(10)}>
              <Forward10 />
            </IconButton>

            <IconButton onClick={handleMuteToggle}>
              {muted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
            </IconButton>

            <Box sx={{ width: 150 }}>
              <Slider
                value={muted ? 0 : volume}
                min={0}
                max={1}
                step={0.01}
                onChange={handleVolumeChange}
                aria-labelledby="volume-slider"
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default VideoPlayer;
