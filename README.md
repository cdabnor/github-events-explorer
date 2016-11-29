# Github Events Explorer

## Overview

The Github Events Explorer application allows a user to search across
Github Events to discover the following:
* Find details for a named Github actor and the list of repositories they have
contributed to
* Find the repository that a named Github actor has contributed to the most
* Find all repositories with their top contributor


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

Note: This step also currently builds the UI (it may take some time).
It will be complete when the following message is displayed:
```
[nodemon] starting `node web/app.js
```

The application will then be running on the docker daemon on standard http port 80.

At first startup you need to load data, this can be done via:

```
curl -o data.json.gz http://data.githubarchive.org/2016-01-01-12.json.gz
gunzip data.json.gz
mongoimport --port 27018 --db Github --drop --collection events --file data.json
```

You can then access the User Interface by navigating in a browser to:
`http://localhost:80/`


## Technical Choices

### NodeJS + Express
Using NodeJS + Express for the service layer providing the capability to receive RESTful requests to three endpoints:
* `api/actor/:login`: Return actor details and list of contributed repositories for a certain user name `actor.login`
* `api/actor/:login/topRepos`: Find the repository with the highest number of events from an actor (by login). If multiple repos have the same number of events, return the one with the latest event.
* `api/repos/topActors`: Return list of all repositories with their top contributor (actor with most events).

The service layer interfaces with the following technologies to perform the functionality:
* MongoDB: Performs queries on MongoDB to fetch results for the incoming requests
* Redis: Uses Redis as a cache to store/fetch results for queries before reverting to querying MongoDB

Nodemon is also being used to run the NodeJS instance, this has been used so that files are watched during development and NodeJS is then reloaded when files are changed.

### Nginx
Nginx is being used as a reverse-proxy, this allows requests to localhost:80 to be redirected to the underlying NodeJS service running inside Docker.
This was chosen as it is:
* Fast
* Lightweight
* Easy to setup with Docker.

### Redis
Using Redis as an in-memory cache to store previously fetched results. This increases performance by preventing the need for slower database queries when one has already been performed within a specific time period (a Time To Live: TTL).

* JSON results stored as a String value in Redis for performance (currently no need to
  check individual fields in the value)
* Caching Strategy: 60 seconds Time To Live (TTL).
* Can be scaled by clustering

### MongoDb
Using MongoDB to index Github Events to provide storage and query capability.

* Currently making use of one shared connection for the single NodeJS instance, so that
new connections to the MongoDB are not required for each single query.
* Easy import of JSON documents
* Can be scaled by clustering

### Angular

Angular was chosen primarily for the following reasons:
* Most familiarity
* Use of Yeoman angular generator to get up and running quickly
* Use of Angular Material Design components to produce UI quickly


## Improvements

### Unit Testing

* No unit tests currently added for Service or UI.
* Unit Testing framework in-place for service side: Mocha, Chai, Sinon
* Unit Testing framework in-place for UI: Karma

### UI

* Refactor to make use of angular directives/components (currently app was too simple and
  built too quickly to require a need for them)
* Re-write instead to make use of React + Redux pattern instead of Angular (this
  would improve ability to reason on the state of components and improve rendering
  performance)


### Database

* Currently all results are being returned at once from the database. This means that results have to be loaded into memory and causes a large amount of network traffic when sending the results over the RESTful interface. Paging using the MongoDB cursor should instead be used to limit the number of results returned and allow the user to page through them.
* MongoDB data is currently stored on a host volume (in mongdb_data folder). This might need to be configured differently for production.
* Potentially consider use of Elasticsearch instead of MongoDB if search
requirements become more complex


### Caching

* Further analysis on frequency of data updates would be required to fine tune
the TTL
* TTL currently hard-coded to 60seconds. This should be made configurable.


### Production Configuration

* Docker compose currently setup to run from a host volume. For the future: files
should be contained within the container to prevent tampering.
* UI build step being performed as part of `docker-compose up`. This is probably
not the best place to be performing this step. This should be re-factored.
* Nodemon being used to watch file changes and reload NodeJS. This would not be required in Production.
* Github events are currently loaded in from a static file using a script. This would need to be improved to handle a live stream of events.


### Scaling

To scale to be able to handle more requests and larger volumes of the data would require the following:
* Clustering Mongodb
* Clustering Redis
* Run multiple NodeJS instances
* Use Nginx to perform load-balancing (for example round robin) to make use of the multiple NodeJS instances
* Docker compose to deploy to multiple machines
