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
/*!40000 ALTER TABLE `auth_assignment` DISABLE KEYS */;
REPLACE INTO `auth_assignment` (`item_name`, `user_id`, `created_at`) VALUES
	('Helper', '2', 1468426789);
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
/*!40000 ALTER TABLE `auth_item` DISABLE KEYS */;
REPLACE INTO `auth_item` (`name`, `type`, `description`, `rule_name`, `data`, `created_at`, `updated_at`) VALUES
	('Admin', 1, 'prototype editor', NULL, NULL, 1466528906, 1466695731),
	('app_site', 2, 'Main Site Controller', NULL, NULL, 1466528906, 1466528906),
	('backend_default', 2, 'Backend Dashboard', NULL, NULL, 1466528906, 1466528906),
	('Helper', 1, 'Volunteers taking cases', NULL, NULL, 1466695700, 1466695700),
	('pages', 2, 'Pages Module', NULL, NULL, 1466528905, 1466528905),
	('pages_default_page', 2, 'CMS-Page Action', NULL, NULL, 1466528907, 1466528907),
	('Public', 1, 'Unauthenticated User', NULL, NULL, 1466528906, 1466528906);
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
/*!40000 ALTER TABLE `auth_item_child` DISABLE KEYS */;
REPLACE INTO `auth_item_child` (`parent`, `child`) VALUES
	('Admin', 'app_site'),
	('Admin', 'backend_default'),
	('Admin', 'pages');
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
/*!40000 ALTER TABLE `auth_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rule` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.cases
DROP TABLE IF EXISTS `cases`;
CREATE TABLE IF NOT EXISTS `cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `id_outcome` int(11) DEFAULT NULL,
  `id_severity` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `state` bit(1) DEFAULT b'0',
  `comments` text CHARACTER SET latin1,
  PRIMARY KEY (`id`),
  KEY `id_contact` (`id_contact`),
  KEY `id_category` (`id_category`),
  KEY `id_outcome` (`id_outcome`),
  KEY `severity` (`id_severity`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `fk_category` FOREIGN KEY (`id_category`) REFERENCES `case_category` (`id`),
  CONSTRAINT `fk_contact` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`),
  CONSTRAINT `fk_outcome` FOREIGN KEY (`id_outcome`) REFERENCES `outcome_category` (`id`),
  CONSTRAINT `fk_severity` FOREIGN KEY (`id_severity`) REFERENCES `severity` (`id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.cases: ~4 rows (approximately)
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
REPLACE INTO `cases` (`id`, `id_contact`, `id_user`, `id_category`, `id_outcome`, `id_severity`, `start_date`, `close_date`, `state`, `comments`) VALUES
	(1, 1, 8, 3, 2, 1, '2016-07-05 14:54:22', '2016-07-05 14:54:24', NULL, 'Nada solo esto aguante peres caso'),
	(2, 1, 2, 1, 2, 2, NULL, NULL, b'1', 'bbbbbbbbbbbbb'),
	(3, 1, 2, 1, 2, 2, NULL, NULL, b'1', 'Estoy trabajando en este'),
	(4, 2, 2, 3, 2, 1, NULL, NULL, NULL, 'afasfasf');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.case_category
DROP TABLE IF EXISTS `case_category`;
CREATE TABLE IF NOT EXISTS `case_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_category` varchar(50) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.case_category: ~6 rows (approximately)
/*!40000 ALTER TABLE `case_category` DISABLE KEYS */;
REPLACE INTO `case_category` (`id`, `case_category`) VALUES
	(1, 'Eviction'),
	(2, 'Deportation'),
	(3, 'Detention'),
	(4, 'Information'),
	(5, 'Medical Related'),
	(6, 'Others');
/*!40000 ALTER TABLE `case_category` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.case_text
DROP TABLE IF EXISTS `case_text`;
CREATE TABLE IF NOT EXISTS `case_text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_text` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_case` (`id_case`),
  KEY `id_text` (`id_text`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.case_text: ~0 rows (approximately)
/*!40000 ALTER TABLE `case_text` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_text` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.contact
DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_country` int(11) DEFAULT NULL COMMENT 'Nationality',
  `id_language` int(11) DEFAULT NULL COMMENT 'First Language',
  `first_name` varchar(50) CHARACTER SET latin1 NOT NULL COMMENT 'Names',
  `last_name` varchar(50) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Surname',
  `gender` varchar(10) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Gender',
  `marital_status` varchar(10) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Marital Status',
  `birthday` date DEFAULT NULL COMMENT 'Birthday',
  `address_line1` varchar(50) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Address',
  `address_line2` varchar(50) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Address',
  `city` varchar(50) CHARACTER SET latin1 DEFAULT NULL COMMENT 'City',
  `state` varchar(50) CHARACTER SET latin1 DEFAULT NULL COMMENT 'County',
  `postal_code` varchar(15) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Postcode',
  `comments` varchar(100) CHARACTER SET latin1 DEFAULT NULL COMMENT 'Comments',
  PRIMARY KEY (`id`),
  KEY `id_country` (`id_country`),
  KEY `id_language` (`id_language`),
  CONSTRAINT `fk_country` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`),
  CONSTRAINT `fk_language` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.contact: ~2 rows (approximately)
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
REPLACE INTO `contact` (`id`, `id_country`, `id_language`, `first_name`, `last_name`, `gender`, `marital_status`, `birthday`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `comments`) VALUES
	(1, 3, NULL, 'Eduardo cliente', 'silva', 'M', 'Maried', '2016-06-27', 'afasf', 'asfasf', 'asfasf', 'asfasf', '234234', 'asfasdf'),
	(2, 6, NULL, 'tester2', 'asfasf', 'F', 'Maried', '2016-06-27', 'asfasf', 'asfasf', 'asfasf', '', '', 'asfasfasf');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.contact_phone
DROP TABLE IF EXISTS `contact_phone`;
CREATE TABLE IF NOT EXISTS `contact_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) NOT NULL DEFAULT '0' COMMENT 'Contact',
  `id_phone` varchar(15) CHARACTER SET latin1 NOT NULL DEFAULT '0' COMMENT 'Phone',
  PRIMARY KEY (`id`),
  KEY `id_phone` (`id_phone`),
  KEY `id_contact` (`id_contact`),
  CONSTRAINT `fk_contact_phone_id` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`),
  CONSTRAINT `fk_phone` FOREIGN KEY (`id_phone`) REFERENCES `phone` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.contact_phone: ~2 rows (approximately)
/*!40000 ALTER TABLE `contact_phone` DISABLE KEYS */;
REPLACE INTO `contact_phone` (`id`, `id_contact`, `id_phone`) VALUES
	(2, 1, '+447551524625'),
	(5, 1, '+447508849527');
/*!40000 ALTER TABLE `contact_phone` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code` varchar(2) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `country_name` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.country: ~245 rows (approximately)
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
REPLACE INTO `country` (`id`, `country_code`, `country_name`) VALUES
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
/*!40000 ALTER TABLE `dmstr_page` DISABLE KEYS */;
REPLACE INTO `dmstr_page` (`id`, `root`, `lft`, `rgt`, `lvl`, `page_title`, `name`, `domain_id`, `slug`, `route`, `view`, `default_meta_keywords`, `default_meta_description`, `request_params`, `owner`, `access_owner`, `access_domain`, `access_read`, `access_update`, `access_delete`, `icon`, `icon_type`, `active`, `selected`, `disabled`, `readonly`, `visible`, `collapsed`, `movable_u`, `movable_d`, `movable_l`, `movable_r`, `removable`, `removable_all`, `created_at`, `updated_at`) VALUES
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
/*!40000 ALTER TABLE `html` DISABLE KEYS */;
REPLACE INTO `html` (`id`, `key`, `value`) VALUES
	(2, 'footer', '<p>.</p>\r\n'),
	(4, 'about-us', '<p>esta seria about us</p>\r\n'),
	(6, 'en/site/index', ' <div class="navbar navbar-default navbar-static-top">\r\n      <div class="container">\r\n        <div class="navbar-header">\r\n          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".header-collapse">\r\n            <span class="sr-only">Toggle navigation</span>\r\n            <span class="icon-bar"></span>\r\n            <span class="icon-bar"></span>\r\n            <span class="icon-bar"></span>\r\n          </button>\r\n          <a class="navbar-brand" href="#">White Plum</a>\r\n        </div>\r\n        \r\n        <div class="collapse navbar-collapse header-collapse">\r\n          <ul class="nav navbar-nav">\r\n            <li class="dropdown">\r\n              <a href="#" class="dropdown-toggle" data-toggle="dropdown">CSS <span class="caret"></span></a>\r\n              <ul class="dropdown-menu">\r\n                <li><a href="#headings">Headings</a></li>\r\n                <li><a href="#content-formatting">Content</a></li>\r\n                <li><a href="#tables">Tables</a></li>\r\n                <li><a href="#forms">Forms</a></li>\r\n                <li><a href="#images">Images</a></li>\r\n              </ul>\r\n            </li>\r\n            <li class="dropdown">\r\n              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Components <span class="caret"></span></a>\r\n              <ul class="dropdown-menu">\r\n                <li><a href="#dropdowns">Dropdowns</a></li>\r\n                <li><a href="#input-groups">Input Groups</a></li>\r\n                <li><a href="#navs">Navs</a></li>\r\n                <li><a href="#navbar">Navbar</a></li>\r\n                <li><a href="#pagination">Pagination</a></li>\r\n                <li><a href="#alerts">Alerts</a></li>\r\n                <li><a href="#labels">Labels</a></li>\r\n                <li><a href="#progress">Progress</a></li>\r\n                <li><a href="#media-object">Media Object</a></li>\r\n                <li><a href="#list-groups">List Groups</a></li>\r\n                <li><a href="#panels">Panels</a></li>\r\n                <li><a href="#wells">Wells</a></li>\r\n              </ul>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class="container">\r\n      <div class="jumbotron">\r\n        <h3>Bootstrap Kitchen Sink</h3>\r\n        <p>A quick preview of everything Bootstrap has to offer.</p>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="headings">\r\n            <div class="panel-heading">Headings</div>\r\n            <div class="panel-body">\r\n            <h1 class="page-header">Page Header <small>With Small Text</small></h1>\r\n            <h1>This is an h1 heading</h1>\r\n            <h2>This is an h2 heading</h2>\r\n            <h3>This is an h3 heading</h3>\r\n            <h4>This is an h4 heading</h4>\r\n            <h5>This is an h5 heading</h5>\r\n            <h6>This is an h6 heading</h6>\r\n            </div>\r\n          </div>\r\n          <div class="panel panel-default" id="tables">\r\n            <div class="panel-heading">Tables\r\n            </div>\r\n            <div class="panel-body">\r\n            <table class="table table-hover">\r\n              <thead>\r\n                <tr>\r\n                  <th>#</th>\r\n                  <th>First Name</th>\r\n                  <th>Tables</th>\r\n                </tr>\r\n              </thead>\r\n              <tbody>\r\n                <tr>\r\n                  <td>1</td>\r\n                  <td>Michael</td>\r\n                  <td>Are formatted like this</td>\r\n                </tr>\r\n                <tr>\r\n                  <td>2</td>\r\n                  <td>Lucille</td>\r\n                  <td>Do you like them?</td>\r\n                </tr>\r\n                <tr class="success">\r\n                  <td>3</td>\r\n                  <td>Success</td>\r\n                  <td></td>\r\n                </tr>\r\n                <tr class="danger">\r\n                  <td>4</td>\r\n                  <td>Danger</td>\r\n                  <td></td>\r\n                </tr>\r\n                <tr class="warning">\r\n                  <td>5</td>\r\n                  <td>Warning</td>\r\n                  <td></td>\r\n                </tr>\r\n                <tr class="active">\r\n                  <td>6</td>\r\n                  <td>Active</td>\r\n                  <td></td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n            <table class="table table-striped table-bordered table-condensed">\r\n              <thead>\r\n                <tr>\r\n                  <th>#</th>\r\n                  <th>First Name</th>\r\n                  <th>Tables</th>\r\n                </tr>\r\n              </thead>\r\n              <tbody>\r\n                <tr>\r\n                  <td>1</td>\r\n                  <td>Michael</td>\r\n                  <td>This one is bordered and condensed</td>\r\n                </tr>\r\n                <tr>\r\n                  <td>2</td>\r\n                  <td>Lucille</td>\r\n                  <td>Do you still like it?</td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="content-formatting">\r\n            <div class="panel-heading">Content Formatting\r\n            </div>\r\n            <div class="panel-body">\r\n            <p class="lead">This is a lead paragraph.</p>\r\n            <p>This is an <b>ordinary paragraph</b> that is <i>long enough</i> to wrap to <u>multiple lines</u> so that you can see how the line spacing looks.</p>\r\n            <p class="text-muted">Muted color paragraph.</p>\r\n            <p class="text-warning">Warning color paragraph.</p>\r\n            <p class="text-danger">Danger color paragraph.</p>\r\n            <p class="text-info">Info color paragraph.</p>\r\n            <p class="text-success">Success color paragraph.</p>\r\n            <p><small>This is text in a <code>small</code> wrapper. <abbr title="No Big Deal">NBD</abbr>, right?</small></p>\r\n            <hr>\r\n            <address>                <strong>Twitter, Inc.</strong><br>                795 Folsom Ave, Suite 600<br>                San Francisco, CA 94107<br>                <abbr title="Phone">P:</abbr> (123) 456-7890              </address><address class="col-6">                <strong>Full Name</strong><br>                <a href="mailto:#">first.last@example.com</a>              </address>\r\n            <hr>\r\n            <blockquote>Here\'s what a blockquote looks like in Bootstrap. <small>Use <code>small</code> to identify the source.</small>\r\n            </blockquote>\r\n            <hr>\r\n            <div class="row">\r\n              <div class="col-xs-6">\r\n                <ul>\r\n                  <li>Normal Unordered List</li>\r\n                  <li>Can Also Work\r\n                    <ul>\r\n                      <li>With Nested Children</li>\r\n                    </ul>\r\n                  </li>\r\n                  <li>Adds Bullets to Page</li>\r\n                </ul>\r\n              </div>\r\n              <div class="col-xs-6">\r\n                <ol>\r\n                  <li>Normal Ordered List</li>\r\n                  <li>Can Also Work\r\n                    <ol>\r\n                      <li>With Nested Children</li>\r\n                    </ol>\r\n                  </li>\r\n                  <li>Adds Bullets to Page</li>\r\n                </ol>\r\n              </div>\r\n            </div>\r\n            <hr>\r\n            <pre>function preFormatting() {  // looks like this;  var something = somethingElse;  return true;}</pre>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="panel panel-default" id="forms">\r\n        <div class="panel-heading">Forms\r\n        </div>\r\n        <div class="panel-body">\r\n        <form>\r\n          <fieldset>\r\n            <legend>Legend</legend>\r\n            <div class="form-group">\r\n              <label for="exampleInputEmail">Email address</label>\r\n              <input type="text" class="form-control" id="exampleInputEmail" placeholder="Enter email">\r\n            </div>\r\n            <div class="form-group">\r\n              <label for="exampleInputPassword">Password</label>\r\n              <input type="password" class="form-control" id="exampleInputPassword" placeholder="Password">\r\n            </div>\r\n            <div class="form-group">\r\n              <label for="exampleInputFile">File input</label>\r\n              <input type="file" id="exampleInputFile">\r\n              <p class="help-block">Example block-level help text here.</p>\r\n            </div>\r\n            <div class="checkbox">\r\n              <label>\r\n                <input type="checkbox">Check me out</label>\r\n            </div>\r\n            <button type="submit" class="btn btn-default">Submit</button>\r\n          </fieldset>\r\n        </form>\r\n        <hr>\r\n        <form class="form-inline">\r\n          <input type="text" class="form-control" placeholder="Email" style="width: 200px;">\r\n          <input type="password" class="form-control" placeholder="Password" style="width: 200px;">\r\n          <div class="checkbox">\r\n            <label>\r\n              <input type="checkbox">Remember me</label>\r\n          </div>\r\n          <button type="submit" class="btn btn-default">Sign in</button>\r\n        </form>\r\n        <hr>\r\n        <form class="form-horizontal">\r\n          <div class="form-group">\r\n            <label for="inputEmail" class="col-lg-2 control-label">Email</label>\r\n            <div class="col-lg-10">\r\n              <input type="text" class="form-control" id="inputEmail" placeholder="Email">\r\n            </div>\r\n          </div>\r\n          <div class="form-group has-warning">\r\n            <label for="inputEmail" class="col-lg-2 control-label">Email</label>\r\n            <div class="col-lg-10">\r\n              <input type="text" class="form-control" id="inputEmail" placeholder="Email">\r\n            </div>\r\n          </div>\r\n          <div class="form-group has-error">\r\n            <label for="inputEmail" class="col-lg-2 control-label">Email</label>\r\n            <div class="col-lg-10">\r\n              <input type="text" class="form-control" id="inputEmail" placeholder="Email">\r\n            </div>\r\n          </div>\r\n          <div class="form-group has-success">\r\n            <label for="inputEmail" class="col-lg-2 control-label">Email</label>\r\n            <div class="col-lg-10">\r\n              <input type="text" class="form-control" id="inputEmail" placeholder="Email">\r\n            </div>\r\n          </div>\r\n          <div class="form-group">\r\n            <label for="inputPassword" class="col-lg-2 control-label">Password</label>\r\n            <div class="col-lg-10">\r\n              <input type="password" class="form-control" id="inputPassword" placeholder="Password">\r\n              <div class="checkbox">\r\n                <label>\r\n                  <input type="checkbox">Remember me</label>\r\n              </div>\r\n              <button type="submit" class="btn btn-default">Sign in</button>\r\n            </div>\r\n          </div>\r\n        </form>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-8">\r\n          <div class="panel panel-default" id="buttons">\r\n            <div class="panel-heading">Buttons\r\n            </div>\r\n            <div class="panel-body">\r\n              <p>\r\n                <button type="button" class="btn btn-lg btn-default">Default</button>\r\n                <button type="button" class="btn btn-lg btn-primary">Primary</button>\r\n                <button type="button" class="btn btn-lg btn-success">Success</button>\r\n                <button type="button" class="btn btn-lg btn-info">Info</button>\r\n                <button type="button" class="btn btn-lg btn-warning">Warning</button>\r\n                <button type="button" class="btn btn-lg btn-danger">Danger</button>\r\n                <button type="button" class="btn btn-lg btn-link">Link</button>\r\n              </p>\r\n              <p>\r\n                <button type="button" class="btn btn-default">Default</button>\r\n                <button type="button" class="btn btn-primary">Primary</button>\r\n                <button type="button" class="btn btn-success">Success</button>\r\n                <button type="button" class="btn btn-info">Info</button>\r\n                <button type="button" class="btn btn-warning">Warning</button>\r\n                <button type="button" class="btn btn-danger">Danger</button>\r\n                <button type="button" class="btn btn-link">Link</button>\r\n              </p>\r\n              <p>\r\n                <button type="button" class="btn btn-sm btn-default">Default</button>\r\n                <button type="button" class="btn btn-sm btn-primary">Primary</button>\r\n                <button type="button" class="btn btn-sm btn-success">Success</button>\r\n                <button type="button" class="btn btn-sm btn-info">Info</button>\r\n                <button type="button" class="btn btn-sm btn-warning">Warning</button>\r\n                <button type="button" class="btn btn-sm btn-danger">Danger</button>\r\n                <button type="button" class="btn btn-sm btn-link">Link</button>\r\n              </p>\r\n              <p>\r\n                <button type="button" class="btn btn-xs btn-default">Default</button>\r\n                <button type="button" class="btn btn-xs btn-primary">Primary</button>\r\n                <button type="button" class="btn btn-xs btn-success">Success</button>\r\n                <button type="button" class="btn btn-xs btn-info">Info</button>\r\n                <button type="button" class="btn btn-xs btn-warning">Warning</button>\r\n                <button type="button" class="btn btn-xs btn-danger">Danger</button>\r\n                <button type="button" class="btn btn-xs btn-link">Link</button>\r\n              </p>\r\n              <p>\r\n                <button type="button" class="btn btn-default"><span class="glyphicon glyphicon-star"></span> Glyphicons!</button>\r\n                <button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-edit"></span></button>\r\n                <button type="button" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span></button>\r\n                <button type="button" class="btn btn-info"><span class="glyphicon glyphicon-info-sign"></span></button>\r\n                <button type="button" class="btn btn-warning"><span class="glyphicon glyphicon-flash"></span></button>\r\n                <button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-ban-circle"></span></button>\r\n                <button type="button" class="btn btn-link"><span class="glyphicon glyphicon-arrow-right"></span></button>\r\n              </p>\r\n          </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-4">\r\n          <div class="panel panel-default" id="images">\r\n            <div class="panel-heading">Images\r\n            </div>\r\n            <div class="panel-body">\r\n            <p><img src="http://placehold.it/100x100" class="img-rounded">\r\n              <img src="http://placehold.it/100x100" class="img-circle">\r\n              <img src="http://placehold.it/100x100" class="img-thumbnail"></p>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-default" id="dropdowns">\r\n            <div class="panel-heading">Dropdowns\r\n            </div>\r\n            <div class="panel-body clearfix">\r\n            <div class="dropdown">\r\n              <!-- Link or button to toggle dropdown -->\r\n              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display: block; position: static;">\r\n                <li class="dropdown-header">Dropdown header</li>\r\n                <li class="disabled">\r\n                  <a tabindex="-1" href="#">Action</a>\r\n                </li>\r\n                <li>\r\n                  <a tabindex="-1" href="#">Another action</a>\r\n                </li>\r\n                <li>\r\n                  <a tabindex="-1" href="#">Something else here</a>\r\n                </li>\r\n                <li class="divider"></li>\r\n                <li>\r\n                  <a tabindex="-1" href="#">Separated link</a>\r\n                </li>\r\n              </ul>\r\n            </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-9">\r\n          <div class="panel panel-default" id="input-groups">\r\n            <div class="panel-heading">Input Groups\r\n            </div>\r\n            <div class="panel-body">\r\n            <div class="input-group">\r\n              <span class="input-group-btn">                <button class="btn btn-default" type="button">Go!</button>              </span><input type="text" class="form-control" placeholder="Username">\r\n            </div><br>\r\n            <div class="input-group">\r\n              <input type="text" class="form-control input-large">\r\n              <span class="input-group-addon input-large">.00</span>\r\n            </div><br>\r\n            <div class="input-group">\r\n              <span class="input-group-addon">$</span><input type="text" class="form-control">\r\n              <span class="input-group-addon">.00</span>\r\n            </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="navs">\r\n            <div class="panel-heading">Navs\r\n            </div>\r\n            <div class="panel-body clearfix">\r\n            <ul class="nav nav-tabs">\r\n              <li class="active">\r\n                <a href="#">Home</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">About</a>\r\n              </li>\r\n            </ul>\r\n            <p></p>\r\n            <p></p>\r\n            <ul class="nav nav-pills">\r\n              <li class="active">\r\n                <a href="#">Home</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">About</a>\r\n              </li>\r\n            </ul>\r\n            <p></p>\r\n            <p></p>\r\n            <ul class="nav nav-stacked nav-pills">\r\n              <li class="active">\r\n                <a href="#">Home</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">About</a>\r\n              </li>\r\n            </ul>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-6" id="navbar">\r\n          <div class="panel panel-default">\r\n            <div class="panel-heading">Navbar\r\n            </div>\r\n            <div class="panel-body">\r\n            <p></p>\r\n            <div class="navbar">\r\n              <div class="navbar-header">\r\n                <a href="#" class="navbar-brand">Your Company</a>\r\n              </div>\r\n              <div class="navbar-collapse">\r\n                <ul class="nav navbar-nav navbar-right">\r\n                  <li class="active">\r\n                    <a href="#">Home</a>\r\n                  </li>\r\n                  <li>\r\n                    <a href="#">About</a>\r\n                  </li>\r\n                  <li>\r\n                    <a href="#">Contact</a>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n            <div class="navbar navbar-inverse">\r\n              <div class="navbar-header">\r\n                <a href="#" class="navbar-brand">Your Company</a>\r\n              </div>\r\n              <div class="navbar-collapse">\r\n                <ul class="nav navbar-nav navbar-right">\r\n                  <li class="active">\r\n                    <a href="#">Home</a>\r\n                  </li>\r\n                  <li>\r\n                    <a href="#">About</a>\r\n                  </li>\r\n                  <li>\r\n                    <a href="#">Contact</a>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n            </div>\r\n            <div class="navbar">\r\n              <div class="collapse navbar-collapse">\r\n                <a class="btn btn-primary navbar-btn">Navbar Button</a>\r\n                <p class="navbar-text navbar-right">Navbar Text</p>\r\n              </div>\r\n            </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="pagination">\r\n            <div class="panel-heading">Pagination\r\n            </div>\r\n            <div class="panel-body">\r\n            <ul class="pagination" style="margin-right: 10px;">\r\n              <li>\r\n                <a href="#">Prev</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">1</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">2</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">3</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">4</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">Next</a>\r\n              </li>\r\n            </ul>\r\n            <ul class="pagination pagination-lg">\r\n              <li>\r\n                <a href="#">Prev</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">1</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">2</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">3</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">4</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">Next</a>\r\n              </li>\r\n            </ul>\r\n            <ul class="pager">\r\n              <li>\r\n                <a href="#">Prev</a>\r\n              </li>\r\n              <li>\r\n                <a href="#">Next</a>\r\n              </li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n          <div class="panel panel-default" id="labels">\r\n            <div class="panel-heading">Labels and Badges\r\n            </div>\r\n            <div class="panel-body">\r\n            <h3><span class="label label-default">Default</span>&nbsp;<span class="label label-success">Success</span>&nbsp;<span class="label label-warning">Warning</span>&nbsp;<span class="label label-danger">Danger</span>&nbsp;<span class="label label-info">Info</span></h3>\r\n            <p class="lead"><a href="#">Inbox <span class="badge">42</span></a></p>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="alerts">\r\n            <div class="panel-heading">Alerts\r\n            </div>\r\n            <div class="panel-body">\r\n            <div>\r\n              <div class="alert alert-danger">\r\n                <button type="button" class="close" data-dismiss="alert">&times;</button>\r\n                <strong>Oh snap!</strong> <a href="#" class="alert-link">Change a few things up</a> and try submitting again.\r\n              </div>\r\n              <div class="alert alert-success">\r\n                <button type="button" class="close" data-dismiss="alert">&times;</button>\r\n                <strong>Well done!</strong> You successfully read <a href="#" class="alert-link">this important alert message</a>.\r\n              </div>\r\n              <div class="alert alert-warning">\r\n                <button type="button" class="close" data-dismiss="alert">&times;</button>\r\n                <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it\'s not super important.\r\n              </div>\r\n              <div class="alert alert-info">\r\n                <button type="button" class="close" data-dismiss="alert">&times;</button>\r\n                <strong>Heads up!</strong> This <a href="#" class="alert-link">alert needs your attention</a>, but it\'s not super important.\r\n              </div>\r\n              <div class="alert">\r\n                <button type="button" class="close" data-dismiss="alert">&times;</button>\r\n                <h4>Warning!</h4>\r\n                <p>This is a block style alert.</p>\r\n              </div>\r\n            </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="progress">\r\n            <div class="panel-heading">Progress Bars\r\n            </div>\r\n            <div class="panel-body">\r\n              <div class="progress">\r\n                <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;"><span class="sr-only">60% Complete</span></div>\r\n              </div>\r\n              <div class="progress">\r\n                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%"><span class="sr-only">40% Complete (success)</span></div>\r\n              </div>\r\n              <div class="progress">\r\n                <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%"><span class="sr-only">20% Complete</span></div>\r\n              </div>\r\n              <div class="progress">\r\n                <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%"><span class="sr-only">60% Complete (warning)</span></div>\r\n              </div>\r\n              <div class="progress">\r\n                <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%"><span class="sr-only">80% Complete (danger)</span></div>\r\n              </div>\r\n              <div class="progress">\r\n                <div class="progress-bar progress-bar-success" style="width: 35%"><span class="sr-only">35% Complete (success)</span></div>\r\n                <div class="progress-bar progress-bar-warning" style="width: 20%"><span class="sr-only">20% Complete (warning)</span></div>\r\n                <div class="progress-bar progress-bar-danger" style="width: 10%"><span class=\'sr-only\'>10% Complete (danger)</span></div>\r\n              </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-6">\r\n          <div class="panel panel-default" id="media-object">\r\n            <div class="panel-heading">Media Object\r\n            </div>\r\n            <div class="panel-body">\r\n            <p></p>\r\n            <div class="media">\r\n              <a class="pull-left" href="#">    <img class="media-object" src="https://app.divshot.com/img/placeholder-64x64.gif">  </a>\r\n              <div class="media-body">\r\n                <h4 class="media-heading">Media heading</h4>\r\n                <p>This is the content for your media.</p>\r\n                <div class="media">\r\n                  <a class="pull-left" href="#">    <img class="media-object" src="https://app.divshot.com/img/placeholder-64x64.gif">  </a>\r\n                  <div class="media-body">\r\n                    <h4 class="media-heading">Media heading</h4>\r\n                    <p>This is the content for your media.</p>\r\n                  </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-4">\r\n          <ul class="list-group">\r\n            <li class="list-group-item">Cras justo odio</li>\r\n            <li class="list-group-item">Dapibus ac facilisis in</li>\r\n            <li class="list-group-item">Morbi leo risus</li>\r\n            <li class="list-group-item">Porta ac consectetur ac</li>\r\n            <li class="list-group-item">Vestibulum at eros</li>\r\n          </ul>\r\n        </div>\r\n        <div class="col-lg-4">\r\n          <div class="list-group">\r\n            <a href="#" class="list-group-item active">          Cras justo odio        </a><a href="#" class="list-group-item">Dapibus ac facilisis in        </a><a href="#" class="list-group-item">Morbi leo risus        </a><a href="#" class="list-group-item">Porta ac consectetur ac        </a><a href="#" class="list-group-item">Vestibulum at eros        </a>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-4">\r\n          <div class="list-group">\r\n            <a href="#" class="list-group-item active">          <h4 class="list-group-item-heading">List group item heading</h4>          <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>        </a><a href="#" class="list-group-item">          <h4 class="list-group-item-heading">List group item heading</h4>          <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>        </a><a href="#" class="list-group-item">          <h4 class="list-group-item-heading">List group item heading</h4>          <p class="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>        </a>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-primary" id="panels">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <p class="panel-body">This is a panel</p>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-success">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <div class="panel-body">This is a panel</div>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-danger">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <div class="panel-body">This is a panel</div>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-warning">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <div class="panel-body">This is a panel</div>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class="row">\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-info">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <p class="panel-body">This is a panel</p>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="panel panel-default">\r\n            <div class="panel-heading">This is a header\r\n            </div>\r\n            <div class="panel-body">This is a panel</div>\r\n            <ul class="list-group list-group-flush">\r\n              <li class="list-group-item">First Item</li>\r\n              <li class="list-group-item">Second Item</li>\r\n              <li class="list-group-item">Third Item</li>\r\n            </ul>\r\n            <div class="panel-footer">This is a footer\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="well" id="wells">Default Well\r\n          </div>\r\n          <div class="well well-small">Small Well\r\n          </div>\r\n        </div>\r\n        <div class="col-lg-3">\r\n          <div class="well well-large">Large Padding Well\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>');
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
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
REPLACE INTO `language` (`language_id`, `language`, `country`, `name`, `name_ascii`, `status`) VALUES
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
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
REPLACE INTO `languages` (`id`, `language`, `short_name`) VALUES
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
/*!40000 ALTER TABLE `less` DISABLE KEYS */;
/*!40000 ALTER TABLE `less` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.migration
DROP TABLE IF EXISTS `migration`;
CREATE TABLE IF NOT EXISTS `migration` (
  `version` varchar(180) NOT NULL,
  `alias` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table helptext_dev.migration: ~22 rows (approximately)
/*!40000 ALTER TABLE `migration` DISABLE KEYS */;
REPLACE INTO `migration` (`version`, `alias`, `apply_time`) VALUES
	('m000000_000000_base', '@app/migrations', 1425651576),
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
	('m150917_193929_rbac', '@app/migrations', 1466528907),
	('m150918_031100_auth_items', '@vendor/dmstr/yii2-pages-module/migrations', 1466528907),
	('m151020_213100_update_profile_table', '@vendor/cinghie/yii2-user-extended/migrations', 1466756758),
	('m151126_091910_add_unique_index', '@vendor/pheme/yii2-settings/migrations', 1466528907),
	('m151226_111407_init', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466528909),
	('m160411_082658_rename_name_id_column', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160411_111111_name_id_to_domain_id_renamer', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160504_032335_add_twig_table', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466617681),
	('m160623_153352_add_new_field_to_user', '@app/migrations', 1466697998),
	('m160623_164857_add_fields_to_profile', '@app/migrations', 1466700598);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.outcome_category
DROP TABLE IF EXISTS `outcome_category`;
CREATE TABLE IF NOT EXISTS `outcome_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outcome` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.outcome_category: ~2 rows (approximately)
/*!40000 ALTER TABLE `outcome_category` DISABLE KEYS */;
REPLACE INTO `outcome_category` (`id`, `outcome`) VALUES
	(1, 'Resolved'),
	(2, 'Refered'),
	(3, 'N/A');
/*!40000 ALTER TABLE `outcome_category` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.phone
DROP TABLE IF EXISTS `phone`;
CREATE TABLE IF NOT EXISTS `phone` (
  `id` varchar(15) CHARACTER SET latin1 NOT NULL,
  `comment` varchar(200) CHARACTER SET latin1 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.phone: ~2 rows (approximately)
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
REPLACE INTO `phone` (`id`, `comment`) VALUES
	('+447508849527', 'otro mio de ee'),
	('+447551524625', 'este es el mio normal vodaphone');
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.profile
DROP TABLE IF EXISTS `profile`;
CREATE TABLE IF NOT EXISTS `profile` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `public_email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `gravatar_email` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `gravatar_id` varchar(32) CHARACTER SET utf8 DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `website` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `bio` text CHARACTER SET utf8,
  `id_country` int(11) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT NULL,
  `skills` text CHARACTER SET utf8,
  `firstname` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `lastname` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `birthday` date NOT NULL,
  `avatar` varchar(255) CHARACTER SET utf8 NOT NULL,
  `terms` tinyint(1) NOT NULL DEFAULT '0',
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_profile` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table helptext_dev.profile: ~8 rows (approximately)
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
REPLACE INTO `profile` (`user_id`, `name`, `public_email`, `gravatar_email`, `gravatar_id`, `location`, `website`, `bio`, `id_country`, `availability`, `skills`, `firstname`, `lastname`, `birthday`, `avatar`, `terms`, `phone`) VALUES
	(1, '', '', 'info@open-ecommerce.org', 'e49de8ff6009a963195568839177e24d', '', '', '', 1, 1, 'nada', 'adminname', 'adminsuraname', '1966-07-16', '', 0, NULL),
	(2, 'Eduardo Silva', 'eduardo@open-ecommerce.org', 'eduardo@open-ecommerce.org', '1f6df2c9dac05c886ac3f90e692f93af', 'London', 'http://www.open-ecommerce.org', 'Esto solo lo que quiero decir de mi', 16, 0, 'eduardo adfasf', 'Helper Eduardo', 'Silva', '2016-06-17', '', 0, '+447508849527'),
	(3, NULL, '', '', 'd41d8cd98f00b204e9800998ecf8427e', '', '', '', 1, 1, 'esto', 'Tester1', 'ApellidoTester', '2016-07-13', '', 0, NULL),
	(4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Nada', 'Pepe', 'Marqueta', '0000-00-00', '', 0, NULL),
	(5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Juan', 'Pitufo', '0000-00-00', '', 0, NULL),
	(6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Jackson', 'Brown', '0000-00-00', '', 0, NULL),
	(7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pepito', 'cuevas', '0000-00-00', '', 0, NULL),
	(8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'pepe', 'Biondi', '0000-00-00', '', 0, NULL);
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.sender_type
DROP TABLE IF EXISTS `sender_type`;
CREATE TABLE IF NOT EXISTS `sender_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_type` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.sender_type: ~2 rows (approximately)
/*!40000 ALTER TABLE `sender_type` DISABLE KEYS */;
REPLACE INTO `sender_type` (`id`, `sender_type`) VALUES
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
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
REPLACE INTO `settings` (`id`, `type`, `section`, `key`, `value`, `active`, `created`, `modified`) VALUES
	(1, 'boolean', 'app.assets', 'registerPrototypeAsset', '1', 0, '2016-06-22 09:34:27', '2016-06-22 09:34:27');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.severity
DROP TABLE IF EXISTS `severity`;
CREATE TABLE IF NOT EXISTS `severity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `severity` varchar(50) NOT NULL COMMENT 'Severity',
  `sla` text NOT NULL COMMENT 'Sevice Level Agreement',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.severity: ~0 rows (approximately)
/*!40000 ALTER TABLE `severity` DISABLE KEYS */;
REPLACE INTO `severity` (`id`, `severity`, `sla`) VALUES
	(1, 'Severity 1', 'Contact the client within 24hs'),
	(2, 'Severity 2', 'about severity 2');
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
/*!40000 ALTER TABLE `social_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_account` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.text
DROP TABLE IF EXISTS `text`;
CREATE TABLE IF NOT EXISTS `text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phone` varchar(15) NOT NULL DEFAULT '0',
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_sender_type` int(11) NOT NULL DEFAULT '0',
  `message` varchar(50) NOT NULL DEFAULT '0',
  `sent` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `id_phone` (`id_phone`),
  KEY `id_case` (`id_case`),
  KEY `id_sender_type` (`id_sender_type`),
  CONSTRAINT `fk_case` FOREIGN KEY (`id_case`) REFERENCES `cases` (`id`),
  CONSTRAINT `fk_sender_type` FOREIGN KEY (`id_sender_type`) REFERENCES `sender_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.text: ~3 rows (approximately)
/*!40000 ALTER TABLE `text` DISABLE KEYS */;
REPLACE INTO `text` (`id`, `id_phone`, `id_case`, `id_sender_type`, `message`, `sent`) VALUES
	(1, '+447551524625', 1, 2, 'nada', '0000-00-00 00:00:00'),
	(2, '+447551524625', 1, 2, 'nada', '0000-00-00 00:00:00'),
	(5, '+447508849527', 1, 1, 'aaaaaaaaaaaaa rrrrrr', '0000-00-00 00:00:00');
/*!40000 ALTER TABLE `text` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.text_template
DROP TABLE IF EXISTS `text_template`;
CREATE TABLE IF NOT EXISTS `text_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `message` varchar(200) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table helptext_dev.text_template: ~2 rows (approximately)
/*!40000 ALTER TABLE `text_template` DISABLE KEYS */;
REPLACE INTO `text_template` (`id`, `name`, `message`) VALUES
	(1, '001 generic helper answering', 'This is an authomatic response from NNLS. We will contact you as soon we can.'),
	(2, '002 generic helper not-answering', 'This is an authomatic response from NNLS. We will contact you as soon a helper is available.');
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
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
REPLACE INTO `token` (`user_id`, `code`, `created_at`, `type`) VALUES
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
/*!40000 ALTER TABLE `twig` DISABLE KEYS */;
/*!40000 ALTER TABLE `twig` ENABLE KEYS */;


-- Dumping structure for table helptext_dev.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(60) NOT NULL,
  `auth_key` varchar(32) NOT NULL,
  `confirmed_at` int(11) DEFAULT NULL,
  `unconfirmed_email` varchar(255) DEFAULT NULL,
  `blocked_at` int(11) DEFAULT NULL,
  `registration_ip` varchar(45) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  `flags` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique_email` (`email`),
  UNIQUE KEY `user_unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Dumping data for table helptext_dev.user: ~8 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
REPLACE INTO `user` (`id`, `username`, `email`, `password_hash`, `auth_key`, `confirmed_at`, `unconfirmed_email`, `blocked_at`, `registration_ip`, `created_at`, `updated_at`, `flags`) VALUES
	(1, 'admin', 'info@open-ecommerce.org', '$2y$10$pF12T5IRobdd/OevEABPxOnWhCq0/sOZaHQosPlE9IKIaAqT8wbfG', 'L4DEoxYf4R9C3ZvHP8uBzwcSbq5vo5mP', 1466528922, NULL, NULL, NULL, 1425651628, 1466588159, 0),
	(2, 'helper', 'eduardo@open-ecommerce.org', '$2y$10$qLQCwG1K1zMvEUJjMhhKwOhigP6WH4qjhZsf/EMJc4OtR/7b.0DQ2', 'uqe7SH5MKQYWpHUe7Mn42svnEmWkuVCI', 1425651715, NULL, NULL, '192.168.1.74', 1425651715, 1468426763, 0),
	(3, 'Tester1', 'tester1@open-ecommerce.org', '$2y$10$Z7bPvb4BRJf6CQJ/tL8vOOJssrJLlcFyLF9ZkC.74LXq6Tj5NGZji', 'zlUuQlMHPdSM-wTTlPkzhe3jvnoFJkBX', 1466680707, NULL, NULL, '127.0.0.1', 1466680022, 1466680022, 0),
	(4, 'mariano', 'mariano@open-ecommerce.org', '$2y$10$lxmIAPinglkzrcFfyj/DQ.l5JbfXphXb44YelwqSkiTLeKOBdiKEW', 'YZ0hyKV6Je2_2DO3mp-JeUFMO5WI-hZN', 1466680738, NULL, NULL, '192.168.1.74', 1466680738, 1466680738, 0),
	(5, 'aguien', 'tester2@algo.com', '$2y$10$Sla0IaYXAHdyrY.mLE1xfufgO7frV6U.Rodw1o5/XgBab4pdP6Kva', 'DG1ZZKMgydtwVXMjYrMXKFkV7ne-SJw_', 1466695513, NULL, NULL, '192.168.1.74', 1466695513, 1466695513, 0),
	(6, 'cacho1', 'cacho@cacho.com', '$2y$10$hmbMzLJsgA1DhkbSQyOuj.HZcEqWGrKYq0y8ohpUNt7AegY8YIc32', 'RoqqXH4h5NUYSXlXJZRqBK6gB3MGgG7_', 1466758216, NULL, NULL, '192.168.1.74', 1466758216, 1466758216, 0),
	(7, 'tester3@open-ecommerce.org', 'tester3@open-ecommerce.org', '$2y$10$Zl7xEiSCYBeDa4kRn1ldWeKpyV0HMWl93IRQd9hWsaLdPRzUuMaDu', 'Q_Rn636doTi3ue2-dMFuJ2coLfqlR4CG', 1467980744, NULL, NULL, '127.0.0.1', 1467980720, 1467980720, 0),
	(8, 'tester4', 'tester4@open-ecommerce.org', '$2y$10$11fIiKaiQqp/thlCNmKXv.hd9NX4p6/eIisTotolxH1QmAT.BoJAq', 'XZNX5JKdcV6RZElK0DMsODjBQeexYnDf', NULL, NULL, NULL, '192.168.1.74', 1467980966, 1467980966, 0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
