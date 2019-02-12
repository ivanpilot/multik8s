docker build -t ivanpilot/multi-client:latest -t ivanpilot/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t ivanpilot/multi-server:latest -t ivanpilot/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t ivanpilot/multi-worker:latest -t ivanpilot/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# no need to login inside docker since we are already logged in through the .travis.yaml file that will execute before this file execute
docker push ivanpilot/multi-client:latest
docker push ivanpilot/multi-server:latest
docker push ivanpilot/multi-worker:latest

docker push ivanpilot/multi-client:$SHA
docker push ivanpilot/multi-server:$SHA
docker push ivanpilot/multi-worker:$SHA
#then we need to apply all the config files in the k8s folder. Again, since our gcloud is taking care of kubernetes (as per the travis.yaml file) we can directly apply the config files all agt once like if we were on our local machine
kubectl apply -f k8s

#final step is to set imperativly latest images on each deployment
kubectl set image deployments/server-deployment server=ivanpilot/multi-server:$SHA
kubectl set image deployments/client-deployment client=ivanpilot/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=ivanpilot/multi-worker:$SHA