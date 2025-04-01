import React, { useState, useEffect } from "react";
import styles from "../styles/profcate.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSlidersH,
  faSearch,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, Link } from "react-router-dom";
import { checkLogin, updateCountPrlike } from "../AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import "@ant-design/v5-patch-for-react-19";
import { message } from "antd";
import { themPr } from "../CartSlice";
import ReactPaginate from "react-paginate";

const ProductC = () => {
  let { cate_id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [product, Setproduct] = useState([]);
  const [sortPr, SetsortPr] = useState("create_date");
  const user = useSelector((state) => state.auth.user);
  const [likePr, setLikePr] = useState({});
  const [cate, setcate] = useState([]);
  const [infocate, setinfocate] = useState(null);
  const dispatch = useDispatch();
  const [typeCatesByCate, setTypeCatesByCate] = useState({}); // Lưu trữ type_cate theo từng cate

  // Kiểm tra user đăng nhập
  useEffect(() => {
    dispatch(checkLogin());
  }, [dispatch]);

  // Hàm fetch type_cate theo cate_id
  const fetchTypeCates = async (cateId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/c/type_cate_by_cate/${cateId}`
      );
      const data = await response.json();
      setTypeCatesByCate((prev) => ({
        ...prev,
        [cateId]: data,
      }));
    } catch (error) {
      console.error("Lỗi khi lấy type_cate:", error);
    }
  };

  // Khi click vào danh mục
  const handleCateClick = (e, cate) => {
    e.preventDefault();

    // Nếu chưa có type_cate của danh mục này thì fetch
    if (!typeCatesByCate[cate.id]) {
      fetchTypeCates(cate.id);
    }

    // Mở submenu nếu đóng và ngược lại
    setOpenSubmenu(openSubmenu === cate.id ? null : cate.id);
  };

  // Paginate
  // ... các state khác
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Số sản phẩm mỗi trang
  const [totalProducts, setTotalProducts] = useState(0);

  // Lấy tất cả cate của type_cate
  useEffect(() => {
    fetch("http://localhost:3000/c/categories_with_type_cate")
      .then((res) => res.json())
      .then((data) => {
        setcate(data);
      })
      .catch((err) => console.error("Lỗi lấy danh mục:", err));
  }, []);

  // Lấy tất cả type_cate dựa v

  // Lấy cate dựa trên id
  useEffect(() => {
    fetch(`http://localhost:3000/c/cate/${cate_id}`)
      .then((res) => res.json())
      .then((data) => setinfocate(data));
  }, [cate_id]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetch(
          `http://localhost:3000/pr/products-by-cate/${cate_id}?sort=${sortPr}&page=${currentPage}&limit=${itemsPerPage}`
        );
        const response = await products.json();
        Setproduct(response.products || response);
        setTotalProducts(response.total || response.length);

        if (user && user.id) {
          const resFav = await fetch(
            `http://localhost:3000/pr/user-favorite/${user.id}`
          );
          const likedProductIds = await resFav.json();

          // Sửa ở đây - thêm (response.products || response)
          const likedStatus = (response.products || response).reduce(
            (acc, pr) => {
              acc[pr.id] = likedProductIds.includes(pr.id);
              return acc;
            },
            {}
          );
          setLikePr(likedStatus);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm hoặc danh sách yêu thích:", error);
      }
    };
    fetchData();
  }, [user, cate_id, sortPr, currentPage, itemsPerPage]);

  // Thêm hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, page)); // Đảm bảo trang nhỏ nhất là 1
  };

  // Xử lý toggle thích sản phẩm
  const toggleFavorite = async (pr_id) => {
    if (!user || !user.id) {
      message.error("Bạn cần đăng nhập để thích sản phẩm!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/pr/toggle-favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, pr_id }),
      });

      const data = await response.json();
      if (data.success) {
        setLikePr((prev) => ({
          ...prev,
          [pr_id]: data.liked,
        }));

        dispatch(updateCountPrlike(data.liked ? 1 : -1));
        message.success(
          data.liked ? "Bạn đã thích sản phẩm!" : "Bạn đã hủy thích sản phẩm!"
        );
      }
    } catch (error) {
      console.error("Lỗi khi toggle yêu thích:", error);
    }
  };

  return (
    <div>
      {infocate && (
        <nav className={styles.bgnav}>
          <div className={styles.containernav}>
            <img
              src={infocate.image_content}
              alt=""
              className={styles.navBackground}
            />
            <div className={styles.nav_content}>
              <h1>{infocate.name}</h1>
              <p>{infocate.content}</p>
            </div>
          </div>
        </nav>
      )}

      <main className={`${styles.container_full} ${styles.bgmain}`}>
        <section className={styles.container}>
          <div className={styles.Prdanhmuc_select}>
            <div>
              <div
                className={styles["category-toggle"]}
                onClick={toggleSidebar}
              >
                <FontAwesomeIcon icon={faSlidersH} /> <span>CHỌN DANH MỤC</span>
              </div>
            </div>

            <div className={styles.content}>
              <aside
                id="sidebar"
                className={`${styles.sidebar} ${
                  isSidebarOpen ? styles.show : ""
                }`}
              >
                <div className={styles["search-box"]}>
                  <input type="text" placeholder="Tìm kiếm sản phẩm..." />
                  <button>
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
                <div className={styles.title_loctheogia}>
                  <h3>LỌC THEO GIÁ</h3>
                </div>
                <div className={styles.filter}>
                  <input type="range" min="0" max="7500000" step="1000" />
                  <p>Price: 0đ - 7.500.000đ</p>
                  <button className={styles["filter-btn"]}>LỌC</button>
                </div>

                <h3 className={styles["filter-danhmuc"]}>DANH MỤC</h3>
                {cate.map((c) => (
  <ul className={styles["category-list"]} key={c.id}>
    <li
      className={`${styles["has-submenu"]} ${
        openSubmenu === c.id ? styles.open : ""
      }`}
    >
      {/* Nếu là danh mục hiện tại thì cho mở submenu */}
      {c.id == cate_id ? (
        <div
          role="button"
          onClick={(e) => handleCateClick(e, c)}
          className={`${styles.categoryButton} ${
            openSubmenu === c.id ? styles.rotated : ""
          }`}
        >
          {c.name}
        </div>
      ) : (
        /* Nếu không phải thì dùng Link chuyển trang */
        <Link 
          to={`/pr_by_cate/${c.id}`} 
          className={styles.categoryLink}
        >
          {c.name}
        </Link>
      )}

      {/* Chỉ hiển thị submenu nếu là danh mục hiện tại */}
      {c.id == cate_id && openSubmenu === c.id && (
        <ul className={`${styles.submenu} ${styles.open}`}>
          {typeCatesByCate[c.id]?.length > 0 ? (
            typeCatesByCate[c.id].map((tc) => (
              <li key={tc.type_cate_id}>
                <Link
                  to={`/pr_by_typecate/${tc.type_cate_id}`}
                  className={styles.subcategoryLink}
                >
                  {tc.type_cate_name}
                </Link>
              </li>
            ))
          ) : (
            <li>Đang tải...</li>
          )}
        </ul>
      )}
    </li>
  </ul>
))}
              </aside>
            </div>

            <div>
              <select name="" id="" onChange={(e) => SetsortPr(e.target.value)}>
                <option value="create_date">
                  Sắp xếp theo sản phẩm mới nhất
                </option>
                <option value="price_asc">Sắp xếp theo giá tăng dần</option>
                <option value="price_desc">Sắp xếp theo giá giảm dần</option>
                <option value="view">Sắp xếp theo mức độ phổ biến</option>
              </select>
            </div>
          </div>

          <div className={styles.products}>
            {product.map((pr) => (
              <div className={styles.product} key={pr.id}>
                <div className={styles.product_img}>
                  <img
                    src={
                      pr.images ? pr.images.split(",")[0] : "/default-image.jpg"
                    }
                    alt={pr.name}
                  />
                </div>
                <div
                  className={`${styles.pr_tim} ${
                    likePr[pr.id] ? styles.liked : ""
                  }`}
                  onClick={() => toggleFavorite(pr.id)}
                >
                  <i
                    style={{ color: likePr[pr.id] === true ? "red" : "black" }}
                  >
                    <FontAwesomeIcon icon={faHeart} />
                  </i>
                </div>
                <div className={styles.product_btn}>
                  <div className={styles.pr_xemchitiet}>
                    <button onClick={() => dispatch(themPr(pr))}>
                      <Link to={`/chi_tiet_san_pham/${pr.id}`}> Xem chi tiết </Link>
                    </button>
                  </div>
                  <div className={styles.pr_themvaogio}>
                    <button
                      onClick={() => {
                        dispatch(themPr(pr));
                        message.success("Bạn đã thêm sản phẩm vào giỏ hàng");
                      }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
                <div className={styles.product_info}>
                  <p className={styles.product_price}>{pr.name}</p>
                  <p>{Number(pr.price).toLocaleString("vi")} VNĐ</p>
                </div>
              </div>
            ))}
          </div>
          {totalProducts > itemsPerPage && (
            <div className={styles.paginationContainer}>
              <ReactPaginate
                breakLabel="⋯" // Sử dụng ký tự Unicode cho dấu ba chấm
                nextLabel=">"
                previousLabel="<"
                onPageChange={(selectedItem) =>
                  handlePageChange(selectedItem.selected + 1)
                }
                pageRangeDisplayed={2} // Hiển thị 2 trang xung quanh trang hiện tại
                marginPagesDisplayed={1} // Hiển thị 1 trang ở đầu/cuối
                pageCount={Math.ceil(totalProducts / itemsPerPage)}
                renderOnZeroPageCount={null}
                containerClassName={styles.pagination}
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
                previousClassName={styles.pageItem}
                previousLinkClassName={`${styles.pageLink} ${styles.previousLink}`}
                nextClassName={styles.pageItem}
                nextLinkClassName={`${styles.pageLink} ${styles.nextLink}`}
                activeClassName={styles.active}
                breakClassName={styles.break}
                forcePage={Math.min(
                  Math.max(0, currentPage - 1),
                  Math.ceil(totalProducts / itemsPerPage) - 1
                )}
              />
            </div>
          )}
        </section>
      </main>

      <div
        id="overlay"
        className={`${styles.overlay} ${isSidebarOpen ? styles.active : ""}`}
        onClick={toggleSidebar}
      ></div>
    </div>
  );
};

export default ProductC;
