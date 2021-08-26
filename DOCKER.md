```
docker build --rm -f Dockerfile -t rick-morty-random-episode:latest .
docker run --rm -d -p 80:80 rick-morty-random-episode:latest
```