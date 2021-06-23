#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER kratos WITH PASSWORD 'kratos-pass';
    CREATE DATABASE kratos;
    GRANT ALL PRIVILEGES ON DATABASE kratos TO kratos;

    CREATE USER glitchtip WITH PASSWORD 'glitchtip-pass';
    CREATE DATABASE glitchtip;
    GRANT ALL PRIVILEGES ON DATABASE glitchtip TO glitchtip;
EOSQL
