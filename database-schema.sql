-- public.knex_migrations definition

-- Drop table

-- DROP TABLE public.knex_migrations;

CREATE TABLE public.knex_migrations (
	id serial4 NOT NULL,
	"name" varchar(255) NULL,
	batch int4 NULL,
	migration_time timestamptz NULL,
	CONSTRAINT knex_migrations_pkey PRIMARY KEY (id)
);


-- public.knex_migrations_lock definition

-- Drop table

-- DROP TABLE public.knex_migrations_lock;

CREATE TABLE public.knex_migrations_lock (
	"index" serial4 NOT NULL,
	is_locked int4 NULL,
	CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index)
);


-- public.product_stock_logs definition

-- Drop table

-- DROP TABLE public.product_stock_logs;

CREATE TABLE public.product_stock_logs (
	id serial4 NOT NULL,
	product_id int4 NULL,
	stock_delta int4 NULL,
	stock int4 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT product_stock_logs_pkey PRIMARY KEY (id)
);


-- public.products definition

-- Drop table

-- DROP TABLE public.products;

CREATE TABLE public.products (
	id serial4 NOT NULL,
	title varchar(255) NOT NULL,
	price numeric(10, 2) NOT NULL,
	description text NULL,
	category varchar(255) NULL,
	image text NULL,
	stock int4 DEFAULT 0 NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT products_pkey PRIMARY KEY (id),
	CONSTRAINT products_price_check CHECK ((price > (0)::numeric)),
	CONSTRAINT products_stock_check CHECK ((stock >= 0))
);