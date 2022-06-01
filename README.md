# Rebage - Cloud Computing

_The cloud technology used in Rebage_

**Powered by:**

<img src="https://www.gstatic.com/devrel-devsite/prod/v6cd15f45ec209c8961e07ea7e57ed9a0e9da4333bc915e67d1fcd2b2a9ec62d1/cloud/images/cloud-logo.svg" width="125"/>

Google Cloud Platform, offered by Google, is a suite of cloud computing services
that runs on the same infrastructure that Google uses internally for its
end-user products, such as Google Search, Gmail, Google Drive, and YouTube.

The cloud technology that used in this project:

-   **Google Cloud Platform** (suite of cloud computing services)
-   **Cloud SQL** (for app database - dev environment)
-   **App Engine** (for deploying the app)
-   **Vertex AI** (for machine learning)

## Important Notes

-   The folder called **_`"endpoint"`_** contains the code for the backend of
    the web-app. This backend code is used to handle the requests and send the
    response to the client. The backend code is written in Express.js. Now, the
    backend code is not used in this project because not suitable.

-   The folder called **_`"endpoint"`_** is project in the
    `internal implementation stage`, the service and the account used is a
    personal account. The changes made are an application testing that is
    expected to be perfect when the application enters the final stage.

-   The folder called **_`"final-endpoint"`_** contains the code for the backend
    of the mobile-app. This backend code is used to handle the requests and send
    the response to the client. The backend code is written in Node.js with
    Express.js framework. Currently, the backend code is used in this project
    because of the suitable.

-   The folder called **_`"final-endpoint"`_** is project in the
    `actual implementation stage`, the service and the account used is a
    educational account purpose from Bangkit 2022. The changes made are an
    application testing that is expected to be perfect when the application
    enters the final stage.

## Technology Used

There are three uses of technology in Google Cloud. Among them are Cloud SQL,
App Engine, and Vertex AI. These three services are used as application service
needs on the cloud side to process all requests and data services.

### Cloud SQL

This sql service **`has been deployed`** (dev environment).

Service details:

```YAML
Database Type   : PostgreSQL
Version         : 14
vCPUs           : 1
Memory          : 614.4 MB
Storage         : 10 GB
```

Docs: [cloud-sql-postgres-docs](https://cloud.google.com/sql/docs/postgres/)

### App Engine

This app service **`has been deployed`**.

Service details:

```YAML
runtime: nodejs
env: flex
manual_scaling:
    instances: 1
resources:
    cpu: 2
    memory_gb: 4
    disk_size_gb: 10
```

Docs:
[app-engine-docs](https://cloud.google.com/appengine/docs/standard/nodejs/runtime)

### Vertex AI

This service model **`has been deployed`**.

Detail info:

```YAML
Model name      : ssd_100k
Region          : us-central1
Version         : 1
Endpoint name   : rebage-models-endpoint
```

Docs: [ai-platform-docs](https://cloud.google.com/ai-platform/docs/).

This application still `under development` changes are expected to be perfect
when the application enters the final stage.
