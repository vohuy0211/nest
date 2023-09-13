import './HomePage.css';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { BsFire } from 'react-icons/bs';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import asset from '../../assets/img';
import { BookAPI } from '../../models/book';
import { CartAPI } from '../../models/cart';
import { IBookAPI } from '../../types/book';

// import { ICart } from '../../types/cart';

// import { IBookAPI } from '../../models/book';


const HomePage = () => {
  const [book, setBook] = useState<IBookAPI[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectBook, setSelectBook] = useState<any[]>();
  const [isCheckBook, setIsCheckBook] = useState(false);
  const [isCall, setIsCall] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchValue = useSelector((state: any) => state.search);
  useEffect(() => {
    const handleGetBook = async () => {
      if (searchValue == "") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await BookAPI.getAllBooks();
        const data = await response;
        // console.log(data);
        setBook(data);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await CartAPI.searchBook(searchValue);
        const data = await response;

        setBook(data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const response: any = await BookAPI.getAllBooks();
      // const data = await response.data;
      // console.log(data);
      // setBook(data);
    };
    handleGetBook();

    return () => {
      setIsCall(false);
    };
  }, [isCall, searchValue]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilerType = (type: any) => {
    const newListBook = book.map((item) => {
      console.log(item);

      const categories = item.category.split(",");
      console.log(categories);

      return {
        ...item,
        category:
          item.category.length > 1 ? item.category.split(",") : item.category,
      };
    });
    const test = newListBook.filter((item) =>
      Array.isArray(item.category) && // Kiểm tra xem item.category là mảng chuỗi
      item.category.some((t: string) => t.includes(type))
    );
    if (test.length != 0) {
      setIsCheckBook(true);
      setSelectBook(test);
    } else {
      setSelectBook([]);
    }
  };

  const handleAddtoCart = async (id: number) => {

    // Lấy thông tin sản phẩm từ state book
    const selectedBook = book.find(item => item.id === id);

    // Kiểm tra nếu quantityBook = 0 thì không cho mua
    if (selectedBook && selectedBook.quantityBook === 0) {
      toast.error("Sản phẩm đã hết hàng", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const userOrder = JSON.parse(localStorage.getItem("user") || "null");
    const valueOrder = {
      userId: userOrder.id,
      status: 1
    };
    // console.log(valueOrder);

    // console.log("user==>", userOrder);
    await CartAPI.addOder(valueOrder);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await CartAPI.getOder(userOrder.id).then((oder: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataValue: any = {
        quantityOrder: 1,
        productId: id,
        orderId: oder.id,
      };
      // console.log("dataValue", dataValue);
      return dataValue;
    }).then((data) => {
      CartAPI.addToCart(data);
      toast.success("Thêm vào giỏ hàng thành công", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }).catch(
      (err) => {
        console.log(err);

      }
    )

    // dispatch(updateState());
  };

  function formatCurrencyVND(amount: any) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="Slider-product">
        <h2>
          Truyện HOT <BsFire />
        </h2>
        <div className="Slider-product-item">
          <img src={asset.productCard.anh1} />
          <img src={asset.productCard.anh2} />
          <img src={asset.productCard.anh3} />
          <img src={asset.productCard.anh4} />
          <img src={asset.productCard.anh5} />
          <img src={asset.productCard.anh6} />
        </div>
      </div>
      <div className="wrapper-product">
        <div className="wrapper-product-category">
          <h1>THỂ LOẠI</h1>
          <ul>
            <li onClick={() => handleFilerType("")}>TẤT CẢ</li>
            <li onClick={() => handleFilerType("viễn tưởng")}>VIỄN TƯỞNG</li>
            <li onClick={() => handleFilerType("xuyên không")}>XUYÊN KHÔNG</li>
            <li onClick={() => handleFilerType("tình cảm")}>TÌNH CẢM</li>
            <li onClick={() => handleFilerType("học đường")}>HỌC ĐƯỜNG</li>
            <li onClick={() => handleFilerType("cổ đại")}>CỔ ĐẠI</li>
            <li onClick={() => handleFilerType("thám hiểm")}>THÁM HIỂM</li>
            <li onClick={() => handleFilerType("linh dị")}>LINH DỊ</li>
          </ul>
        </div>
        <div className="wrapper-product-item">
          <div className="wrapper-product-card">
            <h1>ALL BOOK</h1>
            <div className="Card">
              {isCheckBook
                ? selectBook && selectBook.length > 0 &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectBook?.map((item: any) => (
                  <div className="Card-Product" key={item.id}>
                    <img src={item.img} />
                    <h3 style={{ padding: '8px 0' }}>{item.nameBook}</h3>
                    <h5 style={{ paddingBottom: 8 }}>
                      Giá sản phẩm : {formatCurrencyVND(item.price)}
                    </h5>
                    <div className="Card-Product-btn">
                      <Link to={`/Detail/${item.id}`}>Chi tiết</Link>
                      <button onClick={() => handleAddtoCart(item.id)} >
                        <TbShoppingCartPlus className="Card-Product-btn-add" />
                      </button>
                    </div>
                  </div>
                ))
                : book?.length > 0 &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                book?.map((item: any) => (
                  <div className="Card-Product" key={item.id}>
                    <img src={item.img} />
                    <h3 style={{ padding: '8px 0' }}>{item.nameBook}</h3>
                    <h5 style={{ paddingBottom: 8 }}>
                      Giá sản phẩm : {formatCurrencyVND(item.price)}
                    </h5>
                    <div className="Card-Product-btn">
                      <Link to={`/Detail/${item.id}`}>Chi tiết</Link>
                      <button onClick={() => handleAddtoCart(item.id)}>
                        <TbShoppingCartPlus />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage