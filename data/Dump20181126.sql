-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: kkb
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `open_course`
--

DROP TABLE IF EXISTS `open_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `open_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(200) NOT NULL,
  `time` datetime DEFAULT NULL,
  `count` int(11) DEFAULT '0',
  `poster` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='公开课表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `open_course`
--

LOCK TABLES `open_course` WRITE;
/*!40000 ALTER TABLE `open_course` DISABLE KEYS */;
INSERT INTO `open_course` VALUES (1,'互联网海量分布式架构演进之路','互联网海量分布式架构演进之路','2011-11-11 20:00:00',0,NULL),(2,'Python多线程故事','理解多线程编程的意义和作用','2011-11-18 20:00:00',0,NULL),(3,'aaa','bbb','2018-11-15 20:00:00',0,NULL),(4,'node.js初体验',' /admin/open-courses-update/op\r\n        ','2018-11-16 12:30:00',0,'a62d465691bd9b6b5d492e0d7509a7bf'),(5,'node.js初体验','lalalalalalala','2018-11-16 20:30:00',0,'980d04e41c3a3d93fb71ec2de025b0b3'),(6,'node.js初体验','lalalalalalala','2018-11-16 20:30:00',0,'1542374854364'),(7,'node.js初体验','','2018-11-16 20:00:00',0,'1542375399845.jpg'),(8,'node.js初体验','eqrer','2018-11-18 20:00:00',0,'1542376410117.jpg'),(9,'node.js初体验','eqrer','2018-11-18 20:00:00',0,'1542376536621.jpg'),(10,'node.js初体验','eqrer','2018-11-18 20:00:00',0,'1542376594004.jpg');
/*!40000 ALTER TABLE `open_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opencourse`
--

DROP TABLE IF EXISTS `opencourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `opencourse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opencourse`
--

LOCK TABLES `opencourse` WRITE;
/*!40000 ALTER TABLE `opencourse` DISABLE KEYS */;
/*!40000 ALTER TABLE `opencourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'17337952504','17337952504','123');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verify_code`
--

DROP TABLE IF EXISTS `verify_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `verify_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(11) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verify_code`
--

LOCK TABLES `verify_code` WRITE;
/*!40000 ALTER TABLE `verify_code` DISABLE KEYS */;
INSERT INTO `verify_code` VALUES (1,'17337952504','949439','2018-11-21 21:16:43'),(2,'17337952504','210939','2018-11-21 21:31:26');
/*!40000 ALTER TABLE `verify_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vip_course`
--

DROP TABLE IF EXISTS `vip_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `vip_course` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `poster` varchar(256) DEFAULT NULL,
  `icon` varchar(256) DEFAULT NULL,
  `desc` varchar(200) DEFAULT NULL,
  `cooperation` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='VIP课程表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vip_course`
--

LOCK TABLES `vip_course` WRITE;
/*!40000 ALTER TABLE `vip_course` DISABLE KEYS */;
INSERT INTO `vip_course` VALUES (1,'WEB全栈架构师','/vip-course/web','https://img.kaikeba.com/web_vip.png','https://img.kaikeba.com/web_menu.png','授课深度对标百度，。。。。。。。。。。。。https://img.kaikeba.com/baidu.png','https://img.kaikeba.com/baidu.png,https://img.kaikeba.com/toutiao.png'),(2,'Python爬虫训练营','/vip-course/python','https://img.kaikeba.com/web_vip.png','https://img.kaikeba.com/web_menu.png','授课深度对标百度，。。。。。。。。。。。。https://img.kaikeba.com/baidu.png','https://img.kaikeba.com/baidu.png,https://img.kaikeba.com/toutiao.png');
/*!40000 ALTER TABLE `vip_course` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-11-26 23:05:54
