<div style="width: 1440px; height: 500px; text-align: center; overflow: hidden; border-radius: 100px;">
    <h1 style="color: #ffffff; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Full-Stack MERN E-Commerce</h1>
    <img src="https://github.com/DanSmirnov48/techno-trades/blob/main/images/banner.png" style="width: 100%; height: 100%; object-fit: cover; border-radius: 100px;">
</div>

## Live Appliocation
You can check out the [deployed app here](https://techno-trades-b8640249eefb.herokuapp.com), and create your own account or use of the dummy ones:

```yaml
Email: tomas.stevenson@emial.com
Email: mark.doel789@gmail.com
Email: lynne.gibson@gmail.com
Email: nina.spencer123@gmail.com
```
and the password is the same of all users
```yaml
Password: password123
```

## User Auth & Account Verification
The user authentication and autherazation is using NodeMailer to send users vefication emails. </br>
At SignUp user will be asked to enter a verification code that will be sent to provided email. **Can not create an account without this!** </br>
So if you are Signing Up enter an email you can verify.


## Making Payments
The app is using Stripe as a payment method, and is running is Development Mode, which means it doesn't actually withdraw any real money but you will have to use the following card details:
```yaml
Card Number: 4242 4242 4242 4242
Exp Date: ANY FUTURE DATE e.g(12/30)
CVC: ANY 3 DIGITS e.g(999)
```


## Run Locally

This app requires [node.js](https://nodejs.org/) v14+ to run.
To run the site, open terminal and make sure it is in the project's directory
Install the dependencies and start the server.

Install & Run Server dependencies

```sh
  git clone https://github.com/DanSmirnov48/techno-trades.git
```

```sh
  cd techno-trades
```

```sh
  npm install
```

```sh
  npm run server
```

Install & Run Client dependencies

```sh
  cd client
```

```sh
  npm install
```

```sh
  npm run dev
```

## Tech Stack

**Client:**
- React Vite
- Tailwind
- TanStack React Query
- React-hook-form
- Shadcn/ui
- Zod
- Zustand
- Axios
- UploadThing

**Server:**
- Express
- MongoDb & Mongoose
- NodeMailer
- React-email
- Stripe
- UploadThing


    
