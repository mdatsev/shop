CREATE TYPE item_type AS ENUM ( 
    'product',
    'subscription'
);

CREATE TABLE spec (
    id bigserial PRIMARY KEY,
    name varchar NOT NULL UNIQUE
);

CREATE TABLE "user" (
    id bigserial PRIMARY KEY,
    name varchar NOT NULL,
    email varchar UNIQUE NOT NULL,
    password varchar NOT NULL
);

CREATE TABLE organization (
    id bigserial PRIMARY KEY,
    owner_id bigint NOT NULL REFERENCES "user",
    name varchar NOT NULL,
    secret_key varchar
);

CREATE TABLE item (
    id bigserial PRIMARY KEY,
    name varchar NOT NULL,
    description varchar,
    organization_id bigint NOT NULL REFERENCES organization,
    type item_type NOT NULL,
    price bigint NOT NULL
);

CREATE TABLE subscription (
    id bigserial PRIMARY KEY,
    item_id bigint UNIQUE NOT NULL REFERENCES item,
    period interval NOT NULL
);

CREATE TABLE product (
    id bigserial PRIMARY KEY,
    item_id bigint UNIQUE NOT NULL REFERENCES item,
    available_quantity bigint NOT NULL
);

CREATE TABLE item_spec (
    id bigserial PRIMARY KEY,
    item_id bigint NOT NULL REFERENCES item,
    spec_id bigint NOT NULL REFERENCES spec,
    value varchar NOT NULL,
    UNIQUE (item_id, spec_id)
);

CREATE TABLE discount (
    id bigserial PRIMARY KEY,
    item_id bigint NOT NULL REFERENCES item,
    percentage bigint NOT NULL,
    start_timestamp timestamptz NOT NULL,
    end_timestamp timestamptz NOT NULL
);

CREATE TABLE price (
    id bigserial PRIMARY KEY,
    item_id bigint NOT NULL REFERENCES item,
    value bigint NOT NULL,
    start_timestamp timestamptz NOT NULL
);

CREATE TABLE payment (
    id bigserial PRIMARY KEY,
    settled boolean NOT NULL,
    payment_timestamp timestamptz NOT NULL,
    type varchar NOT NULL,
    transaction_id varchar NOT NULL,
    amount bigint NOT NULL,
    UNIQUE (type, transaction_id)
);

CREATE TABLE "order" (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES "user",
    payment_id bigint UNIQUE REFERENCES payment
);

CREATE TABLE order_item (
    id bigserial PRIMARY KEY,
    order_id bigint NOT NULL REFERENCES "order",
    item_id bigint NOT NULL REFERENCES item,
    quantity bigint NOT NULL,
    UNIQUE (order_id, item_id)
);

CREATE TABLE staff (
    id bigserial PRIMARY KEY,
    name varchar NOT NULL,
    email varchar UNIQUE NOT NULL,
    password varchar NOT NULL
);

CREATE TABLE session (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES "user",
    secret varchar NOT NULL,
    expiration timestamptz NOT NULL
);

CREATE TABLE shop (
    id bigserial PRIMARY KEY,
    organization_id bigint NOT NULL REFERENCES organization,
    lat float,
    lng float,
    name varchar,
    description varchar
)
