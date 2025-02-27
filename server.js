const http = require('http');
const fs = require('fs');

http.createServer(function (req, res) {
    if(req.url == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync("index.html"));
        res.end();
    }
    if(req.url == "/main.js"){
        res.writeHead(200, {'Content-Type': 'application/wasm'});
        res.write(fs.readFileSync("main.js"));
        res.end();
    }
    if(req.url == "/main.wasm"){
        res.writeHead(200, {'Content-Type': 'application/wasm'});
        res.write(fs.readFileSync("main.wasm"));
        res.end();
    }
    if(req.url == "/run"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(fs.readFileSync("runner.html"));
        res.end();
    }
    if(req.url == "/compile" && req.method == "POST"){
        let body = "";
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            fs.writeFileSync("main.c", JSON.parse(body).code);
            const { exec } = require('child_process');
            exec('emcc -sASYNCIFY=1 -O1 main.c -o main.js', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
                console.log(stderr);
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(stderr+" "+stdout);
            });
        });
    }
}).listen(3000);
