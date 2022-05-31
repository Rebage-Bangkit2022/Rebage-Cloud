## Rebage - Cloud Computing

_The cloud technology used in Rebage_

##### Powered by:

<img src="https://www.gstatic.com/devrel-devsite/prod/v6cd15f45ec209c8961e07ea7e57ed9a0e9da4333bc915e67d1fcd2b2a9ec62d1/cloud/images/cloud-logo.svg" width="125"/>

Google Cloud Platform, offered by Google, is a suite of cloud computing services
that runs on the same infrastructure that Google uses internally for its
end-user products, such as Google Search, Gmail, Google Drive, and YouTube.

The cloud technology that used in this project:

-   **Google Cloud Platform**
-   **Compute Engine (VM)** (for deploying the app & database)
-   **Vertex AI** (for machine learning)

### Important Notes

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

### Compute Engine (VM)

This service **`has been deployed`**. Deployment details:

```
-- Runtime Host
Proccess    : PM2 for JavaScript Runtime Node.js
Docs        : https://pm2.keymetrics.io/docs/usage/process-management/
-- App info
URL         : https://rebage.rayatiga.com/
Web server  : nginx
SSL         : ZeroSSL
Runtime     : nodejs
Port        : 8080 -> 80 proxyed by nginx
Version     : 1
-- Resources
OS          : Ubuntu 22.04 LTS
Virtual CPU : 0.5
Memory      : 1.70 GB
Disk Size   : 20 GB
-- Database
Database    : postgreSQL
Version     : 14.3
```

Docs:
[compute-engine-overview](https://cloud.google.com/compute/docs/instances/).

### Vertex AI

This model **`has been deployed`**.

Detail info:

```
Model name      : ssd_100k
Region          : us-central1
Version         : 1
Endpoint name   : rebage-models-endpoint
```

Docs: [ai-platform-overview](https://cloud.google.com/ai-platform/docs/).
