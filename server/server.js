import http from 'http';
import app from './app.js';

const port = process.env.PORT || 4000;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});