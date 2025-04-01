import styles from"../styles/prdetail.module.css";
import React from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import { message } from "antd";
import { Link } from "react-router-dom";
export default function Comment() {
    const DaDangNhap = useSelector((state) => state.auth.DaDangNhap)
    const {id} = useParams()
    const user = useSelector(state => state.auth.user)
   const contentRef = useRef(null);
   const idprRef = useRef(null);

   const BinhLuan = async () => {
    let ngaybl = new Date().toISOString();
    let url = `${process.env.REACT_APP_API_URL}/binh_luan`;

    if(contentRef.current.value === ''){
        message.error('Vui lòng nhập bình luận')
    }else{
        let tt = {
            user_id: user && user.id ? user.id : 0,
            pr_id: idprRef.current.value,
            content: contentRef.current.value,
            comment_date: ngaybl
        };

        console.log(tt);

        let opt = {
            method: "POST",
            body: JSON.stringify(tt),
            headers: { "Content-Type": "application/json" }
        };

        try {
            const res = await fetch(url, opt);
            const data = await res.json();

            if (res.ok && data.success) {
                message.success('Bạn đã bình luận thành công');
               contentRef.current.value =''
            } else {
                message.error(`Lỗi: ${data.error || 'Không thể bình luận'}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            message.error("Có lỗi xảy ra khi gửi bình luận");
        }
    }


};

  return (
    <>
    {DaDangNhap ? (
         <><div className={styles.dgsp}>
         <h3>Bình luận sản phẩm</h3>
       </div>

       <textarea className={styles["comment-box"]} type="text" placeholder="" ref={contentRef} />
       <div>
       <input type="hidden" defaultValue={id} ref={idprRef} />
         <button type="button" onClick={BinhLuan}>Gửi bình luận</button>
       </div> </>
    ):(
        <><div className={styles.dgsp}>
         <h3>Bình luận sản phẩm</h3>
       </div>

       <textarea className={styles["comment-box"]} type="text" placeholder="" ref={contentRef} />
       <div>
        <p>Bạn cần đăng nhập để bình luận sản phẩm. <Link>Đăng nhập ngay</Link> </p>

       </div> </>
    )}

    </>
  );
}
