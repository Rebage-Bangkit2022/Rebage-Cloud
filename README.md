## Rebage - Cloud Computing

_The cloud technology used in Rebage_

##### Powered by:

<img src="https://www.gstatic.com/devrel-devsite/prod/v6cd15f45ec209c8961e07ea7e57ed9a0e9da4333bc915e67d1fcd2b2a9ec62d1/cloud/images/cloud-logo.svg" width="125"/>

Google Cloud Platform, offered by Google, is a suite of cloud computing services
that runs on the same infrastructure that Google uses internally for its
end-user products, such as Google Search, Gmail, Google Drive, and YouTube.

The cloud technology that used in this project:

-   **Google Cloud Platform**
-   **Cloud SQL** (for database)
-   **App Engine** (for deploying the app)
-   **Vertex AI** (for machine learning)

### Important Notes

This project is currently in the **_`internal implementation stage`_**, the
service and the account used is a personal account. The changes made are an
application testing that is expected to be perfect when the application enters
the final stage.

### Cloud SQL

Database MySQL **`has been deployed`**.

Connection:

-   [x] **Bash** (GNU/Linux e.g. use MySQL package)

```bash
mysql -h IP_ADDRESS \
    -u DB_USERNAME -p
```

-   [x] **phpMyAdmin** (Windows e.g. use XAMPP) Add the following setup to
        `phpMyAdmin/config.inc.php` at the end of the line:

```php
...
$i++;
$cfg['Servers'][$i]['host'] = '***';          // hostname remote mysql
$cfg['Servers'][$i]['user'] = '***';          // user database
$cfg['Servers'][$i]['password'] = '***';      // password database
$cfg['Servers'][$i]['auth_type'] = 'config';  // keep it as config
```

Docs:
[connect-overview](https://cloud.google.com/sql/docs/mysql/connect-overview).

### App Engine

This service **`has been deployed`**. Deployment details:

```
-- App info
URL         : https://rebage.uc.r.appspot.com/
Runtime     : nodejs
Environtment: flex
Port        : 3000 --> 80
Version     : 1
-- Resources
cpu         : 2
memory_gb   : 4
disk_size_gb: 10
```

Docs:
[deploy-appengine](https://cloud.google.com/build/docs/deploying-builds/deploy-appengine).

### Vertex AI

This model **`has been deployed`**.

Detail info:

```
Model name      : rebage-models
Region          : us-central1
Version         : 1
Endpoint name   : rebage-models-endpoint
ProjectID       : rebage
```

Docs: [ai-platform-docs](https://cloud.google.com/ai-platform/docs).
