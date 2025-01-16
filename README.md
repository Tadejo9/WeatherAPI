Clone the project

```bash
git clone git@github.com:Tadejo9/WeatherAPI.git
```

Install the dependencies

```bash
npm install
```

Run the server
```
node index.js
```

Endpoints

### Login

Method: `POST`

`/login`

Response

```ts
{
    token: string;
}
```

### List locations
Method: `GET`

`/locations`

Response
```ts
[
    {
        lon: number,
        lat: number
    }
]
```

### Add location
Method: `POST`

`/locations`

Body

```ts
{
    lat: number,
    lon: number
}
```

### Delete location
Method: `DELETE`

`/locations`

Body

```ts
{
    lat: number,
    lon: number
}
```