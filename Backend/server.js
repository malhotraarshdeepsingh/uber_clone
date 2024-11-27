const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

// giveing app instance to http to create a new server
const server = http.createServer(app);

server.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});