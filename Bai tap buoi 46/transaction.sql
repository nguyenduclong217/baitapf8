--     Chuyen tien tu A -> B
    BEGIN;
    SELECT  id,balance
    FROM wallets WHERE id IN(1,2) FOR UPDATE ;

    DO $$
        DECLARE sender_balance NUMERIC;
            BEGIN
            SELECT balance INTO sender_balance FROM wallets WHERE id =1;
            IF sender_balance < 100000
            THEN RAISE EXCEPTION 'Khong du tien';
            END IF;
        END$$;

    UPDATE wallets
    SET balance = balance - 100000
    WHERE id=1;

    UPDATE wallets
    SET balance = balance + 100000
    WHERE id = 2;
    -- Lưu transaction và lấy id
    WITH new_transaction AS (
      INSERT INTO transactions (sender_wallet_id, receiver_wallet_id, type_id, amount, note)
      VALUES (1, 2, 2, 100000, 'long transfer')
      RETURNING id
    )
    INSERT INTO transaction_logs(transaction_id, step, status)
    SELECT id,'transfer','success'
    FROM new_transaction;
    COMMIT;


-- Nap tien vao vi
UPDATE wallets
SET balance = balance + 100000
WHERE id = 1;

WITH new_bank AS(
    INSERT INTO transactions(sender_wallet_id, receiver_wallet_id, type_id, amount, note)
VALUES (null,1,1,100000,'deposit')
RETURNING id)

INSERT INTO transaction_logs(transaction_id, step, status)
SELECT  id,'deposit','success'
FROM new_bank;
COMMIT;

-- Neu bo transaction de chay 2 câu lệnh riêng lẻ, có rủi do về mất dữ liệu
-- Khi trừ tiền ví A xong mà hệ thống bị crash trước khi cộng tiền cho ví B,
-- thì tiền sẽ bị mất (A bị trừ nhưng B không nhận được),