drop database kanye;
create database kanye;
use kanye;

create table quotes(
    id int auto_increment,
    quote varchar(240),
    created_at datetime,
    deleted_at datetime,
    primary key(id)
)