CREATE TABLE "type" (
    "id" bigserial PRIMARY KEY,
    "name" varchar UNIQUE
);

CREATE TABLE "manufacturer" (
    "id" bigserial PRIMARY KEY,
    "name" varchar UNIQUE
);

CREATE TABLE "product" (
    "id" bigserial PRIMARY KEY,
    "name" varchar,
    "manufacturer_id" bigint UNIQUE NOT NULL REFERENCES "manufacturer" ("id"),
    "type_id" bigint UNIQUE NOT NULL REFERENCES "type" ("id"),
    "price" bigint
);

CREATE TABLE "spec" (
    "id" bigserial PRIMARY KEY,
    "name" varchar UNIQUE
);

CREATE TABLE "product_spec" (
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "spec_id" bigint UNIQUE NOT NULL REFERENCES "spec" ("id"),
    "value" varchar,
    PRIMARY KEY ("product_id", "spec_id")
);

CREATE TABLE "discount" (
    "id" bigserial PRIMARY KEY,
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "start_timestamp" timestamptz,
    "end_timestamp" timestamptz
);

CREATE TABLE "user" (
    "id" bigserial PRIMARY KEY,
    "name" varchar,
    "email" varchar UNIQUE,
    "password" varchar
);

CREATE TABLE "payment" (
    "id" bigserial PRIMARY KEY,
    "settled" boolean,
    "payment_timestamp" timestamptz,
    "transaction_id" varchar UNIQUE,
    "amount" bigint
);

CREATE TABLE "order" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigInt UNIQUE NOT NULL REFERENCES "user" ("id"),
    "payment_id" bigint UNIQUE NOT NULL REFERENCES "payment" ("id")
);

CREATE TABLE "order_item" (
    "order_id" bigint UNIQUE NOT NULL REFERENCES "order" ("id"),
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "quantity" bigint DEFAULT 1,
    PRIMARY KEY ("order_id", "product_id")
);

CREATE TABLE "staff" (
    "id" bigserial PRIMARY KEY,
    "name" varchar,
    "email" varchar UNIQUE,
    "password" varchar
);

