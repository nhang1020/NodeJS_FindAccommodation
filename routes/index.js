var express = require('express');
const { append } = require('express/lib/response');
var router = express.Router();
var conn = require('../connect');
var firstImage = require('../firstImage');

function numberFormat(num){
	var n = new Intl.NumberFormat('en-US');
	var output = n.format(num);
	return output;
}
router.get('/admin/',function(req,res)
{
	res.render('admin/index',{
		title: 'Home'
	});
});
router.get('/',function(req,res)
{
	var sql = 'SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* FROM tbl_danhgia, tbl_nhatro WHERE ID_NT=ID_NhaTro_DG GROUP BY ID_NT;\
	SELECT * FROM province;';
	
	conn.query(sql, function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('index',{
				title: 'Home',
				TuKhoa: "",
				max: "",
				nt: results[0],
				NhaTro: results[0],
				Provinces: results[1],
				numberFormat: numberFormat,
			});
		}
	});
});

router.get('/get_data', function(req, res, next){
	var type = req.query.type;
	var search_query = req.query.parent_value;
	if(type == 'load_district'){
		var sql = 'SELECT * FROM district WHERE _province_id = ' + search_query +' ORDER BY _name ASC';
	}
	if(type == 'load_ward'){
		var sql = 'SELECT * FROM ward WHERE _district_id = ' + search_query +' ORDER BY _name ASC';
	}
	conn.query(sql, function(error, results){
		if(error) {
			req.session.error = error;
			res.redirect('/error');
		} else {
			/*var data_arr = [];
				results.forEach(function(row) {
					data_arr.push(row.Data)
			});*/
			res.json(results);
		}
	});
});

//Tmf kiếm
router.post('/timkiem',function(req,res)
{
	var tukhoa = req.body.timkiem;
	var sql = "SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* \
	FROM tbl_danhgia, tbl_nhatro WHERE ID_NT=ID_NhaTro_DG AND DiaChi_NT LIKE N'%"+tukhoa+"%' GROUP BY ID_NT;\
	SELECT * FROM province; SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* FROM tbl_danhgia, tbl_nhatro WHERE ID_NT=ID_NhaTro_DG GROUP BY ID_NT;";
	conn.query(sql, [tukhoa], function(error, results){
		if(error){
			req.session.error = error;
			res.redirect('/error');
		}
		else{
			res.render('index',{
				title: 'Home',
				TuKhoa: tukhoa,
				max:"",
				nt: results[2],
				NhaTro: results[0],
				Provinces: results[1],
				numberFormat: numberFormat,
			});
		}
	});
});


router.post('/locgia', function(req, res, next){
	
	var min = req.body.min;
	var max = req.body.max;
	var sql = 'SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* FROM tbl_danhgia, tbl_nhatro \
	WHERE ID_NT=ID_NhaTro_DG AND (Gia_NT BETWEEN '+min*1000+' AND '+max*1000+') GROUP BY ID_NT ORDER BY Gia_NT ASC;\
	SELECT * FROM province;\
	SELECT * FROM province; SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* FROM tbl_danhgia, tbl_nhatro WHERE ID_NT=ID_NhaTro_DG GROUP BY ID_NT;'
	
	conn.query(sql, function(error, results){
		if(error){
			req.session.error = min;
			res.redirect('/error');
		}
		else{
			res.render('index',{
				title: 'Home',
				TuKhoa: "",
				min: min,
				max: max,
				NhaTro: results[0],
				Provinces: results[1],
				nt: results[2],
				numberFormat: numberFormat,
				firstImage: firstImage
			});
		}
	});
});
router.get('/locgia', function(req, res, next){
	
	var min = req.query.min;
	var max = req.query.max;
	var sql = 'SELECT AVG(Diem_DG) as Diem_TB, COUNT(Diem_DG) as SoLuong_DG, tbl_nhatro.* FROM tbl_danhgia, tbl_nhatro \
	WHERE ID_NT=ID_NhaTro_DG AND (Gia_NT BETWEEN '+min*1000+' AND '+max*1000+') GROUP BY ID_NT ORDER BY Gia_NT ASC';
	
	conn.query(sql, function(error, results){
		if(error){
			req.session.error = min;
			res.redirect('/error');
		}
		else{
			res.json(results);
		}
	});
});

router.get('/error', function(req, res){
	res.render('error', { title: 'Lỗi' });
});
// GET: Thành công
router.get('/success', function(req, res){
	res.render('success', { title: 'Hoàn thành' });
});





module.exports = router;