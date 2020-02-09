const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require('underscore');

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen(3000, function() {
    console.log('Port 3000 is open.')
});

fetch('http://localhost:3000').then(
    function() {console.log("Running at localhost:3000");
});

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/app", {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then(()=> console.log("MongoDB Database Connected!"))
.catch(error => console.log(error));

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 4
    },
    type:{
        type: String,
        required: true
    }
}, {
    versionKey: false
});
const User = mongoose.model("User", userSchema, "users");
module.exports = User;

const courseSchema = new Schema({
    topic:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    provider:{
        type: String,
        required: true
    },
    reviews: [
        {
            author: {
                type: String
            },
            ranking: {
                type: Number
            }
        }
    ]
}, {
    versionKey: false
});
const Course = mongoose.model("Course", courseSchema, "courses");
module.exports = Course;

app.get("/courses", function(req, res) {
    Course.find({}, function(err, data){
        var count = data.length;
        var courseList = [];
        var updatedList = [];
        var topics = _.map(data, "topic");
        var price = _.map(data, "price");
        var location = _.map(data, "location");
        var provider = _.map(data, "provider");

        for (i = 0; i < count; i++) {
            courseList[i] = "{'Topic':'" + topics[i] + "','Price':" + price[i] + ",'Location':'" + location[i] + "','Provider':'" + provider[i] + "'}"
            var string = courseList[i];
            updatedList[i] = JSON.parse("" + string.replace(/'/g,'"') + "");
        }
        res.json(updatedList)
    })
});

app.get('/',function(req,res){
    res.sendFile(__dirname+'/login.html');
});

app.get('/CW2.webmanifest',function(req,res){
    res.sendFile(__dirname+'/CW2.webmanifest');
});

app.get('/sw.js',function(req,res){
    res.sendFile(__dirname+'/sw.js');
});

app.get('/app.js',function(req,res){
    res.sendFile(__dirname+'/app.js');
});

app.get('/main.js',function(req,res){
    res.sendFile(__dirname+'/main.js');
});

app.get('/main.html',function(req,res){
    res.sendFile(__dirname+'/main.html');
});

app.get('/activities.html',function(req,res){
    res.sendFile(__dirname+'/activities.html');
});

app.get('/reviews.html',function(req,res){
    res.sendFile(__dirname+'/reviews.html');
});

app.get('/admin.html',function(req,res){
    res.sendFile(__dirname+'/admin.html');
});

app.post('/newUser',function(req,res){
    const userData = new User(req.body);
    User.findOne({'username': req.body.username}, function(err, user) {
        if(user) return res.json("E-mail already in use.");
    })
    userData.save();
    console.log(userData);
    res.sendFile(__dirname+'/login.html');
});

app.post('/getUser', function(req,res) {
    User.findOne({'username': req.body.username}, function(err, user) {
        if(err) throw err;
        if(!user) return res.json("E-Mail is incorrect!");
        if (!(user.password == req.body.password)) return res.json("Password is incorrect!");
        if (user.password == req.body.password) return res.sendFile(__dirname+'/main.html');
    })
});

app.post('/addCourse',function(req,res){
    const courseData = new Course(req.body);
    courseData.save();
    console.log(courseData);
    res.sendFile(__dirname+'/admin.html');
    //res.status(204).send();
});

app.post('/findCourse', function(req,res) {
    Course.find({ provider: req.body.provider }, (err, courses) => {
        if (err) return res.json("Unable to find courses requested!");
        if (!courses) return res.json("Provider does not have any courses!");
        if (courses.length == 0) return res.json("Provider does not have any courses!");
        //res.send(courses);

        var count = courses.length;
        var courseList = [];
        var updatedList = [];
        var topics = _.map(courses, "topic");
        var price = _.map(courses, "price");
        var location = _.map(courses, "location");
        var provider = _.map(courses, "provider");

        for (i = 0; i < count; i++) {
            courseList[i] = "{'Topic':'" + topics[i] + "','Price':" + price[i] + ",'Location':'" + location[i] + "','Provider':'" + provider[i] + "'}"
            var string = courseList[i];
            updatedList[i] = JSON.parse("" + string.replace(/'/g,'"') + "");
        }
        res.json(updatedList)
    });
});

app.post('/updateCourse', function(req,res) {
    Course.findOneAndUpdate(
        {
            provider: req.body.oldProvider,
            topic: req.body.oldTopic
        }, {
        topic: req.body.topic,
        price: req.body.price,
        location: req.body.location,
        provider: req.body.provider
    }, (err, updatedCourse) => {
        if (err) return res.json("Unable to update courses requested!");
        if (!updatedCourse) return res.json("Unable to find the course requested");
        if (updatedCourse.topic == null) return res.json("Unable to find the course requested");

        res.json("Course updated!")
        console.log(updatedCourse);
        res.sendFile(__dirname+'/admin.html');
    });
})

app.post('/deleteCourse', function(req,res) {
    Course.findOneAndDelete({
        provider: req.body.provider,
        location: req.body.location,
        topic: req.body.topic
    }, (err, deletedCourse) => {
        if (err) return res.json("Unable to delete course requested!");
        if (!deletedCourse) return res.json("Unable to find the course requested");
        if (deletedCourse.topic == null) return res.json("Unable to find the course requested");
        console.log(deletedCourse);
        res.sendFile(__dirname+'/admin.html');
    })
})

app.post('/createReview', function(req,res) {
    Course.findOne(
        {
            provider: req.body.provider,
            location: req.body.location,
            topic: req.body.topic
        },
        function(err, reviewedCourse) {
            if (err) {
                res.json("Unable to update courses requested!");
                throw err;
            }
            if (!reviewedCourse) return res.json("Unable to find the course requested");
            if (reviewedCourse.topic == null) return res.json("Unable to find the course requested");

            reviewedCourse.reviews.push({
                author: req.body.author,
                ranking: req.body.ranking
            });

            reviewedCourse.save();
            console.log(reviewedCourse);
            return res.sendFile(__dirname+'/reviews.html');
        });
})

app.post('/updateReview', function(req,res) {
    Course.findOne(
        {
            provider: req.body.provider,
            location: req.body.location,
            topic: req.body.topic
        },
        function(err, updatedReview) {
            if (err) {
                res.json("Unable to update courses requested!");
                throw err;
            }
            if (!updatedReview) return res.json("Unable to find the course requested");
            if (updatedReview.topic == null) return res.json("Unable to find the course requested");

            var courseReviews = updatedReview.reviews;
            var reviewAuthor = req.body.author;
            var reviewArr = courseReviews.filter(obj => {
                return obj.author === reviewAuthor;
            });

            if (reviewArr == null | reviewArr == "") {
                res.json("Author has not previously made a review!")
            }
            else {
                var result = _.map(reviewArr, "author");

                Course.findOneAndUpdate(
                    {
                        provider: req.body.provider,
                        location: req.body.location,
                        topic: req.body.topic
                    },
                    { "$pull": { "reviews": { "author": result } }},
                    {multi : true},
                    function(err, courseToUpdate) {
                        if (err) throw err;
                        console.log(courseToUpdate);
                    }
                )

                updatedReview.reviews.push({
                    author: req.body.author,
                    ranking: req.body.ranking
                });
                updatedReview.save();
                console.log(updatedReview)
            }
            return res.sendFile(__dirname+'/reviews.html');
    });
})

