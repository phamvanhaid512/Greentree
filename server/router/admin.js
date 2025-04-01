var express = require('express');
var router = express.Router();
var pool = require('../database/db');
const {adminAuth} = require('./auth')

router.get('/user', adminAuth, async (req, res)=>{
    try{
        const sql = `SELECT * FROM user`;
        const [user] = await pool.query(sql);
        res.json(user)
    }
    catch(error){
        console.error("Lỗi lấy danh mục:", err);
        res.status(500).json({ thongbao: "Lỗi lấy danh mục", error: err });
    }
})

module.exports = router;
