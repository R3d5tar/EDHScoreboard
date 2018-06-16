docker rm -f edhscoreboard-dashboard-local
docker build -t edhscoreboard-dashboard dashboard
docker run --name edhscoreboard-dashboard-local -d -p 8080:80 -e "EDH_BACKEND_URL=http://localhost:8081" edhscoreboard-dashboard