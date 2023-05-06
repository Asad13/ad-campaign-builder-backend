# Campaign Builder - Backend


# Environment vars
The environment variables are provided with **.env.local** file. Rename it to **.env** and replace the values in double quotes
with values specific to you like passwords.

Note: If you want to generate All the secret keys by yourself and use them instead of these provided here you can generate them
using `crypto` package of `node`. The commands are given below. Open terminal/bash and type:

```
node
require('crypto').randomBytes(64).toString('hex');
```
Copy the string from the terminal/bash and use it as your secret key.

This project uses the following environment variables:

| Name                                | Description                                        | Default Value                                  |
| ----------------------------------- | -------------------------------------------------- | -----------------------------------------------|
| NODE_ENV                            | Node Environment                                   | development                                    |
| PORT                                | Server Port                                        | 3001                                           |
| USER                                | Postgresql database user name(default is used)     |"YOUR_POSTGRESQL_USER_NAME"                     |
| HOST                                | host of postgresql server                          | localhost                                      |
| DATABASE                            | Name of the Database                               | campaign_builder                               |
| PASSWORD                            | Database Password(User yours)                      | "YOUR_POSTGRESQL_PASSWORD"                     |
| PG_PORT                             | Port used by Postgresql(default is used)           | 5432                                           |
| ACCESS_TOKEN_SECRET_KEY             | Secret Key to generate Access Token                | 22d2c9d44f0354c24fdb8b0e7286112a96aa8ae0d7dbd86c644e5a2a08c832655c1b8a35e7a4dd7271d0eff3a8b87f7acac14fc1750f81858814266de8e99f10            |
| REFRESH_TOKEN_SECRET_KEY            | Secret Key to generate Access Token                | 717d31efdda19fb3494eac54986bb6268029d58a905627173f8cb5e83392f666ec7d607847f53d0842fb66b14598fc080f9dff0cb1dcff6174c260deb0909d14            |
| ACCESS_TOKEN_MAX_AGE                | Lifespan of Access Token(1 hour)                   | 3600                                           |
| REFRESH_TOKEN_MAX_AGE               | Lifespan of Refresh Token(30 days)                 | 2592000                                        |
| REDIS_HOST                          | Host of Redis(My one is in WSL2 of windows)        | "IP_ADDRESS_OF_HOST_FOR_REDIS"                 |
| REDIS_PORT                          | Port used by Redis(default is used)                | 6379                                           |
| EMAIL_HOST                          | SMTP Host(Gmail used)                              | smtp.gmail.com                                 |
| EMAIL_SERVICE                       | Service used to send email                         | gmail                                          |
| EMAIL_PORT                          | Port used by email service                         | 587                                            |
| EMAIL_SECURE                        | secured                                            | true                                           |
| EMAIL_USER                          | Sender's email address(Temp)                       | "EMAIL_ADDRESS_FOR_SMTP"                       |
| EMAIL_PASSWORD                      | Sender's email  App password(Temp,)                | "APP_PASSWORD_FOR_EMAIL_USER_ADDRESS"          |
| EMAIL_VERIFICATION_TOKEN_SECRET_KEY | Secret Key to generate Email Verification Token    | d912b6fe8387f52a24bc654695abf0431bcfaacdbf116efc7e6954f04775c4d70d38cce19c7aa484e05861347b798c0e005451a8aa0cd68d795f565247387d60            |
| EMAIL_TOKEN_MAX_AGE                 | Lifespan of Email Verification Token(48 hours)     | 172800         
| PASSWORD_RESET_TOKEN_SECRET_KEY     | Secret Key to generate Reset Password Token        | 682e586879c9fd8fcb210d1db1257512a65d602821eddd7b9b6dc257c6d82aeb430bbe7d4849a5daef1ffe732892213755537b096424051077785dcfeb39ea64            |
| PASSWORD_RESET_TOKEN_MAX_AGE        | Lifespan of Reset Password Token(1 hour)           | 3600     
| PASSWORD_FORGOT_TOKEN_SECRET_KEY    | Secret Key to for Forgot Password Token            | 118671fbb9b9cf7d36a06e17d670c56963319e54700033ff39df7490e3170412c2d3667dd2e8e6ec7b076ce54749833b4f804ff2a77eaf0c890f20039723b08e            |
| PASSWORD_SET_TOKEN_SECRET_KEY       | Secret Key to generate set Password Token          | 81620e74468cf3266d0e53f6f4331b75524a1310efbc758c42b6ca62d314b7806b6dfa0cd52d4a564b595a8242f884d55cc7404d9c0a4912f624e79f5722c6ab            |
| INVITE_USER_TOKEN_SECRET_KEY        | Secret Key for email to invite new user            | 3f88a6abd913a819db2a886590e652861e6cf2c0520eda07d125a5dfd012895c0bb14b8fabcb7d013579bc46a412f65ece376c73b811d2bfb50b2608f9be67fd            |
| PASSWORD_FORGOT_TOKEN_MAX_AGE       | Lifespan of Forhot Password Token(1 hour)          | 3600                                           |
| SERVER_URL                          | Server url                                         | http://localhost:3001                          |
| CLIENT_URL                          | Client url                                         | http://localhost:3000                          |
| AWS_BUCKET_NAME                     | Name of the AWS S3 Bucket                          | bf-campaigns-dev                               |
| AWS_BUCKET_REGION                   | Region of the AWS S3 Bucket                        | us-east-2                                      |
| AWS_ACCESS_KEY                      | Access key for AWS S3 Bucket                       | ASK FOR IT                                     |
| AWS_SECRET_ACCESS_KEY               | Secret access key for AWS S3 Bucket                | ASK FOR IT                                     |
| AWS_SIGNED_URL_EXPRIRATION_TIME     | Expiration time for url of the images from AWS     | 3600                                           |
| STRIPE_SECRET_KEY                   | Secret key of stripe                               | ---------------------------------------        |
| COMPANY_NAME                        | Name of the company                                | "Comapny Name Inc."                            |
| COMPANY_ADDRESS_LINE_ONE            | Address of building where the company is located   | "Empire State Building"                        |
| COMPANY_ADDRESS_LINE_TWO            | street address of the company                      | "350 Fith Avenue, 21st Floor"                  |
| COMPANY_ADDRESS_CITY                | City of the company                                | "New York"                                     |
| COMPANY_ADDRESS_POSTCODE            | Postcode of the company                            | "NY 10118"                                     |
| COMPANY_ADDRESS_COUNTRY             | Country of the company                             | "USA"                                          |

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 16.18.1
- Install [PostgreSQL](https://www.postgresql.org/download/) version 15.1
- Install [Redis](https://redis.io/docs/getting-started/installation/) version 7.0.5
- Install [VS Code](https://code.visualstudio.com/download) For development
- Install [VS Code Extension for Redis](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-redis-client) For development only on Windows (Redis by Weijan Chen) [More Info](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-database)


# Getting started

- ### Clone the repository
```
git clone git@github.com:Buzzier/campaign-backend.git
```

- ### Install dependencies
```
cd campaign-backend
yarn
```

- ### Build and run the project in development environment
```
yarn run dev
```

Note: You need nodemon, an npm package to run in development mode. If you don't
have it either run `npm i -g nodemon` for installing and using it globally for
all the node applications or `npm i -D nodemon` to install it as Dev
dependencies to use it for this application only.

You can run `yarn start` in development mode too but then you have to
run it manually everytime you make any change.

- ### Build and run the project in production environment
```
yarn start
```

Navigate to http://localhost:3001. If it says "Hello World" then everything is okay.

## Start PostgreSQL

- ### Connect to PostgreSQL(From Terminal/Bash)
```
psql -U postgres
```

Note: postgres is the default user name PostgreSQL set during installation.
If you change it or using other user replace it with yours. Then you have
to provide your password for the user.

Note: You have to run the next commands only once(now) to setup tha database
and users table.
- ### Create a Database
```
CREATE DATABASE campaign_builder;
```

```
\c campaign_builder;
```

```
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Some useful commands for PostgreSQL:

- ### To see all the tables in the campaign_builder database:
```
\dt
```

- ### To see all the entries of users table:
```
SELECT * FROM users;
```

- ### To stop PostgreSQL:
```
\q
```

### Database Migration: Implementing All New Database Changes
```
yarn run migrateLatest
```

### Database Migration: Adding initial rows for static tables
```
yarn run seedRun
```

### Database Migration: Implementing Next Database Changes
```
yarn run migrateUp
```

### Database Migration: Discarding Latest Database Changes
```
yarn run migrateDown
```

## Start Redis

- ### Connect to Redis by Bash
```
sudo service redis-server start
```

- ### To Check Connection
```
redis-cli ping
```
Note: If the bash replies `PONG` then the connection is okay

-  ### Windows(WSL2) only : You have to connect to the Redis database through the redis extention providing the host and port.

-  ### To stop Connection after finish testing/coding
```
sudo service redis-server stop
```