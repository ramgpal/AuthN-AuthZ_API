const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

// cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// body parser
app.use(express.json());

const database = require("./config/database"); 
database.connect(); // Calling the connect method from the database file

// importing route
const user = require("./routes/user");
// mounting
app.use("/api/v1", user);

app.listen(PORT, () => {
    console.log(`app is listening at ${PORT}`);
});
