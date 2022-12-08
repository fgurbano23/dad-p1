docker build --tag exchange .

docker run -d --name exchange -p 5001:5001 backend
