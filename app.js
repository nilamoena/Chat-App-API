const express = require("express")
const googleService = require("./google-services.json")
const PORT = process.env.PORT || 5000;
const app = express()
const admin = require("firebase-admin");
const { restart } = require("nodemon");

admin.initializeApp({
    credential: admin.credential.cert(googleService)
  });
  
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res)=>{
    res.send("Hello World")
});

app.post("/", (req, res)=>{
    const body = req.body
    const topic = "mobcomp"
    admin.messaging().subscribeToTopic(body.token, topic)
    admin.messaging().send({
        topic,
        data: {
            name: body.name,
            message: body.message
        },
        notification: {
            title: body.name,
            body: body.message
        }
    })
    res.status(200).send()
})

app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});