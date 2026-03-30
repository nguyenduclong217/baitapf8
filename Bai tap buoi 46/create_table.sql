CREATE TABLE wallets (
    id SERIAL PRIMARY KEY ,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    balance NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK ( balance > 0 ),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_types(
    id SERIAL PRIMARY KEY ,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO  transaction_types (name) VALUES ('deposit'),('withdraw'),('transfer');

-- Transactions : Lich su giao dich tien

CREATE TABLE transactions(
    id SERIAL PRIMARY KEY ,
    sender_wallet_id INT,
    receiver_wallet_id INT,
    type_id INT NOT NULL,
    amount NUMERIC(18,2) NOT NULL CHECK ( amount > 0 ),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sender_wallet
                         FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_receiver_wallet
                         FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id),
    CONSTRAINT fk_type
                         FOREIGN KEY (type_id) REFERENCES transaction_types(id)
);

-- transaction_logs: log tung buoc xu ly
CREATE TABLE transaction_logs(
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL ,
    step VARCHAR(100),
    status VARCHAR(20) CHECK ( status IN ('success','failed')),
    created_at TIMESTAMPTZ DEFAULT  CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction
                             FOREIGN KEY (transaction_id) REFERENCES transactions(id)
)

