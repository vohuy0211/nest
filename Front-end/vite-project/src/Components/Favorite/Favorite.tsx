import './Favorite.css';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { toast, ToastContainer } from 'react-toastify';

import { BookAPI } from '../../models/book';
import { CartAPI } from '../../models/cart';
import Header from '../Common/Header/Header';

const Favorite = () => {
  const [like, setLike] = useState([])
  // const [showModal, setShowModal] = useState(false);

  const userValue = localStorage.getItem("user");
  const userOrder = userValue ? JSON.parse(userValue) : undefined;

  const handleGetFavoriteById = async (id: number) => {
    const dataFavorites: any = await BookAPI.getFavoriteById(userOrder.id);
    // console.log("data ==>", dataFavorites);
    setLike(dataFavorites)
  }


  const handleAddtoCart = async (id: number) => {
    const userValue = localStorage.getItem("user");
    const userOrder = userValue ? JSON.parse(userValue) : undefined;
    const valueOrder = { userId: userOrder.id, status: 1 };
    await CartAPI.addOder(valueOrder);
    await CartAPI.getOder(userOrder.id).then((oder: any) => {
      // console.log(oder);


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
    })
  }

  const handleDeleteFavorite = async (id: number) => {
    try {
      console.log(id);


      await BookAPI.deleteFavorite(id);
      const updatedLike = like.filter((item: any) => item.productId !== id);
      setLike(updatedLike);

      toast.success("Xoá khỏi danh sách thành công", {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleGetFavoriteById(userOrder.id)
  }, [])
  console.log(like);

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
      <Header />
      <table className="favorite-list">
        <thead>
          <tr>
            <th>Mã số sách</th>
            <th>Hình ảnh</th>
            <th>Tên sách</th>
            <th>Giá sản phẩm</th>
            <th>Thể loại</th>
            <th>Tác giả</th>
            <th></th>

          </tr>
        </thead>
        <tbody>
          {like?.map((item: any) => (
            <tr className="favorite-item">
              <td>{item.product.id}</td>
              <td><img src={item.product.img} /></td>
              <td>{item.product.nameBook}</td>
              <td>{item.product.price.toLocaleString()}<span>đ</span></td>
              <td>{item.product.category}</td>
              <td>{item.product.author}</td>
              <td className='btn-favorite'>
                <button className='btn-addCart' onClick={() => item.product.id && handleAddtoCart(item.product.id)}>Add to Cart</button>
                <button className='btn-deleteList' onClick={() => handleDeleteFavorite(item.productId)}>Delete</button>
                {/* <div className={`modal-container ${showModal ? 'active' : ''}`}>
                  <div className="modal-content">
                    <p>Bạn có muốn xoá ra khỏi danh sách không?</p>
                    <div className="modal-buttons">
                      <button className="modal-button yes" onClick={() => handleDeleteFavorite(item.productId)}>Có</button>
                      <button className="modal-button no" onClick={() => setShowModal(false)}>Không</button>
                    </div>
                  </div>
                </div> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Favorite