-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.17-0ubuntu0.16.04.1 - (Ubuntu)
-- Server OS:                    Linux
-- HeidiSQL Version:             8.1.0.4571
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table chitchat_dev.auth_assignment
DROP TABLE IF EXISTS `auth_assignment`;
CREATE TABLE IF NOT EXISTS `auth_assignment` (
  `item_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.auth_assignment: ~7 rows (approximately)
DELETE FROM `auth_assignment`;
/*!40000 ALTER TABLE `auth_assignment` DISABLE KEYS */;
INSERT INTO `auth_assignment` (`item_name`, `user_id`, `created_at`) VALUES
	('Admin', '11', 1471860649),
	('Helper', '10', 1471010198),
	('Helper', '2', 1468426789),
	('Helper', '4', 1470212978),
	('Helper', '9', 1470213047),
	('Supervisor', '11', 1471860649),
	('Supervisor', '3', 1469548186);
/*!40000 ALTER TABLE `auth_assignment` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.auth_item
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

-- Dumping data for table chitchat_dev.auth_item: ~10 rows (approximately)
DELETE FROM `auth_item`;
/*!40000 ALTER TABLE `auth_item` DISABLE KEYS */;
INSERT INTO `auth_item` (`name`, `type`, `description`, `rule_name`, `data`, `created_at`, `updated_at`) VALUES
	('Admin', 1, 'prototype editor', NULL, NULL, 1466528906, 1466695731),
	('app_site', 2, 'Main Site Controller', NULL, NULL, 1466528906, 1466528906),
	('backend_default', 2, 'Backend Dashboard', NULL, NULL, 1466528906, 1466528906),
	('Helper', 1, 'Volunteers taking cases', NULL, NULL, 1466695700, 1469808285),
	('pages', 2, 'Pages Module', NULL, NULL, 1466528905, 1466528905),
	('pages_default_page', 2, 'CMS-Page Action', NULL, NULL, 1466528907, 1466528907),
	('Public', 1, 'Unauthenticated User', NULL, NULL, 1466528906, 1466528906),
	('Supervisor', 1, 'Access utilities', NULL, NULL, 1469547852, 1469808336),
	('view_mnu_reports', 2, 'Can view menu reports', NULL, NULL, 1469549640, 1469549640),
	('view_mnu_utilities', 2, 'Can view menu utilities', NULL, NULL, 1469549529, 1469549529);
/*!40000 ALTER TABLE `auth_item` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.auth_item_child
DROP TABLE IF EXISTS `auth_item_child`;
CREATE TABLE IF NOT EXISTS `auth_item_child` (
  `parent` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `child` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.auth_item_child: ~6 rows (approximately)
DELETE FROM `auth_item_child`;
/*!40000 ALTER TABLE `auth_item_child` DISABLE KEYS */;
INSERT INTO `auth_item_child` (`parent`, `child`) VALUES
	('Admin', 'app_site'),
	('Admin', 'backend_default'),
	('Helper', 'backend_default'),
	('Admin', 'pages'),
	('Supervisor', 'view_mnu_reports'),
	('Supervisor', 'view_mnu_utilities');
/*!40000 ALTER TABLE `auth_item_child` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.auth_rule
DROP TABLE IF EXISTS `auth_rule`;
CREATE TABLE IF NOT EXISTS `auth_rule` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.auth_rule: ~0 rows (approximately)
DELETE FROM `auth_rule`;
/*!40000 ALTER TABLE `auth_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rule` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.cases
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
  CONSTRAINT `fk_contact` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.cases: ~3 rows (approximately)
DELETE FROM `cases`;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
INSERT INTO `cases` (`id`, `id_contact`, `id_phone`, `id_user`, `id_category`, `id_outcome`, `id_severity`, `start_date`, `close_date`, `state`, `comments`) VALUES
	(5, 5, '+442082025907', 9, 5, 2, 1, '2016-08-15 17:16:29', NULL, b'1', '15 years old boy. Suspected depression. \r\nReferred to counsellor'),
	(9, 9, '+447399992578', 2, 6, 3, NULL, '2016-12-10 10:35:12', NULL, b'1', 'Child 12 years old not opening up to parent'),
	(10, 11, '+6827705175', 9, NULL, NULL, NULL, '2017-02-27 15:49:36', NULL, b'1', 'New case to review');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.case_category
DROP TABLE IF EXISTS `case_category`;
CREATE TABLE IF NOT EXISTS `case_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_category` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.case_category: ~5 rows (approximately)
DELETE FROM `case_category`;
/*!40000 ALTER TABLE `case_category` DISABLE KEYS */;
INSERT INTO `case_category` (`id`, `case_category`) VALUES
	(2, 'Sexual Activity'),
	(3, 'Sexual Relationship'),
	(4, 'Family Relationship'),
	(5, 'Birth Control'),
	(6, 'Other');
/*!40000 ALTER TABLE `case_category` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.configuration
DROP TABLE IF EXISTS `configuration`;
CREATE TABLE IF NOT EXISTS `configuration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ContactLabel` varchar(20) DEFAULT 'Client',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='helptext configuration system';

-- Dumping data for table chitchat_dev.configuration: ~0 rows (approximately)
DELETE FROM `configuration`;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.contact
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
  CONSTRAINT `fk_country_9163_05` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_languages_9164_06` FOREIGN KEY (`id_language`) REFERENCES `languages` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.contact: ~11 rows (approximately)
DELETE FROM `contact`;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` (`id`, `id_country`, `id_language`, `first_name`, `last_name`, `gender`, `marital_status`, `birthday`, `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `comments`) VALUES
	(2, 182, NULL, 'Alex', 'Norwood', 'F', 'Single', NULL, '', '', '', '', '', ''),
	(3, 229, NULL, 'Louise', 'Smith', 'F', 'Single', NULL, '', '', '', '', '', ''),
	(4, 1, NULL, 'Not assigned', '', '', '', NULL, '', '', '', '', '', ''),
	(5, 104, NULL, 'Stephen', 'Simpson', 'M', 'Single', NULL, '', '', '', '', '', ''),
	(6, NULL, NULL, 'Name not set', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(7, NULL, NULL, 'Not Assigned (+447754853203)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(8, NULL, NULL, 'Not Assigned (+447795822267)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(9, NULL, NULL, 'Not Assigned (+447399992578)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(10, NULL, NULL, 'Not Assigned (+9752350942)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(11, NULL, NULL, 'Not Assigned (+6827705175)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(12, NULL, NULL, 'Not Assigned (+3088707158)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.contact_phone
DROP TABLE IF EXISTS `contact_phone`;
CREATE TABLE IF NOT EXISTS `contact_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) NOT NULL DEFAULT '0',
  `id_phone` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_id_phone_9198_08` (`id_phone`),
  KEY `idx_id_contact_9198_09` (`id_contact`),
  CONSTRAINT `fk_contact_9194_07` FOREIGN KEY (`id_contact`) REFERENCES `contact` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_phone_9194_08` FOREIGN KEY (`id_phone`) REFERENCES `phone` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.contact_phone: ~11 rows (approximately)
DELETE FROM `contact_phone`;
/*!40000 ALTER TABLE `contact_phone` DISABLE KEYS */;
INSERT INTO `contact_phone` (`id`, `id_contact`, `id_phone`) VALUES
	(2, 2, '+442037319073'),
	(3, 3, '+447775964180'),
	(4, 4, '+1521318790'),
	(5, 5, '+442082025907'),
	(6, 6, '+447508849527'),
	(7, 7, '+447754853203'),
	(8, 8, '+447795822267'),
	(9, 9, '+447399992578'),
	(10, 10, '+9752350942'),
	(11, 11, '+6827705175'),
	(12, 12, '+3088707158');
/*!40000 ALTER TABLE `contact_phone` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.country
DROP TABLE IF EXISTS `country`;
CREATE TABLE IF NOT EXISTS `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code` varchar(2) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `country_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.country: ~245 rows (approximately)
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


-- Dumping structure for table chitchat_dev.dmstr_page
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.dmstr_page: ~0 rows (approximately)
DELETE FROM `dmstr_page`;
/*!40000 ALTER TABLE `dmstr_page` DISABLE KEYS */;
/*!40000 ALTER TABLE `dmstr_page` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.html
DROP TABLE IF EXISTS `html`;
CREATE TABLE IF NOT EXISTS `html` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `html_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.html: ~0 rows (approximately)
DELETE FROM `html`;
/*!40000 ALTER TABLE `html` DISABLE KEYS */;
/*!40000 ALTER TABLE `html` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.language
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

-- Dumping data for table chitchat_dev.language: ~78 rows (approximately)
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


-- Dumping structure for table chitchat_dev.languages
DROP TABLE IF EXISTS `languages`;
CREATE TABLE IF NOT EXISTS `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` mediumtext CHARACTER SET utf8 NOT NULL,
  `short_name` mediumtext CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;

-- Dumping data for table chitchat_dev.languages: ~108 rows (approximately)
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


-- Dumping structure for table chitchat_dev.language_source
DROP TABLE IF EXISTS `language_source`;
CREATE TABLE IF NOT EXISTS `language_source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.language_source: ~0 rows (approximately)
DELETE FROM `language_source`;
/*!40000 ALTER TABLE `language_source` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_source` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.language_translate
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

-- Dumping data for table chitchat_dev.language_translate: ~0 rows (approximately)
DELETE FROM `language_translate`;
/*!40000 ALTER TABLE `language_translate` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_translate` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.less
DROP TABLE IF EXISTS `less`;
CREATE TABLE IF NOT EXISTS `less` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `less_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.less: ~0 rows (approximately)
DELETE FROM `less`;
/*!40000 ALTER TABLE `less` DISABLE KEYS */;
/*!40000 ALTER TABLE `less` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.message
DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phone` varchar(15) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_user` int(11) DEFAULT NULL,
  `id_sender_type` int(11) DEFAULT '0',
  `id_message_type` int(11) DEFAULT NULL,
  `message` varchar(160) COLLATE utf8_unicode_ci DEFAULT '0',
  `sent` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sid` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_id_phone_9401_10` (`id_phone`),
  KEY `idx_id_case_9401_11` (`id_case`),
  KEY `idx_id_message_type_9401_13` (`id_message_type`),
  KEY `id_sender_type` (`id_sender_type`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `fk_cases_9396_09` FOREIGN KEY (`id_case`) REFERENCES `cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `profile` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_type_9396_010` FOREIGN KEY (`id_message_type`) REFERENCES `message_type` (`id`) ON DELETE NO ACTION,
  CONSTRAINT `fk_sender_type` FOREIGN KEY (`id_sender_type`) REFERENCES `sender_type` (`id`) ON DELETE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.message: ~22 rows (approximately)
DELETE FROM `message`;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` (`id`, `id_phone`, `id_case`, `id_user`, `id_sender_type`, `id_message_type`, `message`, `sent`, `sid`) VALUES
	(42, '+447399992578', 9, 9, 2, NULL, 'Is this normal?', '2016-12-10 11:59:44', NULL),
	(43, '+447399992578', 9, 9, 2, NULL, 'My child is been bullied how can i help him?', '2016-12-12 11:40:49', NULL),
	(44, '+447399992578', 9, 9, 2, NULL, 'He is 10 and some kids are picking on him ', '2016-12-12 11:47:53', NULL),
	(47, '+447399992578', 9, 9, 2, NULL, 'Yes', '2016-12-12 11:51:45', NULL),
	(52, '+6827705175', 10, 9, 2, 2, 'Por favor ayuda', '2017-02-27 15:49:36', NULL),
	(54, '+447399992578', 9, 9, 2, NULL, 'Ayuda por ravor', '2017-02-28 08:33:11', NULL),
	(55, '+447399992578', 9, 9, 2, NULL, 'Necesito condoms', '2017-02-28 08:33:53', NULL),
	(56, '+447399992578', 9, 9, 2, NULL, 'Hay alguien ahi?', '2017-02-28 08:54:56', NULL),
	(57, '+447399992578', 9, 9, 2, NULL, 'Hi there where do i get condoms', '2017-02-28 09:11:58', NULL),
	(62, '+447399992578', 9, 4, 2, NULL, 'Hi is there somebody there?', '2017-02-28 14:28:30', NULL),
	(63, '+447904591137', 9, 4, 3, 2, 'Case#9# hola manu', '2017-02-28 14:30:50', NULL),
	(64, '+447399992578', 9, 4, 2, NULL, 'Can you help?', '2017-02-28 14:38:09', NULL),
	(65, '+447904591137', 9, 4, 3, 2, 'Case#9# im here with the helping hand', '2017-02-28 14:39:16', NULL),
	(71, '+447399992578', 9, 9, 2, NULL, 'Hi there, i am still waiting!', '2017-03-01 11:01:39', NULL),
	(72, '+4475515246251', 9, 1, 3, 2, 'case#9# Here is a list of hospitals', '2017-03-01 11:03:09', NULL),
	(76, '+4475515246251', 9, 1, 3, 2, 'case#9# Estamos en camino', '2017-03-14 19:33:04', NULL),
	(77, '+4475515246251', 9, 1, 3, 2, 'case#9# Estamos en camino', '2017-03-14 19:34:00', NULL),
	(78, '+4475515246251', 9, 1, 3, 2, 'case#9# ya mismo', '2017-03-14 19:34:38', NULL),
	(79, '+4475515246251', 9, 1, 3, 2, 'case#9# ya mismo', '2017-03-14 19:37:45', NULL),
	(80, '+4475515246251', 9, 1, 3, 2, 'case#9# a ver papa si me ayudas', '2017-03-14 19:55:32', NULL),
	(81, '+4475515246251', 9, 1, 3, 2, 'case#9# vamos macalla', '2017-03-15 12:38:38', NULL),
	(82, '+4475515246251', 9, 1, 3, 2, 'case#9# vamos macalla', '2017-03-15 12:41:20', NULL);
/*!40000 ALTER TABLE `message` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.message_type
DROP TABLE IF EXISTS `message_type`;
CREATE TABLE IF NOT EXISTS `message_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.message_type: ~2 rows (approximately)
DELETE FROM `message_type`;
/*!40000 ALTER TABLE `message_type` DISABLE KEYS */;
INSERT INTO `message_type` (`id`, `type`) VALUES
	(1, 'phone'),
	(2, 'sms');
/*!40000 ALTER TABLE `message_type` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.migration
DROP TABLE IF EXISTS `migration`;
CREATE TABLE IF NOT EXISTS `migration` (
  `version` varchar(180) NOT NULL,
  `alias` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table chitchat_dev.migration: ~22 rows (approximately)
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
	('m151218_234654_add_timezone_to_profile', '@dektrium/user/migrations', 1489007320),
	('m151226_111407_init', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466528909),
	('m160411_082658_rename_name_id_column', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160411_111111_name_id_to_domain_id_renamer', '@vendor/dmstr/yii2-pages-module/migrations', 1466528909),
	('m160504_032335_add_twig_table', '@vendor/dmstr/yii2-prototype-module/src/migrations', 1466617681),
	('m160929_103127_add_last_login_at_to_user_table', '@dektrium/user/migrations', 1489007321);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.outcome_category
DROP TABLE IF EXISTS `outcome_category`;
CREATE TABLE IF NOT EXISTS `outcome_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outcome` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.outcome_category: ~3 rows (approximately)
DELETE FROM `outcome_category`;
/*!40000 ALTER TABLE `outcome_category` DISABLE KEYS */;
INSERT INTO `outcome_category` (`id`, `outcome`) VALUES
	(1, 'Resolved'),
	(2, 'Referred'),
	(3, 'In Progress');
/*!40000 ALTER TABLE `outcome_category` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.phone
DROP TABLE IF EXISTS `phone`;
CREATE TABLE IF NOT EXISTS `phone` (
  `id` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `comment` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.phone: ~11 rows (approximately)
DELETE FROM `phone`;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
INSERT INTO `phone` (`id`, `comment`) VALUES
	('+1521318790', 'added by system'),
	('+3088707158', 'added by system'),
	('+442037319073', 'added by system'),
	('+442082025907', 'added by system'),
	('+447399992578', 'added by system'),
	('+447508849527', 'added by system'),
	('+447754853203', 'added by system'),
	('+447775964180', 'added by system'),
	('+447795822267', 'added by system'),
	('+6827705175', 'added by system'),
	('+9752350942', 'added by system');
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.profile
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
  `birthday` date DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `terms` tinyint(1) DEFAULT '0',
  `phone` varchar(15) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timezone` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_9525_012` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.profile: ~6 rows (approximately)
DELETE FROM `profile`;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` (`user_id`, `name`, `public_email`, `gravatar_email`, `gravatar_id`, `location`, `website`, `bio`, `id_country`, `availability`, `skills`, `firstname`, `lastname`, `birthday`, `avatar`, `terms`, `phone`, `timezone`) VALUES
	(1, 'Eduardo Admin', 'info@open-ecommerce.org', 'info@open-ecommerce.org', 'e49de8ff6009a963195568839177e24d', '', 'http://open-ecommerce.org', '', 1, 0, '', 'adminname', 'adminsuraname', '1966-07-16', '', 0, '+4475515246251', NULL),
	(2, 'Eduardo Helper', 'eduardo@open-ecommerce.org', 'eduardo@open-ecommerce.org', '1f6df2c9dac05c886ac3f90e692f93af', 'Kennington, London', 'http://www.open-ecommerce.org', 'all about nothing', 16, 0, 'What ever need to be done..', 'Helper Eduardo', 'Silva', '2016-06-17', '', 0, '+447551524625', NULL),
	(3, '', '', '', 'd41d8cd98f00b204e9800998ecf8427e', '', '', '', 1, 0, 'esto', 'Supervisor', 'ApellidoTester', '2016-07-13', '', 0, '', NULL),
	(4, 'Marianito', 'mariano@open-ecommerce.org', 'mariano@open-ecommerce.org', 'ff321209266edc0c530a2515e4efc58e', 'South London', 'http://open-ecommerce.org', '', 10, 0, 'rompe pala anda', 'Mariano', 'Marey', '1901-12-13', '', 0, '+447904591137', NULL),
	(9, NULL, 'manuela@open-ecommerce.org', 'manuela@open-ecommerce.org', 'e7ccdff438be28070af54dd31762e3ce', 'North London', 'http://open-ecommerce.org', '', 10, 1, '', 'Manuela', 'Rotstein', '1901-12-13', '', 0, '+447879387106', NULL),
	(11, NULL, 'manuela_rotstein@hotmail.com', '', 'd41d8cd98f00b204e9800998ecf8427e', 'London', '', '', 229, 0, 'Counsellor', 'Suzanne', 'Taylor', '1901-12-20', '', 0, '07879387222', NULL);
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.sender_type
DROP TABLE IF EXISTS `sender_type`;
CREATE TABLE IF NOT EXISTS `sender_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_type` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.sender_type: ~3 rows (approximately)
DELETE FROM `sender_type`;
/*!40000 ALTER TABLE `sender_type` DISABLE KEYS */;
INSERT INTO `sender_type` (`id`, `sender_type`) VALUES
	(1, 'Automated Response'),
	(2, 'Contact'),
	(3, 'User');
/*!40000 ALTER TABLE `sender_type` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.settings
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.settings: ~15 rows (approximately)
DELETE FROM `settings`;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` (`id`, `type`, `section`, `key`, `value`, `active`, `created`, `modified`) VALUES
	(1, 'boolean', 'app.assets', 'registerPrototypeAsset', '1', 0, '2016-06-22 09:34:27', '2016-06-22 09:34:27'),
	(2, 'string', 'helptext', 'contact_label', 'User', 1, '2016-07-27 13:40:27', '2017-02-28 09:04:07'),
	(3, 'integer', 'helptext', 'sender_type_id_contact', '2', 1, '2016-07-27 13:58:13', '2016-07-27 14:00:59'),
	(4, 'string', 'helptext', 'user_label', 'Volunteer', 1, '2016-07-27 14:01:30', '2017-02-28 15:27:59'),
	(5, 'integer', 'helptext', 'sender_type_id_user', '3', 1, '2016-07-27 14:01:59', NULL),
	(6, 'integer', 'helptext', 'country_uk_id', '229', 1, '2016-07-27 14:02:34', NULL),
	(7, 'integer', 'helptext', 'languages_en_id', '1', 1, '2016-07-27 14:03:21', NULL),
	(8, 'string', 'helptext', 'sms_provider', 'telerivet', 1, '2016-07-27 14:03:45', '2016-07-27 14:23:30'),
	(9, 'boolean', 'helptext', 'anonymize', '0', 1, '2016-07-27 14:04:19', '2016-12-10 10:10:41'),
	(10, 'boolean', 'helptext', 'sms_automatic_response', '1', 1, '2016-07-27 14:04:59', '2017-02-28 09:05:35'),
	(11, 'boolean', 'helptext', 'generate_logs', '1', 1, '2016-07-27 14:16:44', NULL),
	(12, 'integer', 'helptext', 'message_type_id_sms', '2', 1, '2016-07-29 10:01:00', '2016-07-29 10:01:01'),
	(13, 'integer', 'helptext', 'message_type_id_call', '1', 1, '2016-07-29 10:01:41', '2016-07-29 10:01:41'),
	(14, 'string', 'helptext', 'email_to_admin_no_helpers', '<p>There are not Volunteers available in the system to receive sms or calls.</p><br>\r\n<p>Please got to the helpers area to set up at least one available helper</p><br><br>\r\n<a href="http://www.nnls-helptext.ml/en/profile">Click to set Helpers</a><br>\r\n<p>Thanks</b>', 1, '2016-08-11 11:30:34', '2017-02-28 09:05:07'),
	(15, 'string', 'design', 'icons_folder', 'client', 1, NULL, '2017-03-14 11:46:15'),
	(16, 'string', 'helptext', 'sms_automatic_response_text', 'This is an auhomatic response from Chit Chat, we created a new case\\r\\nWe will contact you as soon as possible.\\r\\n', 1, '2017-03-15 17:59:35', '2017-03-15 18:04:18');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.severity
DROP TABLE IF EXISTS `severity`;
CREATE TABLE IF NOT EXISTS `severity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `severity` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `sla` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.severity: ~2 rows (approximately)
DELETE FROM `severity`;
/*!40000 ALTER TABLE `severity` DISABLE KEYS */;
INSERT INTO `severity` (`id`, `severity`, `sla`) VALUES
	(1, 'Severity 1', 'URGENT'),
	(2, 'Severity 2', 'NOT URGENT');
/*!40000 ALTER TABLE `severity` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.social_account
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

-- Dumping data for table chitchat_dev.social_account: ~0 rows (approximately)
DELETE FROM `social_account`;
/*!40000 ALTER TABLE `social_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_account` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.text_template
DROP TABLE IF EXISTS `text_template`;
CREATE TABLE IF NOT EXISTS `text_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `message` varchar(160) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table chitchat_dev.text_template: ~0 rows (approximately)
DELETE FROM `text_template`;
/*!40000 ALTER TABLE `text_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `text_template` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.token
DROP TABLE IF EXISTS `token`;
CREATE TABLE IF NOT EXISTS `token` (
  `user_id` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `created_at` int(11) NOT NULL,
  `type` smallint(6) NOT NULL,
  UNIQUE KEY `token_unique` (`user_id`,`code`,`type`),
  CONSTRAINT `fk_user_token` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table chitchat_dev.token: ~0 rows (approximately)
DELETE FROM `token`;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` (`user_id`, `code`, `created_at`, `type`) VALUES
	(3, 'rW55xKLmOt3tD4z3KAqN6F-iI_Ez-Bd4', 1466680022, 0);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.twig
DROP TABLE IF EXISTS `twig`;
CREATE TABLE IF NOT EXISTS `twig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `twig_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.twig: ~0 rows (approximately)
DELETE FROM `twig`;
/*!40000 ALTER TABLE `twig` DISABLE KEYS */;
/*!40000 ALTER TABLE `twig` ENABLE KEYS */;


-- Dumping structure for table chitchat_dev.user
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
  `last_login_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique_email` (`email`),
  UNIQUE KEY `user_unique_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- Dumping data for table chitchat_dev.user: ~6 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`, `username`, `email`, `password_hash`, `auth_key`, `confirmed_at`, `unconfirmed_email`, `blocked_at`, `registration_ip`, `created_at`, `updated_at`, `flags`, `last_login_at`) VALUES
	(1, 'admin', 'info@open-ecommerce.org', '$2y$10$N4jEgbyysxNAHf8Pb8RFaetY07tPWMZL5qOCBUhGhM46yyNIBI3am', 'L4DEoxYf4R9C3ZvHP8uBzwcSbq5vo5mP', 1466528922, NULL, NULL, NULL, 1425651628, 1470164156, 0, 1489774771),
	(2, 'helper-eduardo', 'eduardo@open-ecommerce.org', '$2y$10$ZA61Lh75MrG.cpYd1q63SuvDtZXiOPldHf6GTks.3z01o2u9O4lHS', 'uqe7SH5MKQYWpHUe7Mn42svnEmWkuVCI', 1425651715, NULL, NULL, '192.168.1.74', 1425651715, 1470213413, 0, 1489602350),
	(3, 'supervisor', 'tester1@open-ecommerce.org', '$2y$10$kMa.WHn.1y7BvN2nSsiqN.jvpBEJ4GH/obAbKZM4ct8iHrmo0rTXq', 'zlUuQlMHPdSM-wTTlPkzhe3jvnoFJkBX', 1466680707, NULL, NULL, '127.0.0.1', 1466680022, 1470212945, 0, NULL),
	(4, 'helper-mariano', 'mariano@open-ecommerce.org', '$2y$10$LrG45CQrIiOJhVLx3eFfruR6M1rpM5i9o24eHW4YJFnAaf6MJ2cU6', 'YZ0hyKV6Je2_2DO3mp-JeUFMO5WI-hZN', 1466680738, NULL, NULL, '192.168.1.74', 1466680738, 1470212969, 0, NULL),
	(9, 'helper-manuela', 'manuela@open-ecommerce.org', '$2y$10$o3M29K2W0vhi49m4u9j8bu.wKDEiJouRs7s66hz9X/sxQ34JGyGjW', 'zEvmDjrqvS8rHT7NSgWoKDXFaLFThQSN', 1470213040, NULL, NULL, '217.138.44.117', 1470213040, 1470213040, 0, NULL),
	(11, 'Manuela2', 'manuela_rotstein@hotmail.com', '$2y$10$/p5lTjmQQIZucYoZaNrKxuS9ZrP/O/1ue7zpmXvvujBR504Pg0u2e', '4KEJ4kzPGvaV3xVKbRDoMZc9RbvACOq5', 1471860554, NULL, NULL, '217.138.44.117', 1471860554, 1481368087, 0, NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
