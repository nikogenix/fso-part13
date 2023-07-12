CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('author1', 'url1', 'title1');
insert into blogs (author, url, title) values ('author2', 'url2', 'title2');