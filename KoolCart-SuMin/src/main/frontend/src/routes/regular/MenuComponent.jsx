import { useEffect, useRef, useState } from "react";
import { addProduct, getCategory, getProducts } from "../../api/getData";

import { Menu, Avatar, Card } from 'antd';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/dataSlice";
import './MenuComponent.css';
import { Box } from "@mui/system";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const { Meta } = Card;

export default function MenuComponent({ handleAdd, color }) {

  const [category, SetCategory] = useState([]);
  const [smallCategory, SetSmallCategory] = useState(null);
  const [productsList, SetProductsList] = useState(null)

  const categoryData = useSelector((state) => state.data.category);

  useEffect(() => {
    SetCategory(categoryData);
  }, [])

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [productsList])


  function showProducts(idx) {
    getProducts(
      `api4/pdt_list/${idx}`,
      ({ data }) => {
        SetProductsList(data)
      },
      (error) => {
        console.error(error);
      }
    )
  }

  const items2 = []
  let idx = 1;
  category.map((item, i) => {
    const smallCate = item.small_categories.map((sItem) => {
      return getItem(sItem.name, idx++, null, null);
    });
    items2.push(getItem(item.name, `cate${i}`, null, smallCate));
  });

  return (
    <Box className="Page-container" sx={{ height: '100%' }}>
      <Box className="product-container" sx={{ height: '100%', display: 'flex', marginLeft: 0 }}>
        <Box id="major-category">
          <Menu
            id="cate-menu"
            onClick={(e) => {
              showProducts(e.key)
            }}
            style={{
              backgroundColor: color,
              color: '#000000',
              fontSize: '1rem',
              itemSelectedColor: '#F9F9F9',
              border: 'none',
              position: 'relative',
              zIndex: 1001,
            }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="vertical"
            triggerSubMenuAction="click"
            inlineIndent='10'
            items={items2}
          />
        </Box>
        <Box className="product-list" ref={scrollRef} sx={{ height: '100%', flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          {productsList ? (
            productsList.map((item, i) => (
              <Card
                id="pdt-card"
                hoverable
                key={i}
                // style={{backgroundColor : '#ffffff', width: 377.14, height: 563.74}}
                style={{ backgroundColor: '#ffffff', width: 249, height: 430 }}
                cover={
                  <img
                    alt="example"
                    src={item.img_url}
                    //   style={{width : 377.54, height: 468}}
                    style={{ width: 249, height: 320 }}
                  />
                }
              >
                <Meta
                  title={
                    // 상품명 2줄 이상이면 ...으로 생략
                    <span className="my-card-title"
                      style={{
                        textWrap: "pretty", wordBreak: "break-word", display: "-webkit-box",
                        WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                      }}>
                      {item.item}
                    </span>}
                  description={item.price}
                />

                <AddShoppingCartIcon
                  onClick={() => { handleAdd(item) }}
                />

              </Card>
            ))
          ) : (
            '카테고리를 선택해주세요.'
          )
          }
        </Box>
      </Box>
    </Box>
  )
}
