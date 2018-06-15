docker rm -f edhscoreboard-backend-local 
docker build -t edhscoreboard-backend backend
docker run --name edhscoreboard-backend-local -d -p 8081:80 -e "ALLOWED_CORS_ORIGINS=http://localhost:8080" edhscoreboard-backend