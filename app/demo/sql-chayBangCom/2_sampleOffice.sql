CREATE TABLE offices (
  officeCode INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  addressLine1 VARCHAR(255) NOT NULL,
  addressLine2 VARCHAR(255) ,
  state VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  postalCode VARCHAR(255) NOT NULL,
  territory VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO offices (officeCode, city, phone, addressLine1, addressLine2, state, country, postalCode, territory)
VALUES
  (1, 'New York', '+1 212-555-1234', '123 Main St', 'Apt 4B', 'NY', 'USA', '10001', 'North America'),
  (2, 'Los Angeles', '+1 310-555-5678', '456 Sunset Blvd', 'Suite 200', 'CA', 'USA', '90028', 'North America'),
  (3, 'Wibu sav3 w0lrd', '+1 310-555-9999', '444 Sunset Blvd', 'Suite 330', 'HN', 'VN', '1200', 'North');
