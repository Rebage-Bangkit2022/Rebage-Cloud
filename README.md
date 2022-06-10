# Rebage - Cloud Computing

_The cloud technology used in Rebage_

**Powered by:**

<p style="text-align: center; background-color: #eee; display: inline-block; padding: 14px 20px; border-radius: 15px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" width="250"/>
</p>

Google Cloud Platform, offered by Google, is a suite of cloud computing services
that runs on the same infrastructure that Google uses internally for its
end-user products, such as Google Search, Gmail, Google Drive, and YouTube.

Wiki of Home:
[Home - Wiki](https://github.com/Rebage-Bangkit2022/Rebage-Cloud/wiki)

The cloud technology that used in this project:

-   **Google Cloud Platform** (suite of cloud computing services)
-   **Cloud SQL** (for app database - dev environment)
-   **App Engine** (for deploying the app)
-   **Cloud Storage** (for storing the assets)
-   **Vertex AI** (for machine learning)
-   **Cloud Monitoring** (for get info on all services)

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

<img src="https://symbols.getvecta.com/stencil_4/45_google-cloud-sql.35ca1b4c38.svg" width="50" height="50"/>

This sql service **`has been deployed`** on devevelopment environment.

Service details:

```YAML
Database Type   : PostgreSQL
Version         : 14
vCPUs           : 1
Memory          : 1.7 GB
Storage         : 10 GB
```

Docs: [cloud-sql-postgres-docs](https://cloud.google.com/sql/docs/postgres/)

### App Engine

<img src="https://symbols.getvecta.com/stencil_4/8_google-app-engine.c22bd3c7a9.svg" width="50" height="50"/>

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

### Cloud Storage

<img src="https://symbols.getvecta.com/stencil_4/47_google-cloud-storage.fee263d33a.svg" width="50" height="50"/>

This storage service **`has been deployed`**.

```YAML
Location Type   : Region
Location        : asia-southeast1
Storage Class   : Standard
```

Docs: [cloud-storage-docs](https://cloud.google.com/storage/docs)

### Vertex AI

<img src="https://symbols.getvecta.com/stencil_4/6_google-ai-platform.fe4b377c20.svg" width="50" height="50"/>

This service model **`has been deployed`**.

Detail info:

```YAML
Model name      : ssd_mobnet_50k
Region          : asia-southeast1
Version         : 1
Endpoint name   : rebage-ml-endpoint
```

Docs: [ai-platform-docs](https://cloud.google.com/ai-platform/docs/)

### Cloud Monitoring

<img src="https://symbols.getvecta.com/stencil_4/36_google-cloud-monitoring.5b9e1af8b5.svg" width="50" height="50"/>

This monitoring service **`has been deployed`**.

Detail info:

```YAML
Cloud SQL       : Deadlocks Count, CPU Usage [MEAN]
App Engine      : Response Count, Logs, CPU Utilization [MEAN]
Cloud Storage   : Request Count, Total Bytes [MEAN]
Vertex AI       : Prediction Count [MEAN], Latencies [50th Precentile]
```

Docs: [cloud-monitoring-docs](https://cloud.google.com/monitoring/docs/)

This application still `under development` changes are expected to be perfect
when the application enters the final stage.
