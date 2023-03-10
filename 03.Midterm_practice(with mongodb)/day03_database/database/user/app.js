// 1. set up the web server and realize the communication between the client and the server
// 2. connect to the database, create a collection of users, insert documents into the collection
// 3. query all user information when a user accesses the /list
// Implement the routing function
// render the user list page
// Query user information from the database Display user information in the list
// 4. stitch user information and form HTML and respond the stitching result back to the client
// 5. render the form page and add user information when user accesses/add
// 6. When the user visits /modify, the modification page is rendered and the user information is modified
// There are two major steps to modify user information
// 1. Add a page route to render the page
// 1.1 Pass the user ID to the current page when the modify button is clicked
// 1.2 Query the current user information from the database and display the user information on the page
// 2. Implementing the user modification function
// 2.1 Specify the form submission address and request method
// 2.2 Receive the modification information from the client, find the user, and change the user information to the latest one.
// 7. Implement the user delete function when the user accesses/deletes

const http = require("http");

const url = require("url");
const querystring = require("querystring");

//import user database
require("./model/index.js");
const User = require("./model/user.js");

const app = http.createServer();

// Add request events to the server object
app.on("request", async (req, res) => {
  const method = req.method;
  const { pathname, query } = url.parse(req.url, true);

  if (method == "GET") {
    // Render the user list page
    if (pathname == "/list") {
      // Query user information
      let users = await User.find();
      // html string
      let list = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>User List</title>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
				</head>
				<body>
					<div class="container">
						<h6>
							<a href="/add" class="btn btn-primary">????????????</a>
						</h6>
						<table class="table table-striped table-bordered">
							<tr>
								<td>?????????</td>
								<td>??????</td>
								<td>??????</td>
								<td>??????</td>
								<td>??????</td>
							</tr>
			`;

      // Loop operations on data
      users.forEach((item) => {
        list += `
					<tr>
						<td>${item.name}</td>
						<td>${item.age}</td>
						<td>
				`;

        item.hobbies.forEach((item) => {
          list += `<span>${item}</span>`;
        });

        list += `</td>
						<td>${item.email}</td>
						<td>
							<a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">delete</a>
							<a href="/modify?id=${item._id}" class="btn btn-success btn-xs">edit</a>
						</td>
					</tr>`;
      });

      list += `
						</table>
					</div>
				</body>
				</html>
			`;
      res.end(list);
    } else if (pathname == "/add") {
      // Render the Add User Form page
      let add = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>User List</title>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
				</head>
				<body>
					<div class="container">
						<h3>????????????</h3>
						<form method="post" action="/add">
						  <div class="form-group">
						    <label>?????????</label>
						    <input name="name" type="text" class="form-control" placeholder="??????????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input name="password" type="password" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input name="age" type="text" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input name="email" type="email" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>???????????????</label>
						    <div>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="??????" name="hobbies"> ??????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="??????" name="hobbies"> ??????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="?????????" name="hobbies"> ?????????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="?????????" name="hobbies"> ?????????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="??????" name="hobbies"> ??????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="??????" name="hobbies"> ??????
						    	</label>
						    	<label class="checkbox-inline">
						    	  <input type="checkbox" value="??????" name="hobbies"> ??????
						    	</label>
						    </div>
						  </div>
						  <button type="submit" class="btn btn-primary">????????????</button>
						</form>
					</div>
				</body>
				</html>
			`;
      res.end(add);
    } else if (pathname == "/modify") {
      let user = await User.findOne({ _id: query.id });
      let hobbies = [
        "??????",
        "??????",
        "?????????",
        "?????????",
        "??????",
        "??????",
        "??????",
        "??????",
        "??????",
        "?????????",
      ];
      console.log(user);
      // ??????????????????????????????
      let modify = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>????????????</title>
					<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css">
				</head>
				<body>
					<div class="container">
						<h3>????????????</h3>
						<form method="post" action="/modify?id=${user._id}">
						  <div class="form-group">
						    <label>?????????</label>
						    <input value="${user.name}" name="name" type="text" class="form-control" placeholder="??????????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input value="${user.password}" name="password" type="password" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input value="${user.age}" name="age" type="text" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>??????</label>
						    <input value="${user.email}" name="email" type="email" class="form-control" placeholder="???????????????">
						  </div>
						  <div class="form-group">
						    <label>???????????????</label>
						    <div>
						    	
						    
			`;

      hobbies.forEach((item) => {
        // ??????????????????????????????????????????????????????
        let isHobby = user.hobbies.includes(item);
        if (isHobby) {
          modify += `
						<label class="checkbox-inline">
						  <input type="checkbox" value="${item}" name="hobbies" checked> ${item}
						</label>
					`;
        } else {
          modify += `
						<label class="checkbox-inline">
						  <input type="checkbox" value="${item}" name="hobbies"> ${item}
						</label>
					`;
        }
      });

      modify += `
						    </div>
						  </div>
						  <button type="submit" class="btn btn-primary">????????????</button>
						</form>
					</div>
				</body>
				</html>
			`;
      res.end(modify);
    } else if (pathname == "/remove") {
      // res.end(query.id)
      await User.findOneAndDelete({ _id: query.id });
      res.writeHead(301, {
        Location: "/list",
      });
      res.end();
    }
  } else if (method == "POST") {
    // ??????????????????
    if (pathname == "/add") {
      // ???????????????????????????
      let formData = "";
      // ??????post??????
      req.on("data", (param) => {
        formData += param;
      });
      // post??????????????????
      req.on("end", async () => {
        let user = querystring.parse(formData);
        // ?????????????????????????????????????????????
        await User.create(user);
        // 301???????????????
        // location ????????????
        res.writeHead(301, {
          Location: "/list",
        });
        res.end();
      });
    } else if (pathname == "/modify") {
      // ???????????????????????????
      let formData = "";
      // ??????post??????
      req.on("data", (param) => {
        formData += param;
      });
      // post??????????????????
      req.on("end", async () => {
        let user = querystring.parse(formData);
        // ?????????????????????????????????????????????
        await User.updateOne({ _id: query.id }, user);
        // 301???????????????
        // location ????????????
        res.writeHead(301, {
          Location: "/list",
        });
        res.end();
      });
    }
  }
});

app.listen(3000);
