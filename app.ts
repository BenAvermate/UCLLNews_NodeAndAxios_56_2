import http from "http"
import axios from "axios"
import json2html from "node-json2html"

const hostname = "localhost"
const port = 9000

const server = http.createServer((req, res)=> {
    const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase()
    switch (path) {
        case "/hello":
            res.writeHead(200, {"Content-Type": "text/html"})
            res.write("hello world")
            res.end();
            break

        case "/news/all":
            res.writeHead(200, {'Content-Type': 'text/html'})
            makeGetRequest().then(data => buildHtml(data)).then(html => res.write(html)).then(() => res.end())
            break

        case "/news/add":

            res.writeHead(200, {"Content-Type": "text/html"})
            res.end(`<form method="post", action = "http://localhost:8080/Controller?command=Add">
                <input type="text" id="title">Title</input>
                <input type="text" id="text">Text</input>
                <input type="text" id="author">Author</input>
                <input type="submit" value="Submit News Article">
                </form>`
            );

    }
})

server.listen(port, hostname, ()=>{
    console.log(`Server is running at  https://${hostname}:${port}/ press Ctrl-C to terminate....` )
})

async function makeGetRequest () {
    let res = await axios.get('http://localhost:8080/Controller?command=Refresh')
    return res.data
}


function buildHtml(data) {
    let html = json2html.render(data,
        {"<>": "li", "html":[{"text": "Title: ${title} Text: ${text} Author: ${author} Date: ${date}"}]})


    return  '<!DOCTYPE html>'+
        '<html>'+
        '<head>NEWS</head>'+
        '<body>' + html + '</body>'+
        '</html>'
}
