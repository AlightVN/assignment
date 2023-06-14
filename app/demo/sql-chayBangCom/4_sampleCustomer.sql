CREATE TABLE customers (
    customerNumber INT AUTO_INCREMENT PRIMARY KEY,
    contactLastName VARCHAR(255) NOT NULL,
    contactFirstName VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    addressLine1 VARCHAR(255) NOT NULL,
    addressLine2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    postalCode VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    salesRepEmployeeNumber INT NOT NULL,
    creditLimit INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO customers (customerNumber, contactLastName, contactFirstName, phone, addressLine1, addressLine2, city, state, postalCode, country, salesRepEmployeeNumber, creditLimit)
VALUES
  (1, 'Nguyen', 'Van A', '0123456789', '123 ABC Street', '', 'Ho Chi Minh City', 'HCM', '700000', 'Vietnam', 1, 140000 ),
  (2, 'Tran', 'Thi B', '0987654321', '456 XYZ Street', '', 'Ha Noi', 'HN', '100000', 'Vietnam', 2, 120000 ),
  (3, 'Le', 'Van C', '0909123456', '789 MNO Street', '', 'Da Nang', 'DN', '500000', 'Vietnam', 3, 200000),
  (4, 'Pham', 'Thi D', '0909123456', '789 MNO Street', '', 'Can Tho', 'CT', '900000', 'Vietnam', 1, 300000),
  (5, 'Hoang', 'Van E', '0123456789', '123 ABC Street', '', 'Nha Trang', 'NT', '650000', 'Vietnam', 2, 150000),
  (6, 'Do', 'Thi F', '0987654321', '456 XYZ Street', '', 'Hue', 'HU', '580000', 'Vietnam', 3, 180000),
  (7, 'Vu', 'Van G', '0909123456', '789 MNO Street', '', 'Hai Phong', 'HP', '400000', 'Vietnam', 1, 250000),
  (8, 'Nguyen', 'Thi H', '0909123456', '789 MNO Street', '', 'Vung Tau', 'VT', '740000', 'Vietnam', 2, 190000),
  (9, 'Tran', 'Van I', '0123456789', '123 ABC Street', '', 'Ha Long', 'HL', '500000', 'Vietnam', 3, 220000);
