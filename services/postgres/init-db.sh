#!/usr/bin/env bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER kratos WITH PASSWORD 'kratospass';
    CREATE DATABASE kratos;
    GRANT ALL PRIVILEGES ON DATABASE kratos TO kratos;

    # CREATE USER plausible WITH PASSWORD 'plausiblepass';
    # CREATE DATABASE plausible;
    # GRANT ALL PRIVILEGES ON DATABASE plausible TO plausible;
EOSQL
