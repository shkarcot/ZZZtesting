docker -H $1:4000 login -u="xpms+gocd_robot" -p="FW9P1IERTB95TGHF96BV0S4KNJNTHH584C5BQHIC9UL6ZWA1XXKTP5GH014VTHPO" quay.io

cont=$( docker -H $1:4000 ps -a | grep $3 | awk '{print $1}') && if [ -n "$cont" ]; then echo "$cont" | xargs  docker -H $1:4000 stop | xargs  docker -H $1:4000 rm -v; else echo NO container associated with the Image; fi

docker -H $1:4000 pull quay.io/xpms/nifi-server:develop

docker -H $1:4000 run -d -p 8080 --name $3 --restart=unless-stopped -e SHARED_VOLUME=$4 -v $4:$4 -e SOLUTION_ID=$2  quay.io/xpms/nifi-server:develop