import express from "express";
import http from "node:http";
import createBareServer from "@tomphttp/bare-server-node";
import path from "node:path";
import * as dotenv from "dotenv";
dotenv.config();

const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer("/bare/");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

app.get("/photography", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "search.html"));
});

app.get("/mathematics", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "play.html"));
});

app.get("/forest", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "widgetbot.html"));
});

app.get("/go", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "go.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "settings.html"));
});

app.get("/donate", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "donate.html"));
});

app.get("/ocean", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "apps.html"));
});

app.get("/404", (req, res) => {
  res.sendFile(path.join(__dirname, "static", "404.html"));
});

app.get("/*", (req, res) => {
  res.redirect("/404");
});

// Bare Server
server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(`Interstellar running at http://localhost:${process.env.PORT}`);
});

server.listen({
  port: process.env.PORT,
});


const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Store the correct password in an environment variable
const correctPassword = process.env.PASSWORD || 'your_password_here';

// Authentication middleware
const authenticate = (req, res, next) => {
  const userPassword = req.body.password;
  
  if (userPassword === correctPassword) {
    // Password is correct; set a cookie to remember the user
    res.cookie('authenticated', true);
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Serve your protected page
app.get('/', (req, res) => {
  const isAuthenticated = req.cookies.authenticated === 'true';
  
  if (isAuthenticated) {
    res.send('This is your protected content.');
  } else {
    res.sendFile(__dirname + '/login.html');
  }
});

// Login form submission
app.post('/login', authenticate, (req, res) => {
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
