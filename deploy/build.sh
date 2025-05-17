

imageBack=git.sethsamuel.online/fluffy/mission_ready_lvl5_mission1
# DOCKER_BUILDKIT=1 docker buildx build --no-cache -f Dockerfile.back -t $imageBack ../
DOCKER_BUILDKIT=1 docker buildx build -f Dockerfile.back -t $imageBack ../

docker push $imageBack