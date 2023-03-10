# ð¥ Project Learning notes

# â³ï¸1. Initialization

### 1.1 Create project

1. Create a new api_server folder as the project root, and run the following command in the project root to initialize the package management configuration file.

```bash
npm init -y
```

2. ç¹å®ã®ãã¼ã¸ã§ã³ã®expressãã¤ã³ã¹ãã¼ã«ããå ´åã¯ãä»¥ä¸ã®ã³ãã³ããå®è¡ãã¾ãã

```bash
inpm i express@4.17.1
```

3. Create a new `app.js` in the project root directory as the entry file for the entire project and initialize the following code.

```js
//////////////////// import the required modules ð
// Import the express module
const express = require('express')
// Create a server instance of express
const app = express()

// write your code here...

// Call the app.listen method, specify the port number and start the web server
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})
```

### 1.2 Configuring cors 

1. Run the following command to install the `cors` middleware.

```bash
npm i cors@2.8.5
```

2. Import and configure the`cors` middleware in app.js.

```js
// Importing cors middleware
const cors = require('cors')
// Register cors as global middleware
app.use(cors())
```

### 1.3 Configure middleware for parsing form data

1. The middleware for parsing form data in `application/x-www-form-urlencoded`format is configured with the following code.

```js
//////////////////// configures the middleware for parsing form data ð
app.use(express.urlencoded({ extended: false }))
```

### 1.4 Initializing routing-related folders

1. In the project root directory, create a new *router folder* to store all the routing modules
   
   > In the routing module, only the mapping between the client's request and the processing function is stored
2. In the project root directory, create a new *router_handler* folder to store all the `router` handler modules
   
   > The route handler module is dedicated to holding the corresponding handler functions for each route

### 1.5 Initialize user routing module

1. In the `router` folder, create a new `user.js` file, ** as a routing module for the user, and initialize the code** as follows.

```js
const express = require('express')
 
// Create a routing object, using the constant router to receive
const router = express.Router()


/////////////////////////////////
/* Mount two routes, listen to client requests */
// Register new users
router.post('/regUser', (req, res) => {
  res.send('reguser OK')
})

// Login
router.post('/login', (req, res) => {
  res.send('login OK')
})

// Share the routing object, and then import and use the user module in app.js
module.exports = router
```

2. In `app.js`, import and use the `User Routing Module`.

```js
//////////////////// import and register the userRouter module ð
const userRouter = require('. /router/user')
/* Register as a routing module with app.use, /api means that each module inside userRouter must be prefixed with /api when accessed */
app.use('/api', userRouter)
```

### 1.6 Abstraction of processing functions in the user routing module

> > Purpose: To ensure the purity of the `Route module`, all `Route handler functions` must be abstracted to the corresponding `Route handler module`.
>
> 1. In `/router_handler/user.js, use the exports object to share the following two routing functions with the outside.

```js
/**
 * Define user-related route handling functions here for the /router/user.js module to call
 */

// Handler function for registered users
exports.regUser = (req, res) => {
  res.send('reguser OK')
}

// Login processing function
exports.login = (req, res) => {
  res.send('login OK')
}
```

2. Change the code in /router/user.js to the following structure.

```js
const express = require('express')
const router = express.Router()

// Import User Route Handler Module
const userHandler = require('../router_handler/user')

/* ârouter.post("/regUser", (req, res) => {
  res.send("request successfully");
}); */
// Modify the above code to ð, abstracting out the handler function in the user routing module

// Register a new user
router.post('/regUser', userHandler.regUser)
// Login
router.post('/login', userHandler.login)

module.exports = router
```

# â³ï¸2. Login and Registration

### 2.1 Create a new ev_users table

1. In the `my_db_01` database, create a new ev_users table as follows.
   ```sql
   CREATE TABLE `blog_db_2023`.`ev_users` (
     `id` INT NOT NULL AUTO_INCREMENT,
     `username` VARCHAR(255) NOT NULL,
     `password` VARCHAR(255) NOT NULL,
     `nickname` VARCHAR(255) NULL,
     `email` VARCHAR(255) NULL,
     `user_pic` VARCHAR(255) NULL COMMENT 'User information table',
     PRIMARY KEY (`id`),
     UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
     UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);
   
   ```

### 2.2 Install and configure the mysql module

> In the API interface project, you need to install and configure `mysql`, a third-party module to connect and manipulate MySQL databases

1. Run the following command to install the `mysql` module.

```bash
npm i mysql@2.18.1
```

2. Create a new `/db/index.js` file in the root of the project and create the database connection object in this custom module.

```js
// 1. import mysql module
const mysql = require('mysql')

// 2. Create a connection to the MySQL database ~
const db = mysql.createPool({
  host: "127.0.0.1", // IP address of the database
  user: "root", // account to login to the database
  password: "yuimorii", // password to log in to the database
  database: "blog_db_2023", // specify which database to operate
});


// Share the db database connection object externally
module.exports = db
```

### 2.3 Registration

#### 2.3.0 Implementation steps

1. detect whether the form data is legal
2. detect whether the user name is occupied
3. encrypt the password
4. insert new user

#### 2.3.1 Detecting the legality of form data

1. Determine if the username and password are empty

```js
// Receive form data
const userinfo = req.body
// Determine if the data is legitimate
if (!userinfo.username || !userinfo.password) {
  return res.send({ status: 1, message: 'Username or password cannot be empty! })
}
```

#### 2.3.2 Detecting whether the user name is occupied

1. Importing database operation modules.

```js
const db = require('../db/index')
```

2. Define the SQL statement.

```js
const sql = `select * from ev_users where username=?`
```

3. Execute the SQL statement and determine if the user name is occupied based on the result.

```js
db.query(sql, [userinfo.username], function (err, results) {
  // Failed to execute SQL statement
  if (err) {
    return res.send({ status: 1, message: err.message })
  }
  // Username is occupied
  if (results.length > 0) {
    return res.send({ status: 1, message: 'Username is taken, please change to another username! })
  }
  // TODO: Username available, continue the process...
})
```

In the db, add username: admin password: 000000

```sql
UPDATE `blog_db_2023`.`ev_users` SET `username` = 'admin' WHERE (`id` = '1');

```



> 2.3.3 Encryption of passwords In order to ensure the security of passwords, it is not recommended to store user passwords in the form of `plaintext` in the database, it is recommended to `encrypted storage` of passwords

---

In the current project, user passwords are encrypted using `bcryptjs`, with the following advantages.

- The encrypted password cannot be cracked in reverse.
- The same plaintext password is encrypted multiple times, and the encryption results are different, ensuring security.

---

1. Run the following command to install the specified version of bcryptjs.

```bash
npm i bcryptjs@2.4.3
```

2. In `/router_handler/user.js`, import bcryptjs

```js
const bcrypt = require('bcryptjs')
```

3. After confirming the availability of the username in the user registration handler, the `bcrypt.hashSync`(plaintext password, length of random salt) method is called to encrypt the user's password.

```js
// Encrypt the user's password with bcrype, the return value is the encrypted password string
userinfo.password = bcrypt.hashSync(userinfo.password, 10)
```

#### 2.3.4 Insert new user

1. Define the SQL statement that inserts the user.

```js
const sql = 'insert into ev_users set ?'
```

2. Call `db.query()` to execute the SQL statement that inserts the new user.

```js
db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
  // Failed to execute SQL statement
  if (err) returns res.send({ status: 1, message: err.message })
  // execution of the SQL statement succeeds, but the number of rows affected is not 1
  if (results.affectedRows ! == 1) {
    return res.send({ status: 1, message: 'Failed to register user, please try again later! })
  }
  // Registration was successful
  res.send({ status: 0, message: 'Registration was successful! })
})
```

### 2.4 Optimizing the res.send() code

> In the processing function, you need to call `res.send()` several times to respond to the client with the result of `processing failure`, in order to simplify the code, you can manually encapsulate a res.encap() function

1. In `app.js`, before all routes, declare a global middleware that mounts a `res.encap()` function for the res object.

```js
// Middleware for response data
app.use(function (req, res, next) {
  // status = 0 for success; status = 1 for failure; set status to 1 by default to handle failure cases
  res.encap = function (err, status = 1) {
    res.send({
      // status
      status,
      // status description, determine if err is an error object or a string
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})
```

### 2.5 [Optimize form data validation](https://www.npmjs.com/package/express-joi-validation?activeTab=readme#validatorparamsschema-options)

> The principle of form validation: front-end validation is complementary, back-end validation is primary, and the back-end should never trust any content submitted by the front-end

In actual development, both front and back ends need to verify the legality of the form data, and the back end plays a crucial role in intercepting illegal data as the last gate of data legality verification.

### #joi official case

> Installation

```js
npm install @escook/express-joi
```

>  Dependency

```js
npm install joi@17.4.0
```

> Import

```js
const expressJoi = require('@escook/express-joi')
```

> Use (in development, userSchema is written in a separate schema file that contains validation rules and then exported)

```js
const express = require('express')
const app = express()
// Import Joi to define validation rules
const Joi = require('joi')
// 1. import @escook/express-joi
const expressJoi = require('@escook/express-joi')

// Parse the form data in x-www-form-urlencoded format
app.use(express.urlencoded({ extended: false }))

// 2. Define the validation rule object userSchema
// Note: If the client submits some parameter items that are not defined in the schema
// In this case, these extra parameter items will be ignored by default
const userSchema = {
  // 2.1 Validate the data in req.body (form)
  body: {
    username: Joi.string().alphanum().min(3).max(12).required(),
    password: Joi.string()
      .pattern(/^[\S]{6,15}$/) //.pattern can define regular expressions
      .required(),
    repassword: Joi.ref('password')
  },
  // 2.2 Verify the data in req.query()
  query: {
    name: Joi.string().alphanum().min(3).required(),
    age: Joi.number().integer().min(1).max(100).required()
  },
  // 2.3 Validate the data in req.params (the data in the URL)
  params: {
    id: Joi.number().integer().min(0).required()
  }
}

// 3. Call the middleware for parameter validation by expressJoi(userSchema) in the route
// (partial middleware) =>
app.post('/adduser/:id', expressJoi(userSchema), function (req, res) {
  const body = req.body
  res.send(body)
})

// 4.1 Error-level middleware
app.use(function (err, req, res, next) {
  // 4.1 Joi parameter validation failure
  if (err instanceof Joi.ValidationError) {
    return res.send({
      status: 1,
      message: err.message
    })
  }
  // 4.2 Unknown error
  res.send({
    status: 1,
    message: err.message
  })
})
 
```
Implementation Defining Validation Rules For more validation rules, please refer to the official documentation of [Joi](https://joi.dev/).
> Simply using `if... .else... ` is inefficient, has a high error rate, and is poorly maintained. Therefore, it is recommended to use **third-party data validation modules** to reduce the error rate, improve the efficiency and maintainability of validation, and **let back-end programmers focus more on the processing of core business logic**.

### Optimize form data validation CODE

1. Install the `@hapi/joi` package and define validation rules for each data item carried in the form.

```bash
npm install @hapi/joi@17.1.0
```

2. Install the `@escook/express-joi` middleware to automate the validation of form data.

```bash
npm i @escook/express-joi
```

3. Create a new `/schema/user.js` user information validation rules module and initialize the code as follows.

```js
const joi = require('@hapi/joi')

/**
 * string() value must be a string
 * alphanum() value can only be a string containing a-zA-Z0-9
 * min(length) minimum length
 * max(length) Maximum length
 * required() value is required and cannot be undefined
 * pattern(regular expression) values must conform to the rules of regular expressions
 */

// Username validation rules
const username = joi.string().alphanum().min(1).max(10).required()
// Password validation rules
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required()

// Validation rule object for registration and login forms
exports.reg_login_schema = {
  // indicates that the data in req.body needs to be validated
  body: {
    username,
    password,
  },
}
```

4. Modify the code in `/router/user.js` as follows.
   
   > ð If the server's registration form data is validated against the validation rule object defined  in the schema just now

```js
/* TODO: The router folder is dedicated to all routing modules. The routing module,
  value holds the mapping between interoperable requests and handler functions; */

//ðuser.js is used as the user's routing module, and initialized with the following code ð

//import express
const express = require("express");
// Create the routing object, using the constant router to receive it
const router = express;
//import the user route handler module
const user_handler = require("... /router_handler/user");

//1. import the middleware for validating form data
const expressJoi = require("@escook/express-joi");
//2. import the rule object to be validated
const { reg_login_schema } = require(". /schema/user");

//////////////////////// mounts two routes and listens to the client's requests

// 3. In the route for registering a new user, declare a local middleware that validates the data carried in the current request
// 3.1 If the data validation passes, the request will be forwarded to a later routing function
// 3.2 If the data validation fails, the execution of the subsequent code is terminated and a global Error error is thrown into the global error level middleware for processing

// Register a new user
router.post("/reguser", expressJoi(reg_login_schema), user_handler.regUser);
//login
router.post("/login", user_handler.login);

//expose it, then import and use the user module in app.js
module.exports = router;

```

5. In the global error level middleware of `app.js`, catch the validation failure error and respond to the client with the result of the validation failure.

```js
// Define error-level middleware
app.use((err, req, res, next) => {
  // Error due to validation failure
  if (err instanceof joi.ValidationError) return res.encap(err);
  // error after authentication failure
  if (err.name === "UnauthorizedError") return res.encap("Authentication failed!") ;
  // Unknown error
  res.encap(err);
});
```

### Reported error @hapi/joi third party package not available

If an error is reported @hapi/joi third-party package is not available, you need to download another version; use the third-party package @hapi/joi to define [form](https://so.csdn.net/so/search?q=è¡¨å&spm=1001.2101.3001.7020) validation rules, then use postman to detect the Return error as`Cannot mix different versions of joi schemas`

Solution: Run the following command to reinstall the third-party package

```javascript
npm i joi
```

Change the imported @hapi/joi to joi

```javascript
change
const joi = require("@hapi/joi")
toï¼
const joi = require("joi")
 
```

### 2.6 Login

#### 2.6.0 Implementation steps

1. Check whether the form data is legitimate or not
1. Query user data based on user name
1. Determine if the password entered by the user is correct
1. Generate Token string for JWT

#### 2.6.1 æ£æµç»å½è¡¨åçæ°æ®æ¯å¦åæ³

1. å° `/router/user.js` ä¸­ `ç»å½` çè·¯ç±ä»£ç ä¿®æ¹å¦ä¸ï¼

```js
// ç»å½çè·¯ç±
router.post('/login', expressJoi(reg_login_schema), userHandler.login)
```

#### 2.6.2 æ ¹æ®ç¨æ·åæ¥è¯¢ç¨æ·çæ°æ®

1. æ¥æ¶è¡¨åæ°æ®ï¼

```js
const userinfo = req.body
```

2. å®ä¹ SQL è¯­å¥ï¼

```js
const sql = `select * from ev_users where username=?`
```

3. æ§è¡ SQL è¯­å¥ï¼æ¥è¯¢ç¨æ·çæ°æ®ï¼

```js
db.query(sql, userinfo.username, function (err, results) {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)
  // æ§è¡ SQL è¯­å¥æåï¼ä½æ¯æ¥è¯¢å°æ°æ®æ¡æ°ä¸ç­äº 1
  if (results.length !== 1) return res.encap('ç»å½å¤±è´¥ï¼')
  // TODOï¼å¤æ­ç¨æ·è¾å¥çç»å½å¯ç æ¯å¦åæ°æ®åºä¸­çå¯ç ä¸è´
})
```

#### 2.6.3 å¤æ­ç¨æ·è¾å¥çå¯ç æ¯å¦æ­£ç¡®

> æ ¸å¿å®ç°æè·¯ï¼è°ç¨ `bcrypt.compareSync(ç¨æ·æäº¤çå¯ç , æ°æ®åºä¸­çå¯ç )` æ¹æ³æ¯è¾å¯ç æ¯å¦ä¸è´

> è¿åå¼æ¯å¸å°å¼ï¼true ä¸è´ãfalse ä¸ä¸è´ï¼

å·ä½çå®ç°ä»£ç å¦ä¸ï¼

```js
// æ¿çç¨æ·è¾å¥çå¯ç ,åæ°æ®åºä¸­å­å¨çå¯ç è¿è¡å¯¹æ¯
const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)

// å¦æå¯¹æ¯çç»æç­äº false, åè¯æç¨æ·è¾å¥çå¯ç éè¯¯
if (!compareResult) {
  return res.encap('ç»å½å¤±è´¥ï¼')
}

// TODOï¼ç»å½æåï¼çæ Token å­ç¬¦ä¸²
```

#### 2.6.4 çæ JWT ç Token å­ç¬¦ä¸²

> æ ¸å¿æ³¨æç¹ï¼å¨çæ Token å­ç¬¦ä¸²çæ¶åï¼ä¸å®è¦åé¤ **å¯ç ** å **å¤´å** çå¼

1. éè¿ ES6 çé«çº§è¯­æ³ï¼å¿«éåé¤ `å¯ç ` å `å¤´å` çå¼ï¼

```js
// åé¤å®æ¯ä¹åï¼user ä¸­åªä¿çäºç¨æ·ç id, username, nickname, email è¿åä¸ªå±æ§çå¼
const user = { ...results[0], password: '', user_pic: '' }
```

2. è¿è¡å¦ä¸çå½ä»¤ï¼å®è£çæ Token å­ç¬¦ä¸²çåï¼

```bash
npm i jsonwebtoken@8.5.1
```

3. å¨ `/router_handler/user.js` æ¨¡åçå¤´é¨åºåï¼å¯¼å¥ `jsonwebtoken` åï¼

```js
// ç¨è¿ä¸ªåæ¥çæ Token å­ç¬¦ä¸²
const jwt = require('jsonwebtoken')
```

4. åå»º `config.js` æä»¶ï¼å¹¶åå¤å±äº« **å å¯** å **è¿å** Token ç `jwtSecretKey` å­ç¬¦ä¸²ï¼

```js
module.exports = {
  jwtSecretKey: 'itheima No1. ^_^',
}
```

5. å°ç¨æ·ä¿¡æ¯å¯¹è±¡å å¯æ Token å­ç¬¦ä¸²ï¼

```js
// å¯¼å¥éç½®æä»¶
const config = require('../config')

// çæ Token å­ç¬¦ä¸²
const tokenStr = jwt.sign(user, config.jwtSecretKey, {
  expiresIn: '10h', // token æææä¸º 10 ä¸ªå°æ¶
})
```

6. å°çæç Token å­ç¬¦ä¸²ååºç»å®¢æ·ç«¯ï¼

```js
res.send({
  status: 0,
  message: 'ç»å½æåï¼',
  // ä¸ºäºæ¹ä¾¿å®¢æ·ç«¯ä½¿ç¨ Tokenï¼å¨æå¡å¨ç«¯ç´æ¥æ¼æ¥ä¸ Bearer çåç¼
  token: 'Bearer ' + tokenStr,
})
```

### 2.7 éç½®è§£æ Token çä¸­é´ä»¶

> ä½¿ç¨åºæ¯: å ä¸ºæå¡å¨ç«¯å·²ç»éç½®çætokençè¿ç¨, ä½æ¯ä»¥åå½å®¢æ·ç«¯å¯å¨ä¸äºææéæ¥å£çæ¶åæ¯éè¦èº«ä»½ðè®¤è¯ç, é£ä¹è¿ä¸ªæ¶å,å°±éè¦æç¨æ·ä¿¡æ¯ä»tokenè¿ååæ¥ 

1. è¿è¡å¦ä¸çå½ä»¤ï¼å®è£è§£æ Token çä¸­é´ä»¶ï¼

```js
npm i express-jwt@5.3.3
```

2. å¨ `app.js` ä¸­æ³¨åè·¯ç±ä¹åï¼éç½®è§£æ Token çä¸­é´ä»¶ï¼

```js
 // å¯¼å¥éç½®æä»¶
const { expressjwt } = require("express-jwt");

// è§£æ token çä¸­é´ä»¶
const config = require("./config");

// ä½¿ç¨ .unless({ path: [/^\/api\//] }) æå®åªäºæ¥å£ä¸éè¦è¿è¡ Token çèº«ä»½è®¤è¯
app.use(
  expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/],
  })
);

```

3. å¨ `app.js` ä¸­ç `éè¯¯çº§å«ä¸­é´ä»¶` éé¢ï¼æè·å¹¶å¤ç Token è®¤è¯å¤±è´¥åçéè¯¯ï¼

```js
// éè¯¯ä¸­é´ä»¶
app.use(function (err, req, res, next) {
  // çç¥å¶å®ä»£ç ...

  // æè·èº«ä»½è®¤è¯å¤±è´¥çéè¯¯
  if (err.name === 'UnauthorizedError') return res.encap('èº«ä»½è®¤è¯å¤±è´¥ï¼')

  // æªç¥éè¯¯...
})
```

# â³ï¸3. ä¸ªäººä¸­å¿

### 3.1 è·åç¨æ·çåºæ¬ä¿¡æ¯

#### 3.1.0 å®ç°æ­¥éª¤

1. åå§å **è·¯ç±** æ¨¡å
2. åå§å **è·¯ç±å¤çå½æ°** æ¨¡å
3. è·åç¨æ·çåºæ¬ä¿¡æ¯

#### 3.1.1 åå§åè·¯ç±æ¨¡å

1. åå»º `/router/userinfo.js` è·¯ç±æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// å¯¼å¥ express
const express = require('express')
// åå»ºè·¯ç±å¯¹è±¡
const router = express.Router()

// è·åç¨æ·çåºæ¬ä¿¡æ¯
router.get('/userinfo', (req, res) => {
  res.send('ok')
})

// åå¤å±äº«è·¯ç±å¯¹è±¡
module.exports = router
```

2. å¨ `app.js` ä¸­å¯¼å¥å¹¶ä½¿ç¨ä¸ªäººä¸­å¿çè·¯ç±æ¨¡åï¼

```js
// å¯¼å¥å¹¶ä½¿ç¨ç¨æ·ä¿¡æ¯è·¯ç±æ¨¡å
const userinfoRouter = require('./router/userinfo')
// æ³¨æï¼ä»¥ /my å¼å¤´çæ¥å£ï¼é½æ¯ææéçæ¥å£ï¼éè¦è¿è¡ Token èº«ä»½è®¤è¯
app.use('/my', userinfoRouter)
```

#### 3.1.2 åå§åè·¯ç±å¤çå½æ°æ¨¡å

1. åå»º `/router_handler/userinfo.js` è·¯ç±å¤çå½æ°æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// è·åç¨æ·åºæ¬ä¿¡æ¯çå¤çå½æ°
exports.getUserInfo = (req, res) => {
  res.send('ok')
}
```

2. ä¿®æ¹ `/router/userinfo.js` ä¸­çä»£ç å¦ä¸ï¼

```js
const express = require('express')
const router = express.Router()

// å¯¼å¥ç¨æ·ä¿¡æ¯çå¤çå½æ°æ¨¡å
const userinfo_handler = require('../router_handler/userinfo')

// è·åç¨æ·çåºæ¬ä¿¡æ¯
router.get('/userinfo', userinfo_handler.getUserInfo)

module.exports = router
```

#### 3.1.3 è·åç¨æ·çåºæ¬ä¿¡æ¯

1. å¨ `/router_handler/userinfo.js` å¤´é¨å¯¼å¥æ°æ®åºæä½æ¨¡åï¼

```js
//è·åç¨æ·åºæ¬ä¿¡æ¯çå¤çå½æ°
exports.getUserInfo = (req, res) => {
  //å¯¼å¥æ°æ®åºæ¨¡å
  const db = require("../db/index");
```

2. å®ä¹ SQL è¯­å¥ï¼

```js

  // å®ä¹æ¥è¯¢ç¨æ·ä¿¡æ¯çsqlè¯­å¥
  // æ ¹æ®ç¨æ·ç idï¼æ¥è¯¢ç¨æ·çåºæ¬ä¿¡æ¯
  // æ³¨æï¼ä¸ºäºé²æ­¢ç¨æ·çå¯ç æ³é²ï¼éè¦æé¤ password å­æ®µ
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;
```

3. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥ï¼

```js
  //è°ç¨db.queryæ§è¡sql è¯­å¥
  // æ³¨æï¼req å¯¹è±¡ä¸ç user å±æ§ï¼æ¯ Token è§£ææåï¼express-jwt ä¸­é´ä»¶å¸®æä»¬æè½½ä¸å»ç
  db.query(sql, req.auth.id, (err, results) => {
    // 1. æ§è¡ SQL è¯­å¥å¤±è´¥
    if (err) return res.encap(err);

    // 2. æ§è¡ SQL è¯­å¥æåï¼ä½æ¯æ¥è¯¢å°çæ°æ®æ¡æ°ä¸ç­äº 1
    if (results.length !== 1) return res.encap("è·åç¨æ·ä¿¡æ¯å¤±è´¥ï¼");

    // 3. å°ç¨æ·ä¿¡æ¯ååºç»å®¢æ·ç«¯
    res.send({
      status: 0,
      message: "è·åç¨æ·åºæ¬ä¿¡æ¯æåï¼",
      data: results[0],
    });
  });
  //   res.send("ok");
};

```

### 3.2 æ´æ°ç¨æ·çåºæ¬ä¿¡æ¯

#### 3.2.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. å®ç°æ´æ°ç¨æ·åºæ¬ä¿¡æ¯çåè½

#### 3.2.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼æ°å¢ `æ´æ°ç¨æ·åºæ¬ä¿¡æ¯` çè·¯ç±ï¼

```js
// æ´æ°ç¨æ·çåºæ¬ä¿¡æ¯
router.post('/userinfo', userinfo_handler.updateUserInfo)
```

2. å¨ `/router_handler/userinfo.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `æ´æ°ç¨æ·åºæ¬ä¿¡æ¯` çè·¯ç±å¤çå½æ°ï¼

```js
// æ´æ°ç¨æ·åºæ¬ä¿¡æ¯çå¤çå½æ°
exports.updateUserInfo = (req, res) => {
  res.send('ok')
}
```

#### 3.2.2 éªè¯è¡¨åæ°æ®

> ä½¿ç¨åºæ¯: å¯¹ç¨æ·æäº¤çæ°æ®âåæ³æ§âè¿è¡éªè¯

1. å¨ `/schema/user.js` éªè¯è§åæ¨¡åä¸­ï¼å®ä¹ `id`ï¼`nickname`ï¼`email` çéªè¯è§åå¦ä¸ï¼

```js
// å®ä¹ id, nickname, emial çéªè¯è§å
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()
```

2. å¹¶ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

   > åªæä¸ä¸ªbodyå±æ§ 

```js
// éªè¯è§åå¯¹è±¡ - æ´æ°ç¨æ·åºæ¬ä¿¡æ¯
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email,
  },
}
```

3. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼å¯¼å¥éªè¯æ°æ®åæ³æ§çä¸­é´ä»¶ï¼

```js
// å¯¼å¥éªè¯æ°æ®åæ³æ§çä¸­é´ä»¶
const expressJoi = require('@escook/express-joi')
```

4. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼

```js
// å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡
const { update_userinfo_schema } = require('../schema/user')
```

5. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼ä¿®æ¹ `æ´æ°ç¨æ·çåºæ¬ä¿¡æ¯` çè·¯ç±å¦ä¸ï¼

```js
// æ´æ°ç¨æ·çåºæ¬ä¿¡æ¯
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)
```

#### 3.2.3 å®ç°æ´æ°ç¨æ·åºæ¬ä¿¡æ¯çåè½

1. å®ä¹å¾æ§è¡ç SQL è¯­å¥ï¼

```js
const sql = `update ev_users set ? where id=?`
```

2. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥å¹¶ä¼ åï¼

```js
db.query(sql, [req.body, req.body.id], (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // æ§è¡ SQL è¯­å¥æåï¼ä½å½±åè¡æ°ä¸ä¸º 1
  if (results.affectedRows !== 1) return res.encap('ä¿®æ¹ç¨æ·åºæ¬ä¿¡æ¯å¤±è´¥ï¼')

  // ä¿®æ¹ç¨æ·ä¿¡æ¯æå
  return res.encap('ä¿®æ¹ç¨æ·åºæ¬ä¿¡æ¯æåï¼', 0)
})
```

### 3.3 éç½®å¯ç 

#### 3.3.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. å®ç°éç½®å¯ç çåè½

#### 3.3.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼æ°å¢ `éç½®å¯ç ` çè·¯ç±ï¼

```js
// éç½®å¯ç çè·¯ç±
router.post('/updatepwd', userinfo_handler.updatePassword)
```

2. å¨ `/router_handler/userinfo.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `éç½®å¯ç ` çè·¯ç±å¤çå½æ°ï¼

```js
// éç½®å¯ç çå¤çå½æ°
exports.updatePassword = (req, res) => {
  res.send('ok')
}
```

#### 3.3.2 éªè¯è¡¨åæ°æ®

> æ ¸å¿éªè¯æè·¯ï¼æ§å¯ç ä¸æ°å¯ç ï¼å¿é¡»ç¬¦åå¯ç çéªè¯è§åï¼å¹¶ä¸æ°å¯ç ä¸è½ä¸æ§å¯ç ä¸è´ï¼

1. å¨ `/schema/user.js` æ¨¡åä¸­ï¼ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

```js
// éªè¯è§åå¯¹è±¡ - éç½®å¯ç 
exports.update_password_schema = {
  body: {
    // ä½¿ç¨ password è¿ä¸ªè§åï¼éªè¯ req.body.oldPwd çå¼
    oldPwd: password,
    // ä½¿ç¨ joi.not(joi.ref('oldPwd')).concat(password) è§åï¼éªè¯ req.body.newPwd çå¼
    // è§£è¯»ï¼
    // 1. joi.ref('oldPwd') è¡¨ç¤º newPwd çå¼å¿é¡»å oldPwd çå¼ä¿æä¸è´
    // 2. joi.not(joi.ref('oldPwd')) è¡¨ç¤º newPwd çå¼ä¸è½ç­äº oldPwd çå¼
    // 3. .concat() ç¨äºåå¹¶ joi.not(joi.ref('oldPwd')) å password è¿ä¸¤æ¡éªè¯è§å
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
  },
}
```

2. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼

```js
// å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡
const { update_userinfo_schema, update_password_schema } = require('../schema/user')
```

3. å¹¶å¨ `éç½®å¯ç çè·¯ç±` ä¸­ï¼ä½¿ç¨ `update_password_schema` è§åéªè¯è¡¨åçæ°æ®ï¼ç¤ºä¾ä»£ç å¦ä¸ï¼

```js
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handler.updatePassword)
```

#### 3.3.3 å®ç°éç½®å¯ç çåè½

1. æ ¹æ® `id` æ¥è¯¢ç¨æ·æ¯å¦å­å¨ï¼

```js
// å®ä¹æ ¹æ® id æ¥è¯¢ç¨æ·æ°æ®ç SQL è¯­å¥
const sql = `select * from ev_users where id=?`

// æ§è¡ SQL è¯­å¥æ¥è¯¢ç¨æ·æ¯å¦å­å¨
db.query(sql, req.user.id, (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // æ£æ¥æå® id çç¨æ·æ¯å¦å­å¨
  if (results.length !== 1) return res.encap('ç¨æ·ä¸å­å¨ï¼')

  // TODOï¼å¤æ­æäº¤çæ§å¯ç æ¯å¦æ­£ç¡®
})
```

2. å¤æ­æäº¤ç **æ§å¯ç ** æ¯å¦æ­£ç¡®ï¼

```js
// å¨å¤´é¨åºåå¯¼å¥ bcryptjs åï¼
// å³å¯ä½¿ç¨ bcrypt.compareSync(æäº¤çå¯ç ï¼æ°æ®åºä¸­çå¯ç ) æ¹æ³éªè¯å¯ç æ¯å¦æ­£ç¡®
// compareSync() å½æ°çè¿åå¼ä¸ºå¸å°å¼ï¼true è¡¨ç¤ºå¯ç æ­£ç¡®ï¼false è¡¨ç¤ºå¯ç éè¯¯
const bcrypt = require('bcryptjs')

// å¤æ­æäº¤çæ§å¯ç æ¯å¦æ­£ç¡®
const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
if (!compareResult) return res.encap('åå¯ç éè¯¯ï¼')
```

3. å¯¹æ°å¯ç è¿è¡ `bcrypt` å å¯ä¹åï¼æ´æ°å°æ°æ®åºä¸­ï¼

```js
// å®ä¹æ´æ°ç¨æ·å¯ç ç SQL è¯­å¥
const sql = `update ev_users set password=? where id=?`

// å¯¹æ°å¯ç è¿è¡ bcrypt å å¯å¤ç
const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

// æ§è¡ SQL è¯­å¥ï¼æ ¹æ® id æ´æ°ç¨æ·çå¯ç 
db.query(sql, [newPwd, req.user.id], (err, results) => {
  // SQL è¯­å¥æ§è¡å¤±è´¥
  if (err) return res.encap(err)

  // SQL è¯­å¥æ§è¡æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('æ´æ°å¯ç å¤±è´¥ï¼')

  // æ´æ°å¯ç æå
  res.encap('æ´æ°å¯ç æåï¼', 0)
})
```

### 3.4 æ´æ°ç¨æ·å¤´å

#### 3.4.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. å®ç°æ´æ°ç¨æ·å¤´åçåè½

#### 3.4.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼æ°å¢ `æ´æ°ç¨æ·å¤´å` çè·¯ç±ï¼

```js
// æ´æ°ç¨æ·å¤´åçè·¯ç±
router.post('/update/avatar', userinfo_handler.updateAvatar)
```

2. å¨ `/router_handler/userinfo.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `æ´æ°ç¨æ·å¤´å` çè·¯ç±å¤çå½æ°ï¼

```js
// æ´æ°ç¨æ·å¤´åçå¤çå½æ°
exports.updateAvatar = (req, res) => {
  res.send('ok')
}
```

#### 3.4.2 éªè¯è¡¨åæ°æ®

1. å¨ `/schema/user.js` éªè¯è§åæ¨¡åä¸­ï¼å®ä¹ `avatar` çéªè¯è§åå¦ä¸ï¼

```js
// dataUri() æçæ¯å¦ä¸æ ¼å¼çå­ç¬¦ä¸²æ°æ®ï¼
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required()
```

2. å¹¶ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

```js
// éªè¯è§åå¯¹è±¡ - æ´æ°å¤´å
exports.update_avatar_schema = {
  body: {
    avatar,
  },
}
```

3. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼

```js
const { update_avatar_schema } = require('../schema/user')
```

4. å¨ `/router/userinfo.js` æ¨¡åä¸­ï¼ä¿®æ¹ `æ´æ°ç¨æ·å¤´å` çè·¯ç±å¦ä¸ï¼

```js
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)
```

#### 3.4.3 å®ç°æ´æ°ç¨æ·å¤´åçåè½

1. å®ä¹æ´æ°ç¨æ·å¤´åç SQL è¯­å¥ï¼

```js
const sql = 'update ev_users set user_pic=? where id=?'
```

2. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥ï¼æ´æ°å¯¹åºç¨æ·çå¤´åï¼

```js
db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // æ§è¡ SQL è¯­å¥æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('æ´æ°å¤´åå¤±è´¥ï¼')

  // æ´æ°ç¨æ·å¤´åæå
  return res.encap('æ´æ°å¤´åæåï¼', 0)
})
```

## 4. æç« åç±»ç®¡ç

### 4.1 æ°å»º ev_article_cate è¡¨

#### 4.1.1 åå»ºè¡¨ç»æ

![æç« åç±»è¡¨ç»æ](./images/2.jpg)

#### 4.1.2 æ°å¢ä¸¤æ¡åå§æ°æ®

![æç« åç±»è¡¨ç»æ](./images/3.jpg)

### 4.2 è·åæç« åç±»åè¡¨

#### 4.2.0 å®ç°æ­¥éª¤

1. åå§åè·¯ç±æ¨¡å
2. åå§åè·¯ç±å¤çå½æ°æ¨¡å
3. è·åæç« åç±»åè¡¨æ°æ®

#### 4.2.1 åå§åè·¯ç±æ¨¡å

1. åå»º `/router/artcate.js` è·¯ç±æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// å¯¼å¥ express
const express = require('express')
// åå»ºè·¯ç±å¯¹è±¡
const router = express.Router()

// è·åæç« åç±»çåè¡¨æ°æ®
router.get('/cates', (req, res) => {
  res.send('ok')
})

// åå¤å±äº«è·¯ç±å¯¹è±¡
module.exports = router
```

2. å¨ `app.js` ä¸­å¯¼å¥å¹¶ä½¿ç¨æç« åç±»çè·¯ç±æ¨¡åï¼

```js
// å¯¼å¥å¹¶ä½¿ç¨æç« åç±»è·¯ç±æ¨¡å
const artCateRouter = require('./router/artcate')
// ä¸ºæç« åç±»çè·¯ç±æè½½ç»ä¸çè®¿é®åç¼ /my/article
app.use('/my/article', artCateRouter)
```

#### 4.2.2 åå§åè·¯ç±å¤çå½æ°æ¨¡å

1. åå»º `/router_handler/artcate.js` è·¯ç±å¤çå½æ°æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// è·åæç« åç±»åè¡¨æ°æ®çå¤çå½æ°
exports.getArticleCates = (req, res) => {
  res.send('ok')
}
```

2. ä¿®æ¹ `/router/artcate.js` ä¸­çä»£ç å¦ä¸ï¼

```js
const express = require('express')
const router = express.Router()

// å¯¼å¥æç« åç±»çè·¯ç±å¤çå½æ°æ¨¡å
const artcate_handler = require('../router_handler/artcate')

// è·åæç« åç±»çåè¡¨æ°æ®
router.get('/cates', artcate_handler.getArticleCates)

module.exports = router
```

#### 4.2.3 è·åæç« åç±»åè¡¨æ°æ®

1. å¨ `/router_handler/artcate.js` å¤´é¨å¯¼å¥æ°æ®åºæä½æ¨¡åï¼

```js
// å¯¼å¥æ°æ®åºæä½æ¨¡å
const db = require('../db/index')
```

2. å®ä¹ SQL è¯­å¥ï¼

```js
// æ ¹æ®åç±»çç¶æï¼è·åæææªè¢«å é¤çåç±»åè¡¨æ°æ®
// is_delete ä¸º 0 è¡¨ç¤ºæ²¡æè¢« æ è®°ä¸ºå é¤ çæ°æ®
const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
```

3. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥ï¼

```js
db.query(sql, (err, results) => {
  // 1. æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // 2. æ§è¡ SQL è¯­å¥æå
  res.send({
    status: 0,
    message: 'è·åæç« åç±»åè¡¨æåï¼',
    data: results,
  })
})
```

### 4.3 æ°å¢æç« åç±»

#### 4.3.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. æ¥è¯¢ `åç±»åç§°` ä¸ `åç±»å«å` æ¯å¦è¢«å ç¨
4. å®ç°æ°å¢æç« åç±»çåè½

#### 4.3.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼æ·»å  `æ°å¢æç« åç±»` çè·¯ç±ï¼

```js
// æ°å¢æç« åç±»çè·¯ç±
router.post('/addcates', artcate_handler.addArticleCates)
```

2. å¨ `/router_handler/artcate.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `æ°å¢æç« åç±»` çè·¯ç±å¤çå½æ°ï¼

```js
// æ°å¢æç« åç±»çå¤çå½æ°
exports.addArticleCates = (req, res) => {
  res.send('ok')
}
```

#### 4.3.2 éªè¯è¡¨åæ°æ®

1. åå»º `/schema/artcate.js` æç« åç±»æ°æ®éªè¯æ¨¡åï¼å¹¶å®ä¹å¦ä¸çéªè¯è§åï¼

```js
// å¯¼å¥å®ä¹éªè¯è§åçæ¨¡å
const joi = require('@hapi/joi')

// å®ä¹ åç±»åç§° å åç±»å«å çæ ¡éªè§å
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// æ ¡éªè§åå¯¹è±¡ - æ·»å åç±»
exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
}
```

2. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼ä½¿ç¨ `add_cate_schema` å¯¹æ°æ®è¿è¡éªè¯ï¼

```js
// å¯¼å¥éªè¯æ°æ®çä¸­é´ä»¶
const expressJoi = require('@escook/express-joi')
// å¯¼å¥æç« åç±»çéªè¯æ¨¡å
const { add_cate_schema } = require('../schema/artcate')

// æ°å¢æç« åç±»çè·¯ç±
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCates)
```

#### 4.3.3 æ¥è¯¢åç±»åç§°ä¸å«åæ¯å¦è¢«å ç¨

1. å®ä¹æ¥éç SQL è¯­å¥ï¼

```js
// å®ä¹æ¥è¯¢ åç±»åç§° ä¸ åç±»å«å æ¯å¦è¢«å ç¨ç SQL è¯­å¥
const sql = `select * from ev_article_cate where name=? or alias=?`
```

2. è°ç¨ `db.query()` æ§è¡æ¥éçæä½ï¼

```js
// æ§è¡æ¥éæä½
db.query(sql, [req.body.name, req.body.alias], (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // å¤æ­ åç±»åç§° å åç±»å«å æ¯å¦è¢«å ç¨
  if (results.length === 2) return res.encap('åç±»åç§°ä¸å«åè¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')
  // åå«å¤æ­ åç±»åç§° å åç±»å«å æ¯å¦è¢«å ç¨
  if (results.length === 1 && results[0].name === req.body.name) return res.encap('åç±»åç§°è¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')
  if (results.length === 1 && results[0].alias === req.body.alias) return res.encap('åç±»å«åè¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')

  // TODOï¼æ°å¢æç« åç±»
})
```

#### 4.3.4 å®ç°æ°å¢æç« åç±»çåè½

1. å®ä¹æ°å¢æç« åç±»ç SQL è¯­å¥ï¼

```js
const sql = `insert into ev_article_cate set ?`
```

2. è°ç¨ `db.query()` æ§è¡æ°å¢æç« åç±»ç SQL è¯­å¥ï¼

```js
db.query(sql, req.body, (err, results) => {
  // SQL è¯­å¥æ§è¡å¤±è´¥
  if (err) return res.encap(err)

  // SQL è¯­å¥æ§è¡æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('æ°å¢æç« åç±»å¤±è´¥ï¼')

  // æ°å¢æç« åç±»æå
  res.encap('æ°å¢æç« åç±»æåï¼', 0)
})
```

### 4.4 æ ¹æ® Id å é¤æç« åç±»

#### 4.4.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. å®ç°å é¤æç« åç±»çåè½

#### 4.4.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼æ·»å  `å é¤æç« åç±»` çè·¯ç±ï¼

```js
// å é¤æç« åç±»çè·¯ç±
router.get('/deletecate/:id', artcate_handler.deleteCateById)
```

2. å¨ `/router_handler/artcate.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `å é¤æç« åç±»` çè·¯ç±å¤çå½æ°ï¼

```js
// å é¤æç« åç±»çå¤çå½æ°
exports.deleteCateById = (req, res) => {
  res.send('ok')
}
```

#### 4.4.2 éªè¯è¡¨åæ°æ®

1. å¨ `/schema/artcate.js` éªè¯è§åæ¨¡åä¸­ï¼å®ä¹ id çéªè¯è§åå¦ä¸ï¼

```js
// å®ä¹ åç±»Id çæ ¡éªè§å
const id = joi.number().integer().min(1).required()
```

2. å¹¶ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

```js
// æ ¡éªè§åå¯¹è±¡ - å é¤åç±»
exports.delete_cate_schema = {
  params: {
    id,
  },
}
```

3. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼å¹¶å¨è·¯ç±ä¸­ä½¿ç¨ï¼

```js
// å¯¼å¥å é¤åç±»çéªè¯è§åå¯¹è±¡
const { delete_cate_schema } = require('../schema/artcate')

// å é¤æç« åç±»çè·¯ç±
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)
```

#### 4.4.3 å®ç°å é¤æç« åç±»çåè½

1. å®ä¹å é¤æç« åç±»ç SQL è¯­å¥ï¼

```js
const sql = `update ev_article_cate set is_delete=1 where id=?`
```

2. è°ç¨ `db.query()` æ§è¡å é¤æç« åç±»ç SQL è¯­å¥ï¼

```js
db.query(sql, req.params.id, (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // SQL è¯­å¥æ§è¡æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('å é¤æç« åç±»å¤±è´¥ï¼')

  // å é¤æç« åç±»æå
  res.encap('å é¤æç« åç±»æåï¼', 0)
})
```

### 4.5 æ ¹æ® Id è·åæç« åç±»æ°æ®

#### 4.5.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. å®ç°è·åæç« åç±»çåè½

#### 4.5.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼æ·»å  `æ ¹æ® Id è·åæç« åç±»` çè·¯ç±ï¼

```js
router.get('/cates/:id', artcate_handler.getArticleById)
```

2. å¨ `/router_handler/artcate.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `æ ¹æ® Id è·åæç« åç±»` çè·¯ç±å¤çå½æ°ï¼

```js
// æ ¹æ® Id è·åæç« åç±»çå¤çå½æ°
exports.getArticleById = (req, res) => {
  res.send('ok')
}
```

#### 4.5.2 éªè¯è¡¨åæ°æ®

1. å¨ `/schema/artcate.js` éªè¯è§åæ¨¡åä¸­ï¼ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

```js
// æ ¡éªè§åå¯¹è±¡ - æ ¹æ® Id è·ååç±»
exports.get_cate_schema = {
  params: {
    id,
  },
}
```

2. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼å¹¶å¨è·¯ç±ä¸­ä½¿ç¨ï¼

```js
// å¯¼å¥æ ¹æ® Id è·ååç±»çéªè¯è§åå¯¹è±¡
const { get_cate_schema } = require('../schema/artcate')

// æ ¹æ® Id è·åæç« åç±»çè·¯ç±
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArticleById)
```

#### 4.5.3 å®ç°è·åæç« åç±»çåè½

1. å®ä¹æ ¹æ® Id è·åæç« åç±»ç SQL è¯­å¥ï¼

```js
const sql = `select * from ev_article_cate where id=?`
```

2. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥ï¼

```js
db.query(sql, req.params.id, (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // SQL è¯­å¥æ§è¡æåï¼ä½æ¯æ²¡ææ¥è¯¢å°ä»»ä½æ°æ®
  if (results.length !== 1) return res.encap('è·åæç« åç±»æ°æ®å¤±è´¥ï¼')

  // ææ°æ®ååºç»å®¢æ·ç«¯
  res.send({
    status: 0,
    message: 'è·åæç« åç±»æ°æ®æåï¼',
    data: results[0],
  })
})
```

### 4.6 æ ¹æ® Id æ´æ°æç« åç±»æ°æ®

#### 4.6.0 å®ç°æ­¥éª¤

1. å®ä¹è·¯ç±åå¤çå½æ°
2. éªè¯è¡¨åæ°æ®
3. æ¥è¯¢ `åç±»åç§°` ä¸ `åç±»å«å` æ¯å¦è¢«å ç¨
4. å®ç°æ´æ°æç« åç±»çåè½

#### 4.6.1 å®ä¹è·¯ç±åå¤çå½æ°

1. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼æ·»å  `æ´æ°æç« åç±»` çè·¯ç±ï¼

```js
// æ´æ°æç« åç±»çè·¯ç±
router.post('/updatecate', artcate_handler.updateCateById)
```

2. å¨ `/router_handler/artcate.js` æ¨¡åä¸­ï¼å®ä¹å¹¶åå¤å±äº« `æ´æ°æç« åç±»` çè·¯ç±å¤çå½æ°ï¼

```js
// æ´æ°æç« åç±»çå¤çå½æ°
exports.updateCateById = (req, res) => {
  res.send('ok')
}
```

#### 4.6.2 éªè¯è¡¨åæ°æ®

1. å¨ `/schema/artcate.js` éªè¯è§åæ¨¡åä¸­ï¼ä½¿ç¨ `exports` åå¤å±äº«å¦ä¸ç `éªè¯è§åå¯¹è±¡`ï¼

```js
// æ ¡éªè§åå¯¹è±¡ - æ´æ°åç±»
exports.update_cate_schema = {
  body: {
    Id: id,
    name,
    alias,
  },
}
```

2. å¨ `/router/artcate.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼å¹¶å¨è·¯ç±ä¸­ä½¿ç¨ï¼

```js
// å¯¼å¥æ´æ°æç« åç±»çéªè¯è§åå¯¹è±¡
const { update_cate_schema } = require('../schema/artcate')

// æ´æ°æç« åç±»çè·¯ç±
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)
```

#### 4.5.4 æ¥è¯¢åç±»åç§°ä¸å«åæ¯å¦è¢«å ç¨

1. å®ä¹æ¥éç SQL è¯­å¥ï¼

```js
// å®ä¹æ¥è¯¢ åç±»åç§° ä¸ åç±»å«å æ¯å¦è¢«å ç¨ç SQL è¯­å¥
const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`
```

2. è°ç¨ `db.query()` æ§è¡æ¥éçæä½ï¼

```js
// æ§è¡æ¥éæä½
db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // å¤æ­ åç±»åç§° å åç±»å«å æ¯å¦è¢«å ç¨
  if (results.length === 2) return res.encap('åç±»åç§°ä¸å«åè¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')
  if (results.length === 1 && results[0].name === req.body.name) return res.encap('åç±»åç§°è¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')
  if (results.length === 1 && results[0].alias === req.body.alias) return res.encap('åç±»å«åè¢«å ç¨ï¼è¯·æ´æ¢åéè¯ï¼')

  // TODOï¼æ´æ°æç« åç±»
})
```

#### 4.5.5 å®ç°æ´æ°æç« åç±»çåè½

1. å®ä¹æ´æ°æç« åç±»ç SQL è¯­å¥ï¼

```js
const sql = `update ev_article_cate set ? where Id=?`
```

2. è°ç¨ `db.query()` æ§è¡ SQL è¯­å¥ï¼

```js
db.query(sql, [req.body, req.body.Id], (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // SQL è¯­å¥æ§è¡æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('æ´æ°æç« åç±»å¤±è´¥ï¼')

  // æ´æ°æç« åç±»æå
  res.encap('æ´æ°æç« åç±»æåï¼', 0)
})
```

## 5. æç« ç®¡ç

### 5.1 æ°å»º ev_articles è¡¨

![ev_articlesè¡¨ç»æ](./images/4.jpg)

### 5.2 åå¸æ°æç« 

#### 5.2.0 å®ç°æ­¥éª¤

1. åå§åè·¯ç±æ¨¡å
2. åå§åè·¯ç±å¤çå½æ°æ¨¡å
3. ä½¿ç¨ multer è§£æè¡¨åæ°æ®
4. éªè¯è¡¨åæ°æ®
5. å®ç°åå¸æç« çåè½

#### 5.2.1 åå§åè·¯ç±æ¨¡å

1. åå»º `/router/article.js` è·¯ç±æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// å¯¼å¥ express
const express = require('express')
// åå»ºè·¯ç±å¯¹è±¡
const router = express.Router()

// åå¸æ°æç« 
router.post('/add', (req, res) => {
  res.send('ok')
})

// åå¤å±äº«è·¯ç±å¯¹è±¡
module.exports = router
```

2. å¨ `app.js` ä¸­å¯¼å¥å¹¶ä½¿ç¨æç« çè·¯ç±æ¨¡åï¼

```js
// å¯¼å¥å¹¶ä½¿ç¨æç« è·¯ç±æ¨¡å
const articleRouter = require('./router/article')
// ä¸ºæç« çè·¯ç±æè½½ç»ä¸çè®¿é®åç¼ /my/article
app.use('/my/article', articleRouter)
```

#### 5.2.2 åå§åè·¯ç±å¤çå½æ°æ¨¡å

1. åå»º `/router_handler/article.js` è·¯ç±å¤çå½æ°æ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// åå¸æ°æç« çå¤çå½æ°
exports.addArticle = (req, res) => {
  res.send('ok')
}
```

2. ä¿®æ¹ `/router/article.js` ä¸­çä»£ç å¦ä¸ï¼

```js
const express = require('express')
const router = express.Router()

// å¯¼å¥æç« çè·¯ç±å¤çå½æ°æ¨¡å
const article_handler = require('../router_handler/article')

// åå¸æ°æç« 
router.post('/add', article_handler.addArticle)

module.exports = router
```

#### 5.2.3 ä½¿ç¨ multer è§£æè¡¨åæ°æ®

> æ³¨æï¼ä½¿ç¨ `express.urlencoded()` ä¸­é´ä»¶æ æ³è§£æ `multipart/form-data` æ ¼å¼çè¯·æ±ä½æ°æ®ã

> å½åé¡¹ç®ï¼æ¨èä½¿ç¨ multer æ¥è§£æ `multipart/form-data` æ ¼å¼çè¡¨åæ°æ®ãhttps://www.npmjs.com/package/multer

1. è¿è¡å¦ä¸çç»ç«¯å½ä»¤ï¼å¨é¡¹ç®ä¸­å®è£ `multer`ï¼

```bash
npm i multer@1.4.2
```

2. å¨ `/router_handler/article.js` æ¨¡åä¸­å¯¼å¥å¹¶éç½® `multer`ï¼

```js
// å¯¼å¥è§£æ formdata æ ¼å¼è¡¨åæ°æ®çå
const multer = require('multer')
// å¯¼å¥å¤çè·¯å¾çæ ¸å¿æ¨¡å
const path = require('path')

// åå»º multer çå®ä¾å¯¹è±¡ï¼éè¿ dest å±æ§æå®æä»¶çå­æ¾è·¯å¾
const upload = multer({ dest: path.join(__dirname, '../uploads') })
```

3. ä¿®æ¹ `åå¸æ°æç« ` çè·¯ç±å¦ä¸ï¼

```js
// åå¸æ°æç« çè·¯ç±
// upload.single() æ¯ä¸ä¸ªå±é¨çæçä¸­é´ä»¶ï¼ç¨æ¥è§£æ FormData æ ¼å¼çè¡¨åæ°æ®
// å°æä»¶ç±»åçæ°æ®ï¼è§£æå¹¶æè½½å° req.file å±æ§ä¸­
// å°ææ¬ç±»åçæ°æ®ï¼è§£æå¹¶æè½½å° req.body å±æ§ä¸­
router.post('/add', upload.single('cover_img'), article_handler.addArticle)
```

4. å¨ `/router_handler/article.js` æ¨¡åä¸­ç `addArticle` å¤çå½æ°ä¸­ï¼å° `multer` è§£æåºæ¥çæ°æ®è¿è¡æå°ï¼

```js
// åå¸æ°æç« çå¤çå½æ°
exports.addArticle = (req, res) => {
  console.log(req.body) // ææ¬ç±»åçæ°æ®
  console.log('--------åå²çº¿----------')
  console.log(req.file) // æä»¶ç±»åçæ°æ®

  res.send('ok')
})
```

#### 5.2.4 [éªè¯è¡¨åæ°æ®](https://www.npmjs.com/package/express-joi-validation?activeTab=readme#validatorparamsschema-options)

> å®ç°æè·¯ï¼éè¿ express-joi **èªå¨éªè¯** req.body ä¸­çææ¬æ°æ®ï¼éè¿ if å¤æ­**æå¨éªè¯** req.file ä¸­çæä»¶æ°æ®ï¼

1. åå»º `/schema/article.js` éªè¯è§åæ¨¡åï¼å¹¶åå§åå¦ä¸çä»£ç ç»æï¼

```js
// å¯¼å¥å®ä¹éªè¯è§åçæ¨¡å
const joi = require('@hapi/joi')

// å®ä¹ æ é¢ãåç±»Idãåå®¹ãåå¸ç¶æ çéªè¯è§å
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('å·²åå¸', 'èç¨¿').required()

// éªè¯è§åå¯¹è±¡ - åå¸æç« 
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}
```

2. å¨ `/router/article.js` æ¨¡åä¸­ï¼å¯¼å¥éè¦çéªè¯è§åå¯¹è±¡ï¼å¹¶å¨è·¯ç±ä¸­ä½¿ç¨ï¼

```js
// å¯¼å¥éªè¯æ°æ®çä¸­é´ä»¶
const expressJoi = require('@escook/express-joi')
// å¯¼å¥æç« çéªè¯æ¨¡å
const { add_article_schema } = require('../schema/article')

// åå¸æ°æç« çè·¯ç±
// æ³¨æï¼å¨å½åçè·¯ç±ä¸­ï¼ååä½¿ç¨äºä¸¤ä¸ªä¸­é´ä»¶ï¼
//       åä½¿ç¨ multer è§£æè¡¨åæ°æ®
//       åä½¿ç¨ expressJoi å¯¹è§£æçè¡¨åæ°æ®è¿è¡éªè¯
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)
```

3. å¨ `/router_handler/article.js` æ¨¡åä¸­ç `addArticle` å¤çå½æ°ä¸­ï¼éè¿ `if` å¤æ­å®¢æ·ç«¯æ¯å¦æäº¤äº `å°é¢å¾ç`ï¼

```js
// åå¸æ°æç« çå¤çå½æ°
exports.addArticle = (req, res) => {
    // æå¨å¤æ­æ¯å¦ä¸ä¼ äºæç« å°é¢
  if (!req.file || req.file.fieldname !== 'cover_img') return res.encap('æç« å°é¢æ¯å¿éåæ°ï¼')

  // TODOï¼è¡¨åæ°æ®åæ³ï¼ç»§ç»­åé¢çå¤çæµç¨...
})
```

#### 5.2.5 å®ç°åå¸æç« çåè½

1. æ´çè¦æå¥æ°æ®åºçæç« ä¿¡æ¯å¯¹è±¡ï¼

```js
// å¯¼å¥å¤çè·¯å¾ç path æ ¸å¿æ¨¡å
const path = require('path')

const articleInfo = {
  // æ é¢ãåå®¹ãç¶æãæå±çåç±»Id
  ...req.body,
  // æç« å°é¢å¨æå¡å¨ç«¯çå­æ¾è·¯å¾
  cover_img: path.join('/uploads', req.file.filename),
  // æç« åå¸æ¶é´
  pub_date: new Date(),
  // æç« ä½èçId
  author_id: req.user.id,
}
```

2. å®ä¹åå¸æç« ç SQL è¯­å¥ï¼

```js
const sql = `insert into ev_articles set ?`
```

3. è°ç¨ `db.query()` æ§è¡åå¸æç« ç SQL è¯­å¥ï¼

```js
// å¯¼å¥æ°æ®åºæä½æ¨¡å
const db = require('../db/index')

// æ§è¡ SQL è¯­å¥
db.query(sql, articleInfo, (err, results) => {
  // æ§è¡ SQL è¯­å¥å¤±è´¥
  if (err) return res.encap(err)

  // æ§è¡ SQL è¯­å¥æåï¼ä½æ¯å½±åè¡æ°ä¸ç­äº 1
  if (results.affectedRows !== 1) return res.encap('åå¸æç« å¤±è´¥ï¼')

  // åå¸æç« æå
  res.encap('åå¸æç« æå', 0)
})
```

4. å¨ `app.js` ä¸­ï¼ä½¿ç¨ `express.static()` ä¸­é´ä»¶ï¼å° `uploads` ç®å½ä¸­çå¾çæç®¡ä¸ºéæèµæºï¼

```js
// æç®¡éæèµæºæä»¶
app.use('/uploads', express.static('./uploads'))
```
