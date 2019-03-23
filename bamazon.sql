-- Drops the programming_db if it already exists --
DROP DATABASE IF EXISTS bamazon;
-- Create a database called programming_db --
CREATE DATABASE bamazon;
USE bamazon;
-- Use programming db for the following statements --

-- create a table products --
CREATE TABLE products(
  item_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(150),
  department_name VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER,
  PRIMARY KEY (item_id)
);

-- populate the table --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Little Red Dress", "Apparel", 15.50, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Christmas Sweater", "Apparel", 11.99, 40);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("White Sheeplike Coat", "Apparel", 20.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bouncy Ball", "Toys", 5.99, 65);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mechanical Rat", "Toys", 25.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Remote Controlled Rat", "Toys", 25.00, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mammoth Floss Chews 3-Knot Rope", "Toys", 9.99, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Squeaky Dragon", "Toys", 12.99, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Science Diet", "Food", 9.99, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Ostrich", "Food", 11.99, 40);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dried Liver", "Food", 13.99, 20);









