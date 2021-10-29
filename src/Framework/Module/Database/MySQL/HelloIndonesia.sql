
CREATE TABLE `hi-features-kependudukan_ktp`(
  `id_kependudukan_ktp` BIGINT AUTO_INCREMENT NOT NULL,
  `id_user_login` BIGINT NOT NULL,
  `id_document_goverment_identity` BIGINT NOT NULL,
  PRIMARY KEY (id_kependudukan_ktp)
);

CREATE TABLE `hi-setting_project` (
  `id_project` BIGINT AUTO_INCREMENT NOT NULL,
  `id_country` BIGINT DEFAULT NULL,

  `id_province` BIGINT DEFAULT NULL,
  `id_citydistrict` BIGINT DEFAULT NULL,
  `id_subcitydistrict` BIGINT DEFAULT NULL,
  `id_village` BIGINT DEFAULT NULL,
  `name_project` LONGTEXT DEFAULT NULL,
  `project_status` ENUM('true','false') DEFAULT 'false',
  PRIMARY KEY (id_project)
);

CREATE TABLE `hi-user_login` (
  `id_user_login` BIGINT AUTO_INCREMENT NOT NULL,
  `id_project` BIGINT DEFAULT NULL,
  `level_access` ENUM('DEVELOPER','MASTER', 'ADMINISRATOR', 'PUBLIC') DEFAULT 'PUBLIC',
  `photos` LONGTEXT DEFAULT NULL,
  `confirmation_status` ENUM('true','false') DEFAULT 'false',
  `banned_status` ENUM('true','false') DEFAULT 'false',
  PRIMARY KEY (id_user_login)
)