-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th6 16, 2020 lúc 06:00 PM
-- Phiên bản máy phục vụ: 5.7.26
-- Phiên bản PHP: 7.0.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `news`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `tc_ID` int(11) DEFAULT NULL,
  `username` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `a_Name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cre_Date` date DEFAULT NULL,
  `r_ID` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `account`
--

INSERT INTO `account` (`ID`, `tc_ID`, `username`, `password`, `a_Name`, `cre_Date`, `r_ID`) VALUES
(1, 3, 'thongnguyen', '$2y$10$ib/i1jHiZ5lTHYXTsWwhXOi5E.fpCPcY7KvREYsG6hmCijOWcbw7K', 'Nguyễn Văn Thông', '2020-06-10', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `article`
--

DROP TABLE IF EXISTS `article`;
CREATE TABLE IF NOT EXISTS `article` (
  `ID` int(3) NOT NULL AUTO_INCREMENT,
  `c_ID` int(11) DEFAULT NULL,
  `tag` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `abstract` text COLLATE utf8_unicode_ci,
  `content` text COLLATE utf8_unicode_ci,
  `author` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `public_date` timestamp NULL DEFAULT NULL,
  `images` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `featured` int(11) DEFAULT NULL,
  `views` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `article`
--

INSERT INTO `article` (`ID`, `c_ID`, `tag`, `title`, `abstract`, `content`, `author`, `public_date`, `images`, `featured`, `views`) VALUES
(1, 2, 'cổ phiếu; Vĩnh Hoàn; Chứng khoán; thị trường; thủy sản; đầu tư cổ phiếu; thị trường chứng khoán; VHC; cổ phiếu VHC; cổ phiếu thủy sản;', 'Cổ phiếu Vĩnh Hoàn (VHC) tăng trần trở lại sau chuỗi mất điểm sâu\r\n', '\r\nKTCKVN - Phiên chiều ngày 16/6/2020, cả VN-Index và HNX-Index đều ghi nhận sắc xanh trở lại trong đó VN-Index tăng hơn 23 điểm đạt 856,13 điểm. Một trong những lực đỡ quan trọng cho sự hồi phục này đến từ nhóm bất động sản và thủy sản...', '<tbody>  		<tr>  			<td><img alt=\"co phieu vinh hoan vhc tang tran tro lai sau chuoi mat diem sau\" border=\"0\" class=\"__img_mastercms\" src=\"https://kinhtechungkhoan.vn/stores/news_dataimages/haund/062020/16/16/in_article/0144_cg.png\" style=\"max-width: 100%; padding: 0px; margin: 0px; width: 100%;\" title=\"Cổ phiếu Vĩnh Hoàn (VHC) tăng trần trở lại sau chuỗi mất điểm sâu\"></td>  		</tr>  		<tr>  			<td><em>Diễn biến giá cổ phiếu VHC</em></td>  		</tr>  	</tbody><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"MASTERCMS_TPL_TABLE\" style=\"width: 100%;\">  	<tbody>  		<tr>  			<td><img alt=\"co phieu vinh hoan vhc tang tran tro lai sau chuoi mat diem sau\" border=\"0\" class=\"__img_mastercms\" src=\"https://kinhtechungkhoan.vn/stores/news_dataimages/haund/062020/16/16/in_article/0144_cg.png\" style=\"max-width: 100%; padding: 0px; margin: 0px; width: 100%;\" title=\"Cổ phiếu Vĩnh Hoàn (VHC) tăng trần trở lại sau chuỗi mất điểm sâu\"></td>  		</tr>  		<tr>  			<td><em>Diễn biến giá cổ phiếu VHC</em></td>  		</tr>  	</tbody>  </table><p style=\"text-align: justify;\">Đáng chú ý tại&nbsp;nhóm thủy sản, cổ phiếu VHC của&nbsp;CTCP&nbsp;Vĩnh Hoàn (HOSE: VHC) đóng cửa tại mức trần 6,9% qua đó giúp thị giá tăng thêm 1.350 đồng/cổ phiếu và đạt mức&nbsp;36.300 đồng. Mức trần này đã chấm dứt chuỗi giảm điểm 5 phiên liên tiếp của cổ phiếu VHC.</p><p style=\"text-align: justify;\">Trước đó, nhóm doanh nghiệp thủy sản như VHC, CMX, FMC và ANV đã đồng loạt công bố tình hình kinh doanh trong tháng 4/2020 sau giai đoạn kinh doanh chịu ảnh hưởng bởi dịch bệnh COVID-19.</p><p style=\"text-align: justify;\">Theo đó, Vĩnh Hoàn cho biết, tổng doanh thu tháng 4 đạt 525 tỷ đồng, tăng 7% so với cùng kỳ năm trước trong đó, doanh thu sản phẩm cá tra tăng 33% đạt 343 tỷ đồng, sản phẩm chăm sóc sức khỏe tăng 29% đạt 63 tỷ đồng bù đắp cho sự sụt giảm trong dòng sản phẩm giá trị gia tăng (-3%), sản phẩm phụ (-14%) và sản phẩm khác (-70%).</p><p style=\"text-align: justify;\">Xét về thị trường tiêu thụ, Mỹ và châu Âu đều ghi nhận mức tăng đáng kể 35% và 68%, trong khi Trung Quốc giảm 48%. Đặc biệt, thị trường châu Âu tăng mạnh và vượt Trung Quốc trở thành thị trường xuất khẩu lớn thứ 2 của Vĩnh Hoàn.</p><table class=\"__MB_template_g\">  	<tbody>  		<tr>  			<td class=\"__RE_PLACE_CONTENT\">  			<p style=\"text-align: justify;\"><em><strong>Liên quan đến doanh nghiệp này, ngày 2/6 UBCKNN cũng đã ban hành quyết định phạt vi phạm hành chính trong lĩnh vực chứng khoán và thị trường chứng khoán đối với ông Phan Ngọc Minh, người có liên quan đến bà Phan Thị Kim Hòa - Thành viên BKS VHC&nbsp;số tiền 45 triệu đồng.</strong></em></p>    			<p style=\"text-align: justify;\"><em><strong>Nguyên nhân, do ông Minh đã không báo cáo về việc dự kiến giao dịch. Cụ thể, từ ngày 27/5/2019 đến ngày 28/5/2019, ông Phan Ngọc Minh đã bán 135.000 cổ phiếu VHC nhưng không báo cáo UBCKNN, Sở giao dịch chứng khoán Thành phố Hồ Chí Minh về việc dự kiến giao dịch.</strong></em></p>  			</td>  		</tr>  	</tbody>  </table>', 'Hữu Dũng', '2020-06-16 09:05:00', '/public/article/0144_cg.png', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `ID` int(3) NOT NULL AUTO_INCREMENT,
  `tc_ID` int(11) DEFAULT NULL,
  `c_Name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `c_Large` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`ID`, `tc_ID`, `c_Name`, `c_Large`) VALUES
(1, 1, 'Cổ Phiếu Top Đầu', 'Chứng Khoán'),
(2, 1, 'Xu Hướng Nhận Định', 'Chứng Khoán'),
(3, 2, 'Bất Động Sản', 'Doanh Nghiệp'),
(4, 2, 'Doanh Nghiệp Niêm Yết', 'Doanh Nghiệp'),
(5, 3, 'Ngân Hàng Điện Tử', 'Tài Chính'),
(6, 3, 'Thương Mại Điện Tử', 'Tài Chính');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE IF NOT EXISTS `comment` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Account` int(11) DEFAULT NULL,
  `ID_Article` int(11) DEFAULT NULL,
  `Content` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role_account`
--

DROP TABLE IF EXISTS `role_account`;
CREATE TABLE IF NOT EXISTS `role_account` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `role_account`
--

INSERT INTO `role_account` (`ID`, `Name`) VALUES
(1, 'Độc giả'),
(2, 'Phóng viên'),
(3, 'Biên tập viên'),
(4, 'Quản trị viên');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `social_provider`
--

DROP TABLE IF EXISTS `social_provider`;
CREATE TABLE IF NOT EXISTS `social_provider` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `provider` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'tên các mxh mà mình login',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `type_catelgories`
--

DROP TABLE IF EXISTS `type_catelgories`;
CREATE TABLE IF NOT EXISTS `type_catelgories` (
  `ID` int(3) NOT NULL AUTO_INCREMENT,
  `tc_Name` varchar(150) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `type_catelgories`
--

INSERT INTO `type_catelgories` (`ID`, `tc_Name`) VALUES
(1, 'Chứng Khoán'),
(2, 'Doanh Nghiệp'),
(3, 'Tài Chính');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
