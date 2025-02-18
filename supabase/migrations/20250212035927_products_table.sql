/*
  # Add initial products

  1. New Data
    - Adds initial product data for the store
    - Includes various categories: japanese, desserts, fastfood, breakfast, fruits
    - Each product has name, description, price, category, and image URL

  2. Notes
    - All images are from Unsplash for demo purposes
    - Prices are in USD
*/

INSERT INTO products (name, description, price, category, image) VALUES
-- Japanese Cuisine
('Sushi Platter Display', 'Realistic display of various sushi rolls', 129.99, 'japanese', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3'),
('Ramen Bowl Display', 'Lifelike ramen with detailed toppings', 89.99, 'japanese', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3'),
('Tempura Set Display', 'Artificial tempura with vegetables and shrimp', 119.99, 'japanese', 'https://images.unsplash.com/photo-1581781870027-04212e231e96?ixlib=rb-4.0.3'),

-- Desserts
('Chocolate Cake Display', 'Artificial chocolate cake with detailed frosting', 89.99, 'desserts', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3'),
('Ice Cream Sundae Display', 'Realistic ice cream sundae with toppings', 49.99, 'desserts', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3'),
('Macaron Collection Display', 'Set of colorful artificial macarons', 79.99, 'desserts', 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?ixlib=rb-4.0.3'),

-- Fast Food
('Burger Combo Display', 'Realistic burger with fries and drink', 149.99, 'fastfood', 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3'),
('Pizza Display', 'Artificial pizza with various toppings', 129.99, 'fastfood', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3'),
('Hot Dog Combo Display', 'Realistic hot dog with condiments', 79.99, 'fastfood', 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?ixlib=rb-4.0.3'),

-- Breakfast
('American Breakfast Display', 'Complete breakfast set with pancakes and sides', 179.99, 'breakfast', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3'),
('Continental Breakfast Display', 'Assorted pastries and breakfast items', 159.99, 'breakfast', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3'),
('Eggs Benedict Display', 'Artificial eggs benedict with hollandaise', 89.99, 'breakfast', 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3'),

-- Fruits
('Artificial Red Apple', 'Realistic red apple replica, perfect for displays', 12.99, 'fruits', 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?ixlib=rb-4.0.3'),
('Artificial Banana Bunch', 'Lifelike bunch of bananas', 24.99, 'fruits', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3'),
('Artificial Strawberries', 'Set of realistic strawberries', 18.99, 'fruits', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3'),
('Artificial Orange', 'Realistic orange with detailed texture', 14.99, 'fruits', 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3'),
('Artificial Mango', 'Lifelike mango replica', 16.99, 'fruits', 'https://images.unsplash.com/photo-1553279768-865429fa0078?ixlib=rb-4.0.3'),
('Artificial Blueberries', 'Set of realistic blueberries', 19.99, 'fruits', 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3');