# 🚀 総合的な演習例 student info management(mongodb,art_template)

## Steps:

- Build the web server, achieve communication between client and server side
- Connect to the database, create a collection of users, and insert documents into the collection
- Query all users' information when they visit/list
- Splice the user information with the form HTML and respond the spliced result back to the client
- When the user accesses /add, the form page is rendered and the user information is added.
- When the user accesses /modify, the modification page is rendered, and the user information is modified.
- When the user accesses /delete, the user deletion function is implemented.

## 1. Create server

```js
const http = require("http");

//create server
const app = http.createServer();
//Adding request events to server objects
app.on("request", (req, res) => {
  res.end("ok");
});

app.listen(3000);
```



## 2. Connect to mongodb

```js
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/playground"),
  { userNewUrlParser: true }
    .then(() => console.log("database connection established"))
    .catch(() => console.log("database connection failed"));
```

>  Create collection rules

```js
const userSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  age: {
    type: "number",
    min: 18,
    max: 80,
  },
  password: String,
  email: String,
  hobbies: [String],
})
```

After creating the collection rule, you need to create the collection and use the collection rule instance `UserSchema `that you have just created.

> create collection 

```js
const User = mongoose.model("User",userSchema)
```

💡`mongoose.model("User",userSchema)` will get a **construct function** here, and use `User` to receive it, The later additions, deletions, and changes to the database all rely on this structured function `User`

import user.json file to mongodb

```js
mongoimport -d playground -c users --jsonArray ./user.json
```
