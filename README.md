# Github Events Explorer

## Overview


## Prerequisites

Install [Docker](https://www.docker.com/) on your system.

Install [Docker Compose](http://docs.docker.com/compose/) on your system.


## Setup

Run `docker-compose build`. It will

* build the container for the NodeJS Express app
* build the container for the Nginx server
* build the container for MongoDB
* build the container for Redis


## Start

Run `docker-compose up`.

This will start all of the containers.

The application will now be running on the docker daemon on standard http port 80.

At first startup you need to load data, this can be done via:

```
curl -o data.json.gz http://data.githubarchive.org/2016-01-01-12.json.gz
gunzip data.json.gz
mongoimport --port 27018 --db Github --drop --collection events --file data.json
```


## Technical Choices

### Redis

* JSON results stored as String value
* Caching Strategy: 60 seconds Time To Live (TTL)

### MongoDb

Currently utilising one shared connection for the single NodeJS instance, so that
new connections to the MongoDB are not required for each single query.

## Improvements

### Unit Testing


### Production Configuration


### Scaling
