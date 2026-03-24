-- Tìm thông tin khách hàng theo địa chỉ

SELECT khach_hang.*
FROM dat_phong
JOIN khach_hang
ON dat_phong.makh=khach_hang.makh
WHERE khach_hang.diachi ILIKE '%Hoa xuan%'

-- 2.Hiển thị thông tin các phòng được đặt nhiều lần

SELECT phong.maphong, phong.loaiphong, phong.sokhachtoida, phong.giaphong, COUNT(dat_phong.maphong) as solandat
FROM phong
JOIN dat_phong
ON phong.maphong = dat_phong.maphong
WHERE dat_phong.trangthaidat = 'Da dat'
GROUP BY phong.maphong, phong.loaiphong, phong.sokhachtoida, phong.giaphong
HAVING COUNT(dat_phong.maphong) > 2

-- 3. Tìm khách hàng theo tên và độ dài

SELECT khach_hang.tenkh
FROM khach_hang
WHERE khach_hang.tenkh LIKE 'N%'
OR khach_hang.tenkh LIKE 'H%'
OR khach_hang.tenkh LIKE 'M%'

-- 4. Hiển thị danh sách tên khách hàng duy nhất
 SELECT DISTINCT khach_hang.tenkh
 FROM khach_hang

--  5. Tìm dịch vụ đi kèm theo đơn vị tính và giá
SELECT dich_vu_di_kem.madv, dich_vu_di_kem.tendv,dich_vu_di_kem.donvitinh,dich_vu_di_kem.dongia
FROM dich_vu_di_kem
WHERE (dich_vu_di_kem.donvitinh = 'lon' AND dich_vu_di_kem.dongia > 10000) OR (dich_vu_di_kem.donvitinh ='cai' OR dich_vu_di_kem.dongia < 5000)

-- 6. Hiển thị chi tiết đơn đặt phòng theo năm và giá phòng
SELECT dat_phong.madatphong, dat_phong.maphong, phong.loaiphong,phong.sokhachtoida,phong.giaphong,khach_hang.makh,khach_hang.tenkh,khach_hang.sodt,dat_phong.ngaydat, dat_phong.giobatdau,dat_phong.gioketthuc, dich_vu_di_kem.madv
FROM dat_phong
JOIN phong
ON dat_phong.maphong = phong.maphong
JOIN khach_hang
ON dat_phong.makh = khach_hang.makh
JOIN chi_tiet_su_dung_dv
ON dat_phong.madatphong = chi_tiet_su_dung_dv.madatphong
JOIN dich_vu_di_kem
ON chi_tiet_su_dung_dv.madv = dich_vu_di_kem.madv
WHERE EXTRACT (YEAR FROM dat_phong.ngaydat) IN(2016, 2017) AND phong.giaphong >50000