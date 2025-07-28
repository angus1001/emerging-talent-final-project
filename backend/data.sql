-- Insert sample users
INSERT INTO users (first_name, last_name, password, email, created_at) VALUES
('John', 'Doe', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'john.doe@example.com', '2023-01-15 09:30:00'),
('Jane', 'Smith', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'jane.smith@example.com', '2023-02-20 14:45:00'),
('Robert', 'Johnson', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'robert.j@example.com', '2023-03-10 11:20:00'),
('Emily', 'Williams', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'emily.w@example.com', '2023-04-05 16:30:00'),
('Michael', 'Brown', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'michael.b@example.com', '2023-05-12 10:15:00');

-- Insert sample stocks
INSERT INTO stocks (symbol, company_name, current_price, last_updated) VALUES
('AAPL', 'Apple Inc.', 175.32, '2023-10-01 09:30:00'),
('MSFT', 'Microsoft Corporation', 310.65, '2023-10-01 09:30:00'),
('GOOGL', 'Alphabet Inc.', 135.42, '2023-10-01 09:30:00'),
('AMZN', 'Amazon.com Inc.', 120.56, '2023-10-01 09:30:00'),
('TSLA', 'Tesla Inc.', 210.76, '2023-10-01 09:30:00'),
('NVDA', 'NVIDIA Corporation', 450.87, '2023-10-01 09:30:00'),
('JPM', 'JPMorgan Chase & Co.', 145.23, '2023-10-01 09:30:00'),
('V', 'Visa Inc.', 230.45, '2023-10-01 09:30:00'),
('DIS', 'The Walt Disney Company', 80.12, '2023-10-01 09:30:00'),
('NFLX', 'Netflix Inc.', 380.54, '2023-10-01 09:30:00');

-- Create temporary date table for net worth
CREATE TEMPORARY TABLE IF NOT EXISTS dates (n INT);
INSERT INTO dates VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
                        (11),(12),(13),(14),(15),(16),(17),(18),(19),(20),
                        (21),(22),(23),(24),(25),(26),(27),(28),(29);

-- Insert sample net worth records (30 days for each user)
INSERT INTO net_worth (user_id, total_balance, stock_value, date_recorded)
SELECT 
    u.user_id,
    ROUND(50000 + (RAND() * 50000) + (d.n * 100) + (RAND() * 500 - 250), 2) AS total_balance,
    ROUND(20000 + (RAND() * 30000) + (d.n * 50) + (RAND() * 300 - 150), 2) AS stock_value,
    DATE_SUB(CURDATE(), INTERVAL d.n DAY) AS date_recorded
FROM users u
CROSS JOIN dates d
ORDER BY u.user_id, d.n;

-- Drop temporary date table
DROP TEMPORARY TABLE IF EXISTS dates;

-- Insert sample orders (10-15 per user)
INSERT INTO orders (user_id, order_type, stock_id, shares, price_per_share, order_date, status)
SELECT 
    u.user_id,
    ot.order_type,
    s.stock_id,
    FLOOR(1 + RAND() * 100) AS shares,
    ROUND(s.current_price * (0.8 + RAND() * 0.4), 2) AS price_per_share,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 90) DAY) AS order_date,
    IF(RAND() > 0.2, 'EXECUTED', 'PENDING') AS status
FROM users u
CROSS JOIN (SELECT 'BUY' AS order_type UNION SELECT 'SELL') AS ot
JOIN stocks s
WHERE RAND() < 0.3  -- Each user has orders for 30% of stocks
LIMIT 150;

-- Insert sample holdings (3-5 per user)
INSERT INTO holdings (user_id, stock_id, total_shares, average_price, last_updated)
SELECT 
    o.user_id,
    o.stock_id,
    SUM(CASE 
        WHEN o.order_type = 'BUY' AND o.status = 'EXECUTED' THEN o.shares
        WHEN o.order_type = 'SELL' AND o.status = 'EXECUTED' THEN -o.shares
        ELSE 0
    END) AS total_shares,
    ROUND(AVG(CASE WHEN o.order_type = 'BUY' THEN o.price_per_share ELSE NULL END), 2) AS average_price,
    MAX(o.order_date) AS last_updated
FROM orders o
WHERE o.status = 'EXECUTED'
GROUP BY o.user_id, o.stock_id
HAVING total_shares > 0;

-- Insert sample watchlist items (5-8 per user)
INSERT INTO watchlists (user_id, stock_id, display_name, added_at)
SELECT 
    u.user_id,
    s.stock_id,
    CASE 
        WHEN RAND() > 0.7 THEN CONCAT('My ', s.symbol)
        WHEN RAND() > 0.5 THEN LEFT(s.company_name, 20)
        ELSE NULL
    END AS display_name,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 60) DAY) AS added_at
FROM users u
JOIN stocks s
WHERE RAND() < 0.5  -- Each user watches 50% of stocks
LIMIT 50;

-- Create temporary numbers table for portfolio history
CREATE TEMPORARY TABLE IF NOT EXISTS numbers (n INT);
INSERT INTO numbers VALUES 
(0),(1),(2),(3),(4),(5),(6),(7),(8),(9),(10),
(11),(12),(13),(14),(15),(16),(17),(18),(19),(20),
(21),(22),(23),(24),(25),(26),(27),(28),(29),(30),
(31),(32),(33),(34),(35),(36),(37),(38),(39),(40),
(41),(42),(43),(44),(45),(46),(47),(48),(49),(50),
(51),(52),(53),(54),(55),(56),(57),(58),(59),(60),
(61),(62),(63),(64),(65),(66),(67),(68),(69),(70),
(71),(72),(73),(74),(75),(76),(77),(78),(79),(80),
(81),(82),(83),(84),(85),(86),(87),(88),(89);

-- Insert portfolio value history (90 days for each user)
INSERT INTO portfolio_value_history (user_id, portfolio_date, total_value, cash_value, investment_value)
SELECT 
    u.user_id,
    DATE_SUB(CURDATE(), INTERVAL n.n DAY) AS history_date,
    ROUND(50000 + (RAND() * 50000) + (n.n * 100) + (RAND() * 500 - 250), 2) AS total_value,
    ROUND(10000 + (RAND() * 20000) + (n.n * 50) + (RAND() * 300 - 150), 2) AS cash_value,
    ROUND(40000 + (RAND() * 30000) + (n.n * 50) + (RAND() * 300 - 150), 2) AS investment_value
FROM users u
CROSS JOIN numbers n
ORDER BY u.user_id, n.n;

-- Drop temporary numbers table
DROP TEMPORARY TABLE IF EXISTS numbers;

-- Update stock prices to create variation
UPDATE stocks SET 
    current_price = ROUND(current_price * (0.95 + RAND() * 0.1), 2),
    last_updated = NOW();

-- Create portfolio summary view (MySQL 5.7 compatible)
CREATE OR REPLACE VIEW portfolio_summary AS
SELECT 
    h.user_id,
    SUM(h.total_shares * s.current_price) AS stock_value,
    (SELECT nw.total_balance - nw.stock_value 
     FROM net_worth nw 
     WHERE nw.user_id = h.user_id 
     ORDER BY nw.date_recorded DESC 
     LIMIT 1) AS cash_balance,
    (SELECT nw.total_balance 
     FROM net_worth nw 
     WHERE nw.user_id = h.user_id 
     ORDER BY nw.date_recorded DESC 
     LIMIT 1) AS total_value,
    MAX(h.last_updated) AS last_updated
FROM holdings h
JOIN stocks s ON h.stock_id = s.stock_id
GROUP BY h.user_id;