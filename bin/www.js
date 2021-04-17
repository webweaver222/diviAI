const app = require("../app");
const debug = require("debug")("diviai:server");
const http = require("http");
const WebSocket = require("ws");

var server = http.createServer(app);

server.listen(process.env.PORT || "3000");
server.on("error", onError);
server.on("listening", onListening);

const wss = new WebSocket.Server({ server });

require("./events")(wss);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
