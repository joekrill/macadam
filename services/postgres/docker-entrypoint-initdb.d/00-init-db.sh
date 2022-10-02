#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER kratos WITH PASSWORD 'kratos!';
    CREATE DATABASE kratos;
    GRANT ALL PRIVILEGES ON DATABASE kratos TO kratos;

    -- Until kratos completes their API, we access the kratos db directly
    GRANT ALL PRIVILEGES ON DATABASE kratos TO "$POSTGRES_USER";

    CREATE USER plausible WITH PASSWORD 'plausible!';

    CREATE USER glitchtip WITH PASSWORD 'glitchtip!';
    CREATE DATABASE glitchtip;
    GRANT ALL PRIVILEGES ON DATABASE glitchtip TO glitchtip;
EOSQL

