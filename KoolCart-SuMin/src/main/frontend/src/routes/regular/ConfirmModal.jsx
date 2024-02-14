// ConfirmModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProductComponent from './ProductComponent';

function ConfirmModal({ callback, regular, buttonName, title }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlePurchase = () => {
    callback(regular);
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleOpen} sx={{mx : 1}}>{buttonName}</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40vw',
          bgcolor: 'background.paper',
          boxShadow: 24,
          pt: 2,
          px: 4,
          pb: 3,
        }}>
          <h2 id="child-modal-title">{title}</h2>
          <Box id="child-modal-description" sx={{mt : 3}}>
            <Box>
              <ProductComponent regular={regular} />
              {/* <Typography>정기배송 주기 : {regular.cycle}일</Typography> */}
              {/* <Typography>{regular.lastOrder === null ? "" : `마지막 주문일 : ${regular.lastOrder}`}</Typography>
              <Typography>{regular.nextOrder === null ? "" : `다음 주문일 : ${regular.nextOrder}`}</Typography> */}
            </Box>
          </Box>
          <Box sx={{display: 'flex', justifyContent : 'center', mt : 5}}>
            <Button variant="outlined" onClick={handleClose} sx= {{mx:3}}>취소</Button>
            <Button variant="contained" onClick={handlePurchase} sx = {{mx:3}}>확인</Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

export default ConfirmModal;
