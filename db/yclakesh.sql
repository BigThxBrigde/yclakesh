# Host: localhost  (Version: 5.6.20)
# Date: 2019-07-24 21:37:32
# Generator: MySQL-Front 5.3  (Build 4.13)

/*!40101 SET NAMES utf8 */;

#
# Source for table "member_info"
#

DROP TABLE IF EXISTS `member_info`;
CREATE TABLE `member_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `member_info` varchar(255) NOT NULL DEFAULT '',
  `Certfication` blob NOT NULL,
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
  `SerialId` varchar(20) NOT NULL DEFAULT '',
  `IdentifyCode` varchar(20) NOT NULL DEFAULT '',
  `FirstTime` datetime DEFAULT NULL,
  `QueryCount` int(8) DEFAULT NULL,
  `Member` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "qrcode_info"
#


#
# Source for table "user_info"
#

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `type` smallint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "user_info"
#

INSERT INTO `user_info` VALUES (1,'admin','admin',0);
