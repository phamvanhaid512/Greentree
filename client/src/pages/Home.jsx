import Prdanhchoban from "../components/Prdanhchoban"
import PrSale from "../components/Prsale"
import styles from './../styles/home.module.css'
import PrNew from "../components/PrNew"
import Cate from "../components/Cate"
import Banner from "../components/Banner"

export default function Home() {
    return (
       <main>
        <Banner />
        {/* <Cate /> */}
        <Prdanhchoban />
        <Prdanhchoban />
        <section className={styles.bgmain}>
        <div className={styles.container}>
          <img
            width="100%"
            style={{marginTop: '20px'}}
            src="/images/Mua tại cửa hàng hoặc trực tuyến tại www.greentreeshop.vn (1).png"
            alt=""
          />
        </div>
      </section>
      <Prdanhchoban />
        <section className={styles.bgwhite}>
        <div className={styles.container}>
        <div className={styles.lydochon}>
          <img
            width="500px"
            height="550px"
            style={{marginRight: '30px'}}
            src="/images/vuon-cay-trong-nha-mowgarden-768x768.jpg"
            alt=""
          />

          <div>
            <h1>Lý do chọn GREEN TREE?</h1>
            <div className={styles.lydochon_item}>
              <div className={styles.lydochon_item_con}>
                <img src="/images/ld1.png" alt="" />
                <div>
                  <h3>TUYỂN CHỌN</h3>
                  <p>Mọi cây xanh đều phải được chọn lọc kỹ lưỡng</p>
                </div>
              </div>

              <div className={styles.lydochon_item_con}>
                <img src="/images/ld2.png" alt="" />
                <div>
                  <h3>ĐA DẠNG</h3>
                  <p>Dễ dàng tìm được sản phẩm mà bạn mong muốn</p>
                </div>
              </div>

              <div className={styles.lydochon_item_con}>
                <img src="/images/ld3.png" alt="" />
                <div>
                  <h3>ĐỒNG HÀNH</h3>
                  <p>Luôn đồng hành và giúp đỡ bạn về mặt kỹ thuật</p>
                </div>
              </div>

              <div className={styles.lydochon_item_con}>
                <img src="/images/ld4.png" alt="" />
                <div>
                  <h3>ĐÚNG CHUẨN</h3>
                  <p>Sử dụng hình ảnh chụp thực tế giúp dễ hình dung</p>
                </div>
              </div>

              <div className={styles.lydochon_item_con}>
                <img src="/images/ld5.png" alt="" />
                <div>
                  <h3>TIN CẬY</h3>
                  <p>Gửi ảnh thực tế và cụ thể trước khi giao hàng</p>
                </div>
              </div>

              <div className={styles.lydochon_item_con}>
                <img src="/images/ld6.png" alt="" />
                <div>
                  <h3>CẠNH TRANH</h3>
                  <p>Tối ưu hóa ngân sách nhờ mức giá cực kì cạnh tranh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
       </main>
    )
}
  