const bodyParser  = require('body-parser');
const express = require('express');
const path  = require("path");

//Routes
const authRoutes = require("./routes/auth");
const adminZoneRoutes = require("./routes/admin-zone");
const fanZoneRoutes = require("./routes/fan-zone");
const libraryRoutes = require('./routes/library')



const app = express();

app.use(bodyParser.json());

app.use('/albunsfiles', express.static(path.join(__dirname, '../Albuns')));


///     CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


app.use( "/api/auth", authRoutes);
app.use("/api/admin-zone" , adminZoneRoutes );
app.use("/api/fan-zone" , fanZoneRoutes );
app.use("/api/library" , libraryRoutes );


module.exports = app;
