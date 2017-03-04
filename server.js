// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Restaurant tables (DATA)
// =============================================================
var tables = [{
  customerID: "Galaxy",
  customerNname: "Yoda",
  phoneNumber: 7042778278 ,
  customerEmail: "greenman@gmail.com"
  
}, {
  customerID: "Xmen",
  customerNname: "professor X",
  phoneNumber: 7042778378 ,
  customerEmail: "baldy@gmail.com"
}, {
  customerID: "DC peeps",
  customerNname: "Flash",
  phoneNumber: 7042778379 ,
  customerEmail: "speedster@gmail.com"
}];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "view.html"));
});

app.get("/add", function(req, res) {
  res.sendFile(path.join(__dirname, "add.html"));
});

// Search for Specific Character (or all tables) - provides JSON
app.get("/api/:tables?", function(req, res) {
  var chosen = req.params.tables;

  if (chosen) {
    console.log(chosen);

    for (var i = 0; i < tables.length; i++) {
      if (chosen === tables[i].routeName) {
        res.json(tables[i]);
        return;
      }
    }

    res.json(false);
  }
  else {
    res.json(tables);
  }
});

// Create New tables - takes in JSON input
app.post("/api/new", function(req, res) {
  var newcharacter = req.body;
  newcharacter.routeName = newcharacter.name.replace(/\s+/g, "").toLowerCase();

  console.log(newcharacter);

  tables.push(newcharacter);

  res.json(newcharacter);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
