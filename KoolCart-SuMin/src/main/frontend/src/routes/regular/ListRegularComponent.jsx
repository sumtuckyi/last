import React, { useEffect, useState } from 'react';
import RegularService from './service/RegularService';
import SingleRegularComponent from './SingleRegularComponent';
import { Typography } from '@mui/material';
import { Box } from "@mui/material";
import { useSelector } from 'react-redux';
import Divider from '@mui/material/Divider';

function ListRegularComponent({isNewProductAdded }) {
  const [regulars, setRegulars] = useState([]);

  // Redux 사용해서 사용자 정보 가져오기
  const userSeq = useSelector((state) => state.user.userSeq);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RegularService.getRegularsByUser(userSeq);
        // 다음 정기 배송 일자 가까운 순으로 정렬
        const sortedRegulars = response.data.sort((a, b) => {
          const dateA = new Date(a.nextOrder);
          const dateB = new Date(b.nextOrder);

          return dateA - dateB;
        })

        setRegulars(sortedRegulars);
      } catch (error) {
        console.error('Error fetching regulars:', error);
      }
    };

    fetchData();
  }, [userSeq, isNewProductAdded]);

  const handleTerminate = (terminatedRegular) => {
    // 정기 주문 해지 후, 해당 주문을 리스트에서 제거
    setRegulars((prevRegulars) => prevRegulars.filter(regular => regular.rdSeq !== terminatedRegular.rdSeq));
  }

  const handleUpdateRegular = (updatedRegular) => {
    setRegulars(currentRegulars =>
      currentRegulars.map(regular =>
        regular.rdSeq === updatedRegular.rdSeq ? updatedRegular : regular
      ).sort((a, b) => new Date(a.nextOrder) - new Date(b.nextOrder)) // 남은 배송일 순으로 정렬
    );
  };

  return (
      <Box component="main" sx={{ flex: 1, py: 6, px: 4 }}>

        <Typography variant="h5" align="left" gutterBottom sx={{mx:4, fontSize:"1.3rem"}}>
          <strong>정기배송 신청내역</strong> ({regulars.length}건)
        </Typography>

        <Divider></Divider>

        <Box sx={{ overflowY: 'auto', mb: 1, maxHeight: '80vh' }}>
          {regulars.map((regular) => (
            <Box
              key={regular.rdSeq}
              sx={{ flex: 1, py: 1, px: 3}}
            >
              <SingleRegularComponent
                key={regular.rdSeq} 
                regular={regular}
                onTermination={handleTerminate}
                onUpdateRegular={handleUpdateRegular}
              />
            </Box>
          ))}
        </Box>
      </Box>
  );
}

export default ListRegularComponent;