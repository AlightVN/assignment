SELECT * FROM data.employees;
ADD roleId INT;
UPDATE employees
SET roleId = (
  SELECT id
  FROM permissions
  WHERE employees.jobTitle = permissions.roleName
);
ALTER TABLE employees
ADD CONSTRAINT fk_roleId
FOREIGN KEY (roleId) REFERENCES permissions(id);
