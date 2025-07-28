-- Create the database
CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Stocks reference table
CREATE TABLE stocks (
    stock_id INT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    company_name VARCHAR(100) NOT NULL,
    current_price DECIMAL(15,2) DEFAULT 0.00,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Net worth tracking
CREATE TABLE net_worth (
    net_worth_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    stock_value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date_recorded)
) ENGINE=InnoDB;

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_type ENUM('BUY', 'SELL') NOT NULL,
    stock_id INT NOT NULL,
    shares INT NOT NULL,
    price_per_share DECIMAL(15,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'EXECUTED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),
    INDEX idx_user_order (user_id, order_date)
) ENGINE=InnoDB;

-- Holdings table
CREATE TABLE holdings (
    holding_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    total_shares INT NOT NULL DEFAULT 0,
    average_price DECIMAL(15,2) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),
    UNIQUE KEY uniq_user_stock (user_id, stock_id)
) ENGINE=InnoDB;

-- Watchlist table
CREATE TABLE watchlists (
    watchlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    stock_id INT NOT NULL,
    display_name VARCHAR(50),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id),
    UNIQUE KEY uniq_user_stock_watch (user_id, stock_id)
) ENGINE=InnoDB;

-- Portfolio Value History (for performance charts)
CREATE TABLE portfolio_value_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    portfolio_date DATE NOT NULL,
    total_value DECIMAL(15,2) NOT NULL,
    cash_value DECIMAL(15,2) NOT NULL,
    investment_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uniq_user_date (user_id, portfolio_date)
) ENGINE=InnoDB;

-- Trigger to update holdings after order execution
DELIMITER //
CREATE TRIGGER after_order_execute
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'EXECUTED' AND OLD.status != 'EXECUTED' THEN
        -- Update holdings for BUY orders
        IF NEW.order_type = 'BUY' THEN
            INSERT INTO holdings (user_id, stock_id, total_shares, average_price)
            VALUES (NEW.user_id, NEW.stock_id, NEW.shares, NEW.price_per_share)
            ON DUPLICATE KEY UPDATE
                total_shares = total_shares + NEW.shares,
                average_price = ((total_shares * average_price) + (NEW.shares * NEW.price_per_share)) / (total_shares + NEW.shares);
        END IF;
        
        -- Update holdings for SELL orders
        IF NEW.order_type = 'SELL' THEN
            UPDATE holdings
            SET total_shares = total_shares - NEW.shares
            WHERE user_id = NEW.user_id AND stock_id = NEW.stock_id;
        END IF;
    END IF;
END;
//
DELIMITER ;

-- View for portfolio summary
CREATE VIEW portfolio_summary AS
SELECT 
    h.user_id,
    SUM(h.total_shares * s.current_price) AS stock_value,
    (SELECT total_balance - stock_value 
     FROM net_worth nw 
     WHERE nw.user_id = h.user_id 
     ORDER BY date_recorded DESC 
     LIMIT 1) AS cash_balance,
    (SELECT total_balance 
     FROM net_worth nw 
     WHERE nw.user_id = h.user_id 
     ORDER BY date_recorded DESC 
     LIMIT 1) AS total_value,
    MAX(h.last_updated) AS last_updated
FROM holdings h
JOIN stocks s ON h.stock_id = s.stock_id
GROUP BY h.user_id;