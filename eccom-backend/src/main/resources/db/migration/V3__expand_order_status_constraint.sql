DO $$
DECLARE
    status_constraint RECORD;
BEGIN
    IF to_regclass('public.orders') IS NOT NULL THEN
        FOR status_constraint IN
            SELECT constraint_info.conname
            FROM pg_constraint constraint_info
            WHERE constraint_info.conrelid = 'public.orders'::regclass
              AND constraint_info.contype = 'c'
              AND pg_get_constraintdef(constraint_info.oid) ILIKE '%status%'
        LOOP
            EXECUTE format(
                'ALTER TABLE public.orders DROP CONSTRAINT %I',
                status_constraint.conname
            );
        END LOOP;

        UPDATE public.orders
        SET status = 'CONFIRMED'
        WHERE status = 'PROCESSING';

        ALTER TABLE public.orders
            ADD CONSTRAINT orders_status_check
            CHECK (status IN (
                'PENDING_PAYMENT',
                'PAYMENT_FAILED',
                'PAID',
                'CONFIRMED',
                'PACKED',
                'SHIPPED',
                'IN_TRANSIT',
                'DELIVERY_FAILED',
                'DELIVERED',
                'CANCELLED',
                'RETURN_REQUESTED',
                'RETURN_REJECTED',
                'RETURNED',
                'REFUNDED'
            ));
    END IF;
END
$$;
