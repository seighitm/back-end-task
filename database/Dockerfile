FROM postgres:alpine

ADD /scripts/database-create.sql /docker-entrypoint-initdb.d
ADD /scripts/database-seed.sql /docker-entrypoint-initdb.d

RUN chmod a+r /docker-entrypoint-initdb.d/*

EXPOSE 6666
