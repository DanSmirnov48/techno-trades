<div style="width: 1440px; height: 500px; text-align: center; overflow: hidden; border-radius: 100px;">
    <h1 style="color: #ffffff; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Full-Stack MERN E-Commerce</h1>
    <img src="https://github.com/DanSmirnov48/techno-trades/blob/main/images/banner.png" style="width: 100%; height: 100%; object-fit: cover; border-radius: 100px;">
</div>

## Installation

This app requires [node.js](https://nodejs.org/) v14+ to run.
To run the site, open terminal and make sure it is in the project's directory
Install the dependencies and start the server.

```sh
npm install
node server
npm start
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file


`port`

`MONGO_URI`


## API Reference

#### Get all users

```http
  GET /api/users
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| - | `string` | Get all users as json format |

#### Get item

```http
  GET /api/users/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |


