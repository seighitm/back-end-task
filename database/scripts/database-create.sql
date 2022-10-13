create type enum_users_type as enum ('admin', 'blogger');

create table if not exists users
(
    id            serial,
    type          enum_users_type default 'blogger'::enum_users_type not null,
    name          varchar(255)                                       not null,
    email         varchar(255)                                       not null,
    password_hash varchar(255)                                       not null,
    created_at    timestamp with time zone                           not null,
    updated_at    timestamp with time zone                           not null,
    primary key (id),
    unique (name),
    unique (email)
);

alter table users
    owner to root;

create table if not exists session
(
    id         serial,
    token      varchar(255)             not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    "userId"   integer,
    primary key (id),
    unique (token),
    foreign key ("userId") references users
        on update cascade on delete set null
);

alter table session
    owner to root;

create table if not exists posts
(
    id         serial,
    title      varchar(255)             not null,
    content    text                     not null,
    is_hidden  boolean default false    not null,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone not null,
    "authorId" integer,
    primary key (id),
    unique (title),
    unique (content),
    foreign key ("authorId") references users
        on update cascade on delete set null
);

alter table posts
    owner to root;

