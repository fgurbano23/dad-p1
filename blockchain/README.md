docker build --tag blockchain-node .

docker run -d --name blockchain -p 5000:5000 blockchain-node
