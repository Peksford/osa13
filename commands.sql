CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0 );
insert into blogs (author, url, title, likes) values ('Author Test', 'www.test.url', 'Title Test', 7);
insert into blogs (author, url, title, likes) values ('Paul McCartney', 'www.beatles.url', 'Many Years From Now', 99);
select * from blogs;
