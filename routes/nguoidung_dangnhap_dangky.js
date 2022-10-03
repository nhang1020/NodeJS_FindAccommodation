var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var conn = require('../connect');
var { check, validationResult } = require('express-validator');
var bcrypt = require('bcrypt');
var saltRounds = 10;
var multer = require('multer');
var storageConfig = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, 'uploads/');
	},
	filename: function(req, file, callback){
		var timestamp = Date.now();
		callback(null, timestamp + path.extname(file.originalname));
	}
});
var upload = multer({ storage: storageConfig });
// GET: Đăng ký
router.get('/views_nguoidung_dangky', function(req, res){
	res.render('views_nguoidung_dangky', { title: 'Đăng ký tài khoản cho người dùng!' });
});

// POST: Đăng ký
// var validateForm = [
// 	check('HoVaTen')
// 		.notEmpty().withMessage('Họ và tên không được bỏ trống.'),
// 	check('TenDangNhap')
// 		.notEmpty().withMessage('Tên đăng nhập không được bỏ trống.')
// 		.isLength({ min: 6 }).withMessage('Tên đăng nhập phải lớn hơn 6 ký tự.'),
// 	check('MatKhau')
// 		.notEmpty().withMessage('Mật khẩu không được bỏ trống.')
// 		.custom((value, { req }) => value === req.body.XacNhanMatKhau).withMessage('Xác nhận mật khẩu không đúng.')
// ];
router.post('/views_nguoidung_dangky', upload.single('Anh_ND'),  function(req, res){
	var errors = validationResult(req);
	if(!errors.isEmpty()) {
		if(req.file) fs.unlink(req.file.path, function(err){});
		res.render('views_nguoidung_dangky', {
			title: 'Đăng ký tài khoản',
			errors: errors.array()
		});
	} else {
		var fileName = '';
		if(req.file) fileName = req.file.filename;
		var data = {
			Ten_ND: req.body.Ten_ND,
			Ten_DN_ND: req.body.Ten_DN_ND,
            MK_ND:bcrypt.hashSync(req.body.MK_ND, saltRounds),
            NgaySinh_ND:req.body.NgaySinh_ND,
			Anh_ND: fileName,
            LoaiNguoiDung_ND:req.body.LoaiNguoiDung_ND,
            Email_ND:req.body.Email_ND,
            DienThoai_ND:req.body.DienThoai_ND,
            DiaChi_ND:req.body.DienThoai_ND,
            CMND_ND:req.body.CMND_ND,
          
			
			
		};
		var sql = 'INSERT INTO tbl_nguoidung SET ?';
		conn.query(sql, data, function(error, results){
			if(error) {
				req.session.error = error;
				res.redirect('/error');
			} else {
				req.session.success = 'Đã đăng ký tài khoản người dùng thành thụ.';
				res.redirect('/success');
			}
		});
	}
});


module.exports = router;