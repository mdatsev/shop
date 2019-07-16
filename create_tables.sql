CREATE TABLE "type" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null UNIQUE
);

CREATE TABLE "manufacturer" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null UNIQUE
);

CREATE TABLE "product" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "manufacturer_id" bigint UNIQUE NOT NULL REFERENCES "manufacturer" ("id"),
    "type_id" bigint UNIQUE NOT NULL REFERENCES "type" ("id"),
    "price" bigint not null
);

CREATE TABLE "spec" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null UNIQUE
);

CREATE TABLE "product_spec" (
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "spec_id" bigint UNIQUE NOT NULL REFERENCES "spec" ("id"),
    "value" varchar not null,
    PRIMARY KEY ("product_id", "spec_id")
);

CREATE TABLE "discount" (
    "id" bigserial PRIMARY KEY,
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "percentage" bigint not null,
    "start_timestamp" timestamptz not null,
    "end_timestamp" timestamptz not null
);

CREATE TABLE "price" (
    "id" bigserial PRIMARY KEY,
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "value" bigint not null,
    "start_timestamp" timestamptz not null
);

CREATE TABLE "user" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "email" varchar UNIQUE not null,
    "password" varchar not null
);

CREATE TABLE "payment" (
    "id" bigserial PRIMARY KEY,
    "settled" boolean not null,
    "payment_timestamp" timestamptz not null,
    "type" varchar not null,
    "transaction_id" varchar not null,
    "amount" bigint not null,
    UNIQUE ("type", "transaction_id")
);

CREATE TABLE "order" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigInt UNIQUE NOT NULL REFERENCES "user" ("id"),
    "payment_id" bigint UNIQUE NOT NULL REFERENCES "payment" ("id")
);

CREATE TABLE "order_item" (
    "order_id" bigint UNIQUE NOT NULL REFERENCES "order" ("id"),
    "product_id" bigint UNIQUE NOT NULL REFERENCES "product" ("id"),
    "quantity" bigint not null,
    PRIMARY KEY ("order_id", "product_id")
);

CREATE TABLE "staff" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "email" varchar UNIQUE not null,
    "password" varchar not null
);

