# Microservices application
Project with few basic microservices and one gateway to communicate with client application.
Used technologies: be creative and use your favor language for future service.

## To run locally use
```shell
make pre-run -> prepare and run containers
make sh-ci -> go into container
make run -> build and run application
```

## Commands
#### In Container:
````shell
make -C modules/test-client run-test-client -> run test client with examples
make re-create -> kill all processes and run again
pm2 monit -> show monit and logs for actvie modules
pm2 logs APP_NAME -> show logs for module
````


#### Out of container:
````shell
make clean -> stop and remove containers
make stop -> stop containers
make start -> start containers
make sh-ci -> open docker container
````

## Usage
- **RabbitMQ** manager is available on http://localhost:15672/
  - Login: guest
  - Password: guest
- **MongoDB** UI is available on http://localhost:3300
  - Host: 127.0.0.1
  - Port: 27017
  - User: root
  - Password: password
- **Client application**  is available on http://localhost:3000. Here is perfect place for your front app.

## Licence

MIT @ Konrad Sądel
