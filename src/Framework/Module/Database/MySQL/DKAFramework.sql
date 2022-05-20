-- CREATED BY YOVANGGA ANANDHIKA ---

CREATE TABLE `dka-bigdata-general_gendre` (
  `id_gendre` BIGINT AUTO_INCREMENT NOT NULL,
  `gendre_icon` LONGTEXT DEFAULT NULL,
  `gendre_name` LONGTEXT NOT NULL,
  `status` ENUM('true','false') DEFAULT 'true',
  PRIMARY KEY (id_gendre)
);


CREATE TABLE `dka-bigdata-news_category` (
  `id_news_category` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT DEFAULT NULL,
  `category_photo` LONGTEXT DEFAULT NULL,
  `category_name` LONGTEXT DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `status_deleted` ENUM('true','false') DEFAULT 'false',
  `status_activated` ENUM('true', 'false') DEFAULT 'true',
  PRIMARY KEY (id_news_category)
);

CREATE TABLE `dka-bigdata-news_detail` (
  `id_news_detail` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT DEFAULT NULL,
  `id_news_category` BIGINT DEFAULT NULL,
  `media_data` LONGTEXT DEFAULT NULL,
  `article` LONGTEXT DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `status_deleted` ENUM('true','false') DEFAULT 'false',
  `status_visible` ENUM('visible','hidden') DEFAULT 'visible',
  PRIMARY KEY (id_news_detail)
);

CREATE TABLE `dka-bigdata-news_comment` (
  `id_news_comment` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT DEFAULT NULL,
  `id_news_detail` BIGINT DEFAULT NULL,
  `comment_data` LONGTEXT NOT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `status_deleted` ENUM('true','false') DEFAULT 'false',
  PRIMARY KEY (id_news_comment)
);

-- BIG USER DATA DKA SERVER ---------
CREATE TABLE `dka-bigdata-user_login` (
  `id_user_login` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_upline` BIGINT DEFAULT NULL,
  `id_dcument_goverment_indentity` BIGINT DEFAULT NULL,
  `id_document_driver_identity` BIGINT DEFAULT NULL,
  `id_country` BIGINT DEFAULT NULL,
  `id_province` BIGINT DEFAULT NULL,
  `id_citydistrict` BIGINT DEFAULT NULL,
  `id_subcitydistrict` BIGINT DEFAULT NULL,
  `id_village` BIGINT DEFAULT NULL,
  `first_name` LONGTEXT DEFAULT NULL,
  `last_name` LONGTEXT DEFAULT NULL,
  `username` LONGTEXT DEFAULT NULL,
  `password` LONGTEXT DEFAULT NULL,
  `emailaddress` LONGTEXT DEFAULT NULL,
  `id_gendre` BIGINT DEFAULT NULL,
  `address` LONGTEXT DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `deleted_status` ENUM('true','false') NOT NULL,
  `time_deleted` DATETIME DEFAULT NULL,
  PRIMARY KEY (id_user_login)
);

/** BIG DATA SESSION DATA DKA SERVER **/
CREATE TABLE `dka-bigdata-user_session` (
  `id_user_session` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT NOT NULL,
  `uid_user_session` LONGTEXT NOT NULL,
  `ip_address` LONGTEXT NOT NULL,
  `device_type` ENUM('android','ios','web','unknown') NOT NULL,
  `device_desc` LONGTEXT DEFAULT NULL,
  `loc_coordinate` POINT DEFAULT NULL,
  `time_session_created` DATETIME DEFAULT NULL,
  `session_status_signout` ENUM('true','false') NOT NULL,
  `time_session_signout` DATETIME DEFAULT NULL,
  `session_status_deleted` ENUM('true','false') NOT NULL,
  `time_session_deleted` DATETIME DEFAULT NULL,
  PRIMARY KEY (id_user_session)
);

CREATE TABLE `dka-bigdata-user_message` (
  `id_message` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login_sender` BIGINT NOT NULL,
  `id_user_login_victim` BIGINT NOT NULL,
  `message_data` LONGTEXT DEFAULT NULL,
  `time_sending` DATETIME DEFAULT NULL,
  `time_received` DATETIME DEFAULT NULL,
  `time_deleted` DATETIME DEFAULT NULL,
  `deleted_status` ENUM('true','false') DEFAULT 'false',
  PRIMARY KEY (id_message)
);

/***  KARTU KELUARGA**/
CREATE TABLE `dka-bigdata-group-document-government_identity`(
  `id_document_familycard` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT NOT NULL,
  `id_user_login_headoffamily` BIGINT DEFAULT NULL,
  `unique_document_number` BIGINT DEFAULT NULL,
  `photos` LONGTEXT DEFAULT NULL,
  `head_of_family_name` LONGTEXT DEFAULT NULL,
  `address` LONGTEXT DEFAULT NULL,
  `rt` TEXT DEFAULT NULL,
  `rw` TEXT DEFAULT NULL,
  `postal_code` VARCHAR(10) DEFAULT NULL,
  `id_country` BIGINT DEFAULT NULL,
  `id_province` BIGINT DEFAULT NULL,
  `id_citydistrict` BIGINT DEFAULT NULL,
  `id_subcitydistrict` BIGINT DEFAULT NULL,
  `id_village` BIGINT DEFAULT NULL,
  `date_athority` DATE DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `deleted_status` ENUM('true', 'false') DEFAULT 'false',
  `authority_name` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (id_document_familycard)
);

CREATE TABLE `dka-bigdata-document-government_identity` (
  `id_govermentidentity` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT NOT NULL,
  `id_user_login_document_owner` BIGINT DEFAULT NULL,
  `id_document_familycard` BIGINT DEFAULT NULL,
  `unique_document_number` BIGINT DEFAULT NULL,
  `photos` LONGTEXT DEFAULT NULL,
  `first_name` LONGTEXT DEFAULT NULL,
  `last_name` LONGTEXT DEFAULT NULL,
  `id_gender` BIGINT DEFAULT NULL,
  `bloody_type` ENUM('O','A','AB','B','UNKNOWN') DEFAULT NULL,
  `address` LONGTEXT DEFAULT NULL,
  `rt` TEXT DEFAULT NULL,
  `rw` TEXT DEFAULT NULL,
  `id_village` BIGINT DEFAULT NULL,
  `id_subcitydistrict` BIGINT DEFAULT NULL,
  `id_religion` BIGINT DEFAULT NULL,
  `marriage_status` TEXT DEFAULT NULL,
  `id_jobs` BIGINT DEFAULT NULL,
  `citizenship` TEXT DEFAULT NULL,
  `valid_until` DATETIME DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `deleted_status` ENUM('true', 'false') DEFAULT 'false',
  `authority_name` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (id_govermentidentity)
);

CREATE TABLE `dka-bigdata-document-government_birth`(
  `id_document_birth` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT NOT NULL,
  `id_user_document_owner` BIGINT DEFAULT NULL,
  `id_document_family_card` BIGINT DEFAULT NULL,
  `unique_document_number` LONGTEXT DEFAULT NULL,
  `unique_stbld` LONGTEXT DEFAULT NULL,
  `id_citydistrict` BIGINT DEFAULT NULL,
  `date_birth` DATE DEFAULT NULL,
  `date_birth_text` LONGTEXT DEFAULT NULL,
  `time_birth` TIME DEFAULT NULL,
  `first_name` LONGTEXT DEFAULT NULL,
  `last_name` LONGTEXT DEFAULT NULL,
  `child_number` INT(20) DEFAULT NULL,
  `id_gendre` BIGINT DEFAULT NULL,
  `id_document_identity_father` BIGINT DEFAULT NULL,
  `id_document_identity_mother` BIGINT DEFAULT NULL,
  PRIMARY KEY (id_document_birth)
);

CREATE TABLE `dka-bigdata-document-government_licencedriver` (
  `id_licencedriver` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT DEFAULT NULL,
  `id_user_login_document_owner` BIGINT DEFAULT NULL,
  `unique_document_number` BIGINT DEFAULT NULL,
  `licence_type` TEXT DEFAULT NULL,
  `photos` LONGTEXT DEFAULT NULL,
  `first_name` LONGTEXT DEFAULT NULL,
  `last_name` LONGTEXT DEFAULT NULL,
  `address` LONGTEXT DEFAULT NULL,
  `rt` TEXT DEFAULT NULL,
  `rw` TEXT DEFAULT NULL,
  `id_village` BIGINT DEFAULT NULL,
  `id_subcitydistrict` BIGINT DEFAULT NULL,
  `id_citydistrict` BIGINT DEFAULT NULL,
  `id_birthplace`  BIGINT DEFAULT NULL,
  `birthdate` DATE DEFAULT NULL,
  `height_body` INT(4) DEFAULT NULL,
  `id_jobs` BIGINT DEFAULT NULL,
  `valid_until` DATE DEFAULT NULL,
  `time_created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `time_deleted` DATETIME DEFAULT NULL,
  `deleted_status` ENUM('true', 'false') DEFAULT 'false',
  `authority_name` LONGTEXT DEFAULT NULL,
  PRIMARY KEY (id_licencedriver)
)

-- BIG DATA


CREATE PROCEDURE ADD_DATABASE
BEGIN

end;




