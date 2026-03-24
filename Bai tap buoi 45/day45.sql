ALTER TABLE order_items
ADD COLUMN price_at_time DECIMAL(10,2);
UPDATE order_items
SET price_at_time = products.current_price
FROM products
WHERE order_items.product_id = products.id;
-- Bài 1: Tính tổng doanh thu của hệ thống

SELECT order_items.order_id, SUM(order_items.quantity * price_at_time) AS total
FROM order_items
GROUP BY order_items.order_id

-- Bài 2: Lấy ra 5 khách hàng chi tiêu nhiều nhất trong tháng 1/2026
--
SELECT users.id, users.full_name, 
SUM (order_items.quantity * order_items.price_at_time) AS total_amount
FROM  users
JOIN orders
ON users.id = orders.user_id
JOIN order_items
ON order_items.order_id = orders.id
WHERE EXTRACT(MONTH FROM orders.order_date) = 1 AND EXTRACT(YEAR FROM orders.order_date)= 2026 AND orders.status ='completed'
GROUP BY users.id, users.full_name
ORDER BY total_amount DESC
LIMIT 5

-- Bài 3: Lấy ra 5 user có số lượng bình luận nhiều nhất trong tháng 1/2026

SELECT users.id, users.username,
COUNT(comments.user_id) AS total_comments
FROM users
JOIN comments
ON users.id = comments.user_id
WHERE EXTRACT(MONTH FROM comments.created_at) = 1 AND EXTRACT(YEAR FROM comments.created_at)= 2026
GROUP BY users.id, users.username
ORDER BY total_comments DESC
LIMIT 5

-- Bài 4: Lấy ra tất cả sản phẩm kèm số lượng bình luận
SELECT products.id, products.name, products.current_price,
COUNT(comments.product_id) AS total_comment_products
FROM products
JOIN comments
ON products.id = comments.product_id
GROUP BY products.id, products.name, products.current_price
ORDER BY total_comment_products DESC

-- Bài 5: Lấy ra các khách hàng có tổng chi tiêu lớn hơn mức chi tiêu trung bình
--
WITH users_spend AS(
    SELECT users.id, users.username, SUM(order_items.quantity * price_at_time) AS total_spend
FROM users
JOIN orders
ON users.id = orders.user_id
JOIN order_items
ON orders.id = order_items.order_id
WHERE EXTRACT(MONTH FROM orders.order_date ) = 1 AND EXTRACT(YEAR FROM orders.order_date) =2026 AND orders.status='completed'
GROUP BY users.id, users.username
)

SELECT users_spend.*,(SELECT ROUND(AVG(total_spend), 2) FROM users_spend)
FROM users_spend
WHERE total_spend >
      (SELECT AVG(total_spend) FROM users_spend)

-- Bài 6: Với mỗi danh mục, tìm sản phẩm có tổng số lượng bán ra nhiều nhất
WITH total_product_top AS(SELECT products.id, products.name, products.category, SUM(order_items.quantity) AS total_quantity
FROM products
JOIN order_items
ON products.id = order_items.product_id
GROUP BY products.id, products.name,products.category
) SELECT *
FROM total_product_top t
WHERE total_quantity=(SELECT MAX(total_quantity)
                      FROM total_product_top
                      WHERE category = t.category)

-- Bài 7: Tạo một báo cáo tổng hợp cho từng khách hàng

WITH user_orders AS (
    SELECT users.username,
           users.id,
           COUNT(DISTINCT orders.id) AS total_orders,
           SUM(order_items.quantity) AS total_quantity,
           SUM(order_items.quantity * order_items.price_at_time) AS total_price,
           SUM(order_items.quantity *order_items.price_at_time) /  COUNT(DISTINCT orders.id)  AS  total_spend
    FROM users
    JOIN orders ON users.id = orders.user_id
    JOIN order_items ON orders.id = order_items.order_id
    WHERE EXTRACT(MONTH FROM orders.order_date) = 1
    AND EXTRACT(YEAR FROM orders.order_date)= 2026
    AND orders.status='completed'
    GROUP BY users.username, users.id
),

user_comments AS (
    SELECT user_id , COUNT(user_id) AS total_comment
    FROM comments
    WHERE EXTRACT(MONTH FROM comments.created_at) = 1
    AND EXTRACT(YEAR FROM comments.created_at)= 2026
    GROUP BY user_id
)

SELECT user_orders.*, user_comments.total_comment
FROM user_orders
LEFT JOIN user_comments
ON user_orders.id =user_comments.user_id
ORDER BY user_orders.total_price DESC

-- Bài 8: Tìm các sản phẩm chưa từng được bán

SELECT products.id, products.name, products.current_price,products.category
FROM products
LEFT JOIN order_items
ON products.id = order_items.product_id
WHERE order_items.product_id IS NULL

-- Bài 9: Tính doanh thu theo từng tháng
SELECT EXTRACT (YEAR FROM orders.order_date) AS year,
       EXTRACT(MONTH FROM orders.order_date) AS month,
       SUM(order_items.quantity * order_items.price_at_time) AS total_revenue,
       COUNT(order_items.id) AS total_orders,
       ROUND(SUM(order_items.quantity * order_items.price_at_time) / COUNT(DISTINCT orders.id),2)AS avg_order_value
FROM orders
JOIN order_items
ON orders.id = order_items.order_id
WHERE ( EXTRACT (YEAR FROM orders.order_date) = 2025 AND EXTRACT (MONTH FROM orders.order_date) = 12 ) OR (EXTRACT (YEAR FROM orders.order_date) = 2026 AND EXTRACT (MONTH FROM orders.order_date) = 1 )
AND orders.status='completed'
GROUP BY EXTRACT (YEAR FROM orders.order_date), EXTRACT(MONTH FROM orders.order_date)
ORDER BY year,month

-- Bài 10: Tìm khách hàng trung thành

SELECT users.id, users.username,
       SUM(order_items.quantity) AS total_orders,
       SUM(order_items.quantity * order_items.price_at_time) AS total_spend
FROM users
JOIN orders
ON users.id = orders.user_id
JOIN order_items
ON orders.id = order_items.order_id
WHERE EXTRACT(YEAR FROM orders.order_date) = 2026
  AND EXTRACT(MONTH FROM orders.order_date) = 1
GROUP BY users.id, users.username
HAVING
    SUM(order_items.quantity) >= 2
    AND SUM(order_items.quantity * order_items.price_at_time) >= 30000000;