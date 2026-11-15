-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: portfolio_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `portfolio_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `portfolio_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `portfolio_db`;

--
-- Table structure for table `_experiencetechnologies`
--

DROP TABLE IF EXISTS `_experiencetechnologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_experiencetechnologies` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_ExperienceTechnologies_AB_unique` (`A`,`B`),
  KEY `_ExperienceTechnologies_B_index` (`B`),
  CONSTRAINT `_ExperienceTechnologies_A_fkey` FOREIGN KEY (`A`) REFERENCES `experience` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ExperienceTechnologies_B_fkey` FOREIGN KEY (`B`) REFERENCES `technology` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_experiencetechnologies`
--

LOCK TABLES `_experiencetechnologies` WRITE;
/*!40000 ALTER TABLE `_experiencetechnologies` DISABLE KEYS */;
/*!40000 ALTER TABLE `_experiencetechnologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('cd6c9e25-b1c1-4578-905a-d5017a3d7ea4','9496c665f2cd4195a1b2c089747ba2d374f5f0e52ba0c383406d5010b4a89c65','2026-09-17 20:43:16.284','20260905164713_init',NULL,NULL,'2026-09-17 20:43:15.449',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_projecttechnologies`
--

DROP TABLE IF EXISTS `_projecttechnologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_projecttechnologies` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_ProjectTechnologies_AB_unique` (`A`,`B`),
  KEY `_ProjectTechnologies_B_index` (`B`),
  CONSTRAINT `_ProjectTechnologies_A_fkey` FOREIGN KEY (`A`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ProjectTechnologies_B_fkey` FOREIGN KEY (`B`) REFERENCES `technology` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_projecttechnologies`
--

LOCK TABLES `_projecttechnologies` WRITE;
/*!40000 ALTER TABLE `_projecttechnologies` DISABLE KEYS */;
INSERT INTO `_projecttechnologies` VALUES ('6ca30ee4-7243-4e16-a437-31fcef89c0ec','0f7eedbf-bb78-463b-b891-d91f90b433a6'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','47256ed1-ba00-4876-b691-1ff57c5659b3'),('2e78851b-35f0-4611-8482-8768464c582b','6207a6c7-cf63-41cc-ab6d-ae4f23d8c288'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','6207a6c7-cf63-41cc-ab6d-ae4f23d8c288'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','6207a6c7-cf63-41cc-ab6d-ae4f23d8c288'),('2e78851b-35f0-4611-8482-8768464c582b','6472a496-7e9b-4300-b89d-5f056646ceda'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','6472a496-7e9b-4300-b89d-5f056646ceda'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','6472a496-7e9b-4300-b89d-5f056646ceda'),('2e78851b-35f0-4611-8482-8768464c582b','653a5682-c186-49d7-9157-55950a812463'),('6ca30ee4-7243-4e16-a437-31fcef89c0ec','653a5682-c186-49d7-9157-55950a812463'),('2e78851b-35f0-4611-8482-8768464c582b','78520493-ee39-49b0-b685-c5a57fb52d5f'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','78520493-ee39-49b0-b685-c5a57fb52d5f'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','79b00368-afde-4b47-8326-ae41b4a171f2'),('2e78851b-35f0-4611-8482-8768464c582b','8541b912-6d7c-4925-b90c-02f527ca65bf'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','8541b912-6d7c-4925-b90c-02f527ca65bf'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','8541b912-6d7c-4925-b90c-02f527ca65bf'),('6ca30ee4-7243-4e16-a437-31fcef89c0ec','98a656ae-fb40-44b0-8e4a-79d6d57aee1e'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','c3912460-7cb8-41b9-9181-d7af32b4575c'),('2e78851b-35f0-4611-8482-8768464c582b','db823a1c-3d69-4c04-960d-6f900aaf36de'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','db823a1c-3d69-4c04-960d-6f900aaf36de'),('6ca30ee4-7243-4e16-a437-31fcef89c0ec','db823a1c-3d69-4c04-960d-6f900aaf36de'),('6ca30ee4-7243-4e16-a437-31fcef89c0ec','ea120b71-5038-402b-86f8-2fc0bb56cfd7');
/*!40000 ALTER TABLE `_projecttechnologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aboutsettings`
--

DROP TABLE IF EXISTS `aboutsettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aboutsettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'singleton',
  `badge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'About Me',
  `badgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'نبذة عني',
  `headline` text COLLATE utf8mb4_unicode_ci,
  `headlineAr` text COLLATE utf8mb4_unicode_ci,
  `bioParagraph1` text COLLATE utf8mb4_unicode_ci,
  `bioParagraph1Ar` text COLLATE utf8mb4_unicode_ci,
  `bioParagraph2` text COLLATE utf8mb4_unicode_ci,
  `bioParagraph2Ar` text COLLATE utf8mb4_unicode_ci,
  `coreStack` text COLLATE utf8mb4_unicode_ci,
  `coreStackAr` text COLLATE utf8mb4_unicode_ci,
  `bentoCards` text COLLATE utf8mb4_unicode_ci,
  `bentoCardsAr` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aboutsettings`
--

LOCK TABLES `aboutsettings` WRITE;
/*!40000 ALTER TABLE `aboutsettings` DISABLE KEYS */;
INSERT INTO `aboutsettings` VALUES ('singleton','About Me','نبذة عني','Crafting Scalable Software with Purpose & Precision.','بناء برمجيات قابلة للتوسع بدقة واحترافية.','I\'m Yousef Ayoubi — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production. From custom CRMs and business operations platforms to high-performance web applications and scalable REST & GraphQL APIs.','أنا يوسف أيوبي — مهندس حاسوب ومطور برمجيات متكامل متخصص في بناء أنظمة تعمل بكفاءة في بيئة الإنتاج الفعلية، من أنظمة CRM وإدارة العمليات المخصصة إلى تطبيقات الويب عالية الأداء وواجهات REST و GraphQL البرمجية.','I specialize in architecting modern frontends (React, Next.js) tightly integrated with resilient backends (Node.js, Express.js, relational & NoSQL databases). Grounded in core computer engineering fundamentals, I focus on end-to-end performance optimization, clean maintainable code, and scalable systems that directly drive business growth','أتخصص في تصميم ومعمارية واجهات أمامية حديثة (React, Next.js) متكاملة بدقة مع خوادم خلفية عالية الاعتمادية (Node.js, Express.js، وقواعد البيانات). انطلاقاً من أساسيات هندسة الحاسوب، أركز على تحسين الأداء الشامل، كتابة كود نظيف وقابل للصيانة، وبناء أنظمة قابلة للتوسع تدعم نمو الأعمال مباشرة','[\"HTML\",\"Tailwind CSS\",\"Javascript\",\"Typescript\",\"React.js\",\"Next.js\",\"Node.js\",\"Express.js\",\"React Native\",\"Flutter\",\"Dart\",\"C#\",\"asp.Net\",\"MySQL\",\"PostgreSQL\",\"MongoDB\",\"Prisma ORM\",\"Redis\",\"GraphQL\",\"REST APIs\"]','[\"HTML\",\"Tailwind CSS\",\"Javascript\",\"Typescript\",\"React.js\",\"Next.js\",\"Node.js\",\"Express.js\",\"React Native\",\"Flutter\",\"Dart\",\"C#\",\"asp.Net\",\"MySQL\",\"PostgreSQL\",\"MongoDB\",\"Prisma ORM\",\"Redis\",\"GraphQL\",\"REST APIs\"]','[{\"id\":\"01\",\"title\":\"Clean Architecture\",\"description\":\"Maintainable, scalable codebases built on proven patterns. Every module, layer, and abstraction is intentional — with React, Next.js, and Node.js as the engineering backbone.\",\"icon\":\"Database\",\"titleAr\":\"معمارية برمجية نظيفة\",\"descriptionAr\":\"قواعد برمجية قابلة للصيانة والتوسع مبنية على أنماط تصميم موثوقة. كل وحدة وطبقة برمجية صُممت بغرض محدد — مع اعتماد React و Next.js و Node.js كركائز هندسية أساسية.\"},{\"id\":\"02\",\"title\":\"Business-First Mindset\",\"description\":\"Software engineered to solve real operational bottlenecks and unlock growth. Custom CRMs, workflow automation, and APIs designed around measurable business outcomes — not just technical elegance.\",\"titleAr\":\"عقلية تركز على نمو الأعمال\",\"descriptionAr\":\"برمجيات تم تطويرها لحل اختناقات العمليات الحقيقية وتحفيز النمو. أنظمة CRM مخصصة، أتمتة مسارات العمل، وواجهات برمجية تم تصميمها حول نتائج أعمال قابلة للقياس — وليست مجرد أناقة تقنية.\",\"icon\":\"Trending-up\"},{\"id\":\"03\",\"title\":\"Performance & Reliability\",\"description\":\"Zero compromise on load speeds, database query optimization, and robust API architecture. Sub-second response times, efficient caching strategies, and battle-tested error handling baked in from day one — not bolted on after.\",\"titleAr\":\"الأداء والاعتمادية\",\"descriptionAr\":\"لا مساومة على سرعة التحميل، تحسين استعلامات قواعد البيانات، وبناء واجهات برمجية متينة. أوقات استجابة فائقة، استراتيجيات تخزين مؤقت فعالة، ومعالجة أخطاء مجربة منذ اليوم الأول.\",\"icon\":\"Zap\"}]','[{\"id\":\"01\",\"title\":\"معمارية برمجية نظيفة\",\"description\":\"قواعد برمجية قابلة للصيانة والتوسع مبنية على أنماط تصميم موثوقة. كل وحدة وطبقة برمجية صُممت بغرض محدد — مع اعتماد React و Next.js و Node.js كركائز هندسية أساسية.\",\"icon\":\"Database\"},{\"id\":\"02\",\"title\":\"عقلية تركز على نمو الأعمال\",\"description\":\"برمجيات تم تطويرها لحل اختناقات العمليات الحقيقية وتحفيز النمو. أنظمة CRM مخصصة، أتمتة مسارات العمل، وواجهات برمجية تم تصميمها حول نتائج أعمال قابلة للقياس — وليست مجرد أناقة تقنية.\",\"icon\":\"Trending-up\"},{\"id\":\"03\",\"title\":\"الأداء والاعتمادية\",\"description\":\"لا مساومة على سرعة التحميل، تحسين استعلامات قواعد البيانات، وبناء واجهات برمجية متينة. أوقات استجابة فائقة، استراتيجيات تخزين مؤقت فعالة، ومعالجة أخطاء مجربة منذ اليوم الأول.\",\"icon\":\"Zap\"}]','2026-09-17 20:43:41.495','2026-11-15 13:03:51.249');
/*!40000 ALTER TABLE `aboutsettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adminuser`
--

DROP TABLE IF EXISTS `adminuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminuser` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminUser_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminuser`
--

LOCK TABLES `adminuser` WRITE;
/*!40000 ALTER TABLE `adminuser` DISABLE KEYS */;
INSERT INTO `adminuser` VALUES ('a74263b7-f9cb-4dfe-b684-bf1f6e6587c2','admin@example.com','$2b$10$a.224adiYVP9isDhaPLrAucrzrU5eI.uVntdw912oPGxJnBR48aQK','2026-09-17 20:43:23.198','2026-09-17 20:43:23.198');
/*!40000 ALTER TABLE `adminuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `issuerAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issueDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credentialUrl` text COLLATE utf8mb4_unicode_ci,
  `credentialId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'award',
  `skills` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skillsAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `imageUrl` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
INSERT INTO `certificate` VALUES ('16f3e014-325d-4153-bd48-c96ce0531a6a','Biruni IT Summit Certificate of Participation','شهادة مشاركة في قمة بيروني لتكنولوجيا المعلومات','TIEC & Biruni University','مركز TIEC وجامعة بيروني','2025',NULL,'DC-aYdKnrx5','terminal','Information Technology, Software Engineering, IT Summit, Tech Networking','تكنولوجيا المعلومات، هندسة البرمجيات، قمة تقنية، شبكات التواصل المهني',1,'2026-09-18 11:17:23.054','2026-10-17 20:46:23.739','/biruni_sertafika.webp'),('4a640d7f-0cc3-42af-b87b-389503c76898','Professional Software Engineering Certification','شهادة التأهيل المهني وهندسة البرمجيات','Forsa Academy','أكاديمية فرصة للتعليم والتدريب','2024',NULL,'FOR-SE-2024','award','Software Engineering, Clean Architecture, Systems Design','هندسة البرمجيات، المعمارية النظيفة، تصميم الأنظمة',5,'2026-10-17 20:46:23.819','2026-10-17 20:46:23.819','/forsa_sertafika.webp'),('686d94c1-f66a-4d96-a5de-098190da69e3','Full-Stack Web Development Track','مسار تطوير الويب المتكامل وتطبيقات الإنترنت','Edraak & Queen Rania Foundation','منصة إدراك ومؤسسة الملكة رانيا','2024',NULL,'EDR-FSWD-2024','award','React, Node.js, Web Architecture, Full-Stack Development','تطوير الواجهات، خوادم Node.js، معماريات الويب، التطوير المتكامل',4,'2026-10-17 20:46:23.799','2026-10-17 20:46:23.799','/edraak_certificate.webp'),('76dbcac7-555b-4d9f-a68c-89c0115ece8b','React & Modern Frontend Architecture Mastery','احتراف مكتبة React وهندسة واجهات الويب الحديثة','Mind Luster International','أكاديمية مايند لستر الدولية','2024',NULL,'ML-REACT-9842','award','React, Next.js, Modern JavaScript, Frontend Architecture','رياكت، جافاسكريبت المتقدمة، معمارية الواجهات، نكست جي اس',6,'2026-10-17 20:46:23.831','2026-10-17 20:46:23.831','/mindluster_sertafika.webp'),('c69ea7cd-3e67-41ee-9d82-bd9aaaf61fa1','Huawei Cloud 101 Training Certificate','شهادة تدريب الحوسبة السحابية Huawei Cloud 101','Huawei Student Developers (HSD) & Biruni University','مطورو هواوي للطلاب (HSD) وجامعة بيروني','2025',NULL,'HSD-HC101-2025','cloud','Huawei Cloud, Cloud Infrastructure, Serverless Computing, Cloud Architecture','سحابة هواوي، البنية التحتية السحابية، الحوسبة بدون خادم، المعمارية السحابية',2,'2026-09-18 11:17:23.047','2026-10-17 20:46:23.761','/hwawi_sertafika.webp'),('e6edb18f-4ad3-4317-8967-dbdd9a20387a','NextGen: Engineering Summit Certificate of Participation','شهادة مشاركة في قمة NextGen الهندسية','Etkin Kampüs & Digicertify','إتكن كامبوس و ديجيسيرتيفاي (Etkin Kampüs & Digicertify)','2026',NULL,'DC-e51gr6y4','award','NextGen Engineering, Software Engineering, Systems Architecture, Tech Summit','هندسة الجيل القادم، هندسة البرمجيات، معمارية الأنظمة، مؤتمرات تقنية',3,'2026-09-18 11:17:23.058','2026-10-17 20:46:23.769','/nextgen_sertifika.webp');
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startDate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endDate` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `responsibilities` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'blue',
  `companyAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descriptionAr` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'briefcase',
  `locationAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `positionAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responsibilitiesAr` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'work',
  `endDateAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDateAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience`
--

LOCK TABLES `experience` WRITE;
/*!40000 ALTER TABLE `experience` DISABLE KEYS */;
INSERT INTO `experience` VALUES ('1c464a2f-512c-4aa9-853c-693954ee0d68','Scramblebit Pazarlama Programlama Ltd. Şti.','Full-Stack Software Engineering Intern','2026','','Istanbul, Turkey (On-site)','Collaborating with the software engineering team to develop responsive web applications and backend APIs. Contributing to feature implementation, code optimization, database query tuning, and integration tests using clean code architecture.',NULL,'2026-09-18 11:17:23.042','2026-09-18 11:17:23.042','amber','شركة سكرامبل بت المحدودة (Scramblebit)','التعاون مع فريق هندسة البرمجيات لتطوير تطبيقات ويب متجاوبة وواجهات برمجية خلفية. المساهمة في تنفيذ الميزات، وتحسين أداء الكود، وضبط استعلامات قواعد البيانات، واختبارات التكامل وفق معايير الكود النظيف.','briefcase','إسطنبول، تركيا (حضوري)',5,'متدرب هندسة برمجيات متكاملة (Full-Stack)',NULL,'work','',NULL),('56e76070-bf80-40fe-9668-f68503025847','Self-Employed / Freelance','Freelance UI/UX Designer & Frontend Developer','2023','2024','Remote','Initiated freelance career focusing on UI/UX design and modern web interface engineering. Designed user-centric wireframes, interactive prototypes, and responsive layouts, translating design systems into clean, component-driven frontend code.',NULL,'2026-09-18 11:17:23.030','2026-09-18 11:17:23.030','purple','عمل حر / مستقل','بدء العمل الحر بالتركيز على تصميم تجربة وواجهة المستخدم (UI/UX) وهندسة واجهات الويب الحديثة. تصميم مخططات أولية ونماذج تفاعلية موجهة للمستخدم، وتحويل نظم التصميم إلى كود واجهات أمامية نظيف ومبني على المكونات (Components).','laptop','عن بُعد',2,'مصمم UI/UX ومطور واجهات أمامية مستقل',NULL,'work','2024',NULL),('68a4e64f-feef-40b5-9e64-25306bd994af','Biruni University','B.Sc. in Computer Engineering','2023','Present','Istanbul, Turkey','Pursuing a B.Sc. in Computer Engineering, integrating core software engineering principles, advanced algorithms, and AI fundamentals with real-world system architecture. Deep-diving into relational database normalization, object-oriented design patterns, and scalable full-stack web engineering while solving complex computational problems.',NULL,'2026-09-18 11:17:23.023','2026-09-18 11:17:23.023','emerald','جامعة بيروني','دراسة بكالوريوس هندسة الحاسوب، مع دمج مبادئ هندسة البرمجيات الأساسية، والخوارزميات المتقدمة، وأساسيات الذكاء الاصطناعي مع معمارية الأنظمة الواقعية. دراسة معمقة لتصميم وتطبيع قواعد البيانات، وأنماط التصميم كائنية التوجه (OOP)، وهندسة تطبيقات الويب الكاملة لحل المشكلات الحسابية المعقدة.','graduation-cap','إسطنبول، تركيا',1,'بكالوريوس في هندسة الحاسوب',NULL,'education','حتى الآن',NULL),('7621dca2-50a6-4761-a27d-e6c23b3e6487','VecMenu','Co-Founder & Lead Frontend Engineer','2024','Present','Istanbul, Turkey','Co-founded VecMenu, a QR-based digital menu platform for modern restaurant operations. Engineered reactive, multi-language React/Next.js frontends, established scalable client UI architectures, and led product engineering from concept to deployment.',NULL,'2026-09-18 11:17:23.034','2026-09-18 11:17:23.034','coral','فيك منيو (VecMenu)','المشاركة في تأسيس VecMenu، وهي منصة قوائم طعام رقمية ذكية عبر الـ QR لإدارة المطاعم الحديثة. هندسة وتطوير واجهات تفاعلية متعددة اللغات بالاعتماد على React و Next.js، وبناء معمارية واجهات قابلة للتوسع، وقيادة تطوير المنتج من الفكرة حتى الإطلاق.','rocket','إسطنبول، تركيا',3,'شريك مؤسس وقائد هندسة الواجهات الأمامية',NULL,'work','حتى الآن',NULL),('9fc70e2d-1565-458a-94de-a55fbfcc160e','Enterprise & CRM Solutions','Full-Stack & Systems Engineer','2024','Present','Remote','Architecting full-stack enterprise CRM platforms, scalable backend APIs, and custom database schemas. Integrating AI-assisted tools, robust RBAC authentication, and automated business workflows for high-availability production environments.',NULL,'2026-09-18 11:17:23.039','2026-09-18 11:17:23.039','blue','حلول المؤسسات وأنظمة الـ CRM','تصميم وبناء منصات CRM مؤسسية متكاملة، وواجهات برمجية خلفية قابلة للتوسع، ومخططات قواعد بيانات مخصصة. دمج أدوات الذكاء الاصطناعي، ونظام صلاحيات متقدم (RBAC)، وأتمتة مسارات العمل لبيئات إنتاج عالية التوفر والموثوقية.','chart','عن بُعد',4,'مهندس برمجيات متكامل وأنظمة',NULL,'work','حتى الآن',NULL);
/*!40000 ALTER TABLE `experience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqitem`
--

DROP TABLE IF EXISTS `faqitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqitem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoryAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `questionAr` text COLLATE utf8mb4_unicode_ci,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `answerAr` text COLLATE utf8mb4_unicode_ci,
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqitem`
--

LOCK TABLES `faqitem` WRITE;
/*!40000 ALTER TABLE `faqitem` DISABLE KEYS */;
INSERT INTO `faqitem` VALUES ('0201cacc-2668-4227-9bcc-7a0a4a699f7e','collab','التعاون والبدء','Do you sign NDAs or contracts?','هل توقع اتفاقيات عدم إفصاح (NDA) وعقود عمل رسمية؟','Yes, always. I sign a mutual NDA before any sensitive information is shared, and every project starts with a formal contract that outlines scope, milestones, payment schedule, and IP ownership. Your code and data are yours.','نعم دائماً. أوقع اتفاقية عدم إفصاح متبادلة (NDA) لحماية أفكارك، ويبدأ كل مشروع بعقد رسمي يوضح النطاق والمراحل وجدول الدفع وحقوق الملكية الفكرية الكاملة للكود الخاص بك.',16,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.236'),('02d41906-9f3a-4ca1-9f3f-7db74a8adf20','tech','التقنيات المستخدمة','What tools do you use for UI/UX design?','ما هي الأدوات التي تستخدمها في تصميم واجهات المستخدم؟','Figma is my primary design tool — for wireframes, high-fidelity mockups, interactive prototypes, and design systems. I also use Framer for motion prototyping when needed.','أعتمد على Figma كأداة رئيسية لتصميم النماذج الأولية والأنظمة التصميمية المتكاملة، بالإضافة إلى Framer لاختبار الحركات والتفاعلات المتقدمة.',12,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.259'),('0aa5b4b1-a8ef-4950-a610-1b5b7df865fc','collab','التعاون والبدء','How do we get started?','كيف نبدأ العمل معاً؟','Send me a message through the contact form below or email me directly. Describe your project, goals, and timeline. I will respond within 24 hours with a discovery call invitation or a direct quote depending on the scope.','أرسل لي رسالة عبر نموذج التواصل أدناه أو تواصل مباشرة عبر واتساب أو البريد الإلكتروني. وضح أهداف مشروعك والجدول المتوقع، وسأرد عليك خلال 24 ساعة بمقترح ومكالمة لتحديد تفاصيل البدء.',13,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.270'),('3e71f307-fcac-4d67-b6f2-b5b74a2f5507','process','منهجية وسير العمل','Do you offer post-launch support and maintenance?','هل تقدم خدمات الدعم الفني والصيانة بعد الإطلاق؟','Yes. I offer post-launch support packages that cover bug fixes, performance monitoring, dependency updates, and feature iterations. We agree on the scope at the start of the engagement.','نعم. أقدم حزم دعم فني بعد الإطلاق تشمل إصلاح أي مشكلات، مراقبة الأداء، تحديث التبعيات البرمجية، وإضافة تحسينات وميزات جديدة حسب الاتفاق.',8,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.278'),('3f47293f-ac6f-4a1f-ab60-49273625948b','services','الخدمات ونطاق العمل','Do you offer freelance and consulting engagements?','هل تقدم خدمات العمل الحر والاستشارات البرمجية المستمرة؟','Yes. I am available for freelance project contracts, part-time consulting, and long-term retainer arrangements. I also offer code-review sessions and architecture consulting for existing teams.','نعم، أنا متاح للمشاريع التعاقدية الحرة، والاستشارات الجزئية، وعقود الدعم المستمر، بالإضافة لجلسات تدقيق الأكواد وتقديم الاستشارات المعمارية للفرق البرمجية.',2,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.286'),('52191d40-293d-4d5b-8dee-c3304b3ed640','process','منهجية وسير العمل','How long does it take to build a web application?','كم من الوقت يستغرق بناء تطبيق ويب متكامل؟','A focused MVP can be production-ready in 2–4 weeks. A full-featured SaaS or CRM platform typically takes 4–6 weeks. Timeline depends on feature complexity, design requirements, and third-party integrations. I always provide a clear estimate upfront.','النموذج الأولي المركز (MVP) يمكن إطلاقه خلال 2 إلى 4 أسابيع. المنصات الشاملة أو أنظمة الـ CRM تستغرق عادة من 4 إلى 6 أسابيع حسب تعقيد الميزات والربط مع الخدمات الخارجية، مع تقديم جدول زمني واضح ومحدد مسبقاً.',6,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.294'),('5462014c-9f76-4567-9687-52eec8640387','collab','التعاون والبدء','What information do you need to provide a quote?','ما هي التفاصيل المطلوبة لتقديم عرض سعر وتقدير زمني؟','A brief project description, key features or pages needed, any design references you like, your target launch date, and budget range. The more context you share, the more accurate the estimate I can provide.','وصف موجز للمشروع، الميزات الرئيسية المطلوبة، نماذج أو مواقع ملهمة تعجبك، موعد الإطلاق المستهدف، والنطاق المالي المتوقع. كلما كانت التفاصيل أوضح، كان التقدير أكثر دقة.',15,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.303'),('5d27de23-48be-4ddf-a3b9-e3e32f585b73','services','الخدمات ونطاق العمل','What types of projects do you take on?','ما هي أنواع المشاريع التي تعمل عليها؟','I work on full-stack web applications, custom CRM/ERP systems, REST & GraphQL APIs, e-commerce platforms, SaaS products, and mobile apps. Whether you need a polished MVP in weeks or a long-term engineering partner — I can help.','أعمل على تطوير تطبيقات الويب المتكاملة، أنظمة CRM/ERP المخصصة، واجهات برمجية REST و GraphQL، منصات التجارة الإلكترونية، منتجات SaaS، وتطبيقات الموبايل. سواءً كنت بحاجة لنموذج أولي سريع أو شريك تقني طويل الأمد.',1,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.310'),('69fa18c9-c56c-4871-8049-411f2626014f','tech','التقنيات المستخدمة','Do you build mobile applications?','هل تقوم بتطوير تطبيقات الهواتف المحمولة أيضاً؟','Yes. I build cross-platform mobile apps using Flutter and Dart — targeting both iOS and Android from a single codebase. This includes REST API integration, local storage, state management (Riverpod/Bloc), and App Store/Play Store deployment.','نعم. أقوم بتطوير تطبيقات متعددة المنصات باستخدام Flutter و Dart لنظامي iOS و Android مع تكامل الـ APIs، التخزين المحلي، إدارة الحالة المتقدمة، والنشر على المتاجر الرسمية.',11,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.320'),('850e6d38-b053-4d3d-95cc-d373d3d09a49','services','الخدمات ونطاق العمل','Do you provide UI/UX design as well?','هل تقدم خدمات تصميم واجهات وتجربة المستخدم (UI/UX) أيضاً؟','Yes. I design in Figma before writing a single line of code. I focus on clean, conversion-optimized interfaces that are both visually compelling and highly usable — consistent with modern design systems.','نعم، أصمم الواجهات على Figma قبل البدء بكتابة الأكواد. أركز على تجارب استخدام مدروسة وسلسة تجمع بين الجمالية البصرية وسهولة الاستخدام العالية المتوافقة مع أحدث أنظمة التصميم.',4,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.328'),('8aae7ad6-63fe-4d9d-b82c-f11210a898e5','collab','التعاون والبدء','Do you work with international clients?','هل تعمل مع عملاء دوليين من مختلف الدول؟','Yes, fully. I work asynchronously across time zones and communicate clearly in English and Arabic. Payments are accepted internationally via bank transfer, PayPal, or Wise.','نعم، أعمل مع عملاء حول العالم عبر مناطق زمنية مختلفة بتواصل سلس باللغتين العربية والإنجليزية، واستقبال الدفعات عبر التحويلات الدولية، PayPal، أو Wise.',14,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.338'),('ae7148f7-e497-4213-b577-70db0a8398a8','tech','التقنيات المستخدمة','What is your primary tech stack?','ما هي حزمتك التقنية الأساسية (Tech Stack)؟','On the front-end: React, Next.js, TypeScript, and Tailwind CSS. On the back-end: Node.js, Express, Prisma, and REST APIs. For databases: MySQL, PostgreSQL, and MongoDB. For mobile: Flutter/Dart. For DevOps: Docker, Nginx, and VPS/cloud hosting.','في الواجهات: React, Next.js, TypeScript, و Tailwind CSS. في الخوادم: Node.js, Express, Prisma, و REST APIs. في قواعد البيانات: MySQL, PostgreSQL, و MongoDB. في الموبايل: Flutter. وفي الاستضافة والـ DevOps: Docker, Nginx, وسيرفرات سحابية.',9,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.345'),('d3b191d3-98b9-492b-946a-ec392d52ce53','process','منهجية وسير العمل','Will I be able to track progress during development?','هل يمكنني متابعة سير العمل أثناء مرحلة التطوير؟','Yes. I use GitHub for version control (with shared access), and I schedule regular check-in calls. You will always know exactly what has been built, what is in progress, and what is next.','نعم بكل تأكيد. أستخدم مستودعات GitHub مع منح صلاحية المتابعة، بالإضافة لاجتماعات دورية وعروض حية لتعرف دائماً ما تم إنجازه وما يجري العمل عليه حالياً.',7,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.354'),('de727fa0-7ee6-4214-bb83-086dad01c6bc','tech','التقنيات المستخدمة','Can you work with an existing codebase or tech stack?','هل يمكنك العمل على مشروع أو كود موجود مسبقاً؟','Yes. I can join and contribute to existing projects regardless of the stack. I am comfortable doing code audits, refactoring legacy systems, and incrementally modernizing architectures without breaking production.','نعم. أستطيع الانضمام للمشاريع الحالية، تدقيق الأكواد القائمة، إعادة الهيكلة (Refactoring)، وتحديث المعماريات البرمجية تدريجياً دون تعطيل بيئة العمل المباشرة.',10,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.361'),('e8a73309-eb49-4c2c-828f-3132918afa56','services','الخدمات ونطاق العمل','Can you build both the front-end and back-end of an application?','هل يمكنك بناء كل من الواجهة الأمامية والخلفية للتطبيق بالكامل؟','Absolutely. I specialize in end-to-end development — from React/Next.js UI to Node.js/Express APIs, database design (MySQL, PostgreSQL, MongoDB), and cloud deployment. You get a single point of accountability.','بالتأكيد، أنا متخصص في التطوير المتكامل من البداية إلى النهاية — بدءاً من واجهات React/Next.js العصرية، إلى خوادم Node.js/Express، وتصميم قواعد البيانات (MySQL, PostgreSQL, MongoDB)، والنشر السحابي، مما يضمن لك نقطة مسؤولية واحدة لكامل المشروع.',3,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.370'),('f546c7fa-4a88-4c65-a744-75967096d753','process','منهجية وسير العمل','How does the project process typically work?','كيف تسير مرحلة تنفيذ المشروع عادةً؟','We start with a discovery call to clarify requirements and scope. I then deliver a technical proposal and timeline. Development follows in milestone-based sprints with live demos along the way. The project closes with deployment, handoff docs, and a support window.','نبدأ بجلسة استكشافية لتحديد المتطلبات والنطاق بدقة، ثم أقدم مقترحاً فنياً وجدولاً زمنياً مفصلاً. يجري التطوير عبر مراحل قصيرة مع عروض تجريبية حية، ويختتم المشروع بالنشر السحابي وتوثيق الكود وفترة دعم مخصصة.',5,1,'2026-09-17 20:43:41.509','2026-11-12 14:24:06.377');
/*!40000 ALTER TABLE `faqitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footersettings`
--

DROP TABLE IF EXISTS `footersettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `footersettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'singleton',
  `brandName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Yousef Ayoubi',
  `brandNameAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'يوسف الأيوبي',
  `brandRole` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Software Engineer',
  `brandRoleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'هندسة برمجيات',
  `brandDescription` text COLLATE utf8mb4_unicode_ci,
  `brandDescriptionAr` text COLLATE utf8mb4_unicode_ci,
  `showSocialLinks` tinyint(1) NOT NULL DEFAULT '1',
  `customSocialLinks` text COLLATE utf8mb4_unicode_ci,
  `servicesTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Services',
  `servicesTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'خدماتي',
  `servicesLinkText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'All Services →',
  `servicesLinkTextAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'جميع الخدمات ←',
  `servicesLinkUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '#services',
  `servicesLimit` int NOT NULL DEFAULT '5',
  `showServicesCol` tinyint(1) NOT NULL DEFAULT '1',
  `quickLinksTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Quick Links',
  `quickLinksTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'روابط سريعة',
  `quickLinks` text COLLATE utf8mb4_unicode_ci,
  `showQuickLinksCol` tinyint(1) NOT NULL DEFAULT '1',
  `contactTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Support & Contact',
  `contactTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'الدعم والتواصل',
  `contactEmail` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactLocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactLocationAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availabilityText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availabilityTextAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `showContactCol` tinyint(1) NOT NULL DEFAULT '1',
  `copyrightText` text COLLATE utf8mb4_unicode_ci,
  `copyrightTextAr` text COLLATE utf8mb4_unicode_ci,
  `secondaryBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secondaryBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `showBackToTop` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footersettings`
--

LOCK TABLES `footersettings` WRITE;
/*!40000 ALTER TABLE `footersettings` DISABLE KEYS */;
INSERT INTO `footersettings` VALUES ('singleton','Yousef Ayoubi','يوسف أيوبي','Computer Engineer','مهندس حاسوب','Full-Stack Engineer crafting performant digital products and resilient software architectures.','مهندس برمجيات متكامل يطور منتجات رقمية فائقة الأداء ومعماريات برمجية متينة.',1,'[{\"id\":\"1\",\"platform\":\"GitHub\",\"url\":\"https://github.com\",\"isEnabled\":true},{\"id\":\"2\",\"platform\":\"LinkedIn\",\"url\":\"https://linkedin.com\",\"isEnabled\":true},{\"id\":\"3\",\"platform\":\"Instagram\",\"url\":\"https://instagram.com\",\"isEnabled\":true},{\"id\":\"4\",\"platform\":\"WhatsApp\",\"url\":\"https://x.com\",\"isEnabled\":true}]','Services','خدماتي','All Services ','جميع الخدمات ','#services',4,1,'Quick Links','روابط سريعة','[{\"id\":\"1\",\"label\":\"About Me\",\"labelAr\":\"من أنا ورؤيتي\",\"url\":\"#about\",\"isEnabled\":true,\"order\":1},{\"id\":\"2\",\"label\":\"Featured Projects\",\"labelAr\":\"أعمالي ومشاريعي\",\"url\":\"#projects\",\"isEnabled\":true,\"order\":2},{\"id\":\"3\",\"label\":\"Skills & Stack\",\"labelAr\":\"المهارات والخبرات\",\"url\":\"#skills\",\"isEnabled\":true,\"order\":3},{\"id\":\"4\",\"label\":\"Experience & Career\",\"labelAr\":\"المسيرة المهنية\",\"url\":\"#experience\",\"isEnabled\":true,\"order\":4},{\"id\":\"5\",\"label\":\"Contact Me\",\"labelAr\":\"تواصل معي\",\"url\":\"#contact\",\"isEnabled\":true,\"order\":5},{\"id\":\"1792179613567\",\"label\":\"FAQS\",\"labelAr\":\"الاسئلة الشائعة\",\"url\":\"#faq\",\"isEnabled\":true,\"order\":6}]',1,'Contact','التواصل','yosof2005a@gmail.com','Istanbul, Turkey','إسطنبول، تركيا','+905519412068','','',1,'All rights reserved © 2026 Yousef Ayoubi.','جميع الحقوق محفوظة © 2026 يوسف الأيوبي.','Clean Code • High Performance','كود نظيف • أداء فائق',1,'2026-10-16 18:32:24.826','2026-11-13 12:36:50.858');
/*!40000 ALTER TABLE `footersettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `portfoliosettings`
--

DROP TABLE IF EXISTS `portfoliosettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portfoliosettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'singleton',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `heroText` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ctaText` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `availability` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `availabilityAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `backgroundPattern` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'subtle-grid',
  `bioAr` text COLLATE utf8mb4_unicode_ci,
  `cardStyle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'glassmorphic',
  `contactBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Get In Touch',
  `contactBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'تواصل معي',
  `contactSubtitle` text COLLATE utf8mb4_unicode_ci,
  `contactSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `contactTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Have an idea? Let''s talk.',
  `contactTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'لديك فكرة أو مشروع؟ دعنا نتحدث.',
  `ctaTextAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enableGlow` tinyint(1) NOT NULL DEFAULT '1',
  `experienceBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Career History & Academic Journey',
  `experienceBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'المسيرة المهنية والمحطات',
  `experienceSubtitle` text COLLATE utf8mb4_unicode_ci,
  `experienceSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `experienceTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Experience.',
  `experienceTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'الخبرات والمؤهلات.',
  `faqBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Got a question?',
  `faqBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'لديك سؤال؟',
  `faqSubtitle` text COLLATE utf8mb4_unicode_ci,
  `faqSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `faqTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Common Questions.',
  `faqTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'الأسئلة الأكثر شيوعاً.',
  `fontFamilyAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Cairo',
  `fontFamilyEn` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Geist',
  `footerText` text COLLATE utf8mb4_unicode_ci,
  `footerTextAr` text COLLATE utf8mb4_unicode_ci,
  `heroStats` text COLLATE utf8mb4_unicode_ci,
  `heroStatsAr` text COLLATE utf8mb4_unicode_ci,
  `heroTextAr` text COLLATE utf8mb4_unicode_ci,
  `locationAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nameAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryThemeColor` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'emerald',
  `profilePhoto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectsBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Featured Case Studies',
  `projectsBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'أعمال مختارة ودراسات حالة',
  `projectsSubtitle` text COLLATE utf8mb4_unicode_ci,
  `projectsSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `projectsTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Selected Work.',
  `projectsTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'المشاريع المميزة.',
  `servicesBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Consulting & Offerings',
  `servicesBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'الخدمات والاستشارات',
  `servicesSubtitle` text COLLATE utf8mb4_unicode_ci,
  `servicesSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `servicesTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Services.',
  `servicesTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'ما الذي أقدمه لك.',
  `skillsBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Skills & Expertise',
  `skillsBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'المهارات والقدرات التقنية',
  `skillsDescription` text COLLATE utf8mb4_unicode_ci,
  `skillsDescriptionAr` text COLLATE utf8mb4_unicode_ci,
  `skillsParagraph1` text COLLATE utf8mb4_unicode_ci,
  `skillsParagraph1Ar` text COLLATE utf8mb4_unicode_ci,
  `skillsParagraph2` text COLLATE utf8mb4_unicode_ci,
  `skillsParagraph2Ar` text COLLATE utf8mb4_unicode_ci,
  `skillsPoint1Text` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Clean RESTful APIs & modular database design built to last.',
  `skillsPoint1TextAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'واجهات برمجية RESTful نظيفة وتصميم قواعد بيانات متين صُمم ليدوم.',
  `skillsPoint1Title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Architecture First',
  `skillsPoint1TitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'المعمارية أولاً',
  `skillsPoint2Text` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'High-performance React, Next.js, and Tailwind implementations.',
  `skillsPoint2TextAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'تطبيقات عالية الأداء بالاعتماد على React و Next.js و Tailwind.',
  `skillsPoint2Title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Modern Stack',
  `skillsPoint2TitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'تقنيات حديثة',
  `skillsTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Engineered Core Capabilities',
  `skillsTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'القدرات الهندسية الأساسية',
  `typewriterWords` text COLLATE utf8mb4_unicode_ci,
  `typewriterWordsAr` text COLLATE utf8mb4_unicode_ci,
  `whatsappNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `workflowBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Workflow & Methodology',
  `workflowBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'منهجية وسير العمل',
  `workflowSubtitle` text COLLATE utf8mb4_unicode_ci,
  `workflowSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `workflowTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'How I Engineer Digital Products',
  `workflowTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'كيف أطور وأبني الحلول الرقمية',
  `fontUrlAr` text COLLATE utf8mb4_unicode_ci,
  `fontUrlEn` text COLLATE utf8mb4_unicode_ci,
  `certificatesSubtitle` text COLLATE utf8mb4_unicode_ci,
  `certificatesSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  `certificatesTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Certificates',
  `certificatesTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'الشهادات',
  `reviewsBadge` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Client Testimonials',
  `reviewsBadgeAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'آراء العملاء والشركاء',
  `reviewsTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'What Clients & Partners Say.',
  `reviewsTitleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'ماذا يقول العملاء والشركاء.',
  `reviewsSubtitle` text COLLATE utf8mb4_unicode_ci,
  `reviewsSubtitleAr` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `portfoliosettings`
--

LOCK TABLES `portfoliosettings` WRITE;
/*!40000 ALTER TABLE `portfoliosettings` DISABLE KEYS */;
INSERT INTO `portfoliosettings` VALUES ('singleton','Yousef Ayoubi','Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.','End-to-End Web Development & Software Engineering','See My Work','Istanbul, Turkey','Available for Freelance & Consulting','yosof2005a@gmail.com','2026-09-17 20:43:41.445','2026-11-15 13:03:51.236','متاح للمشاريع الحرة والاستشارات','subtle-grid','تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات عالية الأداء للشركات الناشئة والمؤسسات، بكود نظيف وموثوق يضمن النمو المستمر.','glassmorphic','Get In Touch','تواصل معي','Whether you need a full-stack application, a custom API, a modern dashboard, or a mobile app — I\'m ready to bring your vision to life.','سواء كنت بحاجة لتطبيق ويب متكامل، أو نظام API مخصص، أو لوحة تحكم عصرية، أو تطبيق هاتف — أنا جاهز لتحويل رؤيتك إلى واقع ملموس.','Have an idea?','لديك فكرة مشروع؟','شاهد أعمالي',1,'Career History & Academic Journey','المسيرة المهنية والمحطات','A chronological journey detailing academic foundations, industry experience, high-impact software projects, and recognized industry credentials.','تسلسل زمني يوثق المسيرة الأكاديمية، والخبرات العملية، والمشاريع المؤثرة والشهادات المعتمدة.','Experience & Credentials.','الخبرات والمؤهلات.','Got a question?','لديك استفسار؟','Got a question? Everything you need to know about working together, timelines, and deliverables.','كل ما يهمك معرفته حول آليات العمل المشترك، الجداول الزمنية، ومراحل التسليم.','Common Questions.','الأسئلة الأكثر شيوعاً.','Tajawal','Lora','Full-Stack Engineer crafting performant digital products and resilient software architectures.','مهندس برمجيات متكامل يطور منتجات رقمية فائقة الأداء ومعماريات برمجية متينة.','[{\"value\":\"+4\",\"label\":\"Years Experience\"},{\"value\":\"+8\",\"label\":\"Completed Projects\"},{\"value\":\"100%\",\"label\":\"Client Satisfaction\"},{\"value\":\"100%\",\"label\":\"Reliable Code\"}]','[{\"value\":\"+4\",\"label\":\"سنوات خبرة\"},{\"value\":\"+8\",\"label\":\"مشاريع منجزة\"},{\"value\":\"100%\",\"label\":\"رضا العملاء\"},{\"value\":\"100%\",\"label\":\"جودة الكود\"}]','تطوير برمجيات متكاملة وهندسة حلول الويب','إسطنبول، تركيا','يوسف أيوبي','emerald','/uploads/image-1789681613514.webp','Selected Works & Case Studies','أعمال مختارة ودراسات حالة','A curated selection of client projects, SaaS platforms, and enterprise solutions.','مجموعة مختارة من حلول الويب، ومنصات الـ SaaS، والأنظمة المؤسسية المصممة بعناية.','Featured Projects','المشاريع المميزة','Consulting & Offerings','الخدمات والاستشارات','End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.','خدمات تطوير برمجيات متكاملة تساعدك على الإطلاق بسرعة، وتفادي الديون التقنية، والتوسع بثقة.','What I Deliver.','ما الذي أقدمه لك.','TECHNICAL ARSENAL & SKILLS','الترسانة التقنية والمهارات','Full-stack systems engineered end-to-end with proven modern tools and architectural standards.','بناء أنظمة متكاملة بأحدث التقنيات وأرقى المعايير الهندسية المعترف بها عالمياً.','I bridge the gap between strong academic computer engineering principles and practical, production-ready software execution.','أجمع بين الأساس الأكاديمي الهندسي المتين والتنفيذ البرمجي العملي الجاهز للبيئات الفعلية.','Combining theoretical rigor with modern full-stack development, I build systems optimized for scalability, clean architecture, and real-world performance.','من خلال دمج الدقة النظرية مع أساليب التطوير الحديثة، أقوم ببناء أنظمة مصممة للتوسع، ذات معمارية برمجية نظيفة، وأداء فائق في بيئات الاستخدام الحقيقية.','','','','','','','','','Skills & Engineering Capabilities.','المهارات والقدرات الهندسية.','[\"Computer Engineer\",\"Full-Stack Developer\",\"Mobile App Developer\",\"UI/UX Designer\"]','[\"مهندس حاسوب\",\"مطور ويب شامل\",\"مطور تطبيقات الموبايل\",\"مصمم واجهات المستخدم\"]','+905519412068','Workflow & Methodology','منهجية وسير العمل','A structured, end-to-end development process ensuring total reliability and business alignment.','عملية تطوير منظمة وشاملة تضمن أعلى درجات الموثوقية وتوافق الأعمال.','How I Engineer Digital Products','كيف أطور وأبني الحلول الرقمية',NULL,NULL,NULL,NULL,'Certificates','الشهادات','Client Testimonials','آراء العملاء والشركاء','What Clients & Partners Say.','ماذا يقول العملاء والشركاء.','Authentic feedback and endorsements from engineering teams, founders, and product stakeholders I have collaborated with.','تجارب وآراء حقيقية من مؤسسين ومهندسين وفرق تقنية تشرفت بالتعاون معهم وبناء حلول رقمية مشتركة.');
/*!40000 ALTER TABLE `portfoliosettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `challenge` text COLLATE utf8mb4_unicode_ci,
  `solution` text COLLATE utf8mb4_unicode_ci,
  `features` text COLLATE utf8mb4_unicode_ci,
  `results` text COLLATE utf8mb4_unicode_ci,
  `year` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `liveDemo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isPublished` tinyint(1) NOT NULL DEFAULT '0',
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `categoryAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `challengeAr` text COLLATE utf8mb4_unicode_ci,
  `descriptionAr` text COLLATE utf8mb4_unicode_ci,
  `featuresAr` text COLLATE utf8mb4_unicode_ci,
  `resultsAr` text COLLATE utf8mb4_unicode_ci,
  `role` text COLLATE utf8mb4_unicode_ci,
  `roleAr` text COLLATE utf8mb4_unicode_ci,
  `solutionAr` text COLLATE utf8mb4_unicode_ci,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Project_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES ('2e78851b-35f0-4611-8482-8768464c582b','Developer Portfolio & Custom CMS','developer-portfolio-cms','Architected and engineered a high-performance, bilingual (RTL/LTR) developer portfolio powered by a custom-built full-stack CMS. Features interactive Framer Motion animations, dynamic project and skill management, and a responsive dark/light UI optimized for sub-second loading.',NULL,NULL,NULL,NULL,'2026','Full-Stack Web Application & CMS','https://project-not-ready','https://project-not-ready',1,1,2,'2026-11-14 14:11:46.720','2026-11-14 14:49:29.313','تطبيق ويب متكامل ونظام إدارة محتوى',NULL,'تصميم وهندسة منصة بورتفوليو احترافية ثنائية اللغة (عربي/إنجليزي) مدعومة بنظام إدارة محتوى (CMS) مخصص مبني بالكامل من الصفر. تتميز بتفاعلات حركية سلسة، إدارة ديناميكية للمشاريع والمهارات، وواجهة متجاوبة عالية الأداء.',NULL,NULL,'System Architecture & Full-Stack Development','المعمارية البرمجية والتطوير الشامل',NULL,'منصة البورتفوليو الهندسي ونظام إدارة المحتوى'),('5b55f340-bdf0-45f0-8a63-882b895c3db6','VecMenu','restaurant-qr-menu','Architected and launched VecMenu from concept to production. Engineered a high-performance multi-tenant web application featuring real-time menu customization, instant QR generation, and localized multilingual support. Focused on clean modular frontend architecture, database query optimization, and frictionless user experience for both restaurant operators and end diners.','Restaurants needed a way to update menus dynamically without printing new ones.','Built a real-time QR code menu system with a merchant dashboard.',NULL,NULL,'2024','SaaS Platform','https://vecmenu.com','https://github.com/yusufWeb44/QR_Menu_System',1,1,1,'2026-09-17 20:43:41.485','2026-11-14 14:11:52.963','منصة برمجيات كخدمة (SaaS)',NULL,'تأسيس وبناء منصة VecMenu هندسياً من الفكرة حتى التشغيل الفعلي. تصميم وتطوير تطبيق ويب عالي الأداء متعدد المستأجرين (Multi-tenant)، يتضمن تخصيص القوائم أفقياً لحظة بلحظة، إنتاج أكواد QR فورية، ودعم متعدد اللغات. مع التركيز على كود برجمي نظيف ومقسّم إلى وحدات، تحسين استعلامات قواعد البيانات، وتوفير تجربة مستخدم فائقة السرعة لأصحاب المطاعم والزبائن.',NULL,NULL,'Co-Founder & Lead Frontend Developer','شريك مؤسس وقائد تطوير الواجهات',NULL,'VecMenu'),('6ca30ee4-7243-4e16-a437-31fcef89c0ec','E4tiq Academy','e4tiq-academy','Engineered the complete frontend of E4tiq Academy and serve as an active technical mentor and service provider on the platform — delivering live coding bootcamps, corporate training, and 1-on-1 engineering consultations. Built a high-performance, bilingual (RTL/LTR) interface with seamless dark/light theme switching.',NULL,NULL,NULL,NULL,'2026','Full-Stack EdTech Platform','https://project-not-ready','https://project-not-ready',1,1,3,'2026-09-19 18:31:05.677','2026-11-14 17:17:12.310','منصة تعليمية متكاملة ',NULL,'تطوير وهندسة الواجهات الأمامية بالكامل لمنصة E4tiq الأكاديمية (E4tiq Academy)، إلى جانب دوري كمقدم خدمات تقنية ومدرب بالمنصة في المعسكرات البرمجية، التدريب المؤسسي، وجلسات الإرشاد الفردي (1-on-1). شمل العمل بناء واجهة متجاوبة ثنائية اللغة (عربي/إنجليزي) تدعم تبديل المظهر الليلي والنهاري بسلاسة.',NULL,NULL,'Lead Frontend Developer & Technical Service Provider','مطور واجهات أمامية ومقدم خدمات تقنية بالمنصة',NULL,'E4tiq Academy'),('a23105ce-fd28-42b1-83cb-51c7f26bc64c','AnimePlus','animeplus',' Feature-rich, full-stack web application. Built with Node.js, Express, and MySQL, it allows users to browse trending series, manage personalized watchlists .The platform continuously synchronizes its data using external APIs (like AniList) to provide the latest information, trailers, and ratings.',NULL,NULL,NULL,NULL,'2026','Web App','https://anime-plus-8y7s.onrender.com','https://github.com/yusufWeb44/Anime_Plus',0,1,4,'2026-09-19 18:17:53.605','2026-11-14 14:13:46.357','تطبيق ويب',NULL,'تطبيق ويب متكامل (Full-Stack)مبني باستخدام Node.js و Express و My SQL، ويتيح للمستخدمين تصفح المسلسلات الشائعة وإدارة قوائم المشاهدة المخصصة. تقنياً، تقوم المنصة بمزامنة بياناتها باستمرار عبر واجهات برمجية خارجية (مثل AniList) لتوفير أحدث المعلومات، الإعلانات الترويجية، والتقييمات فورياً.',NULL,NULL,'Full-Stack Developer & Database Architect','مطور متكامل ومعمار قواعد البيانات',NULL,'AnimePlus');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projectimage`
--

DROP TABLE IF EXISTS `projectimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projectimage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isCover` tinyint(1) NOT NULL DEFAULT '0',
  `projectId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ProjectImage_projectId_fkey` (`projectId`),
  CONSTRAINT `ProjectImage_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projectimage`
--

LOCK TABLES `projectimage` WRITE;
/*!40000 ALTER TABLE `projectimage` DISABLE KEYS */;
INSERT INTO `projectimage` VALUES ('22c745e0-8752-4e00-abf6-d6648769a610','http://localhost:5000/uploads/image-1789838228350.png',0,'5b55f340-bdf0-45f0-8a63-882b895c3db6','2026-11-14 13:51:40.905','2026-11-14 13:51:40.905'),('2a41c7e6-d9d8-408e-90c1-d96ce98e9f0d','http://localhost:5000/uploads/image-1789841934549.png',0,'a23105ce-fd28-42b1-83cb-51c7f26bc64c','2026-11-14 14:13:46.357','2026-11-14 14:13:46.357'),('377b1917-d584-4670-b989-aa31cbe83834','http://localhost:5000/uploads/image-1794665332723.png',1,'2e78851b-35f0-4611-8482-8768464c582b','2026-11-14 14:49:29.313','2026-11-14 14:49:29.313'),('3f3538f1-9acd-47e7-b5b6-1b23e6862cd7','http://localhost:5000/uploads/image-1794663861896.png',0,'6ca30ee4-7243-4e16-a437-31fcef89c0ec','2026-11-14 17:17:12.310','2026-11-14 17:17:12.310'),('45893d5b-b409-4b3a-913b-3d84a5d504f1','http://localhost:5000/uploads/image-1794664293326.png',1,'5b55f340-bdf0-45f0-8a63-882b895c3db6','2026-11-14 13:51:40.905','2026-11-14 13:51:40.905'),('509211e7-c146-400e-880b-964b1f8d83c8','http://localhost:5000/uploads/image-1794496201232.png',1,'6ca30ee4-7243-4e16-a437-31fcef89c0ec','2026-11-14 17:17:12.310','2026-11-14 17:17:12.310'),('8b2832ff-840e-4fe4-a823-4ab3f7c3970b','http://localhost:5000/uploads/image-1789837444195.png',0,'5b55f340-bdf0-45f0-8a63-882b895c3db6','2026-11-14 13:51:40.905','2026-11-14 13:51:40.905'),('8d1a774a-6bdc-4d81-bc87-2b58270c7c7f','http://localhost:5000/uploads/image-1794665345168.png',0,'2e78851b-35f0-4611-8482-8768464c582b','2026-11-14 14:49:29.313','2026-11-14 14:49:29.313'),('8d5ab73a-5075-4a4c-a2f1-aeed742052c6','http://localhost:5000/uploads/image-1794665350331.png',0,'2e78851b-35f0-4611-8482-8768464c582b','2026-11-14 14:49:29.313','2026-11-14 14:49:29.313'),('c57d2f21-4c55-4f24-a05b-86b113378dd7','http://localhost:5000/uploads/image-1794667755732.png',0,'2e78851b-35f0-4611-8482-8768464c582b','2026-11-14 14:49:29.313','2026-11-14 14:49:29.313'),('d9796a6e-16c9-40e9-aeeb-83353e294bdb','http://localhost:5000/uploads/image-1789837672074.png',0,'5b55f340-bdf0-45f0-8a63-882b895c3db6','2026-11-14 13:51:40.905','2026-11-14 13:51:40.905'),('ebf60bc3-b3ad-45c2-bd52-a785c0392f3c','http://localhost:5000/uploads/image-1789841945329.png',0,'a23105ce-fd28-42b1-83cb-51c7f26bc64c','2026-11-14 14:13:46.357','2026-11-14 14:13:46.357'),('f6a30ec7-f2fd-4fa8-9846-0ebb25fcdcd9','http://localhost:5000/uploads/image-1789841913775.png',1,'a23105ce-fd28-42b1-83cb-51c7f26bc64c','2026-11-14 14:13:46.357','2026-11-14 14:13:46.357'),('feaef819-6d0b-4625-86fb-28be01ffa77f','http://localhost:5000/uploads/image-1789841926575.png',0,'a23105ce-fd28-42b1-83cb-51c7f26bc64c','2026-11-14 14:13:46.357','2026-11-14 14:13:46.357');
/*!40000 ALTER TABLE `projectimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nameAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatarUrl` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `contentAr` text COLLATE utf8mb4_unicode_ci,
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `linkedinUrl` text COLLATE utf8mb4_unicode_ci,
  `githubUrl` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('46c74086-82dd-460b-8db0-2e6006659646','David Chen','ديفيد تشن','Head of Engineering','رئيس قسم الهندسة البرمجية','Synapse Core Inc.','شركة سينابس كور','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80','Remarkable UI/UX engineering. His mastery over micro-interactions, layout ergonomics, and bulletproof responsive designs elevated our enterprise product to top-tier industry standards.','مستوى احترافي ملهم في هندسة واجهات المستخدم. إتقانه للتفاعلات الدقيقة، وتجاوب التصاميم مع مختلف الشاشات، رفع جودة منتجنا المؤسسي إلى مصاف المنصات العالمية.',4,1,'2026-11-14 19:06:59.959','2026-11-14 23:03:25.001','https://linkedin.com','https://github.com'),('6d176045-9085-4308-bf6a-9514167672da','Sarah Jenkins','سارة جنكينز','Product Lead & Clinical Specialist','مديرة منتج وأخصائية رعاية صحية','CarePulse Health','منظومة كير بلس الصحية','https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80','Working with Yousef was an absolute pleasure. He transformed our complex clinical workflow into an intuitive, high-performance web dashboard that our medical team loves using daily. Highly recommend him!','كان العمل مع يوسف تجربة استثنائية ومثمرة للغاية. استطاع تحويل سير العمل الطبي المعقد إلى لوحة تحكم ويب تفاعلية فائقة السرعة يعتمد عليها فريقنا يومياً بكل سلاسة.',1,1,'2026-11-14 19:06:59.931','2026-11-14 23:03:25.001','https://linkedin.com','https://github.com'),('82fc541a-7133-44ed-b523-57819097ed6c','John Miller','جون ميلر','Operations Director & Co-Founder','مدير عمليات وشريك مؤسس','Nexus Logistics Hub','منصة نيكسوس اللوجستية','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80','A rare engineering talent who truly bridges the gap between sophisticated software architecture and pixel-perfect design. Delivered our multi-tenant SaaS platform ahead of schedule with zero friction.','مهندس برمجيات متميز يجمع بكفاءة نادرة بين قوة المعمارية البرمجية ودقة التصميم الإبداعي. قام بتسليم منصتنا السحابية متعددة المستأجرين قبل الموعد وبأعلى معايير الجودة.',2,1,'2026-11-14 19:06:59.941','2026-11-14 23:03:25.001','https://linkedin.com','https://github.com'),('e72acffd-5baf-455d-82de-f69f1fcd1d18','Emily Rivera','إميلي ريفيرا','Founder & Tech Lead','مؤسسة وقائدة تقنية','Aura HealthTech','أورا للتكنولوجيا الصحية','https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80','Exceptional attention to detail, clean TypeScript code, and unmatched responsiveness. Yousef didn’t just build the frontend; he proactively optimized our full-stack performance and API contracts.','دقة فائقة في التفاصيل، أكواد TypeScript غاية في النظافة، وتواصل احترافي مستمر. لم يقتصر دوره على البناء فحسب، بل ساهم استراتيجياً في تسريع الأداء وتحسين بنية الواجهات البرمجية.',3,1,'2026-11-14 19:06:59.949','2026-11-14 23:03:25.001','https://linkedin.com','https://github.com');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seosettings`
--

DROP TABLE IF EXISTS `seosettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seosettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'singleton',
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Yusuf Ayoubi | Software Developer & Engineer',
  `metaDescription` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `keywords` text COLLATE utf8mb4_unicode_ci,
  `author` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'Yusuf Ayoubi',
  `ogTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ogDescription` text COLLATE utf8mb4_unicode_ci,
  `ogImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ogType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'website',
  `twitterHandle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `twitterCardType` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'summary_large_image',
  `canonicalUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `robots` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'index, follow',
  `structuredData` text COLLATE utf8mb4_unicode_ci,
  `pageOverrides` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seosettings`
--

LOCK TABLES `seosettings` WRITE;
/*!40000 ALTER TABLE `seosettings` DISABLE KEYS */;
INSERT INTO `seosettings` VALUES ('singleton','Yusuf Ayoubi | Software Developer & Engineer','Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Clean, maintainable code engineered for reliability.','Software Engineer, Full-Stack Developer, React, Next.js, Node.js, TypeScript, Web Development, Istanbul','Yusuf Ayoubi','Yusuf Ayoubi | Full-Stack Software Engineer','End-to-End Web Development, Custom CRMs, and High-Performance APIs.',NULL,'website','@yusuf','summary_large_image','https://yusufayoubi.com','index, follow','{\"@context\":\"https://schema.org\",\"@type\":\"Person\",\"name\":\"Yusuf Ayoubi\",\"jobTitle\":\"Software Engineer & Full-Stack Developer\",\"url\":\"https://yusufayoubi.com\",\"sameAs\":[\"https://github.com\",\"https://linkedin.com\"]}',NULL,'2026-09-17 20:43:41.518','2026-09-17 20:43:41.518');
/*!40000 ALTER TABLE `seosettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `descriptionAr` text COLLATE utf8mb4_unicode_ci,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
INSERT INTO `service` VALUES ('279891ab-40fb-4b70-b204-2bdb53d0dc96','Codebase Audit & Quality Refactoring','Reviewing existing codebases to identify performance bottlenecks, eliminate technical debt, enforce clean code standards, and refactor for maintainability.',6,1,'2026-09-18 11:17:23.080','2026-09-18 11:17:23.080','مراجعة المشاريع البرمجية الحالية لتحديد اختناقات الأداء، والتخلص من الديون التقنية، وتطبيق معايير الكود النظيف، وإعادة هيكلة الكود لسهولة صيانته.','فحص وتدقيق الكود وإعادة الهيكلة'),('36d9355c-d44f-4d58-8153-e3992e8578a6','Full-Stack Web Engineering','Architecting end-to-end web applications with Laravel, React, and Next.js, focused on high performance, clean code, and production reliability.',1,1,'2026-09-18 11:17:23.063','2026-09-18 11:17:23.063','بناء وتطوير تطبيقات ويب شاملة باستخدام Laravel و React و Next.js، مع التركيز على الأداء العالي، ونظافة الكود، والموثوقية في بيئات الإنتاج.','هندسة وتطوير تطبيقات الويب المتكاملة'),('501bbc17-7951-4420-8cef-6b011d256fe0','Cross-Platform Mobile Apps','Building native-performance iOS and Android applications using Flutter and Dart, powered by clean architecture and Bloc state management.',4,1,'2026-09-18 11:17:23.074','2026-09-18 11:17:23.074','بناء تطبيقات iOS و Android بأداء مماثل للتطبيقات الأصلية (Native) باستخدام Flutter و Dart، بالاعتماد على المعمارية النظيفة وإدارة الحالة عبر Bloc.','تطبيقات الهواتف الذكية متعددة المنصات'),('a5ce81f8-f2f5-4901-b584-d873277d0c7b','Custom CRM & Dashboard Systems','Engineered enterprise CRM modules and analytics dashboards with granular RBAC authorization, automated workflows, and AI metrics integration.',2,1,'2026-09-18 11:17:23.067','2026-09-18 11:17:23.067','تطوير وحدات CRM مؤسسية ولوحات تحليلات متقدمة مع نظام صلاحيات دقيق (RBAC)، وأتمتة مسارات العمل، ودمج مقاييس الذكاء الاصطناعي.','أنظمة CRM ولوحات تحكم مخصصة'),('cf10a3f0-9229-4a09-a123-2406f6f0773d','Technical SEO & Web Speed Optimization','Optimizing Core Web Vitals, page load speeds, semantic HTML tags, dynamic sitemaps, and metadata to achieve top Google rankings and maximum Lighthouse scores.',3,1,'2026-09-18 11:17:23.070','2026-09-18 11:17:23.070','تحسين مؤشرات أداء الويب الأساسية (Core Web Vitals)، وسرعات التحميل، والوسوم الدلالية، وخرائط المواقع الديناميكية لتصدر نتائج بحث Google وتحقيق أعلى درجات Lighthouse.','السيو التقني وتسريع المواقع الفائق'),('d76cf53e-d3e7-4030-a6fd-1cf90f29e55d','Database Architecture & Optimization','Modeling relational database schemas (PostgreSQL / MySQL) with advanced indexing, normalization, and high-performance query tuning.',5,1,'2026-09-18 11:17:23.077','2026-09-18 11:17:23.077','نمذجة وتصميم مخططات قواعد البيانات العلائقية (PostgreSQL / MySQL) مع الفهرسة المتقدمة، والتطبيع، وضبط الاستعلامات لأعلى مستويات السرعة.','معمارية وتصميم قواعد البيانات وتحسين أدائها');
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `categoryAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depth` double DEFAULT '5',
  `description` text COLLATE utf8mb4_unicode_ci,
  `descriptionAr` text COLLATE utf8mb4_unicode_ci,
  `nameAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` int DEFAULT '20',
  `x` double DEFAULT NULL,
  `y` double DEFAULT NULL,
  `positionX` double DEFAULT '50',
  `positionY` double DEFAULT '50',
  `weight` int DEFAULT '3',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
INSERT INTO `skill` VALUES ('084b196a-f137-46ee-936c-4ed8aa5d370a','database design','Database',NULL,22,1,'2026-09-21 12:23:31.678','2026-11-14 17:04:19.190','قواعد البيانات',8,'Modeling Entity-Relationship Diagrams (ERDs), normalizing data tables, and defining efficient relational constraints.','تصميم مخططات الكيانات والعلاقات (ERD)، وتطبيع جداول البيانات (Normalization)، وضبط القيود العلائقية بكفاءة عالية.','database design',26,45,15,45,15,3),('0df557e2-36a1-4c94-873e-f8d154a1eaf4','Figma','Design',NULL,23,1,'2026-09-21 12:23:31.684','2026-11-14 17:04:19.200','التصميم وتجربة المستخدم',5,'Designing interactive wireframes, UI prototypes, and translating design tokens directly into production code.','تصميم المخططات التفاعلية والنماذج الأولية للواجهات (UI/UX)، وتحويل عناصر التصميم مباشرة إلى كود برمجي دقيق.','Figma',32,70,10,70,10,4),('17fe0916-0242-41c7-bd6e-3580f1177348','GraphQL','Backend',NULL,14,1,'2026-09-21 12:23:31.637','2026-11-14 17:04:19.100','الواجهة الخلفية',5,'Building schema-first API endpoints to eliminate over-fetching and enable flexible front-end data queries.','بناء واجهات برمجية معتمدة على المخططات (Schema-First) لمنع جلب البيانات الفائضة وتمكين استعلامات مرنة للواجهة الأمامية.','GraphQL',26,72,65,72,65,3),('19375491-6371-4e5c-b2e6-ac60fecb5b60','Node.js','Backend','nodedotjs',5,1,'2026-09-17 20:43:41.468','2026-11-14 17:04:19.007','الواجهة الخلفية',10,'Developing scalable backend microservices, RESTful routes, and real-time WebSocket communication channels.','تطوير خدمات خلفية قابلة للتوسع، ومسارات RESTful، وقنوات اتصال فورية في الوقت الفعلي عبر WebSockets.','Node.js',32,60,78,60,78,4),('3375371d-b357-48c5-8ee8-f04e76e9a875','MongoDB','Database',NULL,15,1,'2026-09-21 12:23:31.642','2026-11-14 17:04:19.108','قواعد البيانات',6,'Modeling document-based NoSQL collections for flexible data structures and high-throughput read operations.','نمذجة قواعد بيانات NoSQL المستندية لهياكل البيانات المرنة وعمليات القراءة والكتابة ذات الكثافة العالية.','MongoDB',26,60,50,60,50,3),('3dfd71c9-e561-409e-961a-1f0117ffc512','SEO','Frontend',NULL,26,1,'2026-09-21 15:29:00.580','2026-11-14 17:04:19.235','الواجهة الأمامية',5,'Optimizing Core Web Vitals, semantic metadata, structured data schemas, and crawlability for top search rankings.','تحسين مؤشرات الأداء الأساسية للويب (Core Web Vitals)، والبيانات الوصفية الدلالية، وهيكلة البيانات لتصدر نتائج محركات البحث.','SEO',26,12,53,12,53,3),('3ef14879-cdd2-43ed-a8aa-f65099163f8d','prompt engineering','AI',NULL,20,1,'2026-09-21 12:23:31.669','2026-11-14 17:04:19.167','الذكاء الاصطناعي',5,'Designing system prompts, few-shot patterns, and structured AI workflows to integrate LLMs into software products.','تصميم الأوامر النظامية (System Prompts)، وأنماط التوجيه الذكية، ودمج النماذج اللغوية الكبيرة (LLMs) داخل المنتجات البرمجية.','prompt engineering',26,15,40,15,40,3),('48a4ed76-57f0-48c4-b9ef-ba4815cdec6e','React','Frontend','react',1,1,'2026-09-17 20:43:41.468','2026-11-14 17:04:18.936','الواجهة الأمامية',10,'Building reactive, component-driven UIs with custom hooks and advanced state management for enterprise web applications.','بناء واجهات مستخدم تفاعلية قائمة على المكونات باستخدام الخطافات المخصصة (Custom Hooks) وإدارة الحالة المتقدمة لتطبيقات الويب المؤسسية.','React',38,10,10,10,10,5),('5cf6086b-a9aa-4bbb-a7d0-c9d35049569e','java','Backend',NULL,25,1,'2026-09-21 12:23:31.694','2026-11-14 17:04:19.223','الواجهة الخلفية',5,'Developing strongly-typed object-oriented applications, backend services, and algorithmic problem solutions.','تطوير تطبيقات كائنية التوجه صارمة الأنواع، وبناء الخدمات الخلفية، وحل المشكلات الخوارزمية المعقدة.','java',32,40,58,40,58,4),('5f68c3b0-89cb-4005-9f53-852bc48ffa2c','Flutter','Mobile',NULL,16,1,'2026-09-21 12:23:31.648','2026-11-14 17:04:19.122','تطبيقات الموبايل',10,'Building cross-platform mobile apps using Bloc architecture, custom animations, and seamless native integration.','تطوير تطبيقات الهواتف الذكية المتعددة المنصات باستخدام معمارية BLoC، والحركات المخصصة، والتكامل السلس مع خصائص النظام.','Flutter',38,65,40,65,40,5),('66417c19-6d9c-4b2f-b9af-b4a6c821df7e','Docker','DevOps',NULL,10,1,'2026-09-21 12:23:31.614','2026-11-14 17:04:19.057','البنية التحتية والنشر',9,'Containerizing full-stack environments with docker-compose to ensure smooth, uniform local-to-cloud deployments.','تحزيم بيئات التطوير المتكاملة داخل حاويات باستخدام Docker Compose لضمان نشر سلس وموحد من البيئة المحلية إلى السحابة.','Docker',26,50,85,50,85,3),('89eb1695-5ec8-4f40-952e-4d4784fd83d3','Express','Backend',NULL,17,1,'2026-09-21 12:23:31.653','2026-11-14 17:04:19.131','الواجهة الخلفية',6,'Structuring lightweight Node.js API layers, request middlewares, and modular route controllers.','هيكلة طبقات الـ API الخفيفة في Node.js، وبرمجيات الوسيط (Middlewares)، ومتحكمات المسارات المعيارية.','Express',26,56,70,56,70,3),('9d6d0f2b-df0c-4223-87b6-04ddaa111a0a','JavaScript','Frontend',NULL,12,1,'2026-09-21 12:23:31.626','2026-11-14 17:04:19.077','الواجهة الأمامية',10,'Utilizing modern ES6+ paradigms, event loops, and asynchronous patterns to write high-performance web code.','توظيف معايير ES6+ الحديثة، وحلقة الأحداث (Event Loop)، والبرمجة غير المتزامنة لكتابة أكواد ويب عالية الأداء.','JavaScript',32,30,48,30,48,4),('a4a9f6bd-e755-4a03-8ea0-89e0472266c2','Data Structure & Algorithm','Architecture',NULL,27,1,'2026-09-21 15:41:49.458','2026-11-14 17:04:19.243','معمارية البرمجيات',9,'Solving complex computational problems with optimal time and space complexity using advanced data structures.','حل المشكلات البرمجية المعقدة بأفضل كفاءة للوقت والذاكرة (Time & Space Complexity) باستخدام هياكل البيانات المتقدمة.','Data Structure & Algorithm',26,20,78,20,78,3),('ab18cf40-1197-402c-b697-1eee1cf15319','prisma ORM','Database',NULL,18,1,'2026-09-21 12:23:31.658','2026-11-14 17:04:19.146','قواعد البيانات',5,'Managing database migrations and querying SQL engines with auto-generated, type-safe client interfaces.','إدارة تهجير قواعد البيانات (Migrations) وتنفيذ استعلامات SQL عبر واجهات برمجية مولدة تلقائياً وآمنة الأنواع.','prisma ORM',26,15,60,15,60,3),('ac5873bf-34c0-4198-81e3-043038721b53','Git & GitHub','Tools',NULL,11,1,'2026-09-21 12:23:31.621','2026-11-14 17:04:19.068','الأدوات',5,'Managing codebase versions through structured feature branching, interactive rebases, and automated CI/CD.','إدارة إصدارات الأكواد البرمجية عبر استراتيجيات التفريع المنظمة، والدمج التفاعلي، وخطوط التكامل والنشر المستمر (CI/CD).','Git & GitHub',26,66,32,66,32,3),('afcd861f-4387-4d64-b74e-2643413451ee','CSS','Frontend',NULL,13,1,'2026-09-21 12:23:31.631','2026-11-14 17:04:19.090','الواجهة الأمامية',10,'Structuring layout systems with CSS Grid, Flexbox, keyframe animations, and custom CSS variables.','بناء أنظمة التخطيط المتقدمة باستخدام CSS Grid و Flexbox، مع الحركات الانسيابية والمتغيرات المخصصة.','CSS',32,70,20,70,20,4),('b0c5715f-69ef-440f-9d90-c81034c3c8a9','REST APIs','Backend',NULL,8,1,'2026-09-21 12:23:31.603','2026-11-14 17:04:19.041','الواجهة الخلفية',9,'Engineering clean, versioned RESTful endpoints secured with JWT auth, rate limiting, and OpenAPI specs.','هندسة واجهات برمجية RESTful نظيفة ومؤمنة بمصادقة JWT، مع تحديد معدل الطلبات (Rate Limiting) والتوثيق وفق معايير OpenAPI.','REST APIs',26,12,30,12,30,3),('bf3df1ee-e87c-4521-9d0d-2dfbbcb1cd38','Postman','Tools',NULL,28,1,'2026-11-14 13:03:16.262','2026-11-14 17:04:19.254','الأدوات',5,'API testing, automated request collections, debugging, and endpoint documentation to ensure reliable backend integration.','اختبار واجهات البرمجة (APIs)، تتبع الأخطاء، وتوثيق نقاط الاتصال لضمان موثوقية الربط مع الخوادم.','Postman',26,50,50,50,50,3),('cc184a7c-8bc6-4dd5-9e60-2aa83f75eec6','OOP','Architecture',NULL,19,1,'2026-09-21 12:23:31.663','2026-11-14 17:04:19.156','معمارية البرمجيات',8,'Applying SOLID design principles, inheritance, and encapsulation to build reusable, maintainable software systems.','تطبيق مبادئ SOLID والوراثة والتغليف لبناء أنظمة برمجية قابلة لإعادة الاستخدام وسهلة الصيانة والتطوير.','OOP',26,35,10,35,10,3),('cd92c3bf-82b3-4c0e-b559-37293e26c8b5','ASP.NET','Backend',NULL,21,1,'2026-09-21 12:23:31.673','2026-11-14 17:04:19.177','الواجهة الخلفية',5,'Building enterprise-grade web APIs and backend services powered by C# and the .NET ecosystem.','بناء واجهات برمجية وخدمات خلفية على مستوى المؤسسات بالاعتماد على لغة C# وبيئة عمل .NET المتكاملة.','ASP.NET',26,10,70,10,70,3),('e354dc99-f9ec-42ce-950a-423270e113b0','TypeScript','Frontend','typescript',3,1,'2026-09-17 20:43:41.468','2026-11-14 17:04:18.990','الواجهة الأمامية',10,'Enforcing strict type safety and domain models across full-stack codebases to eliminate runtime errors.','تطبيق الأمان الصارم للأنواع (Type Safety) ونمذجة النطاقات عبر كامل النظام البرمجي لمنع أخطاء وقت التشغيل.','TypeScript',26,56,56,56,56,3),('e4f6df89-93d2-4e5d-bbcf-a79d274cb3ff','Dart','Mobile',NULL,4,1,'2026-09-21 12:23:31.581','2026-11-14 17:04:18.999','تطبيقات الموبايل',9,'Writing structured mobile core logic using strong OOP architecture, async streams, and sound null safety.','كتابة المنطق الأساسي لتطبيقات الهواتف بهيكلة كائنية متينة، مع إدارة التدفقات غير المتزامنة (Async Streams) والأمان التام للقيم الفارغة.','Dart',32,8,45,8,45,4),('f184dc87-c0ff-454d-a85e-72a2c72f74a1','MySQL','Database','mysql',7,1,'2026-09-17 20:43:41.468','2026-11-14 17:04:19.030','قواعد البيانات',5,'Designing normalized production databases, stored procedures, and high-availability data structures.','تصميم قواعد بيانات إنتاجية معيارية، وإجراءات مخزنة (Stored Procedures)، وهياكل بيانات عالية التوافر والموثوقية.','MySQL',26,42,38,42,38,3),('f219974e-718e-4e9e-aeba-64d1473ccfcc','Tailwind CSS','Frontend','tailwind',9,1,'2026-09-17 20:43:41.468','2026-11-14 17:04:19.049','الواجهة الأمامية',5,'Crafting highly responsive, pixel-perfect UI design systems with modern glassmorphism tokens.','تصميم أنظمة واجهات مستخدم متجاوبة ودقيقة الأبعاد (Pixel-Perfect) باستخدام أنماط التصميم الزجاجي الحديثة.','Tailwind CSS',32,35,25,35,25,4),('fc3f839a-ad79-47aa-b351-d296639f1bde','Next.js','Frontend',NULL,2,1,'2026-09-21 12:23:31.567','2026-11-14 17:04:18.961','الواجهة الأمامية',7,'Leveraging SSR, ISR, and API routes to deliver SEO-friendly, performance-optimized production sites.','توظيف تقنيات العرض من جهة الخادم (SSR) والتوليد الثابت المتزايد (ISR) لبناء مواقع إنتاجية فائقة السرعة ومتوافقة مع محركات البحث.','Next.js',26,55,5,55,5,3),('fd2bb3c9-23a6-479d-aed2-f536a16f7fbe','HTML','Frontend',NULL,24,1,'2026-09-21 12:23:31.689','2026-11-14 17:04:19.210','الواجهة الأمامية',4,'Structuring semantic, accessible web pages optimized for modern browser engines and screen readers.','بناء هيكلية صفحات ويب دلالية (Semantic) متوافقة مع معايير الوصول الشامل وقارئات الشاشة ومحركات المتصفحات الحديثة.','HTML',26,20,20,20,20,3),('ff0b44e8-4fb1-4ae2-ad32-18cbedcf1d02','PostgreSQL','Database',NULL,6,1,'2026-09-21 12:23:31.592','2026-11-14 17:04:19.018','قواعد البيانات',6,'Architecting relational schemas with advanced indexing, foreign keys, and complex query performance tuning.','هندسة قواعد البيانات العلائقية مع الفهرسة المتقدمة، والمفاتيح الخارجية، وتحسين أداء الاستعلامات المعقدة.','PostgreSQL',26,28,68,28,68,3);
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sociallink`
--

DROP TABLE IF EXISTS `sociallink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sociallink` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sociallink`
--

LOCK TABLES `sociallink` WRITE;
/*!40000 ALTER TABLE `sociallink` DISABLE KEYS */;
INSERT INTO `sociallink` VALUES ('2f30be0d-18fc-4fc9-bd84-605cf488ac79','LinkedIn','https://linkedin.com/in/yusuf','linkedin',2,'2026-09-17 20:43:41.462','2026-09-17 20:43:41.462'),('422d34db-0c71-48e0-bf1a-0336425da29d','GitHub','https://github.com/yusuf','github',1,'2026-09-17 20:43:41.462','2026-09-17 20:43:41.462');
/*!40000 ALTER TABLE `sociallink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technology`
--

DROP TABLE IF EXISTS `technology`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technology` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technology`
--

LOCK TABLES `technology` WRITE;
/*!40000 ALTER TABLE `technology` DISABLE KEYS */;
INSERT INTO `technology` VALUES ('0f7eedbf-bb78-463b-b891-d91f90b433a6','Next.js',NULL,'2026-11-12 15:20:31.873','2026-11-12 15:20:31.873'),('47256ed1-ba00-4876-b691-1ff57c5659b3','CSS',NULL,'2026-09-19 18:17:53.598','2026-09-19 18:17:53.598'),('6207a6c7-cf63-41cc-ab6d-ae4f23d8c288','Express',NULL,'2026-09-19 17:05:32.012','2026-09-19 17:05:32.012'),('6472a496-7e9b-4300-b89d-5f056646ceda','Node.js',NULL,'2026-09-17 20:43:41.479','2026-09-17 20:43:41.479'),('653a5682-c186-49d7-9157-55950a812463','Prisma',NULL,'2026-11-12 15:20:31.909','2026-11-12 15:20:31.909'),('78520493-ee39-49b0-b685-c5a57fb52d5f','React',NULL,'2026-09-17 20:43:41.475','2026-09-17 20:43:41.475'),('79b00368-afde-4b47-8326-ae41b4a171f2','HTML',NULL,'2026-09-19 18:17:53.584','2026-09-19 18:17:53.584'),('8541b912-6d7c-4925-b90c-02f527ca65bf','MySQL',NULL,'2026-09-17 20:43:41.481','2026-09-17 20:43:41.481'),('98a656ae-fb40-44b0-8e4a-79d6d57aee1e','PostgreSQL',NULL,'2026-11-12 15:20:31.900','2026-11-12 15:20:31.900'),('ac10166d-713b-46ba-a4d4-039ff5ddc33e','Tailwind CSS',NULL,'2026-09-19 18:31:05.651','2026-09-19 18:31:05.651'),('c3912460-7cb8-41b9-9181-d7af32b4575c','Javascript',NULL,'2026-09-19 18:17:53.567','2026-09-19 18:17:53.567'),('db823a1c-3d69-4c04-960d-6f900aaf36de','TypeScript',NULL,'2026-09-19 17:05:32.003','2026-09-19 17:05:32.003'),('ea120b71-5038-402b-86f8-2fc0bb56cfd7','Nest.js',NULL,'2026-11-12 15:20:31.890','2026-11-12 15:20:31.890');
/*!40000 ALTER TABLE `technology` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `translation`
--

DROP TABLE IF EXISTS `translation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `translation` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageCode` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `languageName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direction` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ltr',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Translation_languageCode_key` (`languageCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `translation`
--

LOCK TABLES `translation` WRITE;
/*!40000 ALTER TABLE `translation` DISABLE KEYS */;
INSERT INTO `translation` VALUES ('566f7d9b-397d-47b1-85a7-aa954a203e6b','ar','العربية','rtl',0,1,'{\n  \"nav.about\": \"من أنا\",\n  \"nav.workflow\": \"سير العمل\",\n  \"nav.projects\": \"المشاريع\",\n  \"nav.skills\": \"المهارات\",\n  \"nav.experience\": \"الخبرات\",\n  \"nav.services\": \"الخدمات\",\n  \"nav.faq\": \"الأسئلة الشائعة\",\n  \"nav.contact\": \"تواصل معي\",\n  \"nav.startProject\": \"ابدأ مشروعك\",\n  \"hero.greeting\": \"متاح للعمل الحر والاستشارات البرمجية\",\n  \"hero.headline\": \"تطوير برمجيات متكاملة وهندسة حلول الويب\",\n  \"hero.bio\": \"تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات عالية الأداء للشركات الناشئة والمؤسسات، بكود نظيف وموثوق يضمن النمو المستمر.\",\n  \"hero.cta\": \"شاهد أعمالي\",\n  \"hero.contactCta\": \"دعنا نتحدث\",\n  \"hero.availability\": \"متاح للمشاريع الحرة والاستشارات\",\n  \"hero.resume\": \"تحميل السيرة الذاتية\",\n  \"hero.stats.experienceValue\": \"+4\",\n  \"hero.stats.experienceLabel\": \"سنوات خبرة\",\n  \"hero.stats.projectsValue\": \"+35\",\n  \"hero.stats.projectsLabel\": \"مشروع مكتمل\",\n  \"hero.stats.satisfactionValue\": \"100%\",\n  \"hero.stats.satisfactionLabel\": \"رضا العملاء\",\n  \"hero.stats.uptimeValue\": \"99.9%\",\n  \"hero.stats.uptimeLabel\": \"جودة وموثوقية الكود\",\n  \"hero.typewriter.fullStack\": \"مطور ويب متكامل\",\n  \"hero.typewriter.softwareEngineer\": \"مهندس برمجيات\",\n  \"hero.typewriter.reactNext\": \"متخصص React و Next.js\",\n  \"hero.typewriter.backendNode\": \"معماري واجهات برمجية و Node.js\",\n  \"hero.typewriter.uiUx\": \"مصمم واجهات وتجربة مستخدم\",\n  \"about.badge\": \"نبذة عني\",\n  \"about.headline\": \"بناء برمجيات قابلة للتوسع بدقة واحترافية.\",\n  \"about.bio1\": \"أنا يوسف أيوبي — مهندس حاسوب ومطور برمجيات متكامل متخصص في بناء أنظمة تعمل بكفاءة في بيئة الإنتاج الفعلية، من أنظمة CRM وإدارة العمليات المخصصة إلى تطبيقات الويب عالية الأداء وواجهات REST و GraphQL البرمجية.\",\n  \"about.bio2\": \"أتخصص في تصميم ومعمارية واجهات أمامية حديثة (React, Next.js) متكاملة بدقة مع خوادم خلفية عالية الاعتمادية (Node.js, Express.js، وقواعد البيانات). انطلاقاً من أساسيات هندسة الحاسوب، أركز على تحسين الأداء الشامل، كتابة كود نظيف وقابل للصيانة، وبناء أنظمة قابلة للتوسع تدعم نمو الأعمال مباشرة\",\n  \"about.coreStack\": \"التقنيات الأساسية\",\n  \"about.sayHello\": \"تواصل معي\",\n  \"about.downloadCv\": \"السيرة الذاتية\",\n  \"about.shippedProjects\": \"مشروع تم تسليمه\",\n  \"about.card1.title\": \"معمارية برمجية نظيفة\",\n  \"about.card1.desc\": \"أكواد برمجية نظيفة وقابلة للتوسع مبنية على أفضل الأنماط العالمية، حيث تُبنى كل طبقة ومكون بعناية فائقة — بالاعتماد على React و Next.js و Node.js كعمود فقري هندسي.\",\n  \"about.card2.title\": \"عقلية تركز على نمو الأعمال\",\n  \"about.card2.desc\": \"برمجيات مصممة لحل المشاكل التشغيلية وتسريع النمو، كأنظمة الـ CRM والأتمتة التي تحقق نتائج أعمال ملموسة ومدروسة وليس مجرد أناقة برمجية.\",\n  \"about.card3.title\": \"أداء فائق وموثوقية تامة\",\n  \"about.card3.desc\": \"لا مساومة على سرعة التحميل، مع تحسين استعلامات قواعد البيانات، وسرعة استجابة فائقة في أجزاء من الثانية، واستراتيجيات كاش متقدمة معالجة للأخطاء منذ اليوم الأول.\",\n  \"about.howIBuild\": \"كيف أطور البرمجيات.\",\n  \"about.value1.label\": \"الأداء في المقام الأول\",\n  \"about.value1.desc\": \"سرعة فائقة كمعيار أساسي. كل جزء من الثانية يصنع فارقاً كبيراً.\",\n  \"about.value2.label\": \"أمان الأنواع الكامل\",\n  \"about.value2.desc\": \"اعتماد TypeScript في كل مكان لكتابة كود موثوق وواضح وذاتي التوثيق.\",\n  \"about.value3.label\": \"تسليم سريع وتحسين دوري\",\n  \"about.value3.desc\": \"التسليم التراكمي المستمر يضمن نتائج أفضل وتكيفاً أسرع مع متطلبات السوق.\",\n  \"about.value4.label\": \"التفكير المنظومي\",\n  \"about.value4.desc\": \"معماريات برمجية متكاملة وقابلة لإعادة الاستخدام وسهلة الصيانة.\",\n  \"about.philosophyQuote\": \"البرمجيات العظيمة تبدو سلسة وخفية للمستخدم، لكن لا يمكن تجاهل أثرها وقوتها في العمل.\",\n  \"about.philosophySub\": \"فلسفتي الهندسية في بناء البرمجيات\",\n  \"about.approachTitle\": \"منهجية العمل.\",\n  \"about.approach1.title\": \"فهم عميق للمشكلة\",\n  \"about.approach1.desc\": \"قبل كتابة أي سطر برمجي، أستثمر في فهم جوهر المشكلة وسلوك المستخدم ومتطلبات العمل بدقة.\",\n  \"about.approach2.title\": \"تصميم قابل للتوسع\",\n  \"about.approach2.desc\": \"أصمم معمارية تقبل النمو السلس، مع فصل واضح للمسؤوليات وواجهات واضحة ومحددة.\",\n  \"about.approach3.title\": \"تسليم متقن بأعلى معايير\",\n  \"about.approach3.desc\": \"الـ 20% الأخيرة تصنع كل الفارق: تفاعلات فائقة السلاسة، معالجة استباقية للأخطاء، وسرعة استثنائية.\",\n  \"workflow.badge\": \"منهجية وسير العمل\",\n  \"workflow.title\": \"كيف أطور وأبني الحلول الرقمية\",\n  \"workflow.subtitle\": \"عملية تطوير منظمة وشاملة تضمن أعلى درجات الموثوقية وتوافق الأعمال.\",\n  \"workflow.step1.title\": \"الاستكشاف وتحديد النطاق\",\n  \"workflow.step1.desc\": \"دراسة عميقة لمتطلبات المشروع، وتحديد النطاق الهندسي ونماذج البيانات لضمان مسار تنفيذ واضح المعالم.\",\n  \"workflow.step2.title\": \"المعمارية وهندسة النظام\",\n  \"workflow.step2.desc\": \"تصميم مخطط قاعدة البيانات، وهندسة الـ API، ورسم المكونات الأساسية قبل كتابة المنطق البرمجي.\",\n  \"workflow.step3.title\": \"التطوير البرمجي الشامل\",\n  \"workflow.step3.desc\": \"تنفيذ مراحل التطوير باستخدام كود نظيف، وإدارة حالة متقدمة، وأمان وحماية تامة للبيانات.\",\n  \"workflow.step4.title\": \"الفحص وضمان الجودة\",\n  \"workflow.step4.desc\": \"اختبارات وحدية وتكاملية وفحص توافقية المتصفحات والشاشات مع رفع كفاءة وسرعة التحميل.\",\n  \"workflow.step5.title\": \"النشر والإطلاق السحابي\",\n  \"workflow.step5.desc\": \"إعداد بيئة الإنتاج السحابية، وخطوط النشر التلقائي، والتخزين المؤقت لسرعة استجابة خارقة.\",\n  \"workflow.step6.title\": \"المتابعة والصيانة المستمرة\",\n  \"workflow.step6.desc\": \"مراقبة الأداء في الوقت الفعلي وتتبع الأخطاء والتحديثات المستمرة لدعم توسع النظام.\",\n  \"projects.badge\": \"أعمال مختارة ودراسات حالة\",\n  \"projects.title\": \"المشاريع المميزة\",\n  \"projects.subtitle\": \"مجموعة مختارة من حلول الويب، ومنصات الـ SaaS، والأنظمة المؤسسية المصممة بعناية.\",\n  \"projects.viewAll\": \"عرض جميع المشاريع\",\n  \"projects.viewCaseStudy\": \"عرض دراسة الحالة\",\n  \"projects.liveDemo\": \"معاينة حية\",\n  \"projects.sourceCode\": \"الكود المصدري\",\n  \"projects.production\": \"إنتاج حقيقي\",\n  \"projects.filterAll\": \"جميع المشاريع\",\n  \"projects.filterFeatured\": \"المميزة\",\n  \"projects.searchPlaceholder\": \"ابحث عن مشروع بالاسم أو التقنية أو التصنيف...\",\n  \"projects.noProjects\": \"لم يتم العثور على مشاريع تطابق بحثك.\",\n  \"projects.backToProjects\": \"العودة إلى جميع المشاريع\",\n  \"projects.projectDetails\": \"نظرة عامة على المشروع\",\n  \"projects.challenge\": \"التحدي الهندسي\",\n  \"projects.solution\": \"الحل المطبق\",\n  \"projects.keyFeatures\": \"الميزات الأساسية\",\n  \"projects.impact\": \"الأثر والنتائج\",\n  \"projects.technologies\": \"التقنيات المستخدمة\",\n  \"projects.year\": \"السنة\",\n  \"projects.category\": \"التصنيف\",\n  \"projects.role\": \"الدور الهندسي\",\n  \"skills.badge\": \"الترسانة التقنية والمهارات\",\n  \"skills.title\": \"المهارات والقدرات الهندسية.\",\n  \"skills.subtitle\": \"بناء أنظمة متكاملة بأحدث التقنيات وأرقى المعايير الهندسية المعترف بها عالمياً.\",\n  \"skills.searchPlaceholder\": \"ابحث عن تقنية، مكتبة، أو أداة...\",\n  \"skills.point1.title\": \"\",\n  \"skills.point1.desc\": \"\",\n  \"skills.point2.title\": \"\",\n  \"skills.point2.desc\": \"\",\n  \"skills.point3.title\": \"استقرار بيئة الإنتاج\",\n  \"skills.point3.desc\": \"التحقق المسبق من البيانات، ومعالجة ذكية للأخطاء لضمان استقرار الخدمة الدائم.\",\n  \"skills.categories.all\": \"جميع التقنيات\",\n  \"skills.categories.frontend\": \"الواجهات الأمامية\",\n  \"skills.categories.backend\": \"الخوادم والـ APIs\",\n  \"skills.categories.database\": \"قواعد البيانات\",\n  \"skills.categories.devops\": \"السحابة والنشر\",\n  \"skills.categories.tools\": \"الأدوات والمكتبات\",\n  \"experience.badge\": \"المسيرة المهنية والمحطات\",\n  \"experience.title\": \"الخبرات والمؤهلات.\",\n  \"experience.subtitle\": \"تسلسل زمني يوثق المسيرة الأكاديمية، والخبرات العملية، والمشاريع المؤثرة والشهادات المعتمدة.\",\n  \"experience.filterAll\": \"المسار بالكامل\",\n  \"experience.filterWork\": \"الخبرات المهنية\",\n  \"experience.filterEducation\": \"التعليم والشهادات\",\n  \"experience.filterMilestones\": \"محطات وإنجازات\",\n  \"experience.present\": \"حتى الآن\",\n  \"experience.responsibilities\": \"أبرز المسؤوليات والمنجزات\",\n  \"experience.technologiesUsed\": \"التقنيات المطبقة\",\n  \"experience.certificatesTitle\": \"الشهادات المهنية المعتمدة\",\n  \"experience.certificatesSubtitle\": \"شهادات معتمدة ومؤهلات تقنية موثقة تثبت التميز التخصصي.\",\n  \"experience.viewCredential\": \"التحقق من الشهادة\",\n  \"experience.loading\": \"جاري تحميل المسار المهني...\",\n  \"services.badge\": \"الخدمات والاستشارات\",\n  \"services.title\": \"ما الذي أقدمه لك.\",\n  \"services.subtitle\": \"خدمات تطوير برمجيات متكاملة تساعدك على الإطلاق بسرعة، وتفادي الديون التقنية، والتوسع بثقة.\",\n  \"services.orderNumber\": \"خدمة\",\n  \"services.startProject\": \"اطلب هذه الخدمة\",\n  \"services.chatWhatsapp\": \"ناقش التفاصيل عبر واتساب\",\n  \"services.customConsultation\": \"تحتاج حلاً مخصصاً بالكامل؟ دعنا نناقش متطلباتك بالتفصيل.\",\n  \"services.contactUs\": \"تواصل الآن\",\n  \"services.noServices\": \"يتم تحديث قائمة الخدمات حالياً.\",\n  \"faq.badge\": \"لديك استفسار؟\",\n  \"faq.title\": \"الأسئلة الأكثر شيوعاً.\",\n  \"faq.subtitle\": \"كل ما يهمك معرفته حول آليات العمل المشترك، الجداول الزمنية، ومراحل التسليم.\",\n  \"faq.categories.services\": \"الخدمات ونطاق العمل\",\n  \"faq.categories.process\": \"الخطوات والجدول الزمني\",\n  \"faq.categories.tech\": \"الحزمة التقنية والجودة\",\n  \"faq.categories.collab\": \"التعاون والتكلفة\",\n  \"faq.stillHaveQuestions\": \"ما زال لديك استفسار آخر؟\",\n  \"faq.reachOut\": \"تواصل معي مباشرة في أي وقت\",\n  \"contact.badge\": \"تواصل معي\",\n  \"contact.headline\": \"لديك فكرة مشروع؟\",\n  \"contact.subheadline\": \"دعنا نتحدث.\",\n  \"contact.subtitle\": \"سواء كنت بحاجة لتطبيق ويب متكامل، أو نظام API مخصص، أو لوحة تحكم عصرية، أو تطبيق هاتف — أنا جاهز لتحويل رؤيتك إلى واقع ملموس.\",\n  \"contact.chatWhatsapp\": \"محادثة واتساب\",\n  \"contact.sendEmail\": \"إرسال بريد إلكتروني\",\n  \"contact.findMe\": \"تابعني على\",\n  \"contact.formTitle\": \"أرسل رسالة مباشرة\",\n  \"contact.nameLabel\": \"الاسم الكريم\",\n  \"contact.namePlaceholder\": \"مثال: يوسف أحمد\",\n  \"contact.emailLabel\": \"البريد الإلكتروني\",\n  \"contact.emailPlaceholder\": \"مثال: yusuf@example.com\",\n  \"contact.subjectLabel\": \"موضوع الرسالة أو نوع المشروع\",\n  \"contact.subjectPlaceholder\": \"مثال: مشروع تطوير منصة ويب جديدة\",\n  \"contact.messageLabel\": \"تفاصيل الرسالة\",\n  \"contact.messagePlaceholder\": \"اشرح فكرة مشروعك، المتطلبات، والجدول الزمني المتوقع...\",\n  \"contact.submitButton\": \"إرسال الرسالة الآن\",\n  \"contact.sending\": \"جاري إرسال الرسالة...\",\n  \"contact.successTitle\": \"تم إرسال رسالتك بنجاح!\",\n  \"contact.successMessage\": \"شكراً لتواصلك. سأقوم بالرد عليك خلال أقل من 24 ساعة بإذن الله.\",\n  \"contact.sendAnother\": \"إرسال رسالة أخرى\",\n  \"contact.errorDefault\": \"حدث خطأ ما أثناء الإرسال. يرجى المحاولة ثانية أو التواصل عبر واتساب.\",\n  \"contact.directStatement\": \"دعنا نبني شيئاً عظيماً ومميزاً معاً.\",\n  \"contact.statementDesc\": \"سواء كان مشروعاً جديداً، أو استشارة برمجية، أو فرصة عمل — يسعدني دائماً مناقشة الأفكار الملهمة.\",\n  \"footer.navigation\": \"روابط سريعة\",\n  \"footer.connect\": \"تواصل معي\",\n  \"footer.rights\": \"جميع الحقوق محفوظة.\",\n  \"footer.startProject\": \"ابدأ مشروعك\",\n  \"footer.tagline\": \"مهندس برمجيات متكامل يطور منتجات رقمية فائقة الأداء ومعماريات برمجية متينة.\",\n  \"common.loading\": \"جاري التحميل...\",\n  \"common.back\": \"رجوع\",\n  \"common.close\": \"إغلاق\",\n  \"common.viewDetails\": \"عرض التفاصيل\",\n  \"common.filter\": \"تصفية\",\n  \"common.search\": \"بحث\",\n  \"common.remote\": \"عن بُعد / عالمياً\",\n  \"common.fullStackEngineer\": \"مهندس برمجيات متكامل\",\n  \"skills.paragraph1\": \"أجمع بين الأساس الأكاديمي الهندسي المتين والتنفيذ البرمجي العملي الجاهز للبيئات الفعلية.\",\n  \"skills.paragraph2\": \"من خلال دمج الدقة النظرية مع أساليب التطوير الحديثة، أقوم ببناء أنظمة مصممة للتوسع، ذات معمارية برمجية نظيفة، وأداء فائق في بيئات الاستخدام الحقيقية.\"\n}','2026-09-17 20:45:04.770','2026-10-27 20:10:59.684'),('f1817876-2df6-4d79-a406-84c9411420d2','en','English','ltr',1,1,'{\n  \"nav.about\": \"About\",\n  \"nav.workflow\": \"Workflow\",\n  \"nav.projects\": \"Projects\",\n  \"nav.skills\": \"Skills\",\n  \"nav.experience\": \"Experience\",\n  \"nav.services\": \"Services\",\n  \"nav.faq\": \"FAQ\",\n  \"nav.contact\": \"Contact\",\n  \"nav.startProject\": \"Start a project\",\n  \"hero.greeting\": \"\",\n  \"hero.headline\": \"End-to-End Web Development & Software Engineering\",\n  \"hero.bio\": \"Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.\",\n  \"hero.cta\": \"See My Work\",\n  \"hero.contactCta\": \"Let\'s Talk\",\n  \"hero.availability\": \"Available for Freelance & Consulting\",\n  \"hero.resume\": \"Download CV\",\n  \"hero.stats.experienceValue\": \"4+\",\n  \"hero.stats.experienceLabel\": \"Years Experience\",\n  \"hero.stats.projectsValue\": \"35+\",\n  \"hero.stats.projectsLabel\": \"Completed Projects\",\n  \"hero.stats.satisfactionValue\": \"100%\",\n  \"hero.stats.satisfactionLabel\": \"Client Satisfaction\",\n  \"hero.stats.uptimeValue\": \"99.9%\",\n  \"hero.stats.uptimeLabel\": \"Code Quality & Uptime\",\n  \"hero.typewriter.fullStack\": \"Full-Stack Developer\",\n  \"hero.typewriter.softwareEngineer\": \"Software Engineer\",\n  \"hero.typewriter.reactNext\": \"React & Next.js Specialist\",\n  \"hero.typewriter.backendNode\": \"Node.js & API Architect\",\n  \"hero.typewriter.uiUx\": \"Modern UI/UX Crafter\",\n  \"about.badge\": \"About Me\",\n  \"about.headline\": \"Crafting Scalable Software with Purpose & Precision.\",\n  \"about.bio1\": \"I\'m Yousef Ayoubi — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production. From custom CRMs and business operations platforms to high-performance web applications and scalable REST & GraphQL APIs.\",\n  \"about.bio2\": \"I specialize in architecting modern frontends (React, Next.js) tightly integrated with resilient backends (Node.js, Express.js, relational & NoSQL databases). Grounded in core computer engineering fundamentals, I focus on end-to-end performance optimization, clean maintainable code, and scalable systems that directly drive business growth\",\n  \"about.coreStack\": \"Core Stack\",\n  \"about.sayHello\": \"Say hello\",\n  \"about.downloadCv\": \"Resume\",\n  \"about.shippedProjects\": \"Projects shipped\",\n  \"about.card1.title\": \"Clean Architecture\",\n  \"about.card1.desc\": \"Maintainable, scalable codebases built on proven patterns. Every module, layer, and abstraction is intentional — with React, Next.js, and Node.js as the engineering backbone.\",\n  \"about.card2.title\": \"Business-First Mindset\",\n  \"about.card2.desc\": \"Software engineered to solve real operational bottlenecks and unlock growth. Custom CRMs, workflow automation, and APIs designed around measurable business outcomes — not just technical elegance.\",\n  \"about.card3.title\": \"Performance & Reliability\",\n  \"about.card3.desc\": \"Zero compromise on load speeds, database query optimization, and robust API architecture. Sub-second response times, efficient caching strategies, and battle-tested error handling baked in from day one.\",\n  \"about.howIBuild\": \"How I Build.\",\n  \"about.value1.label\": \"Performance-First\",\n  \"about.value1.desc\": \"Fast by default. Every millisecond matters.\",\n  \"about.value2.label\": \"Type Safety\",\n  \"about.value2.desc\": \"TypeScript everywhere. Confident, self-documenting code.\",\n  \"about.value3.label\": \"Ship Fast, Refine Often\",\n  \"about.value3.desc\": \"Iterative delivery beats big-bang releases.\",\n  \"about.value4.label\": \"Systems Thinking\",\n  \"about.value4.desc\": \"Reusable, composable, maintainable architectures.\",\n  \"about.philosophyQuote\": \"Great software is invisible to the user but impossible to ignore in its effects.\",\n  \"about.philosophySub\": \"My engineering philosophy\",\n  \"about.approachTitle\": \"My Approach.\",\n  \"about.approach1.title\": \"Understand Deeply\",\n  \"about.approach1.desc\": \"Before writing a line of code, I invest in understanding the problem, the user, and the business constraints.\",\n  \"about.approach2.title\": \"Design for Scale\",\n  \"about.approach2.desc\": \"I architect systems that can grow. Clean separation of concerns, clear interfaces, well-defined boundaries.\",\n  \"about.approach3.title\": \"Deliver with Craft\",\n  \"about.approach3.desc\": \"The final 20% matters. Smooth interactions, precise error handling, accessible markup, and optimized performance.\",\n  \"workflow.badge\": \"Workflow & Methodology\",\n  \"workflow.title\": \"How I Engineer Digital Products\",\n  \"workflow.subtitle\": \"A structured, end-to-end development process ensuring total reliability and business alignment.\",\n  \"workflow.step1.title\": \"Discovery & Scoping\",\n  \"workflow.step1.desc\": \"Deep-dive into business requirements, user personas, technical constraints, and data models to define clear project deliverables.\",\n  \"workflow.step2.title\": \"Architecture & Prototyping\",\n  \"workflow.step2.desc\": \"Drafting database schemas, API contracts, system components, and high-fidelity wireframes before writing business logic.\",\n  \"workflow.step3.title\": \"Full-Stack Development\",\n  \"workflow.step3.desc\": \"Executing iterative milestones with clean TypeScript, robust state management, secure auth, and performant UI components.\",\n  \"workflow.step4.title\": \"Testing & QA\",\n  \"workflow.step4.desc\": \"Unit tests, integration audits, cross-browser compatibility checks, and load performance optimizations.\",\n  \"workflow.step5.title\": \"Deployment & CI/CD\",\n  \"workflow.step5.desc\": \"Automated build pipelines, environment configurations, edge caching, and seamless cloud deployments.\",\n  \"workflow.step6.title\": \"Monitoring & Maintenance\",\n  \"workflow.step6.desc\": \"Real-time telemetry, error tracking, database maintenance, and feature enhancements to support continuous scale.\",\n  \"projects.badge\": \"Selected Works & Case Studies\",\n  \"projects.title\": \"Featured Projects\",\n  \"projects.subtitle\": \"A curated selection of client projects, SaaS platforms, and enterprise solutions.\",\n  \"projects.viewAll\": \"View all projects\",\n  \"projects.viewCaseStudy\": \"View Case Study\",\n  \"projects.liveDemo\": \"Live Demo\",\n  \"projects.sourceCode\": \"Source Code\",\n  \"projects.production\": \"PRODUCTION\",\n  \"projects.filterAll\": \"All Projects\",\n  \"projects.filterFeatured\": \"Featured\",\n  \"projects.searchPlaceholder\": \"Search projects by title, stack, or category...\",\n  \"projects.noProjects\": \"No projects found matching your search.\",\n  \"projects.backToProjects\": \"Back to all projects\",\n  \"projects.projectDetails\": \"Project Overview\",\n  \"projects.challenge\": \"The Challenge\",\n  \"projects.solution\": \"The Solution\",\n  \"projects.keyFeatures\": \"Key Features\",\n  \"projects.impact\": \"Impact & Results\",\n  \"projects.technologies\": \"Technologies Used\",\n  \"projects.year\": \"Year\",\n  \"projects.category\": \"Category\",\n  \"projects.role\": \"Role\",\n  \"skills.badge\": \"TECHNICAL ARSENAL & SKILLS\",\n  \"skills.title\": \"Skills & Engineering Capabilities.\",\n  \"skills.subtitle\": \"Full-stack systems engineered end-to-end with proven modern tools and architectural standards.\",\n  \"skills.searchPlaceholder\": \"Search technologies, frameworks, tools...\",\n  \"skills.point1.title\": \"\",\n  \"skills.point1.desc\": \"\",\n  \"skills.point2.title\": \"\",\n  \"skills.point2.desc\": \"\",\n  \"skills.point3.title\": \"Production Resilience\",\n  \"skills.point3.desc\": \"Defensive validation, resilient error boundaries, and observability built into every layer.\",\n  \"skills.categories.all\": \"All Technologies\",\n  \"skills.categories.frontend\": \"Frontend\",\n  \"skills.categories.backend\": \"Backend & APIs\",\n  \"skills.categories.database\": \"Databases\",\n  \"skills.categories.devops\": \"DevOps & Cloud\",\n  \"skills.categories.tools\": \"Tools & Utilities\",\n  \"experience.badge\": \"Career History & Academic Journey\",\n  \"experience.title\": \"Experience & Credentials.\",\n  \"experience.subtitle\": \"A chronological journey detailing academic foundations, industry experience, high-impact software projects, and recognized industry credentials.\",\n  \"experience.filterAll\": \"All Journey\",\n  \"experience.filterWork\": \"Work & Contracts\",\n  \"experience.filterEducation\": \"Academic Degrees\",\n  \"experience.filterMilestones\": \"Milestones & Achievements\",\n  \"experience.present\": \"Present\",\n  \"experience.responsibilities\": \"Key Responsibilities & Deliverables\",\n  \"experience.technologiesUsed\": \"Technologies Applied\",\n  \"experience.certificatesTitle\": \"Professional Certifications\",\n  \"experience.certificatesSubtitle\": \"Verified industry credentials and specialized technical achievements.\",\n  \"experience.viewCredential\": \"Verify Credential\",\n  \"experience.loading\": \"Loading career timeline...\",\n  \"services.badge\": \"Consulting & Offerings\",\n  \"services.title\": \"What I Deliver.\",\n  \"services.subtitle\": \"End-to-end software development services tailored to help you launch faster, eliminate technical debt, and scale reliably.\",\n  \"services.orderNumber\": \"Service\",\n  \"services.startProject\": \"Request This Service\",\n  \"services.chatWhatsapp\": \"Discuss via WhatsApp\",\n  \"services.customConsultation\": \"Need a tailored solution? Let\'s discuss your specific scope.\",\n  \"services.contactUs\": \"Contact Now\",\n  \"services.noServices\": \"Services are being updated.\",\n  \"faq.badge\": \"Got a question?\",\n  \"faq.title\": \"Common Questions.\",\n  \"faq.subtitle\": \"Got a question? Everything you need to know about working together, timelines, and deliverables.\",\n  \"faq.categories.services\": \"Services & Scope\",\n  \"faq.categories.process\": \"Process & Timeline\",\n  \"faq.categories.tech\": \"Tech Stack & Quality\",\n  \"faq.categories.collab\": \"Collaboration & Pricing\",\n  \"faq.stillHaveQuestions\": \"Still have unanswered questions?\",\n  \"faq.reachOut\": \"Reach out directly anytime\",\n  \"contact.badge\": \"Get In Touch\",\n  \"contact.headline\": \"Have an idea?\",\n  \"contact.subheadline\": \"Let\'s talk.\",\n  \"contact.subtitle\": \"Whether you need a full-stack application, a custom API, a modern dashboard, or a mobile app — I\'m ready to bring your vision to life.\",\n  \"contact.chatWhatsapp\": \"Chat on WhatsApp\",\n  \"contact.sendEmail\": \"Send an Email\",\n  \"contact.findMe\": \"Find me on\",\n  \"contact.formTitle\": \"Send a Direct Message\",\n  \"contact.nameLabel\": \"Your Name\",\n  \"contact.namePlaceholder\": \"e.g. John Doe\",\n  \"contact.emailLabel\": \"Your Email Address\",\n  \"contact.emailPlaceholder\": \"e.g. john@example.com\",\n  \"contact.subjectLabel\": \"Subject / Project Scope\",\n  \"contact.subjectPlaceholder\": \"e.g. New Web Application Project\",\n  \"contact.messageLabel\": \"Your Message\",\n  \"contact.messagePlaceholder\": \"Describe your project, timeline, and key requirements...\",\n  \"contact.submitButton\": \"Send Message\",\n  \"contact.sending\": \"Sending message...\",\n  \"contact.successTitle\": \"Message Sent Successfully!\",\n  \"contact.successMessage\": \"Thank you for reaching out. I\'ll get back to you within 24 hours.\",\n  \"contact.sendAnother\": \"Send another message\",\n  \"contact.errorDefault\": \"Something went wrong. Please try again or reach out directly on WhatsApp.\",\n  \"contact.directStatement\": \"Let\'s build something great together.\",\n  \"contact.statementDesc\": \"Whether it\'s a new project, a consulting engagement, or a full-time opportunity — I\'m always open to discussing high-impact ideas.\",\n  \"footer.navigation\": \"Navigation\",\n  \"footer.connect\": \"Connect\",\n  \"footer.rights\": \"All rights reserved.\",\n  \"footer.startProject\": \"Start a project\",\n  \"footer.tagline\": \"Full-Stack Engineer crafting performant digital products and resilient software architectures.\",\n  \"common.loading\": \"Loading...\",\n  \"common.back\": \"Back\",\n  \"common.close\": \"Close\",\n  \"common.viewDetails\": \"View Details\",\n  \"common.filter\": \"Filter\",\n  \"common.search\": \"Search\",\n  \"common.remote\": \"Remote / Worldwide\",\n  \"common.fullStackEngineer\": \"Full-Stack Engineer\",\n  \"skills.paragraph1\": \"I bridge the gap between strong academic computer engineering principles and practical, production-ready software execution.\",\n  \"skills.paragraph2\": \"Combining theoretical rigor with modern full-stack development, I build systems optimized for scalability, clean architecture, and real-world performance.\"\n}','2026-09-17 20:45:04.770','2026-10-27 20:10:59.665');
/*!40000 ALTER TABLE `translation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workflowstep`
--

DROP TABLE IF EXISTS `workflowstep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workflowstep` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titleAr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descriptionAr` text COLLATE utf8mb4_unicode_ci,
  `pinColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#E8732A',
  `order` int NOT NULL DEFAULT '0',
  `isEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workflowstep`
--

LOCK TABLES `workflowstep` WRITE;
/*!40000 ALTER TABLE `workflowstep` DISABLE KEYS */;
INSERT INTO `workflowstep` VALUES ('1505e2de-6af6-43d5-91db-fd4a33babfaa','02','System & Data Design','تصميم النظام والبيانات','Designing normalized relational schemas, ERD models, and efficient query layers, coupled with RESTful API structures engineered for ultra-low latency and seamless scalability.','تصميم مخططات بيانات عالية الكفاءة (ERDs)، وبناء طبقات استعلام محسّنة، إلى جانب هندسة واجهات برمجية (REST APIs) تمتاز بزمن استجابة فائق السرعة وقابلية تامة للتوسع.','#3B7DD8',2,1,'2026-09-17 20:43:41.502','2026-11-11 21:44:43.076'),('5f1f3260-5de3-4534-a76f-31c1e51fb917','05','Deployment & Cloud Delivery','النشر والإطلاق السحابي','Automating zero-downtime deployments via CI/CD pipelines, containerizing applications with Docker, and setting up real-time server monitoring for maximum uptime and stability.','أتمتة عمليات النشر بدون انقطاع (Zero-downtime) عبر خطوط CI/CD، تغليف التطبيقات باستخدام Docker، وإنشاء أنظمة مراقبة لحظية للخوادم لضمان أقصى درجات الاستقرار والاستمرارية.','#DC2626',5,1,'2026-09-17 20:43:41.502','2026-11-11 21:49:31.111'),('980a0a6d-e632-422a-bf10-3cd00c2ae164','04','Testing & QA Optimization','الاختبار وضمان الجودة','Conducting rigorous server workload testing, API benchmarking, and memory leak analysis to maintain zero-regression codebases and lightning-fast sub-second response times under peak traffic.','إجراء اختبارات صارمة لأحمال الخوادم، قياس أداء الـ APIs، وتحليل استهلاك الذاكرة — للحفاظ على كود متين خالي من الأخطاء وزمن استجابة فائق السرعة تحت أعلى معدلات الضغط.','#0D9668',4,1,'2026-09-17 20:43:41.502','2026-11-11 21:48:06.824'),('da0cf02b-b484-44b7-8883-92ad35d444ba','01','System Discovery & Logic Mapping','استكشاف النظام وتأطير المنطق','Deconstructing core business objectives, mapping system logic and data flows, and architecting scalable, resilient software foundations before writing a single line of code.','تحليل الأهداف التجارية الجوهرية، تخطيط المنطق البرمجي وتدفق البيانات، وتصميم بنية هندسية متينة وقابلة للتوسع قبل كتابة سطر برمجيات واحد.','#E8732A',1,1,'2026-09-17 20:43:41.502','2026-11-11 21:40:31.522'),('e6d239b8-a9ff-4e9a-bd56-fd8ff3484475','03','Full-Stack Execution','البرمجة والتطوير الشامل','Engineering resilient, maintainable codebases across the entire stack using React, Next.js, TypeScript, and Node.js — implementing modular architecture, robust state management, and optimized API integration.','تطوير شفرات برمجية متينة وقابلة للصيانة عبر كامل مكدس التقنيات باستخدام React و Next.js و TypeScript و Node.js — مع تطبيق معمارية برمجية نمطية (Modular)، إدارة حالة دقيقة، وربط واجهات برمجة عالي الكفاءة.','#9333EA',3,1,'2026-09-17 20:43:41.502','2026-11-11 21:46:00.218');
/*!40000 ALTER TABLE `workflowstep` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-15 16:05:45
