# Base App Endpoint

## User Authentication

In this section, is how to authenticate a user and how to retrieve the user's
information.

### Regular Authentication

-   [Register](#register)

Request:

    POST /register

```
    {
        "name": "John Doe",
        "email": "johndoe@mail.com",
        "password": "123456"
    }
```

-   [Login](#login)

    POST /login

Request:

```
    {
        "email": "johndoe@gmail.com",
        "password": "123456"
    }
```

-   [Edit User](#edit-user)

    POST /edit

Request:

```
    {
        "name": "New John Doe",
        "email": "newjohndoe@mail.com",
        "password": "new123456"
    }
```

### Google Authentication

-   [Login with Google](#login-with-google)

    GET /auth/google

Auth0 will redirect the user to the Google login page and then redirect the user
back to the application with saving the user details in the session to database.

Response:

```
    {
        "name": req.user.name,
        "email": request.user.email,
        "id_google": request.user.id
    }
```

-   [Sign Out](#sign-out)

    GET /signout

Will destroy the session both in Regular Authentication and Google
Authentication.

Response:

```
    {
        "message": "User logged out successfully"
    }
```

-   [Dashboard](#dashboard)

    GET /dashboard

In the dashboard, we will show the user's information. User must be logged in
first.

Response:

```
    {
        "message": "Welcome to your dashboard"
    }
```

## Barang

    GET /barang

Barang is the name of the endpoint that will be used to show the list of trash
categories.

Response:

```
    {
        "id": 1,
        "barang": "Plastic",
        "harga": "500",
        "gambar": "https://www.google.com/image.png"
    }
```

## Artikel

Artikel is a simple tutorial that will help you to get started with the
handicraft and show you how to reuse the trash.

### Artikel Reduce

Artikel reduce id range from 1 to 10.

-   [Artikel Reduce List](#artikel-reduce-list)

    GET /artikel/reduce

Response:

```
    {
        "id": 1,
        "judul": "Artikel Reduce 1",
        "isi": "Artikel Reduce 1 isi",
        "author": "John Doe",
        "website": "https://www.google.com",
        "tanggal_pulikasi": "23 May 2022",
        "gambar": "https://www.google.com/image.png"
    }
```

### Artikel Reuse

Artikel reuse id range from 11 to 20.

-   [Artikel Reuse List](#artikel-reuse-list)

    GET /artikel/reuse

Response:

```
    {
        "id": 11,
        "judul": "Artikel Reuse 1",
        "isi": "Artikel Reuse 1 isi",
        "author": "John Doe",
        "website": "https://www.google.com",
        "tanggal_pulikasi": "23 May 2022",
        "gambar": "https://www.google.com/image.png"
    }
```

### Favouriting Artikel

User must be logged in to favourite an artikel. The session id of the user will
be condition to query the database.

-   [Favouriting Artikel](#favouriting-artikel)

    POST /addfav/:id

Request:

```
    {
        "id": 1
    }
```

-   [Show Favourite Artikel](#show-favourite-artikel)

    GET /fav

Response:

```
    {
        "id": 1,
        "judul": "Artikel Reduce or Reuse 1",
        "isi": "Artikel Reduce or Reuse 1 isi",
        "author": "John Doe",
        "website": "https://www.google.com",
        "tanggal_pulikasi": "23 May 2022",
        "gambar": "https://www.google.com/image.png"
    }
```

## Retrieving Vertex AI Data

This section is under `construction`.
