// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require('fs');

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
    customerName: "Yoda",
    phoneNumber: 7042778278,
    customerEmail: "greenman@gmail.com",
    customerID: "Galaxy"

}, {
    customerName: "professor X",
    phoneNumber: 7042778378,
    customerEmail: "baldy@gmail.com",
    customerID: "Xmen"
}, {
    customerName: "Flash",
    phoneNumber: 7042778379,
    customerEmail: "speedster@gmail.com",
    customerID: "DC peeps"
}];

var waitlist = [{
  customerID: "LooneyTunes",
  customerNname: "Buggs B",
  phoneNumber: 7045778278 ,
  customerEmail: "BBfurytail@gmail.com"

}];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/reservation", function(req, res) {
    res.sendFile(path.join(__dirname, "reservation.html"));
});

app.get("/tables", function(req, res) {
    res.sendFile(path.join(__dirname, "tables.html"));
});

//API table link on homepage - provides JSON
app.get("/api/tables", function(req, res) {
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
    } else {
        res.json(tables);
        fs.readFile("tables.txt", tables, function(err){});
    }
});

//API table link on homepage - provides JSON
app.get("/api/waitlist", function(req, res) {
    var chosen = req.params.waitlist;

    if (chosen) {
        console.log(chosen);

        for (var i = 0; i < waitlist.length; i++) {
            if (chosen === waitlist[i].routeName) {
                res.json(waitlist[i]);
                return;
            }
        }

        res.json(false);
    } else {
        res.json(waitlist);
    }
});
// Create New tables - takes in JSON input
app.post("/api/tables", function(req, res) {
    var newtables = req.body;
    console.log(tables.length);
    if(tables.length<3){
        newtables.routeName = newtables.customerID.replace(/\s+/g, "").toLowerCase();

        console.log(newtables);
        
        tables.push(newtables);

        res.json(newtables);
        fs.appendFile("tables.txt", tables, function(err){});
    }else{
        app.post("/api/waitlist",function(req,res){ //nh: this second app.post is what really screwed us up and prevented everything from working.  My thinking at the time was that we needed to have an "app.post" in order to "write" to "api/waitlist"...as though we were writing to a text file or something.
        console.log(newtables);
        
        waitlist.push(newtables);

        res.json(newtables);
        fs.appendFile("waitlist.txt", waitlist, function(err){});
        });

    }
       


});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});