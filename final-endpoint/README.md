# Base App Endpoint

## Base URL

API Base URL: https://rebage.uc.r.appspot.com/

## User Authentication

In this section, is how to authenticate a user and how to retrieve the user's
information.

### Regular Authentication

-   [Signup](#signup)

    POST /api/user/signup

Request:

```JSON
{
    "name": "John Doe",
    "email": "johndoe@mail.com",
    "password": "123456"
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@mail.com",
        "photo": null,
        "token": "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQ1ODcyNTMsImlhdCI6MTY1Mzk4MjQ1MywidXNlcklkIjo4fQ.nOeJ59XYSAutz2-0Q8P30EOA1aE9pMUT43Dy54LfjvU"
    }
}
```

-   [Signin](#signin)

    POST /api/user/signin

Request:

```JSON
{
    "email": "johndoe@mail.com",
    "password": "123456"
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "id": 1,
        "name": "John Doe",
        "email": "johndoe@mail.com",
        "photo": null,
        "token": "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQ1ODczNDIsImlhdCI6MTY1Mzk4MjU0MiwidXNlcklkIjo4fQ.A8y7D-Idid6mvDsyU9EYtdh30qDTTF2sZDcMeCmMlGg"
    }
}
```

-   [Google Auth](#google-auth)

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
    "id": number,
    "name": string,
    "email": string,
    "photo": string | null,
    "token": string
}
```

-   [Get User Info](#user)

    GET /api/user
    Authorization (Bearer Token):

```JSON
{
    "token": "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTQ1ODczNDIsImlhdCI6MTY1Mzk4MjU0MiwidXNlcklkIjo4fQ.A8y7D-Idid6mvDsyU9EYtdh30qDTTF2sZDcMeCmMlGg"
}
```

-   [Post Article](#article)

    POST /api/article

Request:

```JSON
{
    "title": "Tempat Pensil dari Botol Kaca",
    "author": "Tyas Nur Annisa Hidayah",
    "source": "https://www.rumahmesin.com/cara-membuat-kerajinan-dari-plastik/",
    "body": "Tempat pensil adalah tempat untuk menyimpan pensil. \nDan juga bisa diisi dengan alat tulis lain seperti tipe-x, penggaris, \nbolpoint, penghapus, pensil warna, stabilo, dan masih banyak lagi.\nJadi biasanya terbuat dari berbagai jenis bahan seperti plastik, kain, \nanyaman rotan, dan masih banyak lagi. Sekarang, kita akan membuat\n tempat pensil dari botol shampo yang dihias dengan lucu. Bahan dan\n Alat yang Diperlukan : \n1. Botol shampo bekas (yang sudah kosong) \n2. Kertas atau sticker berwarna (sesuai selera) \n3. Gunting \n4. Cutter \n5. Lem \n6. Double tip \n\nCara Membuat: \n1. Buat pola atau bentuk pada botol shampo sesuai selera. \n2. Potong sesuai pola yang sudah dibuat menggunakan cutter atau gunting. \n3. Buat gambar tangan pada bagian yang sudah dipotong atau tidak digunakan. \n4. Bentuk gambar wajah dan hiasan lainnya, lalu rekatkan semua bagian denga lem \n5. Rekatkan dengan double tip pada bagian belakang tempat pensil ke tembok. \nNah itu dia cara membuat tempat pensil dari botol plastik, semoga membantu!",
    "category": "reduce",
    "photo": [
        "https://storage.googleapis.com/rebage-cloud-storage/artikel/reuse/botolplastik-tempatpensil.jpg"
    ]
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "title": "Tempat Pensil dari Botol Kaca",
        "author": "Tyas Nur Annisa Hidayah",
        "source": "https://www.rumahmesin.com/cara-membuat-kerajinan-dari-plastik/",
        "body": "Tempat pensil adalah tempat untuk menyimpan pensil. \nDan juga bisa diisi dengan alat tulis lain seperti tipe-x, penggaris, \nbolpoint, penghapus, pensil warna, stabilo, dan masih banyak lagi.\nJadi biasanya terbuat dari berbagai jenis bahan seperti plastik, kain, \nanyaman rotan, dan masih banyak lagi. Sekarang, kita akan membuat\n tempat pensil dari botol shampo yang dihias dengan lucu. Bahan dan\n Alat yang Diperlukan : \n1. Botol shampo bekas (yang sudah kosong) \n2. Kertas atau sticker berwarna (sesuai selera) \n3. Gunting \n4. Cutter \n5. Lem \n6. Double tip \n\nCara Membuat: \n1. Buat pola atau bentuk pada botol shampo sesuai selera. \n2. Potong sesuai pola yang sudah dibuat menggunakan cutter atau gunting. \n3. Buat gambar tangan pada bagian yang sudah dipotong atau tidak digunakan. \n4. Bentuk gambar wajah dan hiasan lainnya, lalu rekatkan semua bagian denga lem \n5. Rekatkan dengan double tip pada bagian belakang tempat pensil ke tembok. \nNah itu dia cara membuat tempat pensil dari botol plastik, semoga membantu!",
        "category": "reduce",
        "photo": [
            "https://storage.googleapis.com/rebage-cloud-storage/artikel/reuse/botolplastik-tempatpensil.jpg"
        ],
        "createdAt": "2022-05-31T16:11:23.364Z",
        "updatedAt": "2022-05-31T16:11:23.364Z",
        "id": 5
    }
}
```

-   [Get Articles](#articles)

    GET /api/articles

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": "2022-05-31T06:03:29.161Z",
            "updatedAt": "2022-05-31T06:03:29.161Z",
            "id": 4,
            "title": "Tempat Pensil dari Botol Kaca",
            "author": "Tyas Nur Annisa Hidayah",
            "source": "https://www.rumahmesin.com/cara-membuat-kerajinan-dari-plastik/",
            "body": "Tempat pensil adalah tempat untuk menyimpan pensil. \nDan juga bisa diisi dengan alat tulis lain seperti tipe-x, penggaris, \nbolpoint, penghapus, pensil warna, stabilo, dan masih banyak lagi.\nJadi biasanya terbuat dari berbagai jenis bahan seperti plastik, kain, \nanyaman rotan, dan masih banyak lagi. Sekarang, kita akan membuat\n tempat pensil dari botol shampo yang dihias dengan lucu. Bahan dan\n Alat yang Diperlukan : \n1. Botol shampo bekas (yang sudah kosong) \n2. Kertas atau sticker berwarna (sesuai selera) \n3. Gunting \n4. Cutter \n5. Lem \n6. Double tip \n\nCara Membuat: \n1. Buat pola atau bentuk pada botol shampo sesuai selera. \n2. Potong sesuai pola yang sudah dibuat menggunakan cutter atau gunting. \n3. Buat gambar tangan pada bagian yang sudah dipotong atau tidak digunakan. \n4. Bentuk gambar wajah dan hiasan lainnya, lalu rekatkan semua bagian denga lem \n5. Rekatkan dengan double tip pada bagian belakang tempat pensil ke tembok. \nNah itu dia cara membuat tempat pensil dari botol plastik, semoga membantu!",
            "category": "reduce",
            "photo": [
                "https://storage.googleapis.com/rebage-cloud-storage/artikel/reuse/botolplastik-tempatpensil.jpg"
            ]
        }
}
```

-   [Post Garbage](#garbage)

    POST /api/garbage

Request:

```JSON
{
    "createdAt": "2022-05-29T09:09:34.101Z",
    "updatedAt": "2022-05-29T09:09:34.101Z",
    "id": 1,
    "name": "botolkaca",
    "price": "700",
    "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/botolkaca.jpg"
}
```

Response:

```JSON
{
    "success": true,
    "data": {
        "createdAt": "2022-05-29T09:09:34.101Z",
        "updatedAt": "2022-05-29T09:09:34.101Z",
        "id": 1,
        "name": "botolkaca",
        "price": "700",
        "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/botolkaca.jpg"
    }
}
```

-   [Get Garbages](#garbages)

    GET /api/garbages

Response:

```JSON
{
    "success": true,
    "data": [
        {
            "createdAt": "2022-05-29T09:09:34.101Z",
            "updatedAt": "2022-05-29T09:09:34.101Z",
            "id": 1,
            "name": "botolkaca",
            "price": "700",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/botolkaca.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.103Z",
            "updatedAt": "2022-05-29T09:09:34.103Z",
            "id": 2,
            "name": "botolplastik",
            "price": "500",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/botolplastik.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.105Z",
            "updatedAt": "2022-05-29T09:09:34.105Z",
            "id": 3,
            "name": "kaleng",
            "price": "550",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/kaleng.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.106Z",
            "updatedAt": "2022-05-29T09:09:34.106Z",
            "id": 4,
            "name": "kardus",
            "price": "250",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/kardus.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.107Z",
            "updatedAt": "2022-05-29T09:09:34.107Z",
            "id": 5,
            "name": "karet",
            "price": "100",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/karet.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.108Z",
            "updatedAt": "2022-05-29T09:09:34.108Z",
            "id": 6,
            "name": "kertas",
            "price": "50",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/kertas.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.109Z",
            "updatedAt": "2022-05-29T09:09:34.109Z",
            "id": 7,
            "name": "plastik",
            "price": "50",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/plastik.jpg"
        },
        {
            "createdAt": "2022-05-29T09:09:34.110Z",
            "updatedAt": "2022-05-29T09:09:34.110Z",
            "id": 8,
            "name": "sedotan",
            "price": "25",
            "image": "https://storage.googleapis.com/rebage-cloud-storage/barang/sedotan.jpg"
        }
    ]
}
```

-   [Detection](#detection)

    POST /api/detection

Request:

```
Key     : image
Value   : your-images.jpg
```

Response:

```JSON
{
    "success": true,
    "data": {
        "image": "https://storage.googleapis.com/rebage-cloud-storage/user-images/0_6665dfee_2e82_49cd_b8eb_01061ff51b9f_864_1152.jpg",
        "result": {
            "bounding_boxes": [
                [
                    0.0680751503,
                    0.163940698,
                    0.899692655,
                    0.706927896
                ]
            ],
            "label_detections": [
                "kaleng"
            ],
            "scores": [
                0.9903301
            ]
        }
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
