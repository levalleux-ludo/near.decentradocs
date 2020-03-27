docker network create -d bridge --subnet 10.0.75.0/24 --gateway 10.0.75.1 net1

docker run -i -p 1234:1234 -p 35607:35607 ^
 -v %CD%%:/home/developer/Project ^
 -t local/rskj/ubuntu /bin/bash
