import React, { useState, useEffect } from "react";
import styles from "./../styles/header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPhone,
  faClock,
  faCartShopping,
  faMagnifyingGlass,
  faAngleDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {  fetchCountPrLike } from "../AuthSlice";

const Header = () => {
  const cart = useSelector((state) => state.cart.listPr);
  const user = useSelector((state) => state.auth.user);
  const countPrlike = useSelector((state) => state.auth.countPrlike);
  const dispatch = useDispatch();
  const DaDangNhap = useSelector((state) => state.auth.DaDangNhap)
  const [cate, setCate] = useState([]);
  const [characteristis, setCharacteristics] = useState([]);
  const [ShowSearch, setShowSearch] = useState(false);

  const [product, setproduct] = useState([]);
  const [searchpr, setsearchpr] = useState('');
  const [prfilter, setprfilter] = useState([])
  const [isInputFocused, setInputFocused] = useState(false);

  useEffect( () =>{
    fetch(`http://localhost:3000/pr/pr`).then(res => res.json()).then(data => setproduct(data))
   
  }, [])

  // lay du lieu nguoi dung nhap vao
  const onchangeSearch = (e) =>{
    setsearchpr(e.target.value);
  }

  useEffect(() =>{
    if(searchpr === ''){
      setprfilter('')
    }else{
      const Filterpr = product.filter(pr => pr.name.toLowerCase().includes(searchpr.toLowerCase()))
      setprfilter(Filterpr);
    }
  }, [product, searchpr])




  // Fetch số lượng sản phẩm yêu thích khi user thay đổi
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCountPrLike(user.id));
    }
  }, [user?.id, dispatch]);

  // Fetch danh mục
  useEffect(() => {
    fetch("http://localhost:3000/c/cate")
      .then((res) => res.json())
      .then((data) => setCate(data));
  }, []);

  // Fetch đặc điểm theo danh mục
  const fetchCharacteristics = (cate_id) => {
    fetch(`http://localhost:3000/c/characteristics/${cate_id}`)
      .then((res) => res.json())
      .then((data) => setCharacteristics(data));
  };

  // Khi click vào icon, hiển thị ô input và focus vào đó
  // Khi click vào icon tìm kiếm
  const handleSearchClick = () => {
    setShowSearch(true);
    
  };

  // Khi mất focus thì ẩn ô input
  const handleclose = () => {
    setShowSearch(false);
  };

  return (
    <header>
      <div className={styles.bgxanh}>
        <div className={styles.container}>
          <div className={styles["header-top"]}>
            <div className={styles["header-top_info"]}>
              <div className={styles["header-top_info_time"]}>
                <i>
                  <FontAwesomeIcon icon={faClock} />
                </i>
                <p>08:00-21:00</p>
              </div>
              <p>|</p>
              <div className={styles["header-top_info_phone"]}>
                <i>
                  <FontAwesomeIcon icon={faPhone} />
                </i>
                <p>0364185395 - 0337450067</p>
              </div>
            </div>

            <div className={styles["header-top_icon"]}>
              <div className={styles["header-top_icon_tim"]}>
                <Link to={`/prlike/${user?.id}`}>
                <i >
                  <FontAwesomeIcon icon={faHeart} />
                </i>
                </Link>
                <p>{user?.id ? countPrlike ?? "..." : 0}</p>
              </div>
              <p>|</p>

              {
               DaDangNhap === true && user?.role === 1 ?(
                <div >
                <Link to={`/user/${user.id}`} className={styles.user}> 
                <img width={'35px'} height={'35px'}  src={'/images/user_circle.webp'} /> 
                <p>{user?.username.length > 4 ? user.username.slice(0, 4) + "..."  : user.username }</p>
                </Link>
                </div>

               ):( 
                <>
                <Link to={'/dangnhap'}>Đăng Nhập</Link>
                <Link to={'/dangky'}>Đăng Ký</Link>
                </>
              )}
            
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bgheader} id="header">
        <div className={styles.container}>
          <div className={styles.tongheader}>
            <div className={styles.logo}>
             <Link to={'/'}> <img src={"/images/logo.png"} alt="Logo" /> </Link>
            </div>
            <div className={styles.tendanhmuc}>
              <div className={styles.tendanhmuc_down}>
                <a href="#">Giới thiệu</a>
              </div>

              {cate.map((c) => (
                <div
                  className={styles.tendanhmuc_down}
                  key={c.id}
                  onMouseEnter={() => fetchCharacteristics(c.id)}
                >
                  <Link to={`/pr_by_cate/${c.id}`}>{c.name}</Link>
                  <i>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </i>

                  <div className={styles.header_menucon}>
                    {characteristis.length > 0 ? (
                      characteristis.map((char) => (
                        <div
                          className={styles.header_menucon_item}
                          key={char.characteristic_id}
                        >
                          <h3>{char.characteristic_name}</h3>
                          {char.type_cates.map((type) => (
                            <div
                              className={styles.header_menucon_cate}
                              key={type.type_cate_id}
                            >
                              <i>
                                <FontAwesomeIcon icon={faChevronRight} />
                              </i>
                              <a href={`/pr_by_typecate/${type.type_cate_id}`}>
                                {type.type_cate_name}
                              </a>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p>Chưa có đặc điểm</p>
                    )}

                    <div className={styles.header_menucon_item}>
                      <img
                        src={c.image ? c.image: "/images/default.jpg"}
                        width="250px"
                        height="270px"
                        alt={c.name}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.header_icon}>
              <div className={styles.giohang}>
            <Link to={`/giohang`}>
               <i>
                  <FontAwesomeIcon icon={faCartShopping} />
                </i>
              </Link>

                <p>{cart?.length ?? 0}</p>
              </div>

              <div className={styles.search}>
                <i onClick={handleSearchClick}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>

      
  {/* Ô tìm kiếm */}
  {ShowSearch && (
        <div className={styles.overlay} >
          <div className={styles.close} >
          <button onClick={handleclose}>X</button>  
          </div>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className={styles.searchInput}
            value={searchpr}
            onChange={onchangeSearch}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
        </div>
        <div className={styles.pr_search_container}>
        {
       searchpr && prfilter.length > 0 ?(
          prfilter.map((pr, index) =>(
            <div key={index} className={styles.pr_search}>
              <div className={styles.pr_search_img}>
              <img src={pr.images.split(',')[0]} alt="" />
              </div>
              <div className={styles.pr_search_info}>
              <p>{pr.name}</p>
              <p>{pr.price}</p>
              </div>

            </div>
          ))
        )
        :(
          searchpr && isInputFocused && <div>KHoong cos sanr phaamr nayf</div>
        )
      }
      </div>

        </div>
      )}  


    </header>
       
  );
};

export default Header;
