# Usage for Rebage API

The Rebage API Usage wiki records documentation on using the APIs built into the
Rebage app. Sample data is provided for the request as an example of usage along
with detailed information from each endpoint, as well as the response from each
endpoint.

Wiki of API Usage:
[API Usage - Wiki](https://github.com/Rebage-Bangkit2022/Rebage-Cloud/wiki/API-Usage)

## Base URL

API Base URL: https://rebage.uc.r.appspot.com/

## User Authentication

In this section, is how to authenticate a user and how to retrieve the user's
information.

### Regular Authentication

-   [Signup](#post-signup)

    POST /api/user/signup

Request:

```JSON
{
    "name": string,
    "email": string,
    "password": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "name": string,
        "email": string,
        "photo": string | null,
        "token": string
    }
}
```

-   [Signin](#post-signin)

    POST /api/user/signin

Request:

```JSON
{
    "email": string,
    "password": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "name": string,
        "email": string,
        "photo": string | null,
        "token": string
    }
}
```

### Google Authentication

-   [Google Auth](#post-google-auth)

    POST /api/user/auth-google

Request:

```JSON
{
    "idToken": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "name": string,
        "email": string,
        "photo": string | null,
        "token": string
    }
}
```

### Get User Information

-   [Get User](#get-user)

    GET /api/user

Authorization with Bearer Token:

```JSON
{
    "token": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "createdAt": string,
        "updatedAt": string,
        "id": integer,
        "name": string,
        "email": string,
        "password": string,
        "photo": string
    }
}
```

## Articles

The application contains static articles which will be provided by the
application user.

### Adding Articles

-   [Post Article](#post-article)

    POST /api/article

Request:

```JSON
{
    "title": string,
    "author": string,
    "source": string,
    "body": string,
    "category": string [reduce | reuse],
    "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
    "photo": string[]
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "title": string,
        "author": string,
        "source": string,
        "body": string,
        "category": string [reduce | reuse],
        "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
        "photo": string[],
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "id": integer
    }
}
```

### Retrieving all Articles

-   [Get Articles](#get-articles)

    GET /api/articles

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "title": string,
            "author": string,
            "source": string,
            "body": string,
            "category": string [reduce | reuse],
            "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
            "photo": string[]
        }
    ]
}
```

### Retrieving Article by Id

-   [Get Article by Id](#get-article-by-id)

    GET /api/article/:articleId

```JSON
{
    "success": true,
    "data": {
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "id": articleId,
        "title": string,
        "author": string,
        "source": string,
        "body": string,
        "category": string [reduce | reuse],
        "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
        "photo": string[]
    }
}
```

### Retrieving filtered Article data

-   [Get Filtered Article](#get-filtered-articles)

    GET /api/articles?`params`=`value`

The `params` and `value` list:

#### Fitering by Category

-   ?category=`reduce` | `reuse`

    GET /api/articles?category=reduce

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "title": string,
            "author": string,
            "source": string,
            "body": string,
            "category": "reduce",
            "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
            "photo": string[]
        },
        ...
    ]
}
```

#### Fitering by Category Garbage

-   ?garbagecategory=`botolkaca` | `botolplastik` | `kaleng` | `kardus` |
    `karet` | `kertas` | `plastik` | `sedotan`

    GET /api/articles?garbagecategory=botolkaca

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "title": string,
            "author": string,
            "source": string,
            "body": string,
            "category": string,
            "garbagecategory": "botolkaca",
            "photo": string[]
        },
        ...
    ]
}
```

#### Fitering by Size

-   ?size=`1` | `2` | `...` | `integer`

    GET /api/articles?size=2

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "title": string,
            "author": string,
            "source": string,
            "body": string,
            "category": string [reduce | reuse],
            "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
            "photo": string[]
        },
        ...
    ]
}
```

#### Fitering by Page

-   ?page=`1` | `2` | `...` | `integer`

    GET /api/articles?page=1

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "title": string,
            "author": string,
            "source": string,
            "body": string,
            "category": string [reduce | reuse],
            "garbagecategory": string [botolkaca | botolplastik | kaleng | kardus | karet | kertas | plastik | sedotan],
            "photo": string[]
        },
        ...
    ]
}
```

## Garbage

Contains data on 8 items in the form of a list including:

-   botolkaca
-   botolplastik
-   kaleng
-   kardus
-   karet
-   kertas
-   plastik
-   sedotan

### Adding Garbage

-   [Post Garbage](#post-garbage)

    POST /api/garbage

Request:

```JSON
{
    "createdAt": timestamp,
    "updatedAt": timestamp,
    "id": integer,
    "name": string,
    "price": integer,
    "image": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "id": integer,
        "name": string,
        "price": integer,
        "image": string
    }
}
```

### Retrieving all Garbages

-   [Get Garbages](#get-garbages)

    GET /api/garbages

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": timestamp,
            "updatedAt": timestamp,
            "id": integer,
            "name": string,
            "price": integer,
            "image": string
        },
        ...
    ]
}
```

### Retrieve Garbage Details by Id

-   [Get Garbages by Id](#get-garbage-by-id)

    GET /api/garbage/id/:garbageId

Response:

```JSON
{
    "success": true,
    "data": {
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "id": garbageId,
        "name": string,
        "price": integer,
        "image": string
    }
}
```

### Retrieve Garbage Details by Name

-   [Get Garbages by Name](#get-garbage-by-name)

    GET /api/garbage/name/:garbageName

Response:

```JSON
{
    "success": true,
    "data": {
        "createdAt": timestamp,
        "updatedAt": timestamp,
        "id": integer,
        "name": garbageName,
        "price": integer,
        "image": string
    }
}
```

## Detection

To perform visual detection in the form of an image that will be predicted at
the Vertex AI endpoint, then return the results.

### Request Image for Object Detection

-   [Detection](#post-detection)

    POST /api/detection

Request:

```
Key     : image
Value   : your-images.jpg (format can be: .jpeg/jpg | .png | .gif | .bmp | .ico)
```

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "id": integer,
            "image": string,
            "label": string,
            "scores": [
                integer
            ],
            "boundingBoxes": [
                [
                    integer,
                    integer,
                    integer,
                    integer
                ]
            ],
            "total": integer,
            "createdAt": timestamp
        },
        ...
    ]
}
```

### Retrieve the Object Detection

-   [Get Detection](#get-detection)

    GET /api/detections

Authorization with Bearer Token:

```JSON
{
    "token": string
}
```

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "id": integer,
            "image": string,
            "label": string,
            "scores": [
                integer
            ],
            "boundingBoxes": [
                [
                    integer,
                    integer,
                    integer,
                    integer
                ]
            ],
            "total": integer,
            "createdAt": timestamp
        },
        ...
    ]
}
```

### Retrieve the Object Detection by Id

-   [Get Detection](#get-detection-by-id)

    GET /api/detection/:id

Authorization with Bearer Token:

```JSON
{
    "token": string
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "image": string,
        "label": string,
        "scores": [
            integer
        ],
        "boundingBoxes": [
            [
                integer,
                integer,
                integer,
                integer
            ]
        ],
        "total": integer,
        "createdAt": timestamp
    }
}
```

### Update the Object Detection

-   [Update Detection](#update-detection)

    PUT /api/detection/:id

Request:

```JSON
{
    "id": integer,
    "total": integer
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "image": string,
        "label": string,
        "scores": [
            integer
        ],
        "boundingBoxes": [
            [
                integer,
                integer,
                integer,
                integer
            ]
        ],
        "total": integer,
        "createdAt": timestamp
    }
}
```

### Delete the Object Detection

-   [Delete Detection](#delete-detection)

    DELETE /api/detection/:id

Response:

```JSON
{
    "success": true,
    "data": {
        "id": integer,
        "image": string,
        "label": string,
        "scores": [
            integer
        ],
        "boundingBoxes": [
            [
                integer,
                integer,
                integer,
                integer
            ]
        ],
        "total": integer,
        "createdAt": timestamp
    }
}
```

## Contributor

Thanks goes to wonderful people who have contributed to this API:

<table>
  <tr>
  <!-- Person 1 -->
    <td align="center"><a href="https://github.com/bagus2x"><img src="https://avatars.githubusercontent.com/u/54665358?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tubagus Saifulloh</b></sub></a><br /><a href="https://github.com/bagus2x" title="Cloud">☁️</a><a href="https://github.com/bagus2x" title="Mobile">📱</a></td>
<!-- Person 2 -->
    <td align="center"><a href="https://github.com/bydzen"><img src="https://avatars.githubusercontent.com/u/42274355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sultan Kautsar</b></sub></a><br /><a href="https://github.com/bydzen" title="Cloud">☁️</a><a href="https://github.com/bydzen" title="GCP">🌐</a></td>
<!-- Person 3 -->
    <td align="center"><a href="https://github.com/Hanifahmarta"><img src="https://avatars.githubusercontent.com/u/105196353?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hanifah Marta</b></sub></a><br /><a href="https://github.com/Hanifahmarta" title="Cloud">☁️</a><a href="https://github.com/Hanifahmarta" title="GCP">🌐</a></td>
  </tr>
</table>

**Thats All. Thank you!**
