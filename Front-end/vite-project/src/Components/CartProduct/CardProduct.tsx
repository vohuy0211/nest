import './CardProduct.css';
import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { CartAPI } from '../../models/cart';
import { IHistory } from '../../types/cart';
import Header from '../Common/Header/Header';
import ModalPayPal from '../Modal/ModalPayPal';

const CardProduct = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataOrder, setDataOrder] = useState<any[]>();
  const [isCall, setIsCall] = useState(true);
  const [paypal, setPaypal] = useState(false);
  // const [stateUpdate, setStateUpdate] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userData: any = localStorage.getItem("user");
  const userObject = JSON.parse(userData);

  useEffect(() => {
    const handleGetCart = async (id: number) => {
      const dataIdOrder: any = await CartAPI.getOder(Number(id));
      // console.log("data ===>", dataIdOrder);

      const response = await CartAPI.getToCart(dataIdOrder.id);
      // console.log("response ===> ", response);
      const data: any = response;
      // console.log("data cart ==>", data);
      setDataOrder(data);
    };
    if (isCall) {
      handleGetCart(userObject.id);
    }
    return () => {
      setIsCall(false);
    };
  }, [isCall]);
  // console.log("dataOder ===> ", dataOrder);

  const getTotalPrice = () => {
    return dataOrder?.reduce(
      (total, item) => total + item.products.price * item.quantityOrder,
      0
    );
  };

  const totalPrice = getTotalPrice()
  // console.log("total ==>", totalPrice);


  const handleIncreaseQuantity = async (productId: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + 1;
    await updateQuantityOnServer(productId, newQuantity);
  };

  const handleDecreaseQuantity = async (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      await updateQuantityOnServer(productId, newQuantity);
    }
  };

  const updateQuantityOnServer = async (productId: number, newQuantity: number) => {
    console.log("vao day");
    try {
      await CartAPI.updateCart(productId, newQuantity);
      // Cập nhật lại dữ liệu hiển thị sau khi thay đổi số lượng thành công trên server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDataOrder((prevData: any) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        prevData.map((item: any) =>
          item.id === productId ? { ...item, quantityOrder: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await CartAPI.deleteCart(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setDataOrder((prevData: any) => prevData.filter((item: any) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleHistory = async (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataUserOder: any = await CartAPI.getOder(id);
    const dateResponse = await CartAPI.getToCart(dataUserOder.id);
    console.log("dateResponse", dateResponse);

    const dataOrder: any = dateResponse;

    const dataUserJSON: any = localStorage.getItem('user')
    const dataUser: any = JSON.parse(dataUserJSON)
    // console.log("User ===>", dataUser);
    // console.log("gagaga", dataOrder);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await dataOrder?.map((item: any) => {

      const dataValue: IHistory = {
        totalPrice: Number(getTotalPrice()),
        orderDate: new Date().toISOString(),
        quantity: Number(item.quantityOrder),
        status: 1,
        fullName: dataUser.username,
        phoneNumber: dataUser.phoneNumber,
        address: dataUser.address,
        productId: item.productId,
        orderId: dataUserOder.id,
      }
      // console.log("dataValue", dataValue);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return CartAPI.postHistory(dataValue as any);
    });
    toast.success("Thanh toán thành công", {
      position: "top-right",
      autoClose: 500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // console.log("hahaha");
    await CartAPI
      .DelOderItem(dataUserOder.id)
      .then((res) => {
        console.log(res);
        console.log("delete thanh cong");
      })
      .catch((err) => {
        console.log("err", err);
      });
    setDataOrder([]);
  };

  const closeModalPayPal = () => {
    setPaypal(false)
  }



  return (
    <div className="wrapper-cart-product">
      {paypal && <ModalPayPal totalPrice={totalPrice} closeModalPayPal={closeModalPayPal} />}
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
      <Header />
      <h2>
        <i>Danh sách sản phẩm</i>
      </h2>
      <div className="wrapper-cart">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên</th>
              <th>Giá sản phẩm</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataOrder && dataOrder?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img src={item.products.img} />
                </td>
                <td>{item.products.nameBook}</td>
                <td>
                  {(item.products.price * item.quantityOrder).toLocaleString()}
                  <span>đ</span>
                </td>
                <td className="quantity">
                  <AiOutlineMinus
                    onClick={() =>
                      handleDecreaseQuantity(item.id, item.quantityOrder)
                    }
                  />
                  <span>{item.quantityOrder}</span>
                  <AiOutlinePlus
                    onClick={() =>
                      handleIncreaseQuantity(item.id, item.quantityOrder)
                    }
                  />
                </td>
                <td>
                  <TiDelete onClick={() => handleDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pay-cart">
          <h3>Đơn hàng</h3>
          <div>
            Tổng({dataOrder?.length} sản phẩm) :{" "}
            {getTotalPrice()?.toLocaleString()}đ
          </div>
          <button onClick={() => handleHistory(userObject.id)}>
            CheckOut
          </button>
          <button onClick={() => setPaypal(true)}>Pay with PayPal</button>
        </div>
        <div className="wrapper-footer-end">
          <div className="wrapper-footer-end-right">
            <h5>Truyện Tính phí</h5>
            <h5>Thử dùng gói Cao cấp</h5>
            <h5>Tải Ứng Dụng</h5>
            <h5>Ngôn ngữ</h5>
            <h5>Các tác giả</h5>
            <h5>Kinh Doanh</h5>
            <h5>Công việc</h5>
            <h5>Báo chí</h5>
          </div>
          <div className="wrapper-footer-end-left">
            <h5>Điều khoản </h5>
            <h5>Bảo mật</h5>
            <h5>Thiết lập</h5>
            <h5>Trợ giúp</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardProduct