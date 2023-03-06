<h1> Node Authenticator </h1>

<p> Created a complete authentication system which can be used as a starter code for creating any new nodejs
application </p>

### Features :-


1. SignUP :- 

```
- Users can Sign up with their registered email and password
- Encrypted/hashed Password will be stored in the database.
- Display error notification if password and confirm password do not match. 
- The user will be able to see the password by clicking on eye icon.
- Enabled google re-captcha (version - 3) on sign up.

```

2. LogIn & SignOut

```
- Entered password will be compared with hashed password to validate the password and if it is not a success, error notification will be shown.
- On Sign in user will be redirected to a blank home page with a sign out and reset password button.
-  Used Google Login/Signup (Social authentication).
- On clicking on Sign out button user will be signed out and redirected to sign in page.
- Enabled google re-captcha (version - 3) on log in.
```

3. Reset Password 

```
- To reset the password, user needs to click on the reset password button once successfully logged in.
- An email will be sent to the user's registered email with a link to reset the password. Here i have used parallel jobs for sending this mail.
- This link is valid only for 10 mins. Post 10 mins if someone tries to use it , it will given them link expired notification.
- Also i have used user's information i.e. id,name, password in the payload to create the token and link, so once the user changed the password and if he/she again tries to access the same link for resetting their password, it will show invalid link notification as the password will be changed, so JWT will unable to verify the token. which helps to making the link for one time use only.
- After clicking on this link, the user will be redirected to a page which will have field to enter the new password.
- Once the user entered new password and click on submit, the password will be updated and the encrypted password will store in the session.
```


<h2>Tools/Technologies Used :-</h2>

1. Node.Js
2. Express.Js
3. MongoDB
4. Passport.JS [for authentication]

## Some of the Library Used :-
```
1. connect-flash : Used to show toast notifications.
2. connect-mongo : To able to store session cookies in db.
3. crypto - To generate random passwords for the social authentication.
4. jsonwebtoken : To generate JWT token for rest-password functionality. 
5. bcrypt : To hash the password before storing in the db while sign up and compare the entered password and hashed password while sing in.
6. passport : Used for authentication, create/manage sessions.
7. dotenv : Used to create environmental variables for passwords,secret keys etc.
8. cookie-parser : middleware which parses cookies attached to the client request object
9. Kue : To enable parallel Jon functionality
10. nodemailer : Used to send mails to the user

```


<hr>

## How To Use :-

#### Step 1 :- Clone the repo

```
git clone https://github.com/SahilMund/Hospital-API.git
```

#### Step 2 :- To install the dependencies

```
npm install
```

#### Step 3 :- Put your credentials / secret key in the dotenv file
#### Create a file with name no name and env extension i.e. [.env].
#### Your dotenv file will look something like the below, I have given a schema make sure to fill all the details.

```
# CAPTCHA SECRET KEY
CAPTCHA_SECRET_KEY = <Enter_Your_Captcha_key>

# DB CONFIG
DB_URI = mongodb://127.0.0.1:27017/
DB_NAME = Node_Auth

# FOR NODEMAILER , USER EMAIL AND PASSWORD 
TRANSPORTER_USER_EMAIL = ENTER_TRANSPORTER_USER_EMAIL
TRANSPORTER_USER_PASSWORD = ENTER_TRANSPORTER_USER_PASSWORD

# PASSPORT GOOGLE STRATEGY
PASSPORT_GOOGLE_CLIENT_ID = ENTER_YOUR_PASSPORT_GOOGLE_CLIENT_ID
PASSPORT_GOOGLE_CLIENT_SECRET = ENTER_YOUR_PASSPORT_GOOGLE_CLIENT_SECRET


# JWT SECRET KEY
JWT_SECRET_KEY = ENTER_YOUR_JWT_SECRET_KEY


# NODEMAILER FROM USER EMAIL
NODEMAILER_FROM_USER_EMAIL = ENTER_YOUR_NODEMAILER_FROM_USER_EMAIL

# SERVER PORT
PORT = 8000

# COOKIES SECRET KEY
COOKIES_SECRET_KEY = ENTER_YOUR_COOKIES_SECRET_KEY


```

#### Step 4 :- Install Redis (Linux-Ubuntu)

```
sudo apt-get install redis-server
```

#### Step 5 :- Run redis server

```
redis-server
```

#### Step 6 :- To run the application

```
npm start

Application will be running on the PORT - 8000
```


## Folder Structure :-
```
.gitignore
README.md
assets  
   |-- css
   |   |-- header.css
   |   |-- layout.css
   |   |-- user_forms.css
   |-- images
   |   |-- google.png
   |-- js
   |   |-- main.js
config
   |-- captcha-validator.js
   |-- flash-middleware.js
   |-- kue-dashboard.js
   |-- kue.js
   |-- mongoose.js
   |-- nodemailer.js
   |-- passport-google-oauth2-strategy.js
   |-- passport-local-strategy.js
controllers
   |-- home_controller.js
   |-- users_controller.js
index.js
mailers
   |-- reset-password-mailer.js
models
   |-- user.js
package-lock.json
package.json
routes
   |-- index.js
   |-- users.js
views
   |-- _navbar.ejs
   |-- _oAuth.ejs
   |-- home_page.ejs
   |-- layout.ejs
   |-- mailtemplate
   |   |-- Auth
   |   |   |-- reset_password_template.ejs
   |-- reset-password.ejs
   |-- user_sign_in.ejs
   |-- user_sign_up.ejs
worker
   |-- reset-password-worker.js
```