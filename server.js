const mongoclient = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));

mongoclient
  .connect(
    "mongodb+srv://ShivanshGupta:india@2006@blogdb.xowev.mongodb.net/test?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
    }
  )

  .then((client) => {
    console.log("Running Application by Shivansh");
    const db = client.db("SurakshaDB");
    const stuInfo = db.collection("ChildrenInfo");
    app.set("view engine", "ejs");
    app.get("/", function (req, res) {
      res.sendFile(__dirname + "/index.html");
    });
    app.post("/allInfo", function (req, res) {
      stuInfo
        .find()
        .toArray()
        .then((data) => {
             var check = false;
          for (var i = 0; i < data.length; i++) {
          
            if (data[i].email == req.body.email) {
              check = true;
            }
          }
          if (check == false) {
               stuInfo.insertOne(req.body);
            res.redirect("/allInfo");
          } else {
            res.render("failure.ejs");
          }
        });
     
    
    });
    app.post("/updateInfo", function (req, res) {
      stuInfo
        .find()
        .toArray()
        .then((data) => {
          for (var i = 0; i < data.length; i++) {
            console.log(data[i].email, req.body.email);
            if (data[i].email == req.body.email) {
              stuInfo.updateOne(
                { email: req.body.email },
                {
                  $set: req.body,
                }
              );
              res.redirect("/allInfo");
            }
          }
        });
    });
    app.get("/updateInfo", function (req, res) {
      res.render("updateinfo.ejs", {});
    });
    app.get("/allInfo", function (req, res) {
      stuInfo
        .find()
        .toArray()
        .then((data) => {
          res.render("studentinfo.ejs", { data: data });
        })
        .catch((error) => {
          console.error(error);
        });
    });
    app.set("views", __dirname + "/views");
  })
  .catch((error) => {
    console.error("Error: " + error);
  });

app.listen(3000, function (req, res) {
  console.log("The server is running");
});
