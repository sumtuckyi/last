import React, { useState, useEffect, useMemo } from 'react';
import ProductComponent from './ProductComponent';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Divider, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import Paper from '@mui/material/Paper';
import ConfirmModal from './ConfirmModal';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import RegularService from './service/RegularService';
import 'dayjs/locale/ko'
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import QuantityInput from './NumberInputComponent';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
import ShoppingService from './service/ShoppingService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '500px',
  width: '70vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

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

const getColorByDaysLeft = (daysLeft) => {
  if (daysLeft >= 0 && daysLeft <= 7) {
    return '#ff0000'; // 빨간색
  } else if (daysLeft >= 8 && daysLeft <= 16) {
    return '#ffa500'; // 주황색
  } else {
    return '#008000'; // 초록색
  }
};


const SingleRegularComponent = ({
  regular,
  onTermination,
  onUpdateRegular
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedCount, setEditedCount] = useState(regular.count);
  const [editedCycle, setEditedCycle] = useState(regular.cycle);
  const [selectedDate, setSelectedDate] = useState(regular.nextOrder);

  // Redux 사용해서 사용자 정보 가져오기
  const userSeq = useSelector((state) => state.user.userSeq);

  // const currentDate = new Date();
  const currentDate = useMemo(() => new Date(), []); // currentDate를 useMemo로 메모이제이션
  const daysLeft = Math.ceil((dayjs(regular.nextOrder) - currentDate) / (1000 * 60 * 60 * 24));

  const [editedDaysLeft, setEditedDaysLeft] = useState(daysLeft);

  const [editedRegular, setEditedRegular] = useState(regular);

  useEffect(() => {
    // editedRegular 변경되면 다시 렌더링
    setEditedCount(editedRegular.count);
    setEditedCycle(editedRegular.cycle);
    setSelectedDate(editedRegular.nextOrder);
    const newDaysLeft = Math.ceil((dayjs(editedRegular.nextOrder) - currentDate) / (1000 * 60 * 60 * 24));
    setEditedDaysLeft(newDaysLeft);
  }, [editedRegular, currentDate]);

  const handleOpenModal = () => {
    setModalOpen(true);
    setEditedCount(regular.count);
    setEditedCycle(regular.cycle);
    setSelectedDate(regular.nextOrder);
    const newDaysLeft = Math.ceil((dayjs(regular.nextOrder) - currentDate) / (1000 * 60 * 60 * 24));
    setEditedDaysLeft(newDaysLeft);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDateChange = (jsnewDate) => {
    // Date format으로 바꿔서 저장
    const newDate = dayjs(jsnewDate).format('YYYY-MM-DD');
    setSelectedDate(newDate);

    // X일 후 배송 예정 바로 업데이트
    setEditedDaysLeft(Math.ceil((dayjs(newDate) - currentDate) / (1000 * 60 * 60 * 24)));
  };

  const handleTerminate = async () => {
    try {
      await RegularService.terminateRegular(editedRegular.rdSeq);

      // 정기 배송 해지 성공 시, 해당 배송 리스트에서 제거
      onTermination(editedRegular);

      // 모달 닫기
      setModalOpen(false);
    } catch (error) {
      console.error('Error terminate editedRegular: ', error);
    }
  };

  const handleConfirmChanges = async () => {
    try {
      // Backend에 수정된 데이터 전송
      const updatedData = {
        count: editedCount,
        cycle: editedCycle,
        nextOrder: selectedDate,
      };
      await RegularService.updateRegular(editedRegular.rdSeq, updatedData);
  
      // 상위 컴포넌트의 상태 업데이트를 위한 업데이트된 regular 객체 생성
      const updatedRegular = {
        ...editedRegular,
        ...updatedData,
      };
  
      // 상위 컴포넌트의 상태 업데이트 함수 호출
      onUpdateRegular(updatedRegular);
  
      // 모달 닫기
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating editedRegular:', error);
    }
  };

  const handlePurchaseNow = async () => {
    try {
      // 쇼핑몰에 주문 처리 로직
      const orderData = {
        'user': userSeq,
        'pdts': JSON.stringify([{pdt_id: regular.pdtSeq, count: regular.count}]),
        'standard': 0, // 정기 배송 : 0
      };
      await ShoppingService.placeOrder(orderData);
  
      // 주문 처리 후의 업데이트된 날짜 정보
      const newOrderDate = dayjs().add(regular.cycle, 'day').format("YYYY-MM-DD");
      const currentDate = dayjs().format("YYYY-MM-DD");
  
      // 서버에 변경사항을 업데이트
      await RegularService.updateRegular(regular.rdSeq, {
        nextOrder: newOrderDate,
        lastOrder: currentDate,
      });
  
      // 상위 컴포넌트 상태 업데이트를 위한 업데이트된 regular 객체 생성
      const updatedRegular = {
        ...regular,
        nextOrder: newOrderDate,
        lastOrder: currentDate,
      };

      setSelectedDate(newOrderDate);
  
      // 상위 컴포넌트의 상태 업데이트 함수 호출
      onUpdateRegular(updatedRegular);
      
    } catch (error) {
      console.error('Error updating regular:', error);
    }
  };

  const handleSkipOrder = async () => {
    try {
      // 다음 정기 주문 날짜를 현재 주문 주기에 따라 계산
      const newOrderDate = dayjs(regular.nextOrder).add(regular.cycle, 'day').format("YYYY-MM-DD");
  
      // 서버에 변경사항 업데이트
      await RegularService.updateRegular(regular.rdSeq, { nextOrder: newOrderDate });
  
      // 상위 컴포넌트 상태 업데이트를 위한 업데이트된 regular 객체 생성
      const updatedRegular = {
        ...regular,
        nextOrder: newOrderDate,
      };

      setSelectedDate(newOrderDate);
  
      // 상위 컴포넌트의 상태 업데이트 함수 호출
      onUpdateRegular(updatedRegular);
  
    } catch (error) {
      console.error('Error skipping regular order:', error);
    }
  };
  

  // 정기배송 정보 비동기 업데이트
  useEffect(() => {
    setEditedRegular((prevRegular) => ({
      ...prevRegular,
      count: editedCount,
      cycle: editedCycle,
      nextOrder: selectedDate,
    }))

    const newDaysLeft = Math.ceil((dayjs(selectedDate) - currentDate) / (1000 * 60 * 60 * 24));
    setEditedDaysLeft(newDaysLeft);
  }, [selectedDate, editedCount, editedCycle]);

  return (
    <Box>
      <Paper sx={{ minWidth: 600, my: 2, overflow: 'hidden', mb: 1, paddingRight: 3}}>
        <Grid container sx={{ ml: 0.5 }}>
          <Grid container>
            <Grid item xs={10}>
              <ProductComponent regular={editedRegular} />
            </Grid>
            <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleOpenModal}>
                상세 조회
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{width : '100%', mt : 1}}/>

          <Grid container sx={{ my: 2 }}>
            <Grid item xs={3.5} sx={{ textAlign: 'center' }}>
              <Typography style={{ color: getColorByDaysLeft(daysLeft) }}>
                {daysLeft}일 후 배송 예정
              </Typography>
              <Typography style={{ color: getColorByDaysLeft(daysLeft) }}>
                {regular.nextOrder}
              </Typography>
            </Grid>
            <Grid container item xs={8.5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                <ConfirmModal
                  callback={() => handlePurchaseNow(editedRegular)}
                  regular={editedRegular}
                  buttonName={'지금 구매'}
                  title={'지금 구매하시겠습니까?'}
                />
                <ConfirmModal
                  callback={() => handleSkipOrder(editedRegular)}
                  regular={editedRegular}
                  buttonName={'이번 배송 건너뛰기'}
                  title={'이번 배송을 건너뛰시겠습니까?'}
                />
            </Grid>
          </Grid>

          {/* Modal */}
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography variant="h6" component="h2">
                상세 상품정보
                <Divider/>
              </Typography>


              <Box sx={{my: 8}}>
                <ProductComponent regular={editedRegular}/>
                <Typography variant='body2' sx={{textAlign : 'center'}}>{editedRegular.lastOrder === null ? '' : `마지막 배송일 : ${editedRegular.lastOrder}`}</Typography>
                <Divider sx = {{marginTop : 2}}/>
              </Box>

              {/* <TextField
                label="수량"
                type="number"
                value={editedCount}
                onChange={(e) => setEditedCount(Number(e.target.value))}
                sx={{ minWidth: '40%', mb: 2 }}
              /> */}
              <QuantityInput
                value = {editedCount}
                onChange={(value) => setEditedCount(Number(value))}
                sx={{ minWidth: '40%', mb: 2 }}
              />
              <br />

              {/* <TextField
                label="정기 배송 주기"
                type="number"
                inputProps={{ min: 1, max: 99, step: 1 }}
                value={editedCycle}
                onChange={(e) => setEditedCycle
                  (Number(e.target.value))}
                sx={{ minWidth: '40%', mb: 2 }}
              /> */}

              <FormControl sx = {{width : '40%', mb: 2, textAlign: 'center'}}>
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
              <br />
              
              {/* <LocalizationProvider 
                dateAdapter={AdapterDayjs} 
                adapterLocale="ko"
                dateFormats={datePickerUtils}
              >
                <DemoContainer
                    components={["DatePicker"]}
                >
                  <DatePicker
                    label="다음 배송일"
                    value={dayjs(selectedDate)} // dayjs로 변환
                    onChange={(newDate) => handleDateChange(newDate)}
                    textField={(props) => <TextField {...props} />}
                    format="YYYY / MM / DD"
                  />
                </DemoContainer>
              </LocalizationProvider> */}
              <Box sx = {{mb:2, width: '40%'}}>
                <LocalizationProvider 
                  dateAdapter={AdapterDayjs}
                  adapterLocale="ko"
                  dateFormats={datePickerUtils}
                >
                  <MobileDatePicker
                    label="다음 배송일"
                    value={dayjs(regular.nextOrder)} // dayjs로 변환
                    onChange={(newDate) => handleDateChange(newDate)}
                    textField={(params) => <TextField {...params}/>}
                    sx={{ width:'100%' }} 
                    format="YYYY / MM / DD"
                    inputStyle={{ textAlign: 'center' }}
                    minDate={dayjs(currentDate)} 
                  />
                </LocalizationProvider>
              </Box>
              <p style={{ color: getColorByDaysLeft(daysLeft) }}>{editedDaysLeft}일 후 다음 배송 예정</p>

              <Box sx={{ display: 'flex', width: '45%', justifyContent: 'space-between', marginTop: 2 }}>
                <ConfirmModal
                  callback={() => handleTerminate()}
                  regular={editedRegular}
                  buttonName={'정기배송 해지'}
                  title={'해당 상품의 정기배송을 해지하시겠습니까?'}
                />

                <Button variant="contained" onClick={handleCloseModal}>
                  취소
                </Button>

                <Button variant="contained" onClick={handleConfirmChanges}>
                  확인
                </Button>
              </Box>
            </Box>
          </Modal>
        </Grid>
      </Paper>
    </Box>
  );
}

export default SingleRegularComponent;
