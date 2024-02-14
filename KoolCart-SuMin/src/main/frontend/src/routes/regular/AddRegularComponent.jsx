import React, { useState, useEffect } from 'react';
import ProductComponent from './ProductComponent';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RegularService from './service/RegularService';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import MenuComponent from './MenuComponent';
import { useSelector } from 'react-redux';
import QuantityInput from './NumberInputComponent';
import { Divider, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';

const DEFAULT_COUNT = 1;
const DEFAULT_CYCLE = 7;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 9 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const datePickerFormat = "YYYY-MM-DD";
const datePickerUtils = {
  format: datePickerFormat,
  parse: (value) => dayjs(value, datePickerFormat, true).toDate(),
};

function AddRegularComponent({ onNewProductAdded }) {
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [isSelectModalOpen, setSelectModalOpen] = useState(false);

  const [editedCount, setEditedCount] = useState(DEFAULT_COUNT);
  const [editedCycle, setEditedCycle] = useState(DEFAULT_CYCLE);

  const currentDate = new Date();
  const nextWeekDate = new Date(currentDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + DEFAULT_CYCLE);

  const [selectedDate, setSelectedDate] = useState(dayjs(nextWeekDate).format('YYYY-MM-DD'));
  const [editedDaysLeft, setEditedDaysLeft] = useState(DEFAULT_CYCLE);

  const userSeq = useSelector((state) => state.user.userSeq);

  const [regular, setRegular] = useState(
    {
      userSeq: userSeq,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate
    }
  );

  const handleSelectedItem = (item) => {
    setRegular({
      userSeq: userSeq,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate,
      pdtSeq: item.id,
      price: item.price,
      name: item.item,
      img_url: item.img_url,
    })

    handleCloseSelectModal();
  };

  const handleOpenSubmitModal = () => {
    setEditedCount(DEFAULT_COUNT);
    setEditedCycle(DEFAULT_CYCLE);
    setSelectedDate(dayjs(nextWeekDate).format('YYYY-MM-DD'));
    setEditedDaysLeft(DEFAULT_CYCLE);

    setRegular((prevRegular) => ({
      ...prevRegular,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate,
    }))

    setSubmitModalOpen(true);
  };

  const handleOpenSelectModal = () => {

    setSelectModalOpen(true);
  };

  const handleCloseSubmitModal = () => {
    setSubmitModalOpen(false);
  };

  const handleCloseSelectModal = (event, reason) => {
    setSelectModalOpen(false);

    // 모달창 바깥 눌러서 나갈 때는 제출 모달을 띄우지 않는다
    if (reason !== "backdropClick") {
      handleOpenSubmitModal();
    }
  };

  const handleDateChange = (jsnewDate) => {
    // Date format으로 바꿔서 저장
    const newDate = dayjs(jsnewDate).format('YYYY-MM-DD');
    setSelectedDate(newDate);

    // X일 후 주문 예정 바로 업데이트
    setEditedDaysLeft(Math.ceil((dayjs(newDate) - currentDate) / (1000 * 60 * 60 * 24)));
  };

  // 정기배송 정보 비동기 업데이트
  useEffect(() => {
    setRegular((prevRegular) => ({
      ...prevRegular,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate,
    }))
  }, [selectedDate, editedCount, editedCycle]);

  const handleConfirmChanges = async () => {
    setRegular((prevRegular) => ({
      ...prevRegular,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate,
    }))

    try {
      await RegularService.writeRegular(regular);

      onNewProductAdded();
      setSubmitModalOpen(false);
    } catch (error) {
      console.error('Error write regular: ', error);
    }
  };

  return (
    <Box
      sx={{
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        px: 8,
        py: 4
      }}
    >
      <Button variant="contained" onClick={handleOpenSelectModal} fullWidth={true} sx={{ py: 2, fontSize: '1.1rem' }}>
        정기배송 상품 추가
      </Button>

      {/* 상품 선택 모달 */}
      <Modal
        open={isSelectModalOpen}
        onClose={handleCloseSelectModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '500px',
            width: '80vw',
            height: '70vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <MenuComponent handleAdd={handleSelectedItem} color='#ffffff' />
        </Box>
      </Modal>

      {/* 정기배송 신청 모달 */}
      <Modal
        open={isSubmitModalOpen}
        onClose={handleCloseSubmitModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '500px',
            width: '50vw',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="h6" component="h2" sx={{ marginBottom: 3 }}>
            정기배송 신청
            <Divider />
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <ProductComponent regular={regular} />
            <Button variant="contained" sx={{ ml: 1, mr: 4 }} onClick={handleOpenSelectModal} size='small'>
              수정
            </Button>
          </Box>
          <Divider sx={{ width: '90%' }} />


          {/* <TextField
              label="수량"
              type="number"
              value={editedCount}
              onChange={(e) => setEditedCount(Number(e.target.value))}
              sx={{ minWidth: '40%', mb: 2 }}
            /> */}

          <QuantityInput
            value={editedCount}
            onChange={(value) => setEditedCount(Number(value))}
            sx={{ minWidth: '40%', mb: 2, mt: 4 }}
          />

          {/* <TextField
              label="정기 배송 주기"
              type="number"
              inputProps={{ min: 1, max: 99, step: 1 }}
              value={editedCycle}
              onChange={(e) => setEditedCycle(Number(e.target.value))}
              sx={{ minWidth: '40%', mb: 2}}
            /> */}

          <FormControl sx={{ width: '40%', mb: 2, textAlign: 'center' }}>
            <InputLabel id="demo-simple-select-label">정기 배송 주기</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editedCycle}
              label="정기 배송 주기"
              onChange={(e) => setEditedCycle(Number(e.target.value))}
              MenuProps={MenuProps}
            >
              {Array.from({ length: 100 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}일
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2, width: '40%' }}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="ko"
              dateFormats={datePickerUtils}
            >
              <MobileDatePicker
                label="처음 배송일"
                value={dayjs(selectedDate)} // dayjs로 변환
                onChange={(newDate) => handleDateChange(newDate)}
                textField={(params) => <TextField {...params} />}
                sx={{ width: '100%' }}
                format="YYYY / MM / DD"
                inputStyle={{ textAlign: 'center' }}
                minDate={dayjs(currentDate)}
              />
            </LocalizationProvider>
          </Box>

          <p style={{ color: '#ff0000' }}>{editedDaysLeft}일 후 첫 정기 배송 예정</p>

          <Box sx={{ display: 'flex', minWidth: '30%', justifyContent: 'space-between', marginTop: 4 }}>
            <Button variant="outlined" onClick={handleCloseSubmitModal}>
              취소
            </Button>
            <Button variant="contained" onClick={handleConfirmChanges}>
              확인
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AddRegularComponent;
