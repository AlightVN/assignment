-- User được create bằng hash pass :V
CREATE TABLE users (
  userName VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  employeeNumber INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO permissions (userName, password, employeeNumber)
VALUES ('Alight', '$10$ysyrcjYa3CYFslLXbAj51OpqOK8IgHftwf.rYPIdFiTwiU4quUloO', 1);
