DROP DATABASE IF EXISTS Vonatok;
CREATE DATABASE Vonatok;

USE Vonatok;
-- CREATE user 'webprog_vonat'@'localhost' IDENTIFIED BY 'almakorte';
 -- GRANT ALL PRIVILEGES ON *.* TO 'webprog_vonat'@'localhost';

 CREATE TABLE IF NOT EXISTS Trains (
    id INT PRIMARY KEY AUTO_INCREMENT,
    honnan VARCHAR(255) NOT NULL,
    hova VARCHAR(255) NOT NULL,
    day VARCHAR(255) NOT NULL,
    departuretime TIME NOT NULL,
    arrivaltime TIME NOT NULL,
    traintype VARCHAR(255) NOT NULL,
    trainprice INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rang VARCHAR(255) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Reservations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        trainid INT NOT NULL,
        userid INT NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (trainid) REFERENCES Trains(id),
        FOREIGN KEY (userid) REFERENCES Users(id)
    );