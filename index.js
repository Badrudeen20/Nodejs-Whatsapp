const http = require("http");
const express = require("express");
const fileUpload = require('express-fileupload');
const { rootPath, url } = require('./module/url');
const { Server } = require("socket.io");
const app = express();
const session = require('express-session');
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
const PORT = 5000;
const flash = require('connect-flash');
const web = require("./router/web");
const socket = require("./module/socket");
const passport = require('passport');
const initializePassport = require('./config/passport');
initializePassport(passport);
app.use(fileUpload({
  createParentPath: true
}));
app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  app.locals.url = url(req,res)
  res.locals.error = req.flash('error'); // This will catch Passport errors
  next();
});
  


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "./view"));
app.set("view engine", "ejs");
app.use(web);
socket(io)

server.listen(PORT, function () {
      console.log(`Server Started at PORT:${PORT}`)
});