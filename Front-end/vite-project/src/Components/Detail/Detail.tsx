import './Detail.css';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineComment, AiOutlineHeart, AiOutlineSend } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { toast, ToastContainer } from 'react-toastify';

import { BookAPI } from '../../models/book';
import { CartAPI } from '../../models/cart';
import { IBookAPI } from '../../types/book';

// import { ICart } from '../../types/cart';

const Detail = () => {
  const { id } = useParams();
  const [idBook, setIdBook] = useState<IBookAPI>();
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('');
  const [dataComment, setDataComment] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [like, setLike] = useState([])
  // const dispatch = useDispatch(); // 1. Sử dụng useDispatch

  const handleRating = (rate: number) => {
    setRating(rate)

    // other logic
  }
  // Optinal callback functions
  const onPointerEnter = () => console.log('Enter')
  const onPointerLeave = () => console.log('Leave')
  const onPointerMove = (value: number, index: number) => console.log(value, index)

  const handleCommentSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const userValue = localStorage.getItem("user");
      const userOrder = userValue ? JSON.parse(userValue) : undefined;

      if (!userOrder) {
        // Xử lý trường hợp người dùng chưa đăng nhập
        alert('Vui lòng đăng nhập để gửi bình luận.');
        return;
      }

      const data = {
        userId: userOrder.id,
        productId: idBook?.id,
        star: rating,
        comment: comment
      };

      await BookAPI.postComment(data);
      // alert('Bình luận đã được gửi thành công!');
      setComment(''); // Reset input sau khi gửi
      handleGetComment(id as any);
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    }
  }


  const handleGetComment = async (id: number) => {
    const dataComment: any = await BookAPI.getCommentByIdProduct(id);
    // console.log("hahah =>", dataComment);
    setDataComment(dataComment)
  };

  useEffect(() => {
    handleGetComment(id as any)
  }, [])



  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    BookAPI.getBookId(id as any).then((data) => {
      // console.log("data ===>", data);
      const dataDetails: any = data;
      setIdBook(dataDetails);
    });
  }, [id]);

  const categoryArr = idBook?.category.split(",");
  // console.log(categoryArr);

  const handleAddtoCart = async (id: number) => {
    const userValue = localStorage.getItem("user");
    const userOrder = userValue ? JSON.parse(userValue) : undefined;

    const valueOrder = { userId: userOrder.id };
    // console.log("user==>", valueOrder);

    await CartAPI.addOder(valueOrder);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await CartAPI.getOder(userOrder.id).then((oder: any) => {
      // console.log("haha", oder.oder[0].id);
      // console.log("hahaha");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataValue: any = {
        quantityOrder: 1,
        productId: id,
        orderId: oder.id,
      };
      console.log("dataValue", dataValue);
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
  };
  // console.log(comment);

  // Post Favorite
  const handleAddFavorite = async (id: number) => {
    try {
      const userValue = localStorage.getItem("user");
      const userOrder = userValue ? JSON.parse(userValue) : undefined;


      const data: any = {
        userId: userOrder.id,
        productId: id,
      };
      // console.log(data);


      await BookAPI.postFavorite(data).then((res: any) => {
        // console.log(res);
        if (res.message == 'Đã thêm vào danh sách yêu thích') {
          toast.success(res.message, {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsFavorite(false)
        } else {
          toast.error(res.message, {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsFavorite(true)
        }
      });
    } catch (error) {
      console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
    }
  }


  const handleGetFavoriteById = async (id: number) => {
    const dataFavorites: any = await BookAPI.getFavoriteById(id);
    console.log("data ==>", dataFavorites);
    setLike(dataFavorites)
  }
  useEffect(() => {
    handleGetFavoriteById(id as any)
  }, [])

  function formatCurrencyVND(amount: any) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }


  return (
    <div className="wrapper-Detail-card">
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
      <h1>Thông tin truyện</h1>
      <div className="wrapper-Detail">
        <div>
          <h1>THỂ LOẠI</h1>
          <ul>
            {categoryArr?.map((item) => (
              <li className="categoryItem" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <img src={idBook?.img} />
        </div>
        <div className="Detail-card">
          <h3>{idBook?.nameBook}</h3>

          <h4>
            Giá : {formatCurrencyVND(idBook?.price)}
          </h4>
          <p className='count-quantity'>
            Số lượng <input type="number" />
          </p>
          <h5>Giới thiệu :<p>{idBook?.description}</p></h5>
          <h5>Số lượng còn lại : {idBook?.quantityBook}</h5>
          <h5>Tác giả : {idBook?.author}</h5>
          <div className='wrapper-actions'>
            <button onClick={() => idBook?.id && handleAddtoCart(idBook.id)}>
              Thêm vào giỏ hàng
            </button>
            <div className='heart'>
              {like.length === 0 && !isFavorite ? (
                <AiFillHeart onClick={() => idBook?.id && handleAddFavorite(idBook.id)} />
              ) : (
                <AiOutlineHeart onClick={() => idBook?.id && handleAddFavorite(idBook.id)} />
              )}
            </div>
          </div>
        </div>
      </div>
      <br></br>
      <div className='wrapper-content-comment'>
        <form onSubmit={handleCommentSubmit}>
          <div className='comment-center'>
            <div className='cmt-star'>
              <Rating
                onClick={handleRating}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                onPointerMove={onPointerMove}
              /* Available Props */
              />
            </div>
            <div className='wrapper-comment'>
              <input type='text' placeholder='Nhập bình luận ....'
                onChange={(e) => setComment(e.target.value)}
                value={comment} />
              <button type="submit"><AiOutlineSend /></button>
            </div>
          </div>
        </form>
        <div className='user-comment'>
          {dataComment?.map((item: any) => (
            <div className='wrapper-user'>
              <h3>{item.user.username}</h3>
              <div className='wrapper-comment-user'>
                <p>{item.comment}</p>
              </div>
              <h4>{new Date(item.createdAt).toLocaleDateString()}</h4>
              <Rating initialValue={item.star} readonly size={15} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Detail