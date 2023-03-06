<h1> Nodejs Authentication </h1>

<p> Created a complete authentication system which can be used as a starter code for creating any new nodejs
application </p>

### Features :-


1. SignUP :- 

```
- Users can Sign up with their registered email and password
- Encrypted/hashed Password will be stored in the database.
- Display error notification if password and confirm password do not match. Also the user can see the password by clicking on eye icon.
- Enabled re-captcha on sign up.
```

2. LogIn & SignOut

```
- Entered password will be compared with hashed password to validate the password and if it is not a success, error notification will be shown.
- On Sign in user will be redirected to a blank home page with a sign out and reset password button.
- Also used Google login/signup (Social authentication)
- On clicking on Sign out button user will be signed out and redirected to sign in page.
- Enabled re-captcha on log in.
```

3. Reset Password 

```
- To reset the password, user needs to click on the reset password button once successfully logged in.
- An email will be sent to the user's registered email with a link to reset the password. Using parallel jobs for sending this mail.
- This link is valid only for 10 mins. Post 10 mins if someone tries to use it , it will given them link expired.

- After clicking on this link, the user will be redirected to a page which will have field to enter the new password.

- Once the user entered new password and click on submit, the password will be updated and the encrypted password will store in the session.
```


<h2>Tools/Technologies Used :-</h2>

1. Node.Js
2. Express.Js
3. MongoDB

## Some of the Library Used :-
```
1. connect-flash : Used to show toast notifications.
2. connect-mongo : To able to store session cookies in db.
3. crypto - To generate random passwords for the social authentication.
4. jsonwebtoken : To generate JWT token for rest-password functionality.
5. bcrypt : To hash the password before storing in the db while sign up and compare the entered password and hashed password while sing in.
6. passport : Used for authentication, create/manage sessions.
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

#### Step 3 :- To run the application

```
npm start
```


## Folder Structure :-
