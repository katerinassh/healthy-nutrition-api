-- DROP AND CREATE ENUMS
DROP TYPE IF EXISTS public.gender_enum;
CREATE TYPE public.gender_enum AS ENUM (
    'male',
    'female'
);

-- DROP AND CREATE TABLES
DROP TABLE IF EXISTS public.users;
CREATE TABLE public.users (
    id SERIAL,
    firstName character varying NOT NULL,
    lastName character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    gender public.gender_enum,
    age integer,
    height float,
    weight float,
    activity integer,
    calories integer,
    protein integer,
    fats integer,
    carbohydrates integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);

-- INSERT DATA INTO TABLES
INSERT
INTO "users" ("firstName", "lastName", "email", "password")
VALUES('Kateryna', 'Shakiryanova', 'kshak@gmail.com', 'Passw1213');

