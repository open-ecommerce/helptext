-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.6.30-0ubuntu0.15.10.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             8.1.0.4571
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table helptext_dev.auth_assignment
DROP TABLE IF EXISTS `auth_assignment`;
CREATE TABLE IF NOT EXISTS `auth_assignment` (
  `item_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.auth_assignment: ~1 rows (approximately)
DELETE FROM `auth_assignment`;
/*!40000 ALTER TABLE `auth_assignment` DISABLE KEYS */;
INSERT INTO `auth_assignment` (`item_name`, `user_id`, `created_at`) VALUES
	('Helper', '2', 1468426789),
	('Supervisor', '3', 1469548186);
/*!40000 ALTER TABLE `auth_assignment` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.auth_item
DROP TABLE IF EXISTS `auth_item`;
CREATE TABLE IF NOT EXISTS `auth_item` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `rule_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `rule_name` (`rule_name`),
  KEY `idx-auth_item-type` (`type`),
  CONSTRAINT `auth_item_ibfk_1` FOREIGN KEY (`rule_name`) REFERENCES `auth_rule` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.auth_item: ~7 rows (approximately)
DELETE FROM `auth_item`;
/*!40000 ALTER TABLE `auth_item` DISABLE KEYS */;
INSERT INTO `auth_item` (`name`, `type`, `description`, `rule_name`, `data`, `created_at`, `updated_at`) VALUES
	('Admin', 1, 'prototype editor', NULL, NULL, 1466528906, 1466695731),
	('app_site', 2, 'Main Site Controller', NULL, NULL, 1466528906, 1466528906),
	('backend_default', 2, 'Backend Dashboard', NULL, NULL, 1466528906, 1466528906),
	('Helper', 1, 'Volunteers taking cases', NULL, NULL, 1466695700, 1469550942),
	('pages', 2, 'Pages Module', NULL, NULL, 1466528905, 1466528905),
	('pages_default_page', 2, 'CMS-Page Action', NULL, NULL, 1466528907, 1466528907),
	('Public', 1, 'Unauthenticated User', NULL, NULL, 1466528906, 1466528906),
	('Supervisor', 1, 'Access utilities', NULL, NULL, 1469547852, 1469549673),
	('view_mnu_reports', 2, 'Can view menu reports', NULL, NULL, 1469549640, 1469549640),
	('view_mnu_utilities', 2, 'Can view menu utilities', NULL, NULL, 1469549529, 1469549529);
/*!40000 ALTER TABLE `auth_item` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.auth_item_child
DROP TABLE IF EXISTS `auth_item_child`;
CREATE TABLE IF NOT EXISTS `auth_item_child` (
  `parent` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `child` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.auth_item_child: ~3 rows (approximately)
DELETE FROM `auth_item_child`;
/*!40000 ALTER TABLE `auth_item_child` DISABLE KEYS */;
INSERT INTO `auth_item_child` (`parent`, `child`) VALUES
	('Helper', 'Admin'),
	('Admin', 'app_site'),
	('Helper', 'app_site'),
	('Admin', 'backend_default'),
	('Admin', 'pages'),
	('Helper', 'pages'),
	('Helper', 'pages_default_page'),
	('Supervisor', 'view_mnu_reports'),
	('Supervisor', 'view_mnu_utilities');
/*!40000 ALTER TABLE `auth_item_child` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.auth_rule
DROP TABLE IF EXISTS `auth_rule`;
CREATE TABLE IF NOT EXISTS `auth_rule` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.auth_rule: ~0 rows (approximately)
DELETE FROM `auth_rule`;
/*!40000 ALTER TABLE `auth_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rule` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.cases
DROP TABLE IF EXISTS `cases`;
CREATE TABLE IF NOT EXISTS `cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) DEFAULT NULL,
  `id_phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `id_outcome` int(11) DEFAULT NULL,
  `id_severity` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `state` bit(1) DEFAULT NULL,
  `comments` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `idx_id_contact_9123_00` (`id_contact`),
  KEY `idx_id_category_9123_01` (`id_category`),
  KEY `idx_id_outcome_9123_02` (`id_outcome`),
  KEY `idx_id_severity_9124_03` (`id_severity`),
  KEY `idx_id_user_9124_04` (`id_user`),
  KEY `idx_id_phone_9124_05` (`id_phone`),
  CONSTRAINT `fk_case_category_9119_00` FOREIGN KEY (`id_category`) REFERENCES `case_category` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_contact_9119_01` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_outcome_category_9119_02` FOREIGN KEY (`id_outcome`) REFERENCES `outcome_category` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_severity_9119_03` FOREIGN KEY (`id_severity`) REFERENCES `severity` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_9119_04` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.cases: ~2 rows (approximately)
DELETE FROM `cases`;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
INSERT INTO `cases` (`id`, `id_contact`, `id_phone`, `id_user`, `id_category`, `id_outcome`, `id_severity`, `start_date`, `close_date`, `state`, `comments`) VALUES
	(1, 1, '+447508849527', 2, 3, 2, 1, '2016-07-05 14:54:22', '2016-07-05 14:54:24', b'1', 'Main testing case');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.case_category
DROP TABLE IF EXISTS `case_category`;
CREATE TABLE IF NOT EXISTS `case_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_category` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.case_category: ~7 rows (approximately)
DELETE FROM `case_category`;
/*!40000 ALTER TABLE `case_category` DISABLE KEYS */;
INSERT INTO `case_category` (`id`, `case_category`) VALUES
	(1, 'Not Set'),
	(2, 'Deportation'),
	(3, 'Detention'),
	(4, 'Information'),
	(5, 'Medical Related'),
	(6, 'Others'),
	(7, 'Eviction');
/*!40000 ALTER TABLE `case_category` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.configuration
DROP TABLE IF EXISTS `configuration`;
CREATE TABLE IF NOT EXISTS `configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ContactLabel` varchar(20) DEFAULT 'Client',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='helptext configuration system';

-- Dumping data for table helptext_dev.configuration: ~0 rows (approximately)
DELETE FROM `configuration`;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.contact
DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_country` int(11) DEFAULT NULL,
  `id_language` int(11) DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `marital_status` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address_line1` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address_line2` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `city` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `state` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `postal_code` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `comments` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_country_9167_06` (`id_country`),
  KEY `idx_id_language_9168_07` (`id_language`),
  CONSTRAINT `fk_country_9163_05` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_languages_9164_06` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.contact: ~3 rows (approximately)
DELETE FROM `contact`;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` (`id`, `id_country`, `id_language`, `first_name`, `last_name`, `gender`, `marital_status`, `birthday`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `comments`) VALUES
	(1, 3, NULL, 'Client Nokia Phone', 'silva', 'M', 'Maried', '2016-06-27', 'afasf', 'asfasf', 'asfasf', 'asfasf', '234234', 'asfasdf'),
	(2, 6, NULL, 'tester2', 'asfasf', 'F', 'Maried', '2016-06-27', 'asfasf', 'asfasf', 'asfasf', '', '', 'asfasfasf'),
	(3, 16, NULL, 'Client no phone', 'Client no phone', 'M', 'Maried', '2016-07-20', '', '', '', '', '', '');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.contact_phone
DROP TABLE IF EXISTS `contact_phone`;
CREATE TABLE IF NOT EXISTS `contact_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) NOT NULL DEFAULT '0',
  `id_phone` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_id_phone_9198_08` (`id_phone`),
  KEY `idx_id_contact_9198_09` (`id_contact`),
  CONSTRAINT `fk_contact_9194_07` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_phone_9194_08` FOREIGN KEY (`id_phone`) REFERENCES `phone` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.contact_phone: ~2 rows (approximately)
DELETE FROM `contact_phone`;
/*!40000 ALTER TABLE `contact_phone` DISABLE KEYS */;
INSERT INTO `contact_phone` (`id`, `id_contact`, `id_phone`) VALUES
	(2, 1, '+447508849527');
/*!40000 ALTER TABLE `contact_phone` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code` varchar(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `country_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.country: ~245 rows (approximately)
DELETE FROM `country`;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` (`id`, `country_code`, `country_name`) VALUES
	(1, 'AF', 'Afghanistan'),
	(2, 'AL', 'Albania'),
	(3, 'DZ', 'Algeria'),
	(4, 'DS', 'American Samoa'),
	(5, 'AD', 'Andorra'),
	(6, 'AO', 'Angola'),
	(7, 'AI', 'Anguilla'),
	(8, 'AQ', 'Antarctica'),
	(9, 'AG', 'Antigua and Barbuda'),
	(10, 'AR', 'Argentina'),
	(11, 'AM', 'Armenia'),
	(12, 'AW', 'Aruba'),
	(13, 'AU', 'Australia'),
	(14, 'AT', 'Austria'),
	(15, 'AZ', 'Azerbaijan'),
	(16, 'BS', 'Bahamas'),
	(17, 'BH', 'Bahrain'),
	(18, 'BD', 'Bangladesh'),
	(19, 'BB', 'Barbados'),
	(20, 'BY', 'Belarus'),
	(21, 'BE', 'Belgium'),
	(22, 'BZ', 'Belize'),
	(23, 'BJ', 'Benin'),
	(24, 'BM', 'Bermuda'),
	(25, 'BT', 'Bhutan'),
	(26, 'BO', 'Bolivia'),
	(27, 'BA', 'Bosnia and Herzegovina'),
	(28, 'BW', 'Botswana'),
	(29, 'BV', 'Bouvet Island'),
	(30, 'BR', 'Brazil'),
	(31, 'IO', 'British Indian Ocean Territory'),
	(32, 'BN', 'Brunei Darussalam'),
	(33, 'BG', 'Bulgaria'),
	(34, 'BF', 'Burkina Faso'),
	(35, 'BI', 'Burundi'),
	(36, 'KH', 'Cambodia'),
	(37, 'CM', 'Cameroon'),
	(38, 'CA', 'Canada'),
	(39, 'CV', 'Cape Verde'),
	(40, 'KY', 'Cayman Islands'),
	(41, 'CF', 'Central African Republic'),
	(42, 'TD', 'Chad'),
	(43, 'CL', 'Chile'),
	(44, 'CN', 'China'),
	(45, 'CX', 'Christmas Island'),
	(46, 'CC', 'Cocos (Keeling) Islands'),
	(47, 'CO', 'Colombia'),
	(48, 'KM', 'Comoros'),
	(49, 'CG', 'Congo'),
	(50, 'CK', 'Cook Islands'),
	(51, 'CR', 'Costa Rica'),
	(52, 'HR', 'Croatia (Hrvatska)'),
	(53, 'CU', 'Cuba'),
	(54, 'CY', 'Cyprus'),
	(55, 'CZ', 'Czech Republic'),
	(56, 'DK', 'Denmark'),
	(57, 'DJ', 'Djibouti'),
	(58, 'DM', 'Dominica'),
	(59, 'DO', 'Dominican Republic'),
	(60, 'TP', 'East Timor'),
	(61, 'EC', 'Ecuador'),
	(62, 'EG', 'Egypt'),
	(63, 'SV', 'El Salvador'),
	(64, 'GQ', 'Equatorial Guinea'),
	(65, 'ER', 'Eritrea'),
	(66, 'EE', 'Estonia'),
	(67, 'ET', 'Ethiopia'),
	(68, 'FK', 'Falkland Islands (Islas Malvinas)'),
	(69, 'FO', 'Faroe Islands'),
	(70, 'FJ', 'Fiji'),
	(71, 'FI', 'Finland'),
	(72, 'FR', 'France'),
	(73, 'FX', 'France, Metropolitan'),
	(74, 'GF', 'French Guiana'),
	(75, 'PF', 'French Polynesia'),
	(76, 'TF', 'French Southern Territories'),
	(77, 'GA', 'Gabon'),
	(78, 'GM', 'Gambia'),
	(79, 'GE', 'Georgia'),
	(80, 'DE', 'Germany'),
	(81, 'GH', 'Ghana'),
	(82, 'GI', 'Gibraltar'),
	(83, 'GK', 'Guernsey'),
	(84, 'GR', 'Greece'),
	(85, 'GL', 'Greenland'),
	(86, 'GD', 'Grenada'),
	(87, 'GP', 'Guadeloupe'),
	(88, 'GU', 'Guam'),
	(89, 'GT', 'Guatemala'),
	(90, 'GN', 'Guinea'),
	(91, 'GW', 'Guinea-Bissau'),
	(92, 'GY', 'Guyana'),
	(93, 'HT', 'Haiti'),
	(94, 'HM', 'Heard and Mc Donald Islands'),
	(95, 'HN', 'Honduras'),
	(96, 'HK', 'Hong Kong'),
	(97, 'HU', 'Hungary'),
	(98, 'IS', 'Iceland'),
	(99, 'IN', 'India'),
	(100, 'IM', 'Isle of Man'),
	(101, 'ID', 'Indonesia'),
	(102, 'IR', 'Iran (Islamic Republic of)'),
	(103, 'IQ', 'Iraq'),
	(104, 'IE', 'Ireland'),
	(105, 'IL', 'Israel'),
	(106, 'IT', 'Italy'),
	(107, 'CI', 'Ivory Coast'),
	(108, 'JE', 'Jersey'),
	(109, 'JM', 'Jamaica'),
	(110, 'JP', 'Japan'),
	(111, 'JO', 'Jordan'),
	(112, 'KZ', 'Kazakhstan'),
	(113, 'KE', 'Kenya'),
	(114, 'KI', 'Kiribati'),
	(115, 'KP', 'Korea, Democratic People\'s Republic of'),
	(116, 'KR', 'Korea, Republic of'),
	(117, 'XK', 'Kosovo'),
	(118, 'KW', 'Kuwait'),
	(119, 'KG', 'Kyrgyzstan'),
	(120, 'LA', 'Lao People\'s Democratic Republic'),
	(121, 'LV', 'Latvia'),
	(122, 'LB', 'Lebanon'),
	(123, 'LS', 'Lesotho'),
	(124, 'LR', 'Liberia'),
	(125, 'LY', 'Libyan Arab Jamahiriya'),
	(126, 'LI', 'Liechtenstein'),
	(127, 'LT', 'Lithuania'),
	(128, 'LU', 'Luxembourg'),
	(129, 'MO', 'Macau'),
	(130, 'MK', 'Macedonia'),
	(131, 'MG', 'Madagascar'),
	(132, 'MW', 'Malawi'),
	(133, 'MY', 'Malaysia'),
	(134, 'MV', 'Maldives'),
	(135, 'ML', 'Mali'),
	(136, 'MT', 'Malta'),
	(137, 'MH', 'Marshall Islands'),
	(138, 'MQ', 'Martinique'),
	(139, 'MR', 'Mauritania'),
	(140, 'MU', 'Mauritius'),
	(141, 'TY', 'Mayotte'),
	(142, 'MX', 'Mexico'),
	(143, 'FM', 'Micronesia, Federated States of'),
	(144, 'MD', 'Moldova, Republic of'),
	(145, 'MC', 'Monaco'),
	(146, 'MN', 'Mongolia'),
	(147, 'ME', 'Montenegro'),
	(148, 'MS', 'Montserrat'),
	(149, 'MA', 'Morocco'),
	(150, 'MZ', 'Mozambique'),
	(151, 'MM', 'Myanmar'),
	(152, 'NA', 'Namibia'),
	(153, 'NR', 'Nauru'),
	(154, 'NP', 'Nepal'),
	(155, 'NL', 'Netherlands'),
	(156, 'AN', 'Netherlands Antilles'),
	(157, 'NC', 'New Caledonia'),
	(158, 'NZ', 'New Zealand'),
	(159, 'NI', 'Nicaragua'),
	(160, 'NE', 'Niger'),
	(161, 'NG', 'Nigeria'),
	(162, 'NU', 'Niue'),
	(163, 'NF', 'Norfolk Island'),
	(164, 'MP', 'Northern Mariana Islands'),
	(165, 'NO', 'Norway'),
	(166, 'OM', 'Oman'),
	(167, 'PK', 'Pakistan'),
	(168, 'PW', 'Palau'),
	(169, 'PS', 'Palestine'),
	(170, 'PA', 'Panama'),
	(171, 'PG', 'Papua New Guinea'),
	(172, 'PY', 'Paraguay'),
	(173, 'PE', 'Peru'),
	(174, 'PH', 'Philippines'),
	(175, 'PN', 'Pitcairn'),
	(176, 'PL', 'Poland'),
	(177, 'PT', 'Portugal'),
	(178, 'PR', 'Puerto Rico'),
	(179, 'QA', 'Qatar'),
	(180, 'RE', 'Reunion'),
	(181, 'RO', 'Romania'),
	(182, 'RU', 'Russian Federation'),
	(183, 'RW', 'Rwanda'),
	(184, 'KN', 'Saint Kitts and Nevis'),
	(185, 'LC', 'Saint Lucia'),
	(186, 'VC', 'Saint Vincent and the Grenadines'),
	(187, 'WS', 'Samoa'),
	(188, 'SM', 'San Marino'),
	(189, 'ST', 'Sao Tome and Principe'),
	(190, 'SA', 'Saudi Arabia'),
	(191, 'SN', 'Senegal'),
	(192, 'RS', 'Serbia'),
	(193, 'SC', 'Seychelles'),
	(194, 'SL', 'Sierra Leone'),
	(195, 'SG', 'Singapore'),
	(196, 'SK', 'Slovakia'),
	(197, 'SI', 'Slovenia'),
	(198, 'SB', 'Solomon Islands'),
	(199, 'SO', 'Somalia'),
	(200, 'ZA', 'South Africa'),
	(201, 'GS', 'South Georgia South Sandwich Islands'),
	(202, 'ES', 'Spain'),
	(203, 'LK', 'Sri Lanka'),
	(204, 'SH', 'St. Helena'),
	(205, 'PM', 'St. Pierre and Miquelon'),
	(206, 'SD', 'Sudan'),
	(207, 'SR', 'Suriname'),
	(208, 'SJ', 'Svalbard and Jan Mayen Islands'),
	(209, 'SZ', 'Swaziland'),
	(210, 'SE', 'Sweden'),
	(211, 'CH', 'Switzerland'),
	(212, 'SY', 'Syrian Arab Republic'),
	(213, 'TW', 'Taiwan'),
	(214, 'TJ', 'Tajikistan'),
	(215, 'TZ', 'Tanzania, United Republic of'),
	(216, 'TH', 'Thailand'),
	(217, 'TG', 'Togo'),
	(218, 'TK', 'Tokelau'),
	(219, 'TO', 'Tonga'),
	(220, 'TT', 'Trinidad and Tobago'),
	(221, 'TN', 'Tunisia'),
	(222, 'TR', 'Turkey'),
	(223, 'TM', 'Turkmenistan'),
	(224, 'TC', 'Turks and Caicos Islands'),
	(225, 'TV', 'Tuvalu'),
	(226, 'UG', 'Uganda'),
	(227, 'UA', 'Ukraine'),
	(228, 'AE', 'United Arab Emirates'),
	(229, 'GB', 'United Kingdom'),
	(230, 'US', 'United States'),
	(231, 'UM', 'United States minor outlying islands'),
	(232, 'UY', 'Uruguay'),
	(233, 'UZ', 'Uzbekistan'),
	(234, 'VU', 'Vanuatu'),
	(235, 'VA', 'Vatican City State'),
	(236, 'VE', 'Venezuela'),
	(237, 'VN', 'Vietnam'),
	(238, 'VG', 'Virgin Islands (British)'),
	(239, 'VI', 'Virgin Islands (U.S.)'),
	(240, 'WF', 'Wallis and Futuna Islands'),
	(241, 'EH', 'Western Sahara'),
	(242, 'YE', 'Yemen'),
	(243, 'YU', 'Yugoslavia'),
	(244, 'ZR', 'Zaire'),
	(245, 'ZM', 'Zambia');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.dmstr_page
DROP TABLE IF EXISTS `dmstr_page`;
CREATE TABLE IF NOT EXISTS `dmstr_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `root` int(11) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `lvl` smallint(6) NOT NULL,
  `page_title` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `domain_id` varchar(255) CHARACTER SET latin1 NOT NULL,
  `slug` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `route` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `view` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `default_meta_keywords` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `default_meta_description` text CHARACTER SET latin1,
  `request_params` text CHARACTER SET latin1,
  `owner` int(11) DEFAULT NULL,
  `access_owner` int(11) DEFAULT NULL,
  `access_domain` varchar(8) CHARACTER SET latin1 DEFAULT NULL,
  `access_read` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `access_update` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `access_delete` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `icon_type` smallint(6) DEFAULT '1',
  `active` smallint(6) DEFAULT '1',
  `selected` smallint(6) DEFAULT '0',
  `disabled` smallint(6) DEFAULT '0',
  `readonly` smallint(6) DEFAULT '0',
  `visible` smallint(6) DEFAULT '1',
  `collapsed` smallint(6) DEFAULT '0',
  `movable_u` smallint(6) DEFAULT '1',
  `movable_d` smallint(6) DEFAULT '1',
  `movable_l` smallint(6) DEFAULT '1',
  `movable_r` smallint(6) DEFAULT '1',
  `removable` smallint(6) DEFAULT '1',
  `removable_all` smallint(6) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_id_UNIQUE` (`domain_id`,`access_domain`),
  KEY `tbl_tree_NK1` (`root`),
  KEY `tbl_tree_NK2` (`lft`),
  KEY `tbl_tree_NK3` (`rgt`),
  KEY `tbl_tree_NK4` (`lvl`),
  KEY `tbl_tree_NK5` (`active`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.dmstr_page: ~2 rows (approximately)
DELETE FROM `dmstr_page`;
/*!40000 ALTER TABLE `dmstr_page` DISABLE KEYS */;
INSERT INTO `dmstr_page` (`id`, `root`, `lft`, `rgt`, `lvl`, `page_title`, `name`, `domain_id`, `slug`, `route`, `view`, `default_meta_keywords`, `default_meta_description`, `request_params`, `owner`, `access_owner`, `access_domain`, `access_read`, `access_update`, `access_delete`, `icon`, `icon_type`, `active`, `selected`, `disabled`, `readonly`, `visible`, `collapsed`, `movable_u`, `movable_d`, `movable_l`, `movable_r`, `removable`, `removable_all`, `created_at`, `updated_at`) VALUES
	(1, 1, 1, 4, 0, '', 'root_en', 'root', NULL, '/site/index', '', '', '', '{}', NULL, NULL, 'en', NULL, NULL, NULL, 'fa fa-angellist', 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, '2016-06-23 14:58:09', '2016-06-22 12:39:46'),
	(2, 1, 2, 3, 1, '', 'About Us', 'about-us', NULL, '/site/index', '', '', '', '{}', NULL, NULL, '*', NULL, NULL, NULL, 'fa fa-bed', 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, '2016-06-22 12:41:01', '2016-06-22 12:41:01');
/*!40000 ALTER TABLE `dmstr_page` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.html
DROP TABLE IF EXISTS `html`;
CREATE TABLE IF NOT EXISTS `html` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `html_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.html: ~4 rows (approximately)
DELETE FROM `html`;
/*!40000 ALTER TABLE `html` DISABLE KEYS */;
INSERT INTO `html` (`id`, `key`, `value`) VALUES
	(2, 'footer', '<p>.</p>\r\n'),
	(4, 'about-us', '<p>esta seria about us</p>\r\n'),
	(6, 'en/site/index', '\r\nviva peron');
/*!40000 ALTER TABLE `html` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.language
DROP TABLE IF EXISTS `language`;
CREATE TABLE IF NOT EXISTS `language` (
  `language_id` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `language` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `name_ascii` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `status` smallint(6) NOT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.language: ~78 rows (approximately)
DELETE FROM `language`;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` (`language_id`, `language`, `country`, `name`, `name_ascii`, `status`) VALUES
	('af-ZA', 'af', 'za', 'Afrikaans', 'Afrikaans', 0),
	('ar-AR', 'ar', 'ar', '‏العربية‏', 'Arabic', 0),
	('az-AZ', 'az', 'az', 'Azərbaycan dili', 'Azerbaijani', 0),
	('be-BY', 'be', 'by', 'Беларуская', 'Belarusian', 0),
	('bg-BG', 'bg', 'bg', 'Български', 'Bulgarian', 0),
	('bn-IN', 'bn', 'in', 'বাংলা', 'Bengali', 0),
	('bs-BA', 'bs', 'ba', 'Bosanski', 'Bosnian', 0),
	('ca-ES', 'ca', 'es', 'Català', 'Catalan', 0),
	('cs-CZ', 'cs', 'cz', 'Čeština', 'Czech', 0),
	('cy-GB', 'cy', 'gb', 'Cymraeg', 'Welsh', 0),
	('da-DK', 'da', 'dk', 'Dansk', 'Danish', 0),
	('de-DE', 'de', 'de', 'Deutsch', 'German', 0),
	('el-GR', 'el', 'gr', 'Ελληνικά', 'Greek', 0),
	('en-GB', 'en', 'gb', 'English (UK)', 'English (UK)', 1),
	('en-PI', 'en', 'pi', 'English (Pirate)', 'English (Pirate)', 0),
	('en-UD', 'en', 'ud', 'English (Upside Down)', 'English (Upside Down)', 0),
	('en-US', 'en', 'us', 'English (US)', 'English (US)', 1),
	('eo-EO', 'eo', 'eo', 'Esperanto', 'Esperanto', 0),
	('es-ES', 'es', 'es', 'Español (España)', 'Spanish (Spain)', 0),
	('es-LA', 'es', 'la', 'Español', 'Spanish', 0),
	('et-EE', 'et', 'ee', 'Eesti', 'Estonian', 0),
	('eu-ES', 'eu', 'es', 'Euskara', 'Basque', 0),
	('fa-IR', 'fa', 'ir', '‏فارسی‏', 'Persian', 0),
	('fb-LT', 'fb', 'lt', 'Leet Speak', 'Leet Speak', 0),
	('fi-FI', 'fi', 'fi', 'Suomi', 'Finnish', 0),
	('fo-FO', 'fo', 'fo', 'Føroyskt', 'Faroese', 0),
	('fr-CA', 'fr', 'ca', 'Français (Canada)', 'French (Canada)', 0),
	('fr-FR', 'fr', 'fr', 'Français (France)', 'French (France)', 0),
	('fy-NL', 'fy', 'nl', 'Frysk', 'Frisian', 0),
	('ga-IE', 'ga', 'ie', 'Gaeilge', 'Irish', 0),
	('gl-ES', 'gl', 'es', 'Galego', 'Galician', 0),
	('he-IL', 'he', 'il', '‏עברית‏', 'Hebrew', 0),
	('hi-IN', 'hi', 'in', 'हिन्दी', 'Hindi', 0),
	('hr-HR', 'hr', 'hr', 'Hrvatski', 'Croatian', 0),
	('hu-HU', 'hu', 'hu', 'Magyar', 'Hungarian', 0),
	('hy-AM', 'hy', 'am', 'Հայերեն', 'Armenian', 0),
	('id-ID', 'id', 'id', 'Bahasa Indonesia', 'Indonesian', 0),
	('is-IS', 'is', 'is', 'Íslenska', 'Icelandic', 0),
	('it-IT', 'it', 'it', 'Italiano', 'Italian', 0),
	('ja-JP', 'ja', 'jp', '日本語', 'Japanese', 0),
	('ka-GE', 'ka', 'ge', 'ქართული', 'Georgian', 0),
	('km-KH', 'km', 'kh', 'ភាសាខ្មែរ', 'Khmer', 0),
	('ko-KR', 'ko', 'kr', '한국어', 'Korean', 0),
	('ku-TR', 'ku', 'tr', 'Kurdî', 'Kurdish', 0),
	('la-VA', 'la', 'va', 'lingua latina', 'Latin', 0),
	('lt-LT', 'lt', 'lt', 'Lietuvių', 'Lithuanian', 0),
	('lv-LV', 'lv', 'lv', 'Latviešu', 'Latvian', 0),
	('mk-MK', 'mk', 'mk', 'Македонски', 'Macedonian', 0),
	('ml-IN', 'ml', 'in', 'മലയാളം', 'Malayalam', 0),
	('ms-MY', 'ms', 'my', 'Bahasa Melayu', 'Malay', 0),
	('nb-NO', 'nb', 'no', 'Norsk (bokmål)', 'Norwegian (bokmal)', 0),
	('ne-NP', 'ne', 'np', 'नेपाली', 'Nepali', 0),
	('nl-NL', 'nl', 'nl', 'Nederlands', 'Dutch', 0),
	('nn-NO', 'nn', 'no', 'Norsk (nynorsk)', 'Norwegian (nynorsk)', 0),
	('pa-IN', 'pa', 'in', 'ਪੰਜਾਬੀ', 'Punjabi', 0),
	('pl-PL', 'pl', 'pl', 'Polski', 'Polish', 0),
	('ps-AF', 'ps', 'af', '‏پښتو‏', 'Pashto', 0),
	('pt-BR', 'pt', 'br', 'Português (Brasil)', 'Portuguese (Brazil)', 0),
	('pt-PT', 'pt', 'pt', 'Português (Portugal)', 'Portuguese (Portugal)', 0),
	('ro-RO', 'ro', 'ro', 'Română', 'Romanian', 0),
	('ru-RU', 'ru', 'ru', 'Русский', 'Russian', 0),
	('sk-SK', 'sk', 'sk', 'Slovenčina', 'Slovak', 0),
	('sl-SI', 'sl', 'si', 'Slovenščina', 'Slovenian', 0),
	('sq-AL', 'sq', 'al', 'Shqip', 'Albanian', 0),
	('sr-RS', 'sr', 'rs', 'Српски', 'Serbian', 0),
	('sv-SE', 'sv', 'se', 'Svenska', 'Swedish', 0),
	('sw-KE', 'sw', 'ke', 'Kiswahili', 'Swahili', 0),
	('ta-IN', 'ta', 'in', 'தமிழ்', 'Tamil', 0),
	('te-IN', 'te', 'in', 'తెలుగు', 'Telugu', 0),
	('th-TH', 'th', 'th', 'ภาษาไทย', 'Thai', 0),
	('tl-PH', 'tl', 'ph', 'Filipino', 'Filipino', 0),
	('tr-TR', 'tr', 'tr', 'Türkçe', 'Turkish', 0),
	('uk-UA', 'uk', 'ua', 'Українська', 'Ukrainian', 0),
	('vi-VN', 'vi', 'vn', 'Tiếng Việt', 'Vietnamese', 0),
	('xx-XX', 'xx', 'xx', 'Fejlesztő', 'Developer', 0),
	('zh-CN', 'zh', 'cn', '中文(简体)', 'Simplified Chinese (China)', 0),
	('zh-HK', 'zh', 'hk', '中文(香港)', 'Traditional Chinese (Hong Kong)', 0),
	('zh-TW', 'zh', 'tw', '中文(台灣)', 'Traditional Chinese (Taiwan)', 0);
/*!40000 ALTER TABLE `language` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.languages
DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` mediumtext CHARACTER SET utf8 NOT NULL,
  `short_name` mediumtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- Dumping data for table helptext_dev.languages: ~108 rows (approximately)
DELETE FROM `languages`;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` (`id`, `language`, `short_name`) VALUES
	(1, 'English', 'en'),
	(2, 'German', 'de'),
	(3, 'French', 'fr'),
	(4, 'Dutch', 'nl'),
	(5, 'Italian', 'it'),
	(6, 'Spanish', 'es'),
	(7, 'Polish', 'pl'),
	(8, 'Russian', 'ru'),
	(9, 'Japanese', 'ja'),
	(10, 'Portuguese', 'pt'),
	(11, 'Swedish', 'sv'),
	(12, 'Chinese', 'zh'),
	(13, 'Catalan', 'ca'),
	(14, 'Ukrainian', 'uk'),
	(15, 'Norwegian (Bokmål)', 'no'),
	(16, 'Finnish', 'fi'),
	(17, 'Vietnamese', 'vi'),
	(18, 'Czech', 'cs'),
	(19, 'Hungarian', 'hu'),
	(20, 'Korean', 'ko'),
	(21, 'Indonesian', 'id'),
	(22, 'Turkish', 'tr'),
	(23, 'Romanian', 'ro'),
	(24, 'Persian', 'fa'),
	(25, 'Arabic', 'ar'),
	(26, 'Danish', 'da'),
	(27, 'Esperanto', 'eo'),
	(28, 'Serbian', 'sr'),
	(29, 'Lithuanian', 'lt'),
	(30, 'Slovak', 'sk'),
	(31, 'Malay', 'ms'),
	(32, 'Hebrew', 'he'),
	(33, 'Bulgarian', 'bg'),
	(34, 'Slovenian', 'sl'),
	(35, 'Volapük', 'vo'),
	(36, 'Kazakh', 'kk'),
	(37, 'Waray-Waray', 'war'),
	(38, 'Basque', 'eu'),
	(39, 'Croatian', 'hr'),
	(40, 'Hindi', 'hi'),
	(41, 'Estonian', 'et'),
	(42, 'Azerbaijani', 'az'),
	(43, 'Galician', 'gl'),
	(44, 'Simple English', 'simple'),
	(45, 'Norwegian (Nynorsk)', 'nn'),
	(46, 'Thai', 'th'),
	(47, 'Newar / Nepal Bhasa', 'new'),
	(48, 'Greek', 'el'),
	(49, 'Aromanian', 'roa-rup'),
	(50, 'Latin', 'la'),
	(51, 'Occitan', 'oc'),
	(52, 'Tagalog', 'tl'),
	(53, 'Haitian', 'ht'),
	(54, 'Macedonian', 'mk'),
	(55, 'Georgian', 'ka'),
	(56, 'Serbo-Croatian', 'sh'),
	(57, 'Telugu', 'te'),
	(58, 'Piedmontese', 'pms'),
	(59, 'Cebuano', 'ceb'),
	(60, 'Tamil', 'ta'),
	(61, 'Belarusian (Taraškievica)', 'be-x-old'),
	(62, 'Breton', 'br'),
	(63, 'Latvian', 'lv'),
	(64, 'Javanese', 'jv'),
	(65, 'Albanian', 'sq'),
	(66, 'Belarusian', 'be'),
	(67, 'Marathi', 'mr'),
	(68, 'Welsh', 'cy'),
	(69, 'Luxembourgish', 'lb'),
	(70, 'Icelandic', 'is'),
	(71, 'Bosnian', 'bs'),
	(72, 'Yoruba', 'yo'),
	(73, 'Malagasy', 'mg'),
	(74, 'Aragonese', 'an'),
	(75, 'Bishnupriya Manipuri', 'bpy'),
	(76, 'Lombard', 'lmo'),
	(77, 'West Frisian', 'fy'),
	(78, 'Bengali', 'bn'),
	(79, 'Ido', 'io'),
	(80, 'Swahili', 'sw'),
	(81, 'Gujarati', 'gu'),
	(82, 'Malayalam', 'ml'),
	(83, 'Western Panjabi', 'pnb'),
	(84, 'Afrikaans', 'af'),
	(85, 'Low Saxon', 'nds'),
	(86, 'Sicilian', 'scn'),
	(87, 'Urdu', 'ur'),
	(88, 'Kurdish', 'ku'),
	(89, 'Cantonese', 'zh-yue'),
	(90, 'Armenian', 'hy'),
	(91, 'Quechua', 'qu'),
	(92, 'Sundanese', 'su'),
	(93, 'Nepali', 'ne'),
	(94, 'Zazaki', 'diq'),
	(95, 'Asturian', 'ast'),
	(96, 'Tatar', 'tt'),
	(97, 'Neapolitan', 'nap'),
	(98, 'Irish', 'ga'),
	(99, 'Chuvash', 'cv'),
	(100, 'Samogitian', 'bat-smg'),
	(101, 'Walloon', 'wa'),
	(102, 'Amharic', 'am'),
	(103, 'Kannada', 'kn'),
	(104, 'Alemannic', 'als'),
	(105, 'Buginese', 'bug'),
	(106, 'Burmese', 'my'),
	(107, 'Interlingua', 'ia'),
	(108, '- Not selected -', 'dont');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.language_source
DROP TABLE IF EXISTS `language_source`;
CREATE TABLE IF NOT EXISTS `language_source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.language_source: ~0 rows (approximately)
DELETE FROM `language_source`;
/*!40000 ALTER TABLE `language_source` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_source` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.language_translate
DROP TABLE IF EXISTS `language_translate`;
CREATE TABLE IF NOT EXISTS `language_translate` (
  `id` int(11) NOT NULL,
  `language` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `translation` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`,`language`),
  KEY `language_translate_idx_language` (`language`),
  CONSTRAINT `language_translate_ibfk_1` FOREIGN KEY (`language`) REFERENCES `language` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `language_translate_ibfk_2` FOREIGN KEY (`id`) REFERENCES `language_source` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.language_translate: ~0 rows (approximately)
DELETE FROM `language_translate`;
/*!40000 ALTER TABLE `language_translate` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_translate` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.less
DROP TABLE IF EXISTS `less`;
CREATE TABLE IF NOT EXISTS `less` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `less_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.less: ~0 rows (approximately)
DELETE FROM `less`;
/*!40000 ALTER TABLE `less` DISABLE KEYS */;
/*!40000 ALTER TABLE `less` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.message
DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phone` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_sender_type` int(11) NOT NULL DEFAULT '0',
  `id_message_type` int(11) DEFAULT NULL,
  `message` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `sent` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `idx_id_phone_9401_10` (`id_phone`),
  KEY `idx_id_case_9401_11` (`id_case`),
  KEY `idx_id_sender_type_9401_12` (`id_sender_type`),
  KEY `idx_id_message_type_9401_13` (`id_message_type`),
  CONSTRAINT `fk_cases_9396_09` FOREIGN KEY (`id_case`) REFERENCES `cases` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_type_9396_010` FOREIGN KEY (`id_message_type`) REFERENCES `message_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `fk_sender_type_9397_011` FOREIGN KEY (`id_sender_type`) REFERENCES `sender_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.message: ~7 rows (approximately)
DELETE FROM `message`;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` (`id`, `id_phone`, `id_case`, `id_sender_type`, `id_message_type`, `message`, `sent`) VALUES
	(1, '+447551524625', 1, 2, 2, 'Please Help me i am in trouble', '2016-06-01 01:01:01'),
	(2, '+447551524625', 1, 2, 2, 'Hurry up i am in danger', '2016-06-01 01:10:01'),
	(5, '+447551524625', 1, 1, 2, 'We will call you as soon as possible', '2016-06-01 01:21:01'),
	(10, '+447551524625', 1, 3, 2, 'case#1# we are going there to help you', '2016-07-19 17:35:15'),
	(40, '+4475515246251', 1, 3, NULL, 'case#1# y otro mas', '2016-07-25 16:10:48'),
	(41, '+4475515246251', 1, 3, NULL, 'case#1# a ver ahora que onda', '2016-07-25 17:10:23'),
	(42, '+4475515246251', 1, 3, NULL, 'case#1# claro que si', '2016-07-25 17:12:24'),
	(43, '+4475515246251', 1, 3, NULL, 'Anonymized message', '2016-07-25 17:23:56');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.message_type
DROP TABLE IF EXISTS `message_type`;
CREATE TABLE IF NOT EXISTS `message_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.message_type: ~2 rows (approximately)
DELETE FROM `message_type`;
/*!40000 ALTER TABLE `message_type` DISABLE KEYS */;
INSERT INTO `message_type` (`id`, `type`) VALUES
	(1, 'phone'),
	(2, 'sms');
/*!40000 ALTER TABLE `message_type` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.migration
DROP TABLE IF EXISTS `migration`;
CREATE TABLE IF NOT EXISTS `migration` (
  `version` varchar(180) NOT NULL,
  `alias` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table helptext_dev.migration: ~23 rows (approximately)
DELETE FROM `migration`;
/*!40000 ALTER TABLE `migration` DISABLE KEYS */;
INSERT INTO `migration` (`version`, `alias`, `apply_time`) VALUES
	('m140209_132017_init', '@dektrium/user/migrations', 1425651610),
	('m140403_174025_create_account_table', '@dektrium/user/migrations', 1425651610),
	('m140504_113157_update_tables', '@dektrium/user/migrations', 1425651612),
	('m140504_130429_create_token_table', '@dektrium/user/migrations', 1425651613),
	('m140506_102106_rbac_init', '@yii/rbac/migrations', 1466528895),
	('m140618_045255_create_settings', '@vendor/pheme/yii2-settings/migrations', 1466528895),
	('m140830_171933_fix_ip_field', '@dektrium/user/migrations', 1425651613),
	('m140830_172703_change_account_table_name', '@dektrium/user/migrations', 1425651613),
	('m141002_030233_translate_manager', '@vendor/lajax/yii2-translate-manager/migrations', 1466528899),
	('m141222_110026_update_ip_field', '@dektrium/user/migrations', 1425651613),
	('m141222_135246_alter_username_length', '@dektrium/user/migrations', 1466528900),
	('m150309_153255_create_tree_manager_table', '@vendor/dmstr/yii2-pages-module/migrations', 1466528902),
	('m150614_103145_update_social_account_table', '@dektrium/user/migrations', 1466528905),
	('m150623_164544_auth_items', '@vendor/dmstr/yii2-pages-module/migrations', 1466528905),
	('m150623_212711_fix_username_notnull', '@dektrium/user/migrations', 1466528906),
	('m150918_031100_auth_items', '@vendor/dmstr/yii2-pages-module/migrations', 1466528907),
	('m151020_213100_update_profile_table', '@vendor/cinghie/yii2-user-extended/migrations', 1466756758),
	('m151126_091910_add_unique_index', '@vendor/pheme/yii2-settings/migrations', 1466528907),
	('m151226_111407_init', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466528909),
	('m160411_082658_rename_name_id_column', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160411_111111_name_id_to_domain_id_renamer', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160504_032335_add_twig_table', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466617681);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.outcome_category
DROP TABLE IF EXISTS `outcome_category`;
CREATE TABLE IF NOT EXISTS `outcome_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outcome` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.outcome_category: ~3 rows (approximately)
DELETE FROM `outcome_category`;
/*!40000 ALTER TABLE `outcome_category` DISABLE KEYS */;
INSERT INTO `outcome_category` (`id`, `outcome`) VALUES
	(1, 'Resolved'),
	(2, 'Refered'),
	(3, 'N/A');
/*!40000 ALTER TABLE `outcome_category` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.phone
DROP TABLE IF EXISTS `phone`;
CREATE TABLE IF NOT EXISTS `phone` (
  `id` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `comment` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.phone: ~16 rows (approximately)
DELETE FROM `phone`;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` (`id`, `comment`) VALUES
	('+1160463036', 'added by system'),
	('+2494225568', 'added by system'),
	('+2647694543', 'added by system'),
	('+2968035894', 'added by system'),
	('+4387362913', 'added by system'),
	('+447508849527', 'EE nokia phone to test client'),
	('+4833319605', 'added by system'),
	('+4929505151', 'added by system'),
	('+5027810893', 'added by system'),
	('+6593283133', 'added by system'),
	('+7921464339', 'added by system'),
	('+7944383683', 'added by system'),
	('+7968637380', 'added by system'),
	('+8234102891', 'added by system'),
	('+8730845923', 'added by system'),
	('24234234', 'added by system');
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.profile
DROP TABLE IF EXISTS `profile`;
CREATE TABLE IF NOT EXISTS `profile` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `public_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gravatar_email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `gravatar_id` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8_unicode_ci,
  `id_country` int(11) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT NULL,
  `skills` text COLLATE utf8_unicode_ci,
  `firstname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lastname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `birthday` date NOT NULL,
  `avatar` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `terms` tinyint(1) NOT NULL DEFAULT '0',
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_9525_012` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.profile: ~8 rows (approximately)
DELETE FROM `profile`;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` (`user_id`, `name`, `public_email`, `gravatar_email`, `gravatar_id`, `location`, `website`, `bio`, `id_country`, `availability`, `skills`, `firstname`, `lastname`, `birthday`, `avatar`, `terms`, `phone`) VALUES
	(1, 'Eduardo Admin', 'info@open-ecommerce.org', 'info@open-ecommerce.org', 'e49de8ff6009a963195568839177e24d', '', 'http://open-ecommerce.org', '', 1, 1, 'nada', 'adminname', 'adminsuraname', '1966-07-16', '', 0, '+4475515246251'),
	(2, 'Eduardo Helper', 'eduardo@open-ecommerce.org', 'eduardo@open-ecommerce.org', '1f6df2c9dac05c886ac3f90e692f93af', 'Kennington, London', 'http://www.open-ecommerce.org', 'Esto solo lo que quiero decir de mi', 16, 1, 'eduardo adfasf', 'Helper Eduardo', 'Silva', '2016-06-17', '', 0, '+447551524625'),
	(3, '', '', '', 'd41d8cd98f00b204e9800998ecf8427e', '', '', '', 1, 1, 'esto', 'Tester1', 'ApellidoTester', '2016-07-13', '', 0, ''),
	(4, '', '', '', '', '', '', '', NULL, 1, 'Nada', 'Pepe', 'Marqueta', '0000-00-00', '', 0, ''),
	(5, '', '', '', '', '', '', '', NULL, NULL, '', 'Juan', 'Pitufo', '0000-00-00', '', 0, ''),
	(6, '', '', '', '', '', '', '', NULL, NULL, '', 'Jackson', 'Brown', '0000-00-00', '', 0, ''),
	(7, '', '', '', '', '', '', '', NULL, NULL, '', 'Pepito', 'cuevas', '0000-00-00', '', 0, ''),
	(8, '', '', '', '', '', '', '', NULL, 1, '', 'pepe2', 'Biondi', '0000-00-00', '', 0, '');
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.qry_next_available_user
DROP TABLE IF EXISTS `qry_next_available_user`;
CREATE TABLE IF NOT EXISTS `qry_next_available_user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.qry_next_available_user: ~2 rows (approximately)
DELETE FROM `qry_next_available_user`;
/*!40000 ALTER TABLE `qry_next_available_user` DISABLE KEYS */;
INSERT INTO `qry_next_available_user` (`id`, `name`) VALUES
	(2, 'Helper Eduardo'),
	(4, 'Pepe');
/*!40000 ALTER TABLE `qry_next_available_user` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.sender_type
DROP TABLE IF EXISTS `sender_type`;
CREATE TABLE IF NOT EXISTS `sender_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_type` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.sender_type: ~2 rows (approximately)
DELETE FROM `sender_type`;
/*!40000 ALTER TABLE `sender_type` DISABLE KEYS */;
INSERT INTO `sender_type` (`id`, `sender_type`) VALUES
	(1, 'Automated Response'),
	(2, 'Contact'),
	(3, 'User');
/*!40000 ALTER TABLE `sender_type` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.settings
DROP TABLE IF EXISTS `settings`;
CREATE TABLE IF NOT EXISTS `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `section` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text,
  `active` tinyint(1) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_unique_key_section` (`section`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.settings: ~0 rows (approximately)
DELETE FROM `settings`;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `type`, `section`, `key`, `value`, `active`, `created`, `modified`) VALUES
	(1, 'boolean', 'app.assets', 'registerPrototypeAsset', '1', 0, '2016-06-22 09:34:27', '2016-06-22 09:34:27');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.severity
DROP TABLE IF EXISTS `severity`;
CREATE TABLE IF NOT EXISTS `severity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `severity` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `sla` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.severity: ~0 rows (approximately)
DELETE FROM `severity`;
/*!40000 ALTER TABLE `severity` DISABLE KEYS */;
/*!40000 ALTER TABLE `severity` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.social_account
DROP TABLE IF EXISTS `social_account`;
CREATE TABLE IF NOT EXISTS `social_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `provider` varchar(255) NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `data` text,
  `code` varchar(32) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_unique` (`provider`,`client_id`),
  UNIQUE KEY `account_unique_code` (`code`),
  KEY `fk_user_account` (`user_id`),
  CONSTRAINT `fk_user_account` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table helptext_dev.social_account: ~0 rows (approximately)
DELETE FROM `social_account`;
/*!40000 ALTER TABLE `social_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_account` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.text_template
DROP TABLE IF EXISTS `text_template`;
CREATE TABLE IF NOT EXISTS `text_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `message` varchar(200) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.text_template: ~0 rows (approximately)
DELETE FROM `text_template`;
/*!40000 ALTER TABLE `text_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `text_template` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.token
DROP TABLE IF EXISTS `token`;
CREATE TABLE IF NOT EXISTS `token` (
  `user_id` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `created_at` int(11) NOT NULL,
  `type` smallint(6) NOT NULL,
  UNIQUE KEY `token_unique` (`user_id`,`code`,`type`),
  CONSTRAINT `fk_user_token` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table helptext_dev.token: ~1 rows (approximately)
DELETE FROM `token`;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` (`user_id`, `code`, `created_at`, `type`) VALUES
	(3, 'rW55xKLmOt3tD4z3KAqN6F-iI_Ez-Bd4', 1466680022, 0),
	(8, 'bvTbd9Fy1m7Lkr7VLdq6As2HK5uNPdm6', 1467980967, 0);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.twig
DROP TABLE IF EXISTS `twig`;
CREATE TABLE IF NOT EXISTS `twig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `twig_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.twig: ~0 rows (approximately)
DELETE FROM `twig`;
/*!40000 ALTER TABLE `twig` DISABLE KEYS */;
/*!40000 ALTER TABLE `twig` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 NOT NULL,
  `password_hash` varchar(60) CHARACTER SET utf8 NOT NULL,
  `auth_key` varchar(32) CHARACTER SET utf8 NOT NULL,
  `confirmed_at` int(11) DEFAULT NULL,
  `unconfirmed_email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `blocked_at` int(11) DEFAULT NULL,
  `registration_ip` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique_email` (`email`),
  UNIQUE KEY `user_unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.user: ~8 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `auth_key`, `confirmed_at`, `unconfirmed_email`, `blocked_at`, `registration_ip`, `created_at`, `updated_at`, `flags`) VALUES
	(1, 'admin', 'info@open-ecommerce.org', '$2y$10$pF12T5IRobdd/OevEABPxOnWhCq0/sOZaHQosPlE9IKIaAqT8wbfG', 'L4DEoxYf4R9C3ZvHP8uBzwcSbq5vo5mP', 1466528922, NULL, NULL, NULL, 1425651628, 1466588159, 0),
	(2, 'helper', 'eduardo@open-ecommerce.org', '$2y$10$qLQCwG1K1zMvEUJjMhhKwOhigP6WH4qjhZsf/EMJc4OtR/7b.0DQ2', 'uqe7SH5MKQYWpHUe7Mn42svnEmWkuVCI', 1425651715, NULL, NULL, '192.168.1.74', 1425651715, 1468426763, 0),
	(3, 'supervisor', 'tester1@open-ecommerce.org', '$2y$10$aqzrc2C/chlfMBycww1BqeYQp43Tct.gJ76pOywmdXjPiMfTdPkgu', 'zlUuQlMHPdSM-wTTlPkzhe3jvnoFJkBX', 1466680707, NULL, NULL, '127.0.0.1', 1466680022, 1469547898, 0),
	(4, 'mariano', 'mariano@open-ecommerce.org', '$2y$10$lxmIAPinglkzrcFfyj/DQ.l5JbfXphXb44YelwqSkiTLeKOBdiKEW', 'YZ0hyKV6Je2_2DO3mp-JeUFMO5WI-hZN', 1466680738, NULL, NULL, '192.168.1.74', 1466680738, 1466680738, 0),
	(5, 'aguien', 'tester2@algo.com', '$2y$10$Sla0IaYXAHdyrY.mLE1xfufgO7frV6U.Rodw1o5/XgBab4pdP6Kva', 'DG1ZZKMgydtwVXMjYrMXKFkV7ne-SJw_', 1466695513, NULL, NULL, '192.168.1.74', 1466695513, 1466695513, 0),
	(6, 'cacho1', 'cacho@cacho.com', '$2y$10$hmbMzLJsgA1DhkbSQyOuj.HZcEqWGrKYq0y8ohpUNt7AegY8YIc32', 'RoqqXH4h5NUYSXlXJZRqBK6gB3MGgG7_', 1466758216, NULL, NULL, '192.168.1.74', 1466758216, 1466758216, 0),
	(7, 'tester3@open-ecommerce.org', 'tester3@open-ecommerce.org', '$2y$10$Zl7xEiSCYBeDa4kRn1ldWeKpyV0HMWl93IRQd9hWsaLdPRzUuMaDu', 'Q_Rn636doTi3ue2-dMFuJ2coLfqlR4CG', 1467980744, NULL, NULL, '127.0.0.1', 1467980720, 1467980720, 0),
	(8, 'tester4', 'tester4@open-ecommerce.org', '$2y$10$11fIiKaiQqp/thlCNmKXv.hd9NX4p6/eIisTotolxH1QmAT.BoJAq', 'XZNX5JKdcV6RZElK0DMsODjBQeexYnDf', 1469547942, NULL, NULL, '192.168.1.74', 1467980966, 1467980966, 0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
