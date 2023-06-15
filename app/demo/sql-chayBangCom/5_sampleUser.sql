-- User được create bằng hash pass :V
CREATE TABLE users (
  userName VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  employeeNumber INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (userName, password, employeeNumber)
VALUES ('Alight', '$2b$10$oWxtti.p3kn0JZRy8HFCiOsarNYDwhmypK3Hg2pK55OvzJOODrmga', 1);

