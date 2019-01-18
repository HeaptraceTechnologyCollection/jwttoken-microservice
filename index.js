var jwt = require('jsonwebtoken');
const http = require("http")

http.createServer((req, res) => {
    let body = ''
    req.on('data', chunk => { body += chunk.toString() })
    req.on('end', () => {
        if (!['/generate', '/validate'].includes(req.url)) {
            res.writeHead(404) // the request is not valid
            res.end()
        } else {
            let content = JSON.parse(body);
            if (['/generate'].includes(req.url)) {
                GenerateToken(content, res);
            } else {
                ValidateToken(content, res);
            }
        }
    })
}).listen(process.env.PUBSUB_PORT || 5000)

function GenerateToken(content,res) {
    try {
        var token = jwt.sign({ payload : content.payload }, content.privatekey);
        console.log("Token Generated");
        console.log(token);
        let ret = {};
        ret.token = token;
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(ret));
    }catch (ignored) {
        console.log("** Login Failed **");
        res.end(JSON.stringify({ "status":"Failed"}));
        res.writeHead(400) // the request is malformed
        res.end()
    }
}

function ValidateToken(content,res) {
    try {
        var decoded = jwt.verify(content.token, content.privatekey);
        console.log("Verified token");
        console.log("Status : success");
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ "status":"success"}));
    }catch (ignored) {
        console.log("** Validate Failed **");
        res.end(JSON.stringify({ "status":"Failed"}));
        res.writeHead(400) // the request is malformed
        res.end()
    }
}