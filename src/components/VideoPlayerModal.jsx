// components/VideoPlayerModal.jsx
import React, { useRef } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { Forward10, Replay10, Close } from '@mui/icons-material';

const VideoPlayerModal = ({ open, onClose, videoUrl }) => {
  const videoRef = useRef(null);

  const handleForward = () => {
    if (videoRef.current) videoRef.current.currentTime += 10;
  };

  const handleRewind = () => {
    if (videoRef.current) videoRef.current.currentTime -= 10;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ position: 'relative', p: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: 'white' }}
        >
          <Close />
        </IconButton>

        <div style={{ position: 'relative', backgroundColor: 'black', borderRadius: '10px' }}>
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              zIndex: 2,
            }}
          >
            <IconButton onClick={handleRewind} sx={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
              <Replay10 />
            </IconButton>
            <IconButton onClick={handleForward} sx={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
              <Forward10 />
            </IconButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
