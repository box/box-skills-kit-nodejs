//Load HTTP module
// NOTE: After running your server on a fixed public IP, you will need to install
// an SSL certificate to register the URL with Box. For local HTTP development, you can
// create Your Own SSL Certificate Authority and self-sign it, until you get it on a final
// server machine/

const index = require('./index');
const http = require('http');
const util = require('util');

const hostname = '127.0.0.1'; // replace with your public IP
const port = 443; // Box is only able to send events to an https endpoint, make sure you have generated
// and added an SSL certificate, even if just for testing.

//Create HTTP server and listen on port 443 for requests

const server = http.createServer((req, res) => {
    console.log(`Box Skills Request recieved: ${util.inspect(req)}`);

    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', () => {
        console.log(`body = ${body}`);

        index.handler(body).then((resolve, reject) => {
            // Set the response HTTP header with HTTP status and Content type
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Skill Processed');
        });
    });
});

//listen for request on port 8000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
