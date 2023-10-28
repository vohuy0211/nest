import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { PayPalButtons } from '@paypal/react-paypal-js';

import { CartAPI } from '../../models/cart';
import HIstory from '../History/HIstory';

const ModalPayPal: React.FC<any> = ({ totalPrice, closeModalPayPal }) => {
  const [dataOrder, setDataOrder] = useState(false);
  const ref: any = React.useRef<null>(null)

  // console.log(typeof totalPrice);
  const navigate = useNavigate();
  const userData: any = localStorage.getItem("user");
  const userObject = JSON.parse(userData);
  useEffect(() => {

    const fetchData = async () => {
      try {
        const dataUserOder: any = await CartAPI.getOder(userObject.id);
        ref.current = dataUserOder
        const dateResponse: any = await CartAPI.getToCart(dataUserOder.id);
        await dateResponse?.map(async (item: any) => {
          const dataValue: any = {
            totalPrice: Number(totalPrice),
            orderDate: new Date().toISOString(),
            quantity: Number(item.quantityOrder),
            status: 1,
            fullName: userObject.username,
            phoneNumber: userObject.phoneNumber,
            address: userObject.address,
            productId: item.productId,
            orderId: dataUserOder.id,
          }
          return await CartAPI.postHistory(dataValue as any)
        })
      } catch (err) {
        console.log("err", err);
      }
    }

    fetchData();

  }, [dataOrder]);

  const handlePaymentSuccess = async () => {
    // console.log(dateResponse.orderId);
    console.log("ref", ref)
    await CartAPI
      .DelOderItem(ref.current.id)
    setDataOrder(true)
    navigate("/History")
    closeModalPayPal();
    // toast.success("Thanh toán thành công", {
    //   position: "top-right",
    //   autoClose: 500,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });
  }
  console.log("dataOrder")

  return (
    <div>
      <div className='wrapper-exp'>
        <section className='modal-exp'>
          <PayPalButtons
            style={{
              layout: "horizontal",
              height: 48,
            }}
            createOrder={(data, actions) => {
              {
                console.log(data);
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: totalPrice.toLocaleString(), // Sử dụng giá trị totalAmount ở đây
                      },
                      description: `Purchase at ${new Date().toLocaleString()}`,
                    },
                  ],
                });
              }
            }}
            onApprove={(_, actions): any => {
              return actions.order
                ?.capture()
                .then(() => handlePaymentSuccess());
            }}
          />
        </section>
      </div>
    </div>
  )
}

export default ModalPayPal