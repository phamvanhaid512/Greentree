import styles from "../styles/Prlike.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { checkLogin } from "../AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountPrLike } from "../AuthSlice";
import '@ant-design/v5-patch-for-react-19';
import { message } from 'antd';
import { Link } from "react-router-dom";
import { themPr } from '../CartSlice';


export default function Favorite_Pr() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [pr, setpr] = useState([]);

  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  useEffect(() => {
    if (!user || !user.id) return;
    fetchFavoriteUser();
  }, [user]);

  // Lấy danh sách sản phẩm yêu thích
  const fetchFavoriteUser = async () => {
    try {
      const rs = await fetch(
        `http://localhost:3000/pr/favorite_user/${user.id}`
      );
      const favoritePr = await rs.json();
      setpr(favoritePr);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm yêu thích:", error);
    }
  };

  // Xử lý khi nhấn vào tim để bỏ thích
  const handleToggleFavorite = async (pr_id) => {
    if (!user || !user.id) return;
  
    try {
      const res = await fetch("http://localhost:3000/pr/toggle-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          pr_id,
        }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        // Cập nhật lại danh sách yêu thích bằng cách xóa sản phẩm vừa unlike
        setpr((prevPr) => prevPr.filter((item) => item.id !== pr_id));
        message.success(data.liked ? "Bạn đã thích sản phẩm!" : "Bạn đã hủy thích sản phẩm!");

        dispatch(fetchCountPrLike(user.id))

      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
    }
  };

  return (
    <main className={styles.bgmain}>
      <section className={styles.container}>
        <div className={styles.title_prlike}>
          <h2>SẢN PHẨM YÊU THÍCH</h2>
        </div>

        <div className={styles.products}>
          {pr.length > 0 ? (
            pr.map((pr) => (
              <div className={styles.product} key={pr.id}>
                <div className={styles.product_img}>
                  <img
                    src={
                      pr.images ? pr.images.split(",")[0] : "/default-image.jpg"
                    }
                    alt={pr.name}
                  />
                </div>

                {/* Nút tim để bỏ thích */}
                <div
                  className={styles.pr_tim}
                  onClick={() => handleToggleFavorite(pr.id)}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  <i>
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
                  <p>{Number(pr.price).toLocaleString("vi")} VNĐ</p>
                </div>
              </div>
            ))
          ) : (
            <h3>Bạn chưa có sản phẩm yêu thích.</h3>
          )}
        </div>
      </section>
    </main>
  );
}
