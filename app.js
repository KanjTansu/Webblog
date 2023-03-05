const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// Load the full build.
const _ = require('lodash');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://kanjtansu:gITITAM345@todolist.ohgy8q2.mongodb.net/?retryWrites=true&w=majority');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// const posts = [];
const postsSchema = new mongoose.Schema({
  newTitle: String,
  newPost: String
})

const Post = mongoose.model("Post", postsSchema);

const post1 = new Post({
  newTitle: "Title",
  newPost: "Click New Post to create a new blog."
})
const defaultPosts = [post1];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', async (req, res) => {
  // res.render('home', {
  //   homeContent : homeStartingContent, 
  //   posts : posts})
  // console.log(defaultPosts);


  // res.render('home', {
  //   homeContent: homeStartingContent,
  //   posts: Post
  // })
  let foundPosts = await Post.find({}).exec();
  if (foundPosts.length === 0) {
    Post.insertMany(defaultPosts)
      .then(function () {
        console.log("Successfully saved defult items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
  res.redirect("/");
  }else {
  res.render('home', {
    homeContent: homeStartingContent,
    posts: foundPosts
  })}
});

app.get("/post/:title", async (req, res)=> {
  let found = _.lowerCase(req.params.title);
  let foundPosts = await Post.find({}).exec();
  foundPosts.forEach((foundPost) => {
    const storedTitle = _.lowerCase(foundPost.newTitle);
    if (found === storedTitle) {
      res.render("post", {
        title: foundPost.newTitle,
        content: foundPost.newPost
      });
    } else {
      console.log("NOT FOUND!");
    }
  });



});


app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent })
});


app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
});

app.get('/compose', (req, res) => {
  res.render('compose')
});

app.post('/compose', async (req, res) => {
  const post = {
    newTitle: req.body.newTitle,
    newPost: req.body.newPost
  }
  Post.insertMany(post)
      .then(function () {
        console.log("Successfully saved default items to DB");
      })
      .catch(function (err) {
        console.log(err);
      });
  res.redirect('/');
})


// app.listen(3000, function () {
//   console.log("Server started on port 3000");
// });
let port = process.env.PORT;
if (port == "null" || port =="" || port == "undefined") {
  port =3000;
}
app.listen(port, function () {
  console.log("Server running on port " + port);
})