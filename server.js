// Set up ======================================================
require("dotenv").config();
// Dependencies ==============================================
const express = require("express");
const fileUpload = require("express-fileupload");
const AWS = require("aws-sdk");
const app  = express();
const PORT = process.env.PORT || 8000;
const db = require("./models");
// // Configuration ==============================================
// ​
// // Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

// ​
// // Serve up static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
}
// ​
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})
app.post("/api/scribble", (req, res) => {
    let imageFile = req.files.file.data;
    // console.log(req);
    console.log(req.files.file.data);
    console.log(req.body);
    s3.createBucket(() => {
        let param = {
            Bucket: process.env.S3_BUCKET,
            Key: `${req.body.photoName}.jpg`,
            Body: imageFile,
            ACL: "public-read",
            CacheControl: "no-cache"
        }
        s3.upload(param, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(data);
                res.json(data.Location);
            }
        })
    });
});

// Launch Server ==============================================
// db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log("🌎  ==> API Server now listening on PORT ${PORT}!");
    })
// })






