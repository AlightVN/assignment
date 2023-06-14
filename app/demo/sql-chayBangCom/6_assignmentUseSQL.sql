use new_schema;

-- Read all customer 
SELECT * FROM customers;

-- Create customer 
INSERT INTO customers (
  customerNumber,
  customerName,
  contactLastName,
  contactFirstName,
  phone,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
  country,
  salesRepEmployeeNumber,
  creditLimit
) VALUES (15,
  'Michale Fres',
  'Cainte',
  'Roald Copki',
  '337-928-8506',
  '9889 Wuckert Point',
  '4734 Emard Forest',
  'Charlotte',
  'Ha Noi',
  '100000',
  'Saint Pierre and Miquelon',
   6,
  20000000
);

-- Update customer 
UPDATE Customers SET
  customerName = 'Michale Fres',
  contactLastName = 'Cainte',
  contactFirstName = 'Roald Copki',
  phone = '337-928-8506',
  addressLine1 = '9889 Teleport Waypoint',
  addressLine2 = '4734 Emenard Splash',
  city = 'Xiao chao meng',
  state = 'Ha Noi',
  postalCode = '100000',
  country = 'Saint Pierre and Miquelon',
  creditLimit = 20000000,
  updatedAt = '2023-06-08 04:03:02',
  salesRepEmployeeNumber = 6
WHERE customerNumber = 36;

-- Delete customer
DELETE FROM customers WHERE customerNumber = 36;

--  Report list of employee order by number of customers
SELECT employees.employeeNumber, employees.firstName, employees.lastName, employees.officeCode, count(customers.customerNumber) as customerCount FROM employees 
LEFT JOIN customers 
ON employees.employeeNumber = customers.salesRepEmployeeNumber 
GROUP BY employees.employeeNumber
ORDER BY customerCount DESC;

--  Report list of office order by number of customers
SELECT employees.employeeNumber, offices.officeCode, count(customers.customerNumber) as customerCount FROM employees 
LEFT JOIN customers 
ON employees.employeeNumber = customers.salesRepEmployeeNumber 
LEFT JOIN offices
ON employees.officeCode = offices.officeCode
GROUP BY offices.officeCode
ORDER BY customerCount DESC;

-- Report list of employee order by total credit limit of their customers
SELECT employees.employeeNumber, employees.firstName, employees.lastName, employees.officeCode, sum(customers.creditLimit) as totalCustomersCredit FROM employees 
LEFT JOIN customers 
ON employees.employeeNumber = customers.salesRepEmployeeNumber 
GROUP BY employees.employeeNumber
ORDER BY totalCustomersCredit DESC;

-- Report average customer’s credit limit of each office
SELECT employees.employeeNumber, offices.officeCode, avg(customers.creditLimit) as avgCustomersCredit FROM employees 
LEFT JOIN customers 
ON employees.employeeNumber = customers.salesRepEmployeeNumber 
LEFT JOIN offices
ON employees.officeCode = offices.officeCode
GROUP BY offices.officeCode
ORDER BY avgCustomersCredit DESC;

SELECT
  o.officeCode,
  p.productLine,
  SUM(od.quantityOrdered * od.priceEach) AS productLineRevenue
FROM
  offices o
  LEFT JOIN employees e ON o.officeCode = e.officeCode
  LEFT JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
  LEFT JOIN orders ord ON c.customerNumber = ord.customerNumber
  LEFT JOIN orderdetails od ON ord.orderNumber = od.orderNumber
  LEFT JOIN products p ON od.productCode = p.productCode
WHERE
  ord.orderDate BETWEEN '2023-06-01' AND '2023-06-11'
GROUP BY
  o.officeCode,
  p.productLine;


SELECT
  e.employeeNumber,
  SUM(od.quantityOrdered * od.priceEach) AS productLineRevenue
FROM
	employees e
  LEFT JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
  LEFT JOIN orders ord ON c.customerNumber = ord.customerNumber
  LEFT JOIN orderdetails od ON ord.orderNumber = od.orderNumber
  LEFT JOIN products p ON od.productCode = p.productCode
WHERE
  ord.orderDate BETWEEN '2023-06-01' AND '2023-06-11'
GROUP BY
  e.employeeNumber