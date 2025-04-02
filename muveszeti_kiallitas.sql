
-- MySQL Dump - muveszeti_kiallitas adatbázis
CREATE DATABASE IF NOT EXISTS muveszeti_kiallitas;
USE muveszeti_kiallitas;

CREATE TABLE IF NOT EXISTS muvesz (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nev VARCHAR(100) NOT NULL,
  nemzetiseg VARCHAR(50),
  aktiv TINYINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS alkotas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  muvesz_id INT NOT NULL,
  cim VARCHAR(100) NOT NULL,
  ev INT NOT NULL,
  FOREIGN KEY (muvesz_id) REFERENCES muvesz(id)
);
