CREATE TYPE item_type AS ENUM ( 'product',
    'subscription'
);

CREATE TABLE "spec" (
    "id" bigserial PRIMARY KEY,
    "name" varchar NOT NULL UNIQUE
);

CREATE TABLE "user" (
    "id" bigserial PRIMARY KEY,
    "name" varchar NOT NULL,
    "email" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL
);

CREATE TABLE "organization" (
    "id" bigserial PRIMARY KEY,
    "owner_id" bigserial NOT NULL REFERENCES "user" ("id"),
    "name" varchar NOT NULL,
    "secret_key" varchar
);

CREATE TABLE "item" (
    "id" bigserial PRIMARY KEY,
    "name" varchar NOT NULL,
    "organization_id" bigint NOT NULL REFERENCES "organization" ("id"),
    "type" item_type NOT NULL,
    "price" bigint NOT NULL
);

CREATE TABLE "subscription" (
    "id" bigint PRIMARY KEY REFERENCES "item" ("id"),
    "period" interval NOT NULL
);

CREATE TABLE "product" (
    "id" bigint PRIMARY KEY REFERENCES "item" ("id"),
    "available_quantity" bigint NOT NULL
);

CREATE TABLE "item_spec" (
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "spec_id" bigint NOT NULL REFERENCES "spec" ("id"),
    "value" varchar NOT NULL,
    PRIMARY KEY ("item_id", "spec_id")
);

CREATE TABLE "discount" (
    "id" bigserial PRIMARY KEY,
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "percentage" bigint NOT NULL,
    "start_timestamp" timestamptz NOT NULL,
    "end_timestamp" timestamptz NOT NULL
);

CREATE TABLE "price" (
    "id" bigserial PRIMARY KEY,
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "value" bigint NOT NULL,
    "start_timestamp" timestamptz NOT NULL
);

CREATE TABLE "payment" (
    "id" bigserial PRIMARY KEY,
    "settled" boolean NOT NULL,
    "payment_timestamp" timestamptz NOT NULL,
    "type" varchar NOT NULL,
    "transaction_id" varchar NOT NULL,
    "amount" bigint NOT NULL,
    UNIQUE ("type", "transaction_id")
);

CREATE TABLE "order" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigint NOT NULL REFERENCES "user" ("id"),
    "payment_id" bigint UNIQUE REFERENCES "payment" ("id")
);

CREATE TABLE "order_item" (
    "order_id" bigint NOT NULL REFERENCES "order" ("id"),
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "quantity" bigint NOT NULL,
    PRIMARY KEY ("order_id", "item_id")
);

CREATE TABLE "staff" (
    "id" bigserial PRIMARY KEY,
    "name" varchar NOT NULL,
    "email" varchar UNIQUE NOT NULL,
    "password" varchar NOT NULL
);

CREATE TABLE "session" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigint NOT NULL REFERENCES "user" ("id"),
    "secret" varchar NOT NULL,
    "expiration" timestamptz NOT NULL
);

