registry=snkgtest
image=sneakgeektest9cc6
resource=SneakGeek
name=sneakgeek-test
dockerfile=docker/Dockerfile.prod

az acr build --file docker/Dockerfile.prod --registry $registry --image $image .

# Restarting image.
# Uncomment when used
az webapp restart --name $name --resource-group $resource