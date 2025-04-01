import styles from "./../styles/banner.module.css";

export default function Banner() {
    return (
        <section className={styles.bgimg}>
            <div className={styles.banner}>
                <div className={styles.banner_content}>
                    <h1>Tận hưởng không gian sống xanh</h1>
                    <p>
                        Bổ sung thêm cây xanh là một cách đơn giản nhất để tạo ra sự thoải
                        mái cho không gian sống của bạn, giúp mang lại hiệu quả công việc
                        và thư giãn mỗi khi trở về.
                    </p>
                    <div className={styles.banner_btn}>
                        <div className={styles.btn_lienhe}>
                            <a href="">Liên hệ</a>
                        </div>
                        <div className={styles.btn_khampha}>
                            <a href="">Khám phá ngay</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
