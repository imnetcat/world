cat ./install.sql | docker exec -i postgres psql -U postgres
cat ../schemas/database.sql | docker exec -i postgres psql -U postgres -d app
cat ./required_data.sql | docker exec -i postgres psql -U postgres -d app
cat ./data.sql | docker exec -i postgres psql -U postgres -d app
