
# Full-Stack MERN E-Commerce

A web application running on Node Backend server with TypeScript and React Vite on the Frontend. The data is being stored in the MongoDB.


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


