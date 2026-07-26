BEGIN;

-- =====================================================
-- TABLE: ADMINS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admins
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: CARS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cars(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    type VARCHAR(50),
    price_per_day NUMERIC(10,2),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLE: BOOKINGS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bookings
(
    id SERIAL PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    car_id INTEGER NOT NULL,

    pickup_location VARCHAR(255) NOT NULL,
    destination_location VARCHAR(255) NOT NULL,

    pickup_date DATE NOT NULL,
    return_date DATE,

    pickup_time TIME NOT NULL,
    return_time TIME,

    round_trip BOOLEAN DEFAULT FALSE,

    passengers INTEGER,

    total_km NUMERIC(10,2),

    rate_per_km NUMERIC(10,2),

    total_price NUMERIC(10,2),

    advance_amount NUMERIC(10,2) DEFAULT 0,

    travel_purpose VARCHAR(100),

    special_requirements TEXT,

    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending','confirmed','completed','cancelled')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_car
        FOREIGN KEY (car_id)
        REFERENCES public.cars(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- =====================================================
-- TABLE: BLOCKED DATES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blocked_dates
(
    id SERIAL PRIMARY KEY,
    blocked_date DATE NOT NULL UNIQUE,
    reason VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;