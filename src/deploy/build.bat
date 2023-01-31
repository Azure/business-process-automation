docker build --no-cache --tag bpabackend:v0.1 ..\backend
docker build --no-cache --tag bpafrontend-client:v0.1 ..\frontend
docker build --no-cache --tag bpafrontend-server:v0.1 ..\frontend\api