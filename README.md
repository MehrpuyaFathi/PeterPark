# PeterPark
This is peter park challenge , mix of flask and react

# STEP 1 - compose docker
docker compose -f peterpark-compose.yaml up

# STEP 2 - create database
docker exec -it database-postgres psql -U postgres -c "CREATE DATABASE \"PeterPark\" WITH OWNER = postgres ENCODING = 'UTF8' TABLESPACE = pg_default CONNECTION LIMIT = -1;"

# STEP 3 - check the database has been created successfully
docker exec -it database-postgres psql -U postgres -c "SELECT datname FROM pg_database;"

# STEP 4 - final
run http://127.0.0.1:3000
