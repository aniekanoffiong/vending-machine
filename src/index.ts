// import { AppDataSource } from "./data-source"
// import { User } from "./modules/user/user.entity"
import app from "./app";
import debug from "debug";
import http, { Server } from "http";
import { HttpError } from 'http-errors';
import { AppDataSource } from "./data-source";
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.NODE_LOCAL_PORT || 8000;
app.set("port", PORT);
const server: Server = http.createServer(app);

AppDataSource
.initialize()
.then(() => console.log("Typeorm successfully initialized"))
.catch((error) => console.log(`unable to initialize typeorm ${error}`))

server.listen(PORT);
server.on('error', onError);
server.on("listening", onListening);

function onError(error: HttpError) {
    if (error.syscall !== 'listen') {
        throw error;
    }
  
    const bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
  
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr?.port;
    debug('Listening on ' + bind);
}
  