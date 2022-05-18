## Rebage - Cloud Computing
_The cloud technology used in Rebage_

##### Powered by:
<img src="https://www.gstatic.com/devrel-devsite/prod/v6cd15f45ec209c8961e07ea7e57ed9a0e9da4333bc915e67d1fcd2b2a9ec62d1/cloud/images/cloud-logo.svg" width="125"/>

Google Cloud Platform, offered by Google, is a suite of
cloud computing services that runs on the same infrastructure that
Google uses internally for its end-user products, such as Google Search,
Gmail, Google Drive, and YouTube.

The cloud technology that used in this project:

- Google Cloud Platform
- Cloud SQL (for database)
- App Engine (for deploying the app)
- VM Instances (auto creating from App Engine)
- Vertex AI (for machine learning)

### Important Notes
This project is currently in the *```internal implementation stage```*,
the service and the account used is a personal account. The changes made
are an application testing that is expected to be perfect when the application
enters the final stage.

### Cloud SQL ![#f03c15](https://via.placeholder.com/15/c5f015/000000?text=+)
Connection:
- [x] **Bash** (GNU/Linux e.g. use MySQL package)
```bash
mysql -h 146.148.82.14 \
    -u root -p
```
- [x] **phpMyAdmin** (Windows e.g. use XAMPP)
Add the following setup to ```phpMyAdmin/config.inc.php``` at the end of the line:
```php
...
$i++;
$cfg['Servers'][$i]['host'] = '146.148.82.14';  //provide hostname and port if other than default
$cfg['Servers'][$i]['user'] = 'root';            //user name for your remote server
$cfg['Servers'][$i]['password'] = 'xxx';        //password
$cfg['Servers'][$i]['auth_type'] = 'config;     // keep it as config
```

### App Engine ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+)
This service is currently **```waiting for completion```**.

### Vertex AI ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+) 
This service is **```ready to deploy```**.

