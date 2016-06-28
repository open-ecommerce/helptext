-- MySQL dump 10.13  Distrib 5.6.30, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: helptext_dev
-- ------------------------------------------------------
-- Server version	5.6.30-0ubuntu0.15.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_assignment`
--

DROP TABLE IF EXISTS `auth_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_assignment` (
  `item_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_id` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_assignment`
--

LOCK TABLES `auth_assignment` WRITE;
/*!40000 ALTER TABLE `auth_assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_item`
--

DROP TABLE IF EXISTS `auth_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_item` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_item`
--

LOCK TABLES `auth_item` WRITE;
/*!40000 ALTER TABLE `auth_item` DISABLE KEYS */;
INSERT INTO `auth_item` VALUES ('Admin',1,'prototype editor',NULL,NULL,1466528906,1466695731),('app_site',2,'Main Site Controller',NULL,NULL,1466528906,1466528906),('backend_default',2,'Backend Dashboard',NULL,NULL,1466528906,1466528906),('Helper',1,'Volunteers taking cases',NULL,NULL,1466695700,1466695700),('pages',2,'Pages Module',NULL,NULL,1466528905,1466528905),('pages_default_page',2,'CMS-Page Action',NULL,NULL,1466528907,1466528907),('Public',1,'Unauthenticated User',NULL,NULL,1466528906,1466528906);
/*!40000 ALTER TABLE `auth_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_item_child`
--

DROP TABLE IF EXISTS `auth_item_child`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_item_child` (
  `parent` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `child` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_item_child`
--

LOCK TABLES `auth_item_child` WRITE;
/*!40000 ALTER TABLE `auth_item_child` DISABLE KEYS */;
INSERT INTO `auth_item_child` VALUES ('Admin','app_site'),('Admin','backend_default'),('Admin','pages');
/*!40000 ALTER TABLE `auth_item_child` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_rule`
--

DROP TABLE IF EXISTS `auth_rule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_rule` (
  `name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `data` text COLLATE utf8_unicode_ci,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_rule`
--

LOCK TABLES `auth_rule` WRITE;
/*!40000 ALTER TABLE `auth_rule` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_rule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_category`
--

DROP TABLE IF EXISTS `case_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `case_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `case_category` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_category`
--

LOCK TABLES `case_category` WRITE;
/*!40000 ALTER TABLE `case_category` DISABLE KEYS */;
INSERT INTO `case_category` VALUES (1,'Eviction'),(2,'Deportation'),(3,'Detention'),(4,'Information'),(5,'Medical Related'),(6,'Others');
/*!40000 ALTER TABLE `case_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `case_text`
--

DROP TABLE IF EXISTS `case_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `case_text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_text` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_case` (`id_case`),
  KEY `id_text` (`id_text`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `case_text`
--

LOCK TABLES `case_text` WRITE;
/*!40000 ALTER TABLE `case_text` DISABLE KEYS */;
/*!40000 ALTER TABLE `case_text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cases`
--

DROP TABLE IF EXISTS `cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) DEFAULT NULL,
  `id_category` int(11) DEFAULT NULL,
  `id_outcome` int(11) DEFAULT NULL,
  `id_severity` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `close_date` datetime DEFAULT NULL,
  `state` bit(1) DEFAULT b'0',
  `comments` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cases`
--

LOCK TABLES `cases` WRITE;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
INSERT INTO `cases` VALUES (1,1,3,NULL,1,NULL,NULL,'','Nada solo esto aguante peres caso');
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_country` int(11) DEFAULT NULL COMMENT 'Nationality',
  `id_language` int(11) DEFAULT NULL COMMENT 'First Language',
  `first_name` varchar(50) NOT NULL COMMENT 'Names',
  `last_name` varchar(50) DEFAULT NULL COMMENT 'Surname',
  `gender` varchar(10) DEFAULT NULL COMMENT 'Gender',
  `marital_status` varchar(10) DEFAULT NULL COMMENT 'Marital Status',
  `birthday` date DEFAULT NULL COMMENT 'Birthday',
  `address_line1` varchar(50) DEFAULT NULL COMMENT 'Address',
  `address_line2` varchar(50) DEFAULT NULL COMMENT 'Address',
  `city` varchar(50) DEFAULT NULL COMMENT 'City',
  `state` varchar(50) DEFAULT NULL COMMENT 'County',
  `postal_code` varchar(15) DEFAULT NULL COMMENT 'Postcode',
  `comments` varchar(100) DEFAULT NULL COMMENT 'Comments',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,3,NULL,'cachito','perez','M','Maried','2016-06-27','afasf','asfasf','asfasf','asfasf','234234','asfasdf'),(2,6,NULL,'asfasfasf','asfasf','F','Maried','2016-06-27','asfasf','asfasf','asfasf','','','asfasfasf');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_phone`
--

DROP TABLE IF EXISTS `contact_phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_phone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_contact` int(11) NOT NULL DEFAULT '0',
  `id_phone` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_phone` (`id_phone`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_phone`
--

LOCK TABLES `contact_phone` WRITE;
/*!40000 ALTER TABLE `contact_phone` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `country`
--

DROP TABLE IF EXISTS `country`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `country_code` varchar(2) NOT NULL DEFAULT '',
  `country_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=246 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country`
--

LOCK TABLES `country` WRITE;
/*!40000 ALTER TABLE `country` DISABLE KEYS */;
INSERT INTO `country` VALUES (1,'AF','Afghanistan'),(2,'AL','Albania'),(3,'DZ','Algeria'),(4,'DS','American Samoa'),(5,'AD','Andorra'),(6,'AO','Angola'),(7,'AI','Anguilla'),(8,'AQ','Antarctica'),(9,'AG','Antigua and Barbuda'),(10,'AR','Argentina'),(11,'AM','Armenia'),(12,'AW','Aruba'),(13,'AU','Australia'),(14,'AT','Austria'),(15,'AZ','Azerbaijan'),(16,'BS','Bahamas'),(17,'BH','Bahrain'),(18,'BD','Bangladesh'),(19,'BB','Barbados'),(20,'BY','Belarus'),(21,'BE','Belgium'),(22,'BZ','Belize'),(23,'BJ','Benin'),(24,'BM','Bermuda'),(25,'BT','Bhutan'),(26,'BO','Bolivia'),(27,'BA','Bosnia and Herzegovina'),(28,'BW','Botswana'),(29,'BV','Bouvet Island'),(30,'BR','Brazil'),(31,'IO','British Indian Ocean Territory'),(32,'BN','Brunei Darussalam'),(33,'BG','Bulgaria'),(34,'BF','Burkina Faso'),(35,'BI','Burundi'),(36,'KH','Cambodia'),(37,'CM','Cameroon'),(38,'CA','Canada'),(39,'CV','Cape Verde'),(40,'KY','Cayman Islands'),(41,'CF','Central African Republic'),(42,'TD','Chad'),(43,'CL','Chile'),(44,'CN','China'),(45,'CX','Christmas Island'),(46,'CC','Cocos (Keeling) Islands'),(47,'CO','Colombia'),(48,'KM','Comoros'),(49,'CG','Congo'),(50,'CK','Cook Islands'),(51,'CR','Costa Rica'),(52,'HR','Croatia (Hrvatska)'),(53,'CU','Cuba'),(54,'CY','Cyprus'),(55,'CZ','Czech Republic'),(56,'DK','Denmark'),(57,'DJ','Djibouti'),(58,'DM','Dominica'),(59,'DO','Dominican Republic'),(60,'TP','East Timor'),(61,'EC','Ecuador'),(62,'EG','Egypt'),(63,'SV','El Salvador'),(64,'GQ','Equatorial Guinea'),(65,'ER','Eritrea'),(66,'EE','Estonia'),(67,'ET','Ethiopia'),(68,'FK','Falkland Islands (Islas Malvinas)'),(69,'FO','Faroe Islands'),(70,'FJ','Fiji'),(71,'FI','Finland'),(72,'FR','France'),(73,'FX','France, Metropolitan'),(74,'GF','French Guiana'),(75,'PF','French Polynesia'),(76,'TF','French Southern Territories'),(77,'GA','Gabon'),(78,'GM','Gambia'),(79,'GE','Georgia'),(80,'DE','Germany'),(81,'GH','Ghana'),(82,'GI','Gibraltar'),(83,'GK','Guernsey'),(84,'GR','Greece'),(85,'GL','Greenland'),(86,'GD','Grenada'),(87,'GP','Guadeloupe'),(88,'GU','Guam'),(89,'GT','Guatemala'),(90,'GN','Guinea'),(91,'GW','Guinea-Bissau'),(92,'GY','Guyana'),(93,'HT','Haiti'),(94,'HM','Heard and Mc Donald Islands'),(95,'HN','Honduras'),(96,'HK','Hong Kong'),(97,'HU','Hungary'),(98,'IS','Iceland'),(99,'IN','India'),(100,'IM','Isle of Man'),(101,'ID','Indonesia'),(102,'IR','Iran (Islamic Republic of)'),(103,'IQ','Iraq'),(104,'IE','Ireland'),(105,'IL','Israel'),(106,'IT','Italy'),(107,'CI','Ivory Coast'),(108,'JE','Jersey'),(109,'JM','Jamaica'),(110,'JP','Japan'),(111,'JO','Jordan'),(112,'KZ','Kazakhstan'),(113,'KE','Kenya'),(114,'KI','Kiribati'),(115,'KP','Korea, Democratic People\'s Republic of'),(116,'KR','Korea, Republic of'),(117,'XK','Kosovo'),(118,'KW','Kuwait'),(119,'KG','Kyrgyzstan'),(120,'LA','Lao People\'s Democratic Republic'),(121,'LV','Latvia'),(122,'LB','Lebanon'),(123,'LS','Lesotho'),(124,'LR','Liberia'),(125,'LY','Libyan Arab Jamahiriya'),(126,'LI','Liechtenstein'),(127,'LT','Lithuania'),(128,'LU','Luxembourg'),(129,'MO','Macau'),(130,'MK','Macedonia'),(131,'MG','Madagascar'),(132,'MW','Malawi'),(133,'MY','Malaysia'),(134,'MV','Maldives'),(135,'ML','Mali'),(136,'MT','Malta'),(137,'MH','Marshall Islands'),(138,'MQ','Martinique'),(139,'MR','Mauritania'),(140,'MU','Mauritius'),(141,'TY','Mayotte'),(142,'MX','Mexico'),(143,'FM','Micronesia, Federated States of'),(144,'MD','Moldova, Republic of'),(145,'MC','Monaco'),(146,'MN','Mongolia'),(147,'ME','Montenegro'),(148,'MS','Montserrat'),(149,'MA','Morocco'),(150,'MZ','Mozambique'),(151,'MM','Myanmar'),(152,'NA','Namibia'),(153,'NR','Nauru'),(154,'NP','Nepal'),(155,'NL','Netherlands'),(156,'AN','Netherlands Antilles'),(157,'NC','New Caledonia'),(158,'NZ','New Zealand'),(159,'NI','Nicaragua'),(160,'NE','Niger'),(161,'NG','Nigeria'),(162,'NU','Niue'),(163,'NF','Norfolk Island'),(164,'MP','Northern Mariana Islands'),(165,'NO','Norway'),(166,'OM','Oman'),(167,'PK','Pakistan'),(168,'PW','Palau'),(169,'PS','Palestine'),(170,'PA','Panama'),(171,'PG','Papua New Guinea'),(172,'PY','Paraguay'),(173,'PE','Peru'),(174,'PH','Philippines'),(175,'PN','Pitcairn'),(176,'PL','Poland'),(177,'PT','Portugal'),(178,'PR','Puerto Rico'),(179,'QA','Qatar'),(180,'RE','Reunion'),(181,'RO','Romania'),(182,'RU','Russian Federation'),(183,'RW','Rwanda'),(184,'KN','Saint Kitts and Nevis'),(185,'LC','Saint Lucia'),(186,'VC','Saint Vincent and the Grenadines'),(187,'WS','Samoa'),(188,'SM','San Marino'),(189,'ST','Sao Tome and Principe'),(190,'SA','Saudi Arabia'),(191,'SN','Senegal'),(192,'RS','Serbia'),(193,'SC','Seychelles'),(194,'SL','Sierra Leone'),(195,'SG','Singapore'),(196,'SK','Slovakia'),(197,'SI','Slovenia'),(198,'SB','Solomon Islands'),(199,'SO','Somalia'),(200,'ZA','South Africa'),(201,'GS','South Georgia South Sandwich Islands'),(202,'ES','Spain'),(203,'LK','Sri Lanka'),(204,'SH','St. Helena'),(205,'PM','St. Pierre and Miquelon'),(206,'SD','Sudan'),(207,'SR','Suriname'),(208,'SJ','Svalbard and Jan Mayen Islands'),(209,'SZ','Swaziland'),(210,'SE','Sweden'),(211,'CH','Switzerland'),(212,'SY','Syrian Arab Republic'),(213,'TW','Taiwan'),(214,'TJ','Tajikistan'),(215,'TZ','Tanzania, United Republic of'),(216,'TH','Thailand'),(217,'TG','Togo'),(218,'TK','Tokelau'),(219,'TO','Tonga'),(220,'TT','Trinidad and Tobago'),(221,'TN','Tunisia'),(222,'TR','Turkey'),(223,'TM','Turkmenistan'),(224,'TC','Turks and Caicos Islands'),(225,'TV','Tuvalu'),(226,'UG','Uganda'),(227,'UA','Ukraine'),(228,'AE','United Arab Emirates'),(229,'GB','United Kingdom'),(230,'US','United States'),(231,'UM','United States minor outlying islands'),(232,'UY','Uruguay'),(233,'UZ','Uzbekistan'),(234,'VU','Vanuatu'),(235,'VA','Vatican City State'),(236,'VE','Venezuela'),(237,'VN','Vietnam'),(238,'VG','Virgin Islands (British)'),(239,'VI','Virgin Islands (U.S.)'),(240,'WF','Wallis and Futuna Islands'),(241,'EH','Western Sahara'),(242,'YE','Yemen'),(243,'YU','Yugoslavia'),(244,'ZR','Zaire'),(245,'ZM','Zambia');
/*!40000 ALTER TABLE `country` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dmstr_page`
--

DROP TABLE IF EXISTS `dmstr_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dmstr_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `root` int(11) NOT NULL,
  `lft` int(11) NOT NULL,
  `rgt` int(11) NOT NULL,
  `lvl` smallint(6) NOT NULL,
  `page_title` varchar(255) DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  `domain_id` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `view` varchar(255) DEFAULT NULL,
  `default_meta_keywords` varchar(255) DEFAULT NULL,
  `default_meta_description` text,
  `request_params` text,
  `owner` int(11) DEFAULT NULL,
  `access_owner` int(11) DEFAULT NULL,
  `access_domain` varchar(8) DEFAULT NULL,
  `access_read` varchar(255) DEFAULT NULL,
  `access_update` varchar(255) DEFAULT NULL,
  `access_delete` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dmstr_page`
--

LOCK TABLES `dmstr_page` WRITE;
/*!40000 ALTER TABLE `dmstr_page` DISABLE KEYS */;
INSERT INTO `dmstr_page` VALUES (1,1,1,4,0,'','root_en','root',NULL,'/site/index','','','','{}',NULL,NULL,'en',NULL,NULL,NULL,'fa fa-angellist',1,1,0,0,0,1,0,1,1,1,1,1,0,'2016-06-23 13:58:09','2016-06-22 11:39:46'),(2,1,2,3,1,'','About Us','about-us',NULL,'/site/index','','','','{}',NULL,NULL,'*',NULL,NULL,NULL,'fa fa-bed',1,1,0,0,0,1,0,1,1,1,1,1,0,'2016-06-22 11:41:01','2016-06-22 11:41:01');
/*!40000 ALTER TABLE `dmstr_page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `html`
--

DROP TABLE IF EXISTS `html`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `html` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `html_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `html`
--

LOCK TABLES `html` WRITE;
/*!40000 ALTER TABLE `html` DISABLE KEYS */;
INSERT INTO `html` VALUES (2,'footer','<p>.</p>\r\n'),(4,'about-us','<p>esta seria about us</p>\r\n'),(6,'en/site/index','\r\n<div class=\"row\">\r\n    <div class=\"large-12 columns text-center\">\r\n        <h2>Yii2, Foundationized!</h2>\r\n        \r\n        <div class=\"callout secondary\">            \r\n            <p>Welcome to this demo of the <a target=\"_blank\" href=\"http://www.yiiframework.com/doc-2.0/guide-index.html\">Yii2 PHP framework</a>, pre-configured with <a href=\"http://foundation.zurb.com/\" target=\"_blank\">Foundation 6</a>.</p>\r\n            \r\n            <p>To get started with your own foundationized Yii2 project, please see the <a href=\"http://foundationize.com/#yii2\">Yii2 + Foundation installation instructions</a>.</p>\r\n\r\n            <p>No need to install and configure extensions, this version of Yii2 is pre-configured and ready to roll with Foundation 6.</p>\r\n        </div>\r\n        \r\n        <div class=\"callout large\">\r\n\r\n            <p>Once you\'ve exhausted the fun in this document, you should check out:</p>\r\n\r\n            <div class=\"row\">\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <p><a href=\"http://foundation.zurb.com/sites/docs/\">Foundation Documentation</a><br />Everything you need to know about using the framework.</p>\r\n                </div>\r\n\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <p><a href=\"http://zurb.com/university/code-skills\">Foundation Code Skills</a><br />These online courses offer you a chance to better understand how Foundation works and how you can master it to create awesome projects.</p>\r\n                </div>\r\n\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <p><a href=\"http://foundation.zurb.com/forum\">Foundation Forum</a><br />Join the Foundation community to ask a question or show off your knowlege.</p>\r\n                </div>              \r\n            </div>\r\n\r\n            <div class=\"row\">\r\n                <div class=\"large-4 medium-4 medium-push-2 columns\">\r\n                    <p><a href=\"http://github.com/zurb/foundation\">Foundation on Github</a><br />Latest code, issue reports, feature requests and more.</p>\r\n                </div>\r\n\r\n                <div class=\"large-4 medium-4 medium-pull-2 columns\">\r\n                    <p><a href=\"https://twitter.com/ZURBfoundation\">@zurbfoundation</a><br />Ping us on Twitter if you have questions. When you build something with this we\'d love to see it (and send you a totally boss sticker).</p>\r\n                </div>              \r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class=\"row\">\r\n    <div class=\"large-8 medium-8 columns\">\r\n        <h5>Here&rsquo;s your basic grid:</h5>\r\n        <!-- Grid Example -->\r\n\r\n        <div class=\"row\">\r\n            <div class=\"large-12 columns\">\r\n                <div class=\"callout \">\r\n                    <p><strong>This is a twelve column section in a row.</strong> Each of these includes a div.callout element so you can see where the columns are - it\'s not required at all for the grid.</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"large-6 medium-6 columns\">\r\n                <div class=\"callout\">\r\n                    <p>Six columns</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"large-6 medium-6 columns\">\r\n                <div class=\"callout\">\r\n                    <p>Six columns</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"large-4 medium-4 small-4 columns\">\r\n                <div class=\"callout\">\r\n                    <p>Four columns</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"large-4 medium-4 small-4 columns\">\r\n                <div class=\"callout\">\r\n                    <p>Four columns</p>\r\n                </div>\r\n            </div>\r\n            <div class=\"large-4 medium-4 small-4 columns\">\r\n                <div class=\"callout\">\r\n                    <p>Four columns</p>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <hr />\r\n\r\n        <h5>We bet you&rsquo;ll need a form somewhere:</h5>\r\n        <form>\r\n            <div class=\"row\">\r\n                <div class=\"large-12 columns\">\r\n                    <label>Input Label</label>\r\n                    <input type=\"text\" placeholder=\"large-12.columns\" />\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <label>Input Label</label>\r\n                    <input type=\"text\" placeholder=\"large-4.columns\" />\r\n                </div>\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <label>Input Label</label>\r\n                    <input type=\"text\" placeholder=\"large-4.columns\" />\r\n                </div>\r\n                <div class=\"large-4 medium-4 columns\">\r\n                    <label>Input Label</label>\r\n                    <div class=\"input-group\">\r\n                        <input type=\"text\" placeholder=\"small-9.columns\" class=\"input-group-field\" />\r\n                        <span class=\"input-group-label\">.com</span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"large-12 columns\">\r\n                    <label>Select Box</label>\r\n                    <select>\r\n                        <option value=\"husker\">Husker</option>\r\n                        <option value=\"starbuck\">Starbuck</option>\r\n                        <option value=\"hotdog\">Hot Dog</option>\r\n                        <option value=\"apollo\">Apollo</option>\r\n                    </select>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"large-6 medium-6 columns\">\r\n                    <label>Choose Your Favorite</label>\r\n                    <input type=\"radio\" name=\"pokemon\" value=\"Red\" id=\"pokemonRed\"><label for=\"pokemonRed\">Radio 1</label>\r\n                    <input type=\"radio\" name=\"pokemon\" value=\"Blue\" id=\"pokemonBlue\"><label for=\"pokemonBlue\">Radio 2</label>\r\n                </div>\r\n                <div class=\"large-6 medium-6 columns\">\r\n                    <label>Check these out</label>\r\n                    <input id=\"checkbox1\" type=\"checkbox\"><label for=\"checkbox1\">Checkbox 1</label>\r\n                    <input id=\"checkbox2\" type=\"checkbox\"><label for=\"checkbox2\">Checkbox 2</label>\r\n                </div>\r\n            </div>\r\n            <div class=\"row\">\r\n                <div class=\"large-12 columns\">\r\n                    <label>Textarea Label</label>\r\n                    <textarea placeholder=\"small-12.columns\"></textarea>\r\n                </div>\r\n            </div>\r\n        </form>\r\n    </div>\r\n\r\n    <div class=\"large-4 medium-4 columns\">\r\n        <h5>Try one of these buttons:</h5>\r\n        <p><a href=\"#\" class=\"small button\">Simple Button</a><br/>\r\n            <a href=\"#\" class=\"medium success button\">Success Button</a><br/>\r\n            <a href=\"#\" class=\"medium alert button\">Alert Button</a><br/>\r\n            <a href=\"#\" class=\"medium secondary button\">Secondary Button</a></p>\r\n        <div class=\"callout\">\r\n            <h5>So many components, girl!</h5>\r\n            <p>A whole kitchen sink of goodies comes with Foundation. Check out the docs to see them all, along with details on making them your own.</p>\r\n            <a href=\"http://foundation.zurb.com/docs/\" class=\"small button\">Go to Foundation Docs</a>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n');
/*!40000 ALTER TABLE `html` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language`
--

DROP TABLE IF EXISTS `language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language` (
  `language_id` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `language` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `country` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `name_ascii` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `status` smallint(6) NOT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language`
--

LOCK TABLES `language` WRITE;
/*!40000 ALTER TABLE `language` DISABLE KEYS */;
INSERT INTO `language` VALUES ('af-ZA','af','za','Afrikaans','Afrikaans',0),('ar-AR','ar','ar','‏العربية‏','Arabic',0),('az-AZ','az','az','Azərbaycan dili','Azerbaijani',0),('be-BY','be','by','Беларуская','Belarusian',0),('bg-BG','bg','bg','Български','Bulgarian',0),('bn-IN','bn','in','বাংলা','Bengali',0),('bs-BA','bs','ba','Bosanski','Bosnian',0),('ca-ES','ca','es','Català','Catalan',0),('cs-CZ','cs','cz','Čeština','Czech',0),('cy-GB','cy','gb','Cymraeg','Welsh',0),('da-DK','da','dk','Dansk','Danish',0),('de-DE','de','de','Deutsch','German',0),('el-GR','el','gr','Ελληνικά','Greek',0),('en-GB','en','gb','English (UK)','English (UK)',1),('en-PI','en','pi','English (Pirate)','English (Pirate)',0),('en-UD','en','ud','English (Upside Down)','English (Upside Down)',0),('en-US','en','us','English (US)','English (US)',1),('eo-EO','eo','eo','Esperanto','Esperanto',0),('es-ES','es','es','Español (España)','Spanish (Spain)',0),('es-LA','es','la','Español','Spanish',0),('et-EE','et','ee','Eesti','Estonian',0),('eu-ES','eu','es','Euskara','Basque',0),('fa-IR','fa','ir','‏فارسی‏','Persian',0),('fb-LT','fb','lt','Leet Speak','Leet Speak',0),('fi-FI','fi','fi','Suomi','Finnish',0),('fo-FO','fo','fo','Føroyskt','Faroese',0),('fr-CA','fr','ca','Français (Canada)','French (Canada)',0),('fr-FR','fr','fr','Français (France)','French (France)',0),('fy-NL','fy','nl','Frysk','Frisian',0),('ga-IE','ga','ie','Gaeilge','Irish',0),('gl-ES','gl','es','Galego','Galician',0),('he-IL','he','il','‏עברית‏','Hebrew',0),('hi-IN','hi','in','हिन्दी','Hindi',0),('hr-HR','hr','hr','Hrvatski','Croatian',0),('hu-HU','hu','hu','Magyar','Hungarian',0),('hy-AM','hy','am','Հայերեն','Armenian',0),('id-ID','id','id','Bahasa Indonesia','Indonesian',0),('is-IS','is','is','Íslenska','Icelandic',0),('it-IT','it','it','Italiano','Italian',0),('ja-JP','ja','jp','日本語','Japanese',0),('ka-GE','ka','ge','ქართული','Georgian',0),('km-KH','km','kh','ភាសាខ្មែរ','Khmer',0),('ko-KR','ko','kr','한국어','Korean',0),('ku-TR','ku','tr','Kurdî','Kurdish',0),('la-VA','la','va','lingua latina','Latin',0),('lt-LT','lt','lt','Lietuvių','Lithuanian',0),('lv-LV','lv','lv','Latviešu','Latvian',0),('mk-MK','mk','mk','Македонски','Macedonian',0),('ml-IN','ml','in','മലയാളം','Malayalam',0),('ms-MY','ms','my','Bahasa Melayu','Malay',0),('nb-NO','nb','no','Norsk (bokmål)','Norwegian (bokmal)',0),('ne-NP','ne','np','नेपाली','Nepali',0),('nl-NL','nl','nl','Nederlands','Dutch',0),('nn-NO','nn','no','Norsk (nynorsk)','Norwegian (nynorsk)',0),('pa-IN','pa','in','ਪੰਜਾਬੀ','Punjabi',0),('pl-PL','pl','pl','Polski','Polish',0),('ps-AF','ps','af','‏پښتو‏','Pashto',0),('pt-BR','pt','br','Português (Brasil)','Portuguese (Brazil)',0),('pt-PT','pt','pt','Português (Portugal)','Portuguese (Portugal)',0),('ro-RO','ro','ro','Română','Romanian',0),('ru-RU','ru','ru','Русский','Russian',0),('sk-SK','sk','sk','Slovenčina','Slovak',0),('sl-SI','sl','si','Slovenščina','Slovenian',0),('sq-AL','sq','al','Shqip','Albanian',0),('sr-RS','sr','rs','Српски','Serbian',0),('sv-SE','sv','se','Svenska','Swedish',0),('sw-KE','sw','ke','Kiswahili','Swahili',0),('ta-IN','ta','in','தமிழ்','Tamil',0),('te-IN','te','in','తెలుగు','Telugu',0),('th-TH','th','th','ภาษาไทย','Thai',0),('tl-PH','tl','ph','Filipino','Filipino',0),('tr-TR','tr','tr','Türkçe','Turkish',0),('uk-UA','uk','ua','Українська','Ukrainian',0),('vi-VN','vi','vn','Tiếng Việt','Vietnamese',0),('xx-XX','xx','xx','Fejlesztő','Developer',0),('zh-CN','zh','cn','中文(简体)','Simplified Chinese (China)',0),('zh-HK','zh','hk','中文(香港)','Traditional Chinese (Hong Kong)',0),('zh-TW','zh','tw','中文(台灣)','Traditional Chinese (Taiwan)',0);
/*!40000 ALTER TABLE `language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language_source`
--

DROP TABLE IF EXISTS `language_source`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language_source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language_source`
--

LOCK TABLES `language_source` WRITE;
/*!40000 ALTER TABLE `language_source` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_source` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language_translate`
--

DROP TABLE IF EXISTS `language_translate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language_translate` (
  `id` int(11) NOT NULL,
  `language` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `translation` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`,`language`),
  KEY `language_translate_idx_language` (`language`),
  CONSTRAINT `language_translate_ibfk_1` FOREIGN KEY (`language`) REFERENCES `language` (`language_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `language_translate_ibfk_2` FOREIGN KEY (`id`) REFERENCES `language_source` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language_translate`
--

LOCK TABLES `language_translate` WRITE;
/*!40000 ALTER TABLE `language_translate` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_translate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `languages`
--

DROP TABLE IF EXISTS `languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language` mediumtext NOT NULL,
  `short_name` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=109 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `languages`
--

LOCK TABLES `languages` WRITE;
/*!40000 ALTER TABLE `languages` DISABLE KEYS */;
INSERT INTO `languages` VALUES (1,'English','en'),(2,'German','de'),(3,'French','fr'),(4,'Dutch','nl'),(5,'Italian','it'),(6,'Spanish','es'),(7,'Polish','pl'),(8,'Russian','ru'),(9,'Japanese','ja'),(10,'Portuguese','pt'),(11,'Swedish','sv'),(12,'Chinese','zh'),(13,'Catalan','ca'),(14,'Ukrainian','uk'),(15,'Norwegian (Bokmål)','no'),(16,'Finnish','fi'),(17,'Vietnamese','vi'),(18,'Czech','cs'),(19,'Hungarian','hu'),(20,'Korean','ko'),(21,'Indonesian','id'),(22,'Turkish','tr'),(23,'Romanian','ro'),(24,'Persian','fa'),(25,'Arabic','ar'),(26,'Danish','da'),(27,'Esperanto','eo'),(28,'Serbian','sr'),(29,'Lithuanian','lt'),(30,'Slovak','sk'),(31,'Malay','ms'),(32,'Hebrew','he'),(33,'Bulgarian','bg'),(34,'Slovenian','sl'),(35,'Volapük','vo'),(36,'Kazakh','kk'),(37,'Waray-Waray','war'),(38,'Basque','eu'),(39,'Croatian','hr'),(40,'Hindi','hi'),(41,'Estonian','et'),(42,'Azerbaijani','az'),(43,'Galician','gl'),(44,'Simple English','simple'),(45,'Norwegian (Nynorsk)','nn'),(46,'Thai','th'),(47,'Newar / Nepal Bhasa','new'),(48,'Greek','el'),(49,'Aromanian','roa-rup'),(50,'Latin','la'),(51,'Occitan','oc'),(52,'Tagalog','tl'),(53,'Haitian','ht'),(54,'Macedonian','mk'),(55,'Georgian','ka'),(56,'Serbo-Croatian','sh'),(57,'Telugu','te'),(58,'Piedmontese','pms'),(59,'Cebuano','ceb'),(60,'Tamil','ta'),(61,'Belarusian (Taraškievica)','be-x-old'),(62,'Breton','br'),(63,'Latvian','lv'),(64,'Javanese','jv'),(65,'Albanian','sq'),(66,'Belarusian','be'),(67,'Marathi','mr'),(68,'Welsh','cy'),(69,'Luxembourgish','lb'),(70,'Icelandic','is'),(71,'Bosnian','bs'),(72,'Yoruba','yo'),(73,'Malagasy','mg'),(74,'Aragonese','an'),(75,'Bishnupriya Manipuri','bpy'),(76,'Lombard','lmo'),(77,'West Frisian','fy'),(78,'Bengali','bn'),(79,'Ido','io'),(80,'Swahili','sw'),(81,'Gujarati','gu'),(82,'Malayalam','ml'),(83,'Western Panjabi','pnb'),(84,'Afrikaans','af'),(85,'Low Saxon','nds'),(86,'Sicilian','scn'),(87,'Urdu','ur'),(88,'Kurdish','ku'),(89,'Cantonese','zh-yue'),(90,'Armenian','hy'),(91,'Quechua','qu'),(92,'Sundanese','su'),(93,'Nepali','ne'),(94,'Zazaki','diq'),(95,'Asturian','ast'),(96,'Tatar','tt'),(97,'Neapolitan','nap'),(98,'Irish','ga'),(99,'Chuvash','cv'),(100,'Samogitian','bat-smg'),(101,'Walloon','wa'),(102,'Amharic','am'),(103,'Kannada','kn'),(104,'Alemannic','als'),(105,'Buginese','bug'),(106,'Burmese','my'),(107,'Interlingua','ia'),(108,'- Not selected -','dont');
/*!40000 ALTER TABLE `languages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `less`
--

DROP TABLE IF EXISTS `less`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `less` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `less_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `less`
--

LOCK TABLES `less` WRITE;
/*!40000 ALTER TABLE `less` DISABLE KEYS */;
/*!40000 ALTER TABLE `less` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migration`
--

DROP TABLE IF EXISTS `migration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migration` (
  `version` varchar(180) NOT NULL,
  `alias` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migration`
--

LOCK TABLES `migration` WRITE;
/*!40000 ALTER TABLE `migration` DISABLE KEYS */;
INSERT INTO `migration` VALUES ('m000000_000000_base','@app/migrations',1425651576),('m140209_132017_init','@dektrium/user/migrations',1425651610),('m140403_174025_create_account_table','@dektrium/user/migrations',1425651610),('m140504_113157_update_tables','@dektrium/user/migrations',1425651612),('m140504_130429_create_token_table','@dektrium/user/migrations',1425651613),('m140506_102106_rbac_init','@yii/rbac/migrations',1466528895),('m140618_045255_create_settings','@vendor/pheme/yii2-settings/migrations',1466528895),('m140830_171933_fix_ip_field','@dektrium/user/migrations',1425651613),('m140830_172703_change_account_table_name','@dektrium/user/migrations',1425651613),('m141002_030233_translate_manager','@vendor/lajax/yii2-translate-manager/migrations',1466528899),('m141222_110026_update_ip_field','@dektrium/user/migrations',1425651613),('m141222_135246_alter_username_length','@dektrium/user/migrations',1466528900),('m150309_153255_create_tree_manager_table','@vendor/dmstr/yii2-pages-module/migrations',1466528902),('m150614_103145_update_social_account_table','@dektrium/user/migrations',1466528905),('m150623_164544_auth_items','@vendor/dmstr/yii2-pages-module/migrations',1466528905),('m150623_212711_fix_username_notnull','@dektrium/user/migrations',1466528906),('m150917_193929_rbac','@app/migrations',1466528907),('m150918_031100_auth_items','@vendor/dmstr/yii2-pages-module/migrations',1466528907),('m151020_213100_update_profile_table','@vendor/cinghie/yii2-user-extended/migrations',1466756758),('m151126_091910_add_unique_index','@vendor/pheme/yii2-settings/migrations',1466528907),('m151226_111407_init','@vendor/dmstr/yii2-prototype-module/src/migrations',1466528909),('m160411_082658_rename_name_id_column','@vendor/dmstr/yii2-pages-module/migrations',1466528909),('m160411_111111_name_id_to_domain_id_renamer','@vendor/dmstr/yii2-pages-module/migrations',1466528909),('m160504_032335_add_twig_table','@vendor/dmstr/yii2-prototype-module/src/migrations',1466617681),('m160623_153352_add_new_field_to_user','@app/migrations',1466697998),('m160623_164857_add_fields_to_profile','@app/migrations',1466700598);
/*!40000 ALTER TABLE `migration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outcome_category`
--

DROP TABLE IF EXISTS `outcome_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outcome_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `outcome` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outcome_category`
--

LOCK TABLES `outcome_category` WRITE;
/*!40000 ALTER TABLE `outcome_category` DISABLE KEYS */;
INSERT INTO `outcome_category` VALUES (1,'Resolved'),(2,'Refered'),(3,'N/A');
/*!40000 ALTER TABLE `outcome_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phone`
--

DROP TABLE IF EXISTS `phone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phone` (
  `id` int(11) NOT NULL,
  `comment` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phone`
--

LOCK TABLES `phone` WRITE;
/*!40000 ALTER TABLE `phone` DISABLE KEYS */;
/*!40000 ALTER TABLE `phone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile`
--

DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `public_email` varchar(255) DEFAULT NULL,
  `gravatar_email` varchar(255) DEFAULT NULL,
  `gravatar_id` varchar(32) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `bio` text,
  `id_country` int(11) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT NULL,
  `skills` text,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `birthday` date NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `terms` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_profile` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile`
--

LOCK TABLES `profile` WRITE;
/*!40000 ALTER TABLE `profile` DISABLE KEYS */;
INSERT INTO `profile` VALUES (1,'','','info@open-ecommerce.org','e49de8ff6009a963195568839177e24d','','','',NULL,NULL,NULL,NULL,NULL,'1966-07-16','',0),(2,'Eduardo Silva','eduardo@open-ecommerce.org','eduardo@open-ecommerce.org','1f6df2c9dac05c886ac3f90e692f93af','London','http://www.open-ecommerce.org','Esto solo lo que quiero decir de mi',16,0,'eduardo adfasf','Cachoddddddddd','Fontanadddddd','2016-06-17','',0),(3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00','',0),(4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00','',0),(5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00','',0),(6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00','',0);
/*!40000 ALTER TABLE `profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sender_type`
--

DROP TABLE IF EXISTS `sender_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sender_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_type` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sender_type`
--

LOCK TABLES `sender_type` WRITE;
/*!40000 ALTER TABLE `sender_type` DISABLE KEYS */;
INSERT INTO `sender_type` VALUES (1,'Automated Response'),(2,'Clients'),(3,'Helpers');
/*!40000 ALTER TABLE `sender_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'boolean','app.assets','registerPrototypeAsset','1',0,'2016-06-22 09:34:27','2016-06-22 09:34:27');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `severity`
--

DROP TABLE IF EXISTS `severity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `severity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `severity` varchar(50) NOT NULL COMMENT 'Severity',
  `sla` text NOT NULL COMMENT 'Sevice Level Agreement',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `severity`
--

LOCK TABLES `severity` WRITE;
/*!40000 ALTER TABLE `severity` DISABLE KEYS */;
INSERT INTO `severity` VALUES (1,'Severity 1','Contact the client within 24hs');
/*!40000 ALTER TABLE `severity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_account`
--

DROP TABLE IF EXISTS `social_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social_account` (
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_account`
--

LOCK TABLES `social_account` WRITE;
/*!40000 ALTER TABLE `social_account` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `text`
--

DROP TABLE IF EXISTS `text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `text` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_phone` int(11) NOT NULL DEFAULT '0',
  `id_case` int(11) NOT NULL DEFAULT '0',
  `id_sender_type` int(11) NOT NULL DEFAULT '0',
  `message` varchar(50) NOT NULL DEFAULT '0',
  `sent` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `text`
--

LOCK TABLES `text` WRITE;
/*!40000 ALTER TABLE `text` DISABLE KEYS */;
/*!40000 ALTER TABLE `text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `text_template`
--

DROP TABLE IF EXISTS `text_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `text_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  `message` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `text_template`
--

LOCK TABLES `text_template` WRITE;
/*!40000 ALTER TABLE `text_template` DISABLE KEYS */;
/*!40000 ALTER TABLE `text_template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `user_id` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `created_at` int(11) NOT NULL,
  `type` smallint(6) NOT NULL,
  UNIQUE KEY `token_unique` (`user_id`,`code`,`type`),
  CONSTRAINT `fk_user_token` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (3,'rW55xKLmOt3tD4z3KAqN6F-iI_Ez-Bd4',1466680022,0);
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `twig`
--

DROP TABLE IF EXISTS `twig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `twig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `twig_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `twig`
--

LOCK TABLES `twig` WRITE;
/*!40000 ALTER TABLE `twig` DISABLE KEYS */;
/*!40000 ALTER TABLE `twig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','info@open-ecommerce.org','$2y$10$pF12T5IRobdd/OevEABPxOnWhCq0/sOZaHQosPlE9IKIaAqT8wbfG','L4DEoxYf4R9C3ZvHP8uBzwcSbq5vo5mP',1466528922,NULL,NULL,NULL,1425651628,1466588159,0),(2,'eduardo','eduardo@open-ecommerce.org','$2y$10$5XvUqUKzmMSjbGdta31uT.6HPFeotNutWRIivuuM71g03DS4OS/iK','uqe7SH5MKQYWpHUe7Mn42svnEmWkuVCI',1425651715,NULL,NULL,'192.168.1.74',1425651715,1466588060,0),(3,'Tester1','tester1@open-ecommerce.org','$2y$10$Z7bPvb4BRJf6CQJ/tL8vOOJssrJLlcFyLF9ZkC.74LXq6Tj5NGZji','zlUuQlMHPdSM-wTTlPkzhe3jvnoFJkBX',1466680707,NULL,NULL,'127.0.0.1',1466680022,1466680022,0),(4,'mariano','mariano@open-ecommerce.org','$2y$10$lxmIAPinglkzrcFfyj/DQ.l5JbfXphXb44YelwqSkiTLeKOBdiKEW','YZ0hyKV6Je2_2DO3mp-JeUFMO5WI-hZN',1466680738,NULL,NULL,'192.168.1.74',1466680738,1466680738,0),(5,'aguien','tester2@algo.com','$2y$10$Sla0IaYXAHdyrY.mLE1xfufgO7frV6U.Rodw1o5/XgBab4pdP6Kva','DG1ZZKMgydtwVXMjYrMXKFkV7ne-SJw_',1466695513,NULL,NULL,'192.168.1.74',1466695513,1466695513,0),(6,'cacho1','cacho@cacho.com','$2y$10$hmbMzLJsgA1DhkbSQyOuj.HZcEqWGrKYq0y8ohpUNt7AegY8YIc32','RoqqXH4h5NUYSXlXJZRqBK6gB3MGgG7_',1466758216,NULL,NULL,'192.168.1.74',1466758216,1466758216,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-28 18:12:04
