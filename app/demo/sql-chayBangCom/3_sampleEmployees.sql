CREATE TABLE employees (
    employeeNumber INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    extension VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    officeCode INT NOT NULL,
    reportsTo INT,
    jobTitle VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO employees (employeeNumber, firstName, lastName, extension, email, officeCode, reportsTo, jobTitle)
VALUES
  (1, 'John', 'Doe', '1234', 'john@example.com', 2, NULL, 'President'),
  (2, 'Jane', 'Smith', '5678', 'jane@example.com', 1, 1, 'Manager'),
  (3, 'David', 'Brown', '4321', 'david@example.com', 2, 2, 'Leader'),
  (4, 'Sarah', 'Johnson', '8765', 'sarah@example.com', 2, 2, 'Leader'),
  (5, 'Michael', 'Williams', '1357', 'michael@example.com', 1, 3, 'Staff'),
  (6, 'Emily', 'Jones', '2468', 'emily@example.com', 1, 3, 'Staff'),
  (7, 'William', 'Davis', '3690', 'william@example.com', 3, 4, 'Staff'),
  (8, 'Olivia', 'Taylor', '2580', 'olivia@example.com', 3, 4, 'Staff'),
  (9, 'John', 'Doe', '1234', 'john@example.com', 3, NULL, 'President');
