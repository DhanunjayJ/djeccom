DO $$
BEGIN
    IF to_regclass('public.users') IS NOT NULL THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(32);
        UPDATE users SET role = 'CUSTOMER' WHERE role IS NULL;
        ALTER TABLE users ALTER COLUMN role SET DEFAULT 'CUSTOMER';
        ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    END IF;

    IF to_regclass('public.products') IS NOT NULL THEN
        ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN;
        UPDATE products SET active = TRUE WHERE active IS NULL;
        ALTER TABLE products ALTER COLUMN active SET DEFAULT TRUE;
        ALTER TABLE products ALTER COLUMN active SET NOT NULL;
    END IF;

    IF to_regclass('public.orders') IS NOT NULL THEN
        UPDATE orders SET status = 'CONFIRMED' WHERE status = 'PROCESSING';
    END IF;
END
$$;
