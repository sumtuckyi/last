import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Paper, Grid, Button, Modal, Tooltip, IconButton, TextField } from '@mui/material';
import { addProduct } from "../../api/getData";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Box, ThemeProvider, createTheme, spacing } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import banana from './banana.png';
import egg from './egg.jpg';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '500px',
  width: '800px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const CartModal = ({ userSeq, sctgSeq, pdtSeq }) => {
  const [pdtData, setPdtData] = useState([]);
  const [shopData, setShopData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if(pdtSeq != 0){
      axios.get(`http://i10a101.p.ssafy.io:8000/api4/pdt_list/search/${pdtSeq}`)
      .then(response => { setPdtData(response.data) });
    }
    axios.get(`http://i10a101.p.ssafy.io:8000/api4/pdt_list/${sctgSeq}`)
    .then(response => { setShopData(response.data) });
  }, []);

  const addToCart = (selectPdt) => {
    addProduct(
			'api/carts/',
			{ 
				'userSeq': userSeq,
				'pdtSeq': selectPdt.id,
				'count': 1,
				'name': selectPdt.item,
				'imgUrl': selectPdt.img_url,
				'price': selectPdt.price
			},
			(res) => {
				console.log(res)
			},
			(error) => {
				console.error(error)
			}
		)
  };

    return (
      <Box sx={modalStyle}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            간편 주문
          </Typography>
        </Grid>
        <Grid item xs={2}>
          {/* <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton> */}
        </Grid>

        {pdtSeq !== 0 ? (
          <>
          <Grid item xs={12}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              현재 내 상품
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Box>
              <img src={pdtData.img_url} alt="egg" style={{ width: '60%', height: '50%', objectFit: 'cover' }} />
              {/* 가격 : 1000원 */}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Button
            onClick={() => addToCart(pdtData)}
            style={{ width: '100%', height: '100%' }}
            >
            <Typography sx={{ mt: 2 }}>
              제품명 : {pdtData.item}
              <br/>
              가격 : {pdtData.price}
            </Typography>
            </Button>
          </Grid>
          </>
        ) : null}

        <Grid item xs={12}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            추천 상품
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ overflowY: 'auto', maxHeight: '400px' }}>
        {shopData.slice(0, 5).map((item) => (
          <Grid container key={item.id} spacing={2}>

            <Grid item xs={5}>
            <Box>
              <img src={item.img_url} alt={item.productName} style={{ width: '50%', height: '50%', objectFit: 'cover' }} />
              {/* 가격 : {item.price}원 */}
            </Box>
            </Grid>
            <Grid item xs={7}>
            <Button
            onClick={() => addToCart(item)}
            style={{ width: '100%', height: '100%' }}
            >
            <Typography sx={{ mt: 2 }}>
              제품명 : {item.item}
              <br/>
              가격 : {item.price}원
            </Typography>
            </Button>
            </Grid>

          </Grid>
        ))}
        </Grid>

      </Grid>
    </Box>
    );
};

export default CartModal;