drop database kanye;
create database kanye;

CREATE USER 'kanye'@'localhost' IDENTIFIED BY 'good_password';
grant all PRIVILEGES on *.* to 'kanye'@'localhost';

use kanye;

create table users(
    id INT auto_increment,
    profile_name varchar(16),
    password varchar(20),
    email varchar (20),
    created_at datetime,
    deleted_at datetime,
    constraint user_id primary key(id),
    CONSTRAINT profile_name UNIQUE(profile_name),
    CONSTRAINT email UNIQUE(email)
);

create table quotes(
    id int auto_increment,
    user_id int,
    quote varchar(240),
    created_at datetime,
    deleted_at datetime,
    primary key(id),
    constraint foreign key(user_id) references users(id)
);