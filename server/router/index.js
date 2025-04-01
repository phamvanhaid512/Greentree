var express = require('express');
var router = express.Router();
var pool = require('../database/db')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('node-jsonwebtoken')
const fs = require('fs');
const { userInfo } = require('os');
const PRIVATE_KEY = fs.readFileSync('private-key.txt')
const maxAge = 3 *60 *60;

const nodemailer = require('nodemailer')
const otpStorage = {}; // Lưu tạm OTP trong memory (có thể thay bằng database)
const otpExpiryTime = 5 * 60 * 1000; // 5 phút

// Danh sách bài đăng theo kiểu bài đăng 


// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "nguyentruongvuong11@gmail.com",
        pass: "dubg blqu sruj xtbs",
    },
});

// Chức năng đăng kí
router.post("/dangky", async (req, res) => {
    try {
        let { username, email, password, phone } = req.body;

        if (!username || !email || !password || !phone) {
            return res.status(400).json({ thongbao: "Vui lòng nhập đầy đủ thông tin" });
        }

        // Kiểm tra email đã tồn tại chưa
        const checkUser = await pool.execute(`SELECT id FROM user WHERE email = ?`, [email]);
        if (checkUser[0].length > 0) {
            return res.status(400).json({ thongbao: "Email đã tồn tại" });
        }

        // Tạo OTP ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

        // Lưu OTP vào database
        await pool.execute(
            `INSERT INTO otp_codes (email, otp_code, expires_at) VALUES (?, ?, ?)`,
            [email, otp, expiresAt]
        );

        // Gửi email OTP
        await transporter.sendMail({
            from: '"Hệ thống xác minh" <your-email@gmail.com>',
            to: email,
            subject: "Xác minh email của bạn",
            text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
        });

        res.json({ success: true, message: "Mã OTP đã được gửi tới email của bạn." });
    } catch (err) {
        console.error("Lỗi khi gửi OTP:", err);
        res.status(500).json({ thongbao: "Lỗi máy chủ", err });
    }
});


// ✅ API Xác minh OTP và Tạo tài khoản
router.post("/xacminhotp", async (req, res) => {
    try {
        let { username, email, password, phone, otp } = req.body;

        // Lấy OTP từ database
        const [otpRecords] = await pool.execute(
            `SELECT otp_code, expires_at FROM otp_codes WHERE email = ? ORDER BY id DESC LIMIT 1`,
            [email]
        );

        if (otpRecords.length === 0) {
            return res.status(400).json({ thongbao: "OTP không hợp lệ" });
        }

        const { otp_code, expires_at } = otpRecords[0];

        if (Date.now() > new Date(expires_at).getTime()) {
            return res.status(400).json({ thongbao: "OTP đã hết hạn" });
        }

        if (parseInt(otp) !== parseInt(otp_code)) {
            return res.status(400).json({ thongbao: "OTP không đúng" });
        }

        // Mã hóa mật khẩu
        const hash = await bcrypt.hash(password, 10);

        // Lưu người dùng vào database
        await pool.execute(`INSERT INTO user (username, email, phone, password) VALUES (?, ?, ?, ?)`, 
            [username, email, phone, hash]);

        // Xóa OTP sau khi xác minh thành công
        await pool.execute(`DELETE FROM otp_codes WHERE email = ?`, [email]);

        res.json({ success: true, message: "Đăng ký thành công!" });
    } catch (err) {
        console.error("Lỗi khi xác minh OTP:", err);
        res.status(500).json({ thongbao: "Lỗi máy chủ", err });
    }
});



// Chức năng đăng nhập
router.post('/dangnhap', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra xem email có tồn tại không
        const sql = `SELECT * FROM user WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ "thongbao": "Người dùng không tồn tại" });
        }

        const userInfo = rows[0];

        // So sánh mật khẩu
        const match = await bcrypt.compare(password, userInfo.password);
        if (!match) {
            return res.status(401).json({ "thongbao": "Đăng nhập thất bại" });
        }

        // Tạo JWT token
        const jwtBearToken = jwt.sign(
            { id: userInfo.id, role: userInfo.role },
            PRIVATE_KEY,
            { algorithm: 'RS256', expiresIn: maxAge, subject: userInfo.id.toString() }
        );

        res.status(200).json({
            token: jwtBearToken,
            expiresIn: maxAge,
            userInfo
        });

    } catch (err) {
        console.error("Lỗi khi đăng nhập:", err);
        res.status(500).json({ "thongbao": "Lỗi máy chủ", err });
    }
});

// Chức năng bình luận

router.post('/binh_luan', async(req, res) =>{
    try{
        const {user_id, pr_id, content, comment_date} = req.body;
        const sql = `INSERT INTO comment (user_id, pr_id, content, comment_date) VALUES (?,?,?,?)`;

        const [result] = await pool.query(sql, [user_id, pr_id, content, comment_date])
        res.json({ success: true, message: 'Thêm bình luận thành công' }); // Trả về JSON có success)
    }catch (error) {
        res.status(500).json({ error: err.message });
      }
})

// Lấy bình luận
router.get('/binh_luan/:pr_id', async (req, res) => {
    const { pr_id } = req.params;  // Sửa lỗi destructuring
    try {
        const sql = `
        SELECT c.id, c.user_id, u.username , c.pr_id, c.content, c.comment_date, c.status
        FROM comment c
        JOIN user u ON c.user_id = u.id
        WHERE c.pr_id = ? AND c.status = 1;
    `;
        const [result] = await pool.query(sql, [pr_id]); // Đảm bảo pool hỗ trợ promise
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Sửa 'err' thành 'error'
    }
});


module.exports = router;
