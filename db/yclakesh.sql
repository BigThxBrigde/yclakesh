# Host: localhost  (Version: 5.6.20)
# Date: 2019-07-30 19:46:25
# Generator: MySQL-Front 5.3  (Build 4.13)

/*!40101 SET NAMES utf8 */;

#
# Source for table "member_info"
#

DROP TABLE IF EXISTS `member_info`;
CREATE TABLE `member_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Certification` mediumblob DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "member_info"
#


#
# Source for table "qrcode_info"
#

DROP TABLE IF EXISTS `qrcode_info`;
CREATE TABLE `qrcode_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Url` varchar(255) DEFAULT NULL,
  `SerialId` varchar(20) NOT NULL DEFAULT '',
  `IdentifyCode` varchar(20) NOT NULL DEFAULT '',
  `FirstTime` datetime DEFAULT NULL,
  `QueryCount` int(8) DEFAULT NULL,
  `Member` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Index_SerialId_IdentiyCode` (`SerialId`,`IdentifyCode`)
) ENGINE=InnoDB AUTO_INCREMENT=3951 DEFAULT CHARSET=utf8;

#
# Data for table "qrcode_info"
#


#
# Source for table "user_info"
#

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL DEFAULT '',
  `Password` varchar(255) NOT NULL DEFAULT '',
  `Type` smallint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

#
# Data for table "user_info"
#

INSERT INTO `user_info` VALUES (2,'admin','21232f297a57a5a743894a0e4a801fc3',0);
