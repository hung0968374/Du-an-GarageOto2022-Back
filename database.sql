USE garaauto;
CREATE TABLE users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    password VARCHAR(100) NOT NULL,
    roles VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'INITIAL',
    email VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    recent_login_time DATETIME,
    PRIMARY KEY (id)
);
CREATE TABLE login_tokens (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    token CHAR(255),
    user_id INT UNSIGNED NOT NULL,
    created_at datetime NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE login_attempts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    attempts INT UNSIGNED NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE email_reminder (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    email_status VARCHAR(20) NOT NULL,
    last_send_time DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE brand (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE payment_method (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    method VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);
INSERT INTO payment_method VALUE (DEFAULT, "Paid in full");
INSERT INTO payment_method VALUE (DEFAULT, "Subscription");
CREATE TABLE payment_provider (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    provider VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);
INSERT INTO payment_provider VALUE (DEFAULT, "Stripe");
INSERT INTO payment_provider VALUE (DEFAULT, "Cash");
CREATE TABLE error_recorder (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    destination VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE cars (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    brand_id INT UNSIGNED NOT NULL,
    name VARCHAR(255),
    price NUMERIC,
    discount_percent int,
    description TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (brand_id) REFERENCES brand(id)
);

CREATE TABLE car_apperance (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    car_id INT UNSIGNED NOT NULL,
    img text,
    color varchar(30),
    PRIMARY KEY (id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE client_coupon (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_id INT UNSIGNED NOT NULL,
    coupon_id INT UNSIGNED NOT NULL,
    used_at datetime,
    car_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES client_info(id),
    FOREIGN KEY (coupon_id) REFERENCES coupon(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

CREATE TABLE wish_list (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_id INT UNSIGNED NOT NULL,
    car_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (client_id) REFERENCES client_info(id),
    FOREIGN KEY (car_id) REFERENCES cars(id)
);

-- password ducquang123
INSERT INTO users VALUE (
        DEFAULT,
        "$2a$12$QE5VKmeBHfqXTebeK8Vjc.MAMKdfc.UjmFr1b9EcaE6956Nop2eli",
        "ADMIN",
        "ACTIVE",
        "ducquang03102000@gmail.com",
        NOW(),
        NOW()
    );