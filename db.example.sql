-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

create table
  users (
    id bigint primary key generated always as identity,
    name varchar(255),
    email varchar(255) unique,
    password varchar(255),
    profile_photo varchar(100),
    description varchar(255),
    role varchar(10),
    whatsapp varchar(255),
    verificated boolean default false
  );

create table
  courses (
    id bigint primary key generated always as identity,
    id_owner bigint,
    name varchar(255),
    description varchar(255),
    cover varchar(255),
    lessons integer,
    stars float,
    foreign key (id_owner) references users (id)
  );

create table
  items (
    id bigint primary key generated always as identity,
    id_course bigint,
    name varchar(255),
    description varchar(255),
    total_questions integer,
    questions integer,
    type varchar(30),
    foreign key (id_course) references courses (id)
  );

create table
  users_courses (
    id bigint primary key generated always as identity,
    id_user bigint,
    id_course bigint,
    finished boolean default false,
    owner boolean default false,
    stars float default 0,
    foreign key (id_user) references users (id),
    foreign key (id_course) references courses (id)
  );

create table
  comments (
    id bigint primary key generated always as identity,
    id_user_course bigint,
    description varchar(255),
    date varchar(255),
    foreign key (id_course) references users_courses (id)
  );

create table
  categories (
    id bigint primary key generated always as identity,
    name varchar(100),
    type varchar(100)
  );

create table
  courses_categories (
    id bigint primary key generated always as identity,
    id_user bigint,
    id_course bigint,
    foreign key (id_user) references users (id),
    foreign key (id_course) references courses (id)
  );

create table
  finished_items (
    id bigint primary key generated always as identity,
    id_user_course bigint,
    id_item bigint,
    foreign key (id_user_course) references users_courses (id),
    foreign key (id_item) references items (id)
  );

create table
  comments (
    id bigint primary key generated always as identity,
    id_user_course bigint,
    description varchar(255),
    date varchar(255),
    foreign key (id_course) references users_courses (id)
  );