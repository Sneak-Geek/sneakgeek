registry=websnkg
image=landingsnkg
webapp=snkgapp
resourceGroup=snkg

az acr build --file Dockerfile --registry $registry --image $image .

# Restarting image.
# Uncomment when used
az webapp restart --name $webapp --resource-group $resourceGroup