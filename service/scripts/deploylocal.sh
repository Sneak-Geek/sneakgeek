tag=snkg/sneakgeek-service
# Build docker
docker build -t $tag -f docker/Dockerfile.prod .
image=$(docker run -p 8080:8080 -d ${tag})
docker logs $image -f