CREATE TYPE item_type AS ENUM ('product', 'subscription');

CREATE TABLE "spec" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null UNIQUE
);


CREATE TABLE "user" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "email" varchar UNIQUE not null,
    "password" varchar not null
);

CREATE TABLE "organization" (
    "id" bigserial PRIMARY KEY,
    "owner_id" bigserial NOT NULL REFERENCES "user" ("id"),
    "name" varchar not null
);

CREATE TABLE "item" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "organization_id" bigint NOT NULL REFERENCES "organization" ("id"),
    "type" item_type not null,
    "price" bigint not null
);

CREATE TABLE "subscription" (
    "id" bigint PRIMARY KEY REFERENCES "item" ("id"),
    "period" interval not null
);

CREATE TABLE "product" (
    "id" bigint PRIMARY KEY REFERENCES "item" ("id"),
    "available_quantity" bigint not null
);
CREATE TABLE "item_spec" (
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "spec_id" bigint NOT NULL REFERENCES "spec" ("id"),
    "value" varchar not null,
    PRIMARY KEY ("item_id", "spec_id")
);

CREATE TABLE "discount" (
    "id" bigserial PRIMARY KEY,
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "percentage" bigint not null,
    "start_timestamp" timestamptz not null,
    "end_timestamp" timestamptz not null
);

CREATE TABLE "price" (
    "id" bigserial PRIMARY KEY,
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "value" bigint not null,
    "start_timestamp" timestamptz not null
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
    "user_id" bigint NOT NULL REFERENCES "user" ("id"),
    "payment_id" bigint UNIQUE REFERENCES "payment" ("id")
);

CREATE TABLE "order_item" (
    "order_id" bigint NOT NULL REFERENCES "order" ("id"),
    "item_id" bigint NOT NULL REFERENCES "item" ("id"),
    "quantity" bigint not null,
    PRIMARY KEY ("order_id", "item_id")
);

CREATE TABLE "staff" (
    "id" bigserial PRIMARY KEY,
    "name" varchar not null,
    "email" varchar UNIQUE not null,
    "password" varchar not null
);

