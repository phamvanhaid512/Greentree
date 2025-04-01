import styles from '../styles/prdetail.module.css'
import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { themPr } from "../CartSlice";
import { useDispatch, useSelector } from "react-redux";
import "@ant-design/v5-patch-for-react-19";
import { message } from "antd";
import Comment from "../components/Comment";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faHeart } from '@fortawesome/free-solid-svg-icons';

import { checkLogin, updateCountPrlike } from '../AuthSlice';

export default function Prdetail() {
  const { id } = useParams();
  const [pr, setPr] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [type_cate, sertype_cate] = useState([]);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [comment, setcomment] = useState([])
  const [prlq, setprlq] = useState([])
  const user = useSelector((state) => state.auth.user);
  const [likePr, setLikePr] = useState({});
  const [cate, setcate] = useState([]);

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  useEffect(() =>{
     const fetchCate = async () =>{
      const res = await fetch(`${process.env.REACT_APP_API_URL}/c/namecate/${id}`);
      const data = await res.json();
      setcate(data)
     }
     fetchCate()
  },[id])

  useEffect(() => {
    const fetchPr = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/pr/detailPr/${id}`);
        const data = await res.json();

        if (data) {
          setPr(data);
          sertype_cate(data.type_cate);
          if (data.images) {
            const imageList = data.images.split(","); // Tách chuỗi thành mảng
            setMainImage(imageList[0]); // Ảnh chính là ảnh đầu tiên
            setThumbnails(imageList); // Danh sách ảnh nhỏ
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchPr();
  }, [id]);

  useEffect(() =>{
    const FetchComment = async () =>{
      try{
        const res = await fetch(`${process.env.REACT_APP_API_URL}/binh_luan/${id}`);
        const data = await res.json()
        setcomment(data)
      }catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };
    FetchComment();
  })

  useEffect(() =>{
    const fetchprlq = async () =>{
      try{
        const res = await fetch(`${process.env.REACT_APP_API_URL}/pr/prlq/${pr?.cate_id}`);
        const data = await res.json()
        setprlq(data)

        if (user && user.id) {
          const resFav = await fetch(`${process.env.REACT_APP_API_URL}/pr/user-favorite/${user.id}`);
          const likedProductIds = await resFav.json();

          // Tạo object likePr từ dữ liệu API
          const likedStatus = data.reduce((acc, pr) => {
            acc[pr.id] = likedProductIds.includes(pr.id);
            return acc;
          }, {});
          setLikePr(likedStatus);
        }
      }catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    }
    fetchprlq()
  },[pr?.cate_id, user])

  const toggleFavorite = async (pr_id) => {
    if (!user || !user.id) {
      message.error("Bạn cần đăng nhập để thích sản phẩm!");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/pr/toggle-favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, pr_id }),
      });

      const data = await response.json();
      if (data.success) {
        setLikePr(prev => ({
          ...prev,
          [pr_id]: data.liked,
        }));

        dispatch(updateCountPrlike(data.liked ? 1 : -1));
        message.success(data.liked ? `Bạn đã thích sản phẩm!` : "Bạn đã hủy thích sản phẩm!");

      }
    } catch (error) {
      console.error("Lỗi khi toggle yêu thích:", error);
    }
  };

  const Maxquantity = pr ? pr.inventory_quantity : 0;

  const handleChange = (e) => {
    let value = e.target.value;

    // Chỉ cho phép nhập số
    if (/^\d*$/.test(value)) {
      const num = parseInt(value, 10);
      if (num > Maxquantity) {
        message.warning(`Chỉ có thể mua số lượng tối đa là ${Maxquantity}`);
        setQuantity(Maxquantity);
      } else {
        setQuantity(num > 0 ? num : ""); // Không cho số âm, giữ input rỗng khi nhập 0
      }
    }
  };

  // Tăng số lượng
  const increaseQuantity = () => {
    if (quantity < Maxquantity) {
      setQuantity((prev) => prev + 1);
    } else {
      message.warning(`Chỉ có thể mua tối đa ${Maxquantity} sản phẩm.`);
    }
  };

  // Giảm số lượng
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Xử lý khi thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (quantity < 1) {
      message.warning("Số lượng phải lớn hơn 0!");
      return;
    }
    if (quantity > pr.inventory_quantity) {
      message.warning(`Chỉ còn ${pr.inventory_quantity} sản phẩm trong kho`);
      return;
    }

    dispatch(themPr({ ...pr, so_luong: quantity }));
    message.success("Bạn đã thêm sản phẩm vào giỏ hàng");
  };

  // Nếu chưa có dữ liệu, hiển thị thông báo
  if (!pr) return <p>Đang tải...</p>;

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <div className={styles.oo}>
          <div className={styles.odau}>
            <img
              id="mainImg"
              src={mainImage}
              alt="Main"
              width="575px"
              height="500px"
            />
            <div className={styles.abc}>
              {thumbnails.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Thumbnail"
                  width="130px"
                  height="130px"
                  onClick={() => setMainImage(src)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </div>
          <div className={styles.ocuoi}>
            <div className={styles.cay}>
              <b>{pr.name}</b>
            </div>
            <div className={styles.masp}>
              {" "}
              <strong>Mã sản phẩm:</strong> {pr.id}{" "}
            </div>
            <div className={styles.gia}>
              <p>
                {" "}
                <strong>Giá: </strong> {pr.price} VNĐ
              </p>
            </div>
            <div className={styles.trangthai}>
              <p>
                {" "}
                <strong> Số lượng: </strong> {pr.inventory_quantity}{" "}
              </p>
            </div>
            <div className={styles.mota}>
              <p>
                {" "}
                <strong> Mô tả sản phẩm: </strong>
              </p>
            </div>
            <div className={styles.dongmota}>
              <p>{pr.discription} </p>
            </div>

            <div className={styles["button-container"]}>
              <div className={styles.counter}>
                <button onClick={decreaseQuantity} className={styles.counter}>-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleChange}
                  onBlur={() => setQuantity(quantity || 1)} // Nếu rỗng, đặt lại thành 1

                />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button className={styles["btn-cart"]} onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
            </div>

            <div className={styles["product-info"]}>
              <p className={styles.categories}>
                <strong>Danh mục:</strong>{" "} <Link to={`/pr_by_cate/${cate.cate_id}`}>{cate.cate_name}, </Link>
                {type_cate.length > 0
                  ? type_cate.map((tc, index) => (
                      <span key={index}>
                        <Link to={`/pr_by_typecate/${tc.id}`}>
                          {tc.name} {index < type_cate.length - 1 && ", "}
                        </Link>
                      </span>
                    ))
                  : "Không có danh mục"}
              </p>

              <div className={styles["return-policy"]}>
                <img src="/images/baove.png" alt="Return Policy" />
                <div className={styles["return-policy-text"]}>
                  <strong>Miễn phí đổi trả</strong>
                  <p>Đổi trả trong vòng 7 ngày nếu không hài lòng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bgwhite}>
        <div className={styles.container_comment}>
        <div className={styles["product-title"]}>
                Bình luận về <span>{pr.name}</span>
              </div>
          <div className={styles.ochung}>
            <div className={styles.o1}>

            <div className={styles["review-container"]}>
            <div className={styles.danhgia}>
                <h3>Bình luận từ người dùng khác</h3>
              </div>
                {
                  comment.length > 0 ?(
                    comment.map((cmt, index) => (
                      <div className={styles["user-review"]} key={index}>
                  <div className={styles.user}>
                    <strong>{cmt.username}</strong> <span className={styles.stars}></span>
                  </div>
                  <div className={styles.date}>{moment(cmt.comment_date).format('H:mm YYYY-MM-DD')}</div>
                  <div className={styles.comment}>
                    <p>{cmt.content}</p>
                  </div>
                </div>
                    ))
                  ):(
                    <div>
                      <p>Chưa có bình luận nào về sản phẩm này bạn hãy là người đâu tiên bình luận</p>
                    </div>
                  )
                }





              </div>

            </div>
            <div className={styles.o2}>
                    <Comment />
            </div>
            </div>
          </div>
        </div>

          <div className={styles.bgmain}>
                <section className={styles.container}>
                  <div className={styles.title}>
                    {/* <div className={styles.title_btnxt}>
                      <a href="#">Xem thêm</a>
                      <i><FontAwesomeIcon icon={faArrowRightLong} /></i>
                    </div> */}
                    <div className={styles.title_name}>
                      <p>SẢN PHẨM LIÊN QUAN</p>
                    </div>
                  </div>

                  <div className={styles.products}>
                    {prlq.map((pr) => (
                      <div className={styles.product} key={pr.id}>
                        <div className={styles.product_img}>
                          <img src={pr.images ? pr.images.split(',')[0] : '/default-image.jpg'} alt={pr.name} />
                        </div>

                        <div className={`${styles.pr_tim} ${likePr[pr.id] ? styles.liked : ''}`} onClick={() => toggleFavorite(pr.id)}>
                        <i style={{ color: likePr[pr.id] === true ? "red" : "black" }}>
                            <FontAwesomeIcon icon={faHeart} />
                          </i>
                        </div>

                        <div className={styles.product_btn}>
                          <div className={styles.pr_xemchitiet}>
                            <button> <Link to={`/chi_tiet_san_pham/${pr.id}`} className={styles.btnxct}>  Xem chi tiết </Link> </button>
                          </div>
                          <div className={styles.pr_themvaogio}>
                            <button onClick={() => {dispatch(themPr(pr)); message.success('Bạn đã thêm sản phẩm vào giỏ hàng')}}>Thêm vào giỏ</button>
                          </div>
                        </div>
                        <div className={styles.product_info}>
                          <p className={styles.product_price}>{pr.name}</p>
                          <p>{Number(pr.price).toLocaleString('vi')} VNĐ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

    </div>
  );
}
