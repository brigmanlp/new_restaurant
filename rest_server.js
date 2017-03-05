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
    // var chosen = req.params.tables;

    // if (chosen) {
    //     console.log(chosen);

    //     for (var i = 0; i < tables.length; i++) {
    //         if (chosen === tables[i].routeName) {
    //             res.json(tables[i]);
    //             return;
    //         }
    //     }

    //     res.json(false);
    // }
     // else {

            res.json(tables);//nh: All of the above code is only necessary if we were going to search for indivdual tables like we did with the star wars characters...which is why that code had the "?" but this app didn't need it.
            
            // fs.readFile("tables.txt", tables, function(err){});//nh: only needed if we actually stored our data and wanted access after reconnecting or changing ports or deploying etc.
    // }
});

//API Wait List link on homepage - provides JSON
app.get("/api/waitlist", function(req, res) {
        //nh:Similar to the section above, the only code needed here is the one that spits out the waitlist tables.  Note that this is not displayed in the html page(Well-Sections) but rather the links at the bottom (API Table Link & API Wait List).  The jQuery in the tables.html file handles the displaying in the browser.
        res.json(waitlist);
    
});

// Create New tables - takes in JSON input

//nh: I was double confused in class after Dwight told us that the if statement needed to be in the app.get. Turns out he was under the impression we were trying to "get" from a text file and then display...still not sure that he was sure...Anyway, turns out that our if/else was indeed correct where it was, but we were not "communicating" with the reservations.html properly. res.json(newtables) needed to be res.json(true/false) in order for the reservation table to be able to give the alerts. However, even if you eliminate the res.json(true/false) the code will still work as needed, except you won't receive alerts.
//So...the biggest issue with our code in class is that I had a secondary app.post within the if/else statement.  As soon as I removed it and simply pushed to either the tables or waitlist array the code worked just fine.
app.post("/api/tables", function(req, res) {
    var newtables = req.body;
    console.log(tables.length);
    if(tables.length<3){
        // newtables.routeName = newtables.customerID.replace(/\s+/g, "").toLowerCase(); //nh:we are not routing to the tables so don't need this...the html file actually takes the customer ID and uses it (line 105 in tables.html)

        console.log(newtables);
        
        tables.push(newtables);

        res.json(true); //nh: we had this as res.json(newtables) so the if statements in the reservation.html never received the true or false values it needed...I must confess, I never would have thought to write this line this way b/c res.json(boolean) makes no sense to me...but as mentioned above, even without it the code still functions

        // fs.appendFile("tables.txt", JSON.stringify(tables), function(err){}); //nh: not actually needed for today but would be for future deployment if we wated to retain the info...also needed to stringify the tables array or would post as [object, object] etc.
    }
    else{
        //nh: notice the lack of the second (nested) app.post here. My thinking at the time was that we needed to have an "app.post" in order to "write" to "api/waitlist"...as though we were writing to a text file or something (see how app.post above directs us to /api/tables).  I think this is where the confusion was with Dwight as well when he said that the app.get took care of the display.
        console.log(newtables);
        waitlist.push(newtables);
        res.json(false);
    }
       


});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});