import app from ".";
const http = require("http");

const port = process.env.PORT || 1000;

const server = http.createServer(app);

server.listen(port);

console.log(`Server listening on port ${port}`);
