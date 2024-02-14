import React, { useState } from 'react';
import Box from '@mui/material/Box';
import ListRegularComponent from './ListRegularComponent';
import AddRegularComponent from './AddRegularComponent';

export default function Regular() {
  const [isNewProductAdded, setNewProductAdded] = useState(false);

  const handleNewProductAdded = () => {
    setNewProductAdded(true);

    // 리스트에 반영하는 시간 주기
    setTimeout(() => {
      setNewProductAdded(false);
    }, 10);
  };

  return (
    <Box className="Regular-container" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        // alignItems: 'center', 
        minHeight: "100vh",
        marginLeft: '180px',
        // width: '85vw',
        // height: '100dvh',
        // maxWidth: '800px',
        px: 4
        }}>
        <AddRegularComponent onNewProductAdded={handleNewProductAdded} className="AddRegularComponent"/>
        <ListRegularComponent isNewProductAdded ={isNewProductAdded} className="ListRegularComponent"/>
    </Box>
  );
}