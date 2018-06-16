docker rm -f edhscoreboard-hud-local 
docker build -t edhscoreboard-hud hud
docker run --name edhscoreboard-hud-local -d -p 8082:80 -e "EDH_BACKEND_URL=http://localhost:8081" edhscoreboard-hud