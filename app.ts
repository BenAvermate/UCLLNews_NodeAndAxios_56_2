import http from "http"
import axios from "axios"
import json2html from "node-json2html"

//const json2html = require('node-json2html')

const hostname = "localhost"
const port = 9000

const server = http.createServer((req, res) => {
    const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLowerCase()
    switch (path) {
        case "/news/all":
            res.writeHead(200, { 'Content-Type': 'text/html' })
            makeGetRequest().then(data => buildHtml(data)).then(html => res.write(html)).then(() => res.end())
            break

        case "/news/add":
            res.writeHead(200, { 'Content-Type': 'application/json' })
            makePostRequestAddNews(req, res)
            break
        /*
        res.writeHead(200, { "Content-Type": "text/html" })
        res.end(`<form method="post", action = "http://localhost:8080/Controller?command=Add">
            <input type="text" id="title">Title</input>
            <input type="text" id="text">Text</input>
            <input type="text" id="author">Author</input>
            <input type="submit" value="Submit News Article">
            </form>`
        );
        */

        default:
            res.writeHead(200, { "Content-Type": "text/html" })
            res.write("hello world")
            res.end();
            break
    }
})

server.listen(port, hostname, () => {
    console.log(`Server is running at  https://${hostname}:${port}/ press Ctrl-C to terminate....`)
})

async function makeGetRequest() {
    let res = await axios.get('http://localhost:8080/Controller?command=Refresh')
    return res.data
}


async function makeGetRequestAddNews() {
    let res = await axios.get('http://localhost:8080/NewsOverview')
    return res.data
}


async function makePostRequestAddNews(req, res) {
    let body = ''
    req.on('data', chunk => {
        // chunk is a buffer that contains the data received from the client 
        // a buffer is a special type of an array that can contain anything
        // we can use the buffer to store the data received from the client
        body += chunk.toString()
    })
    req.on('end', () => {
        let data = JSON.parse(body)
        axios.post('http://localhost:8080/AddNews', data)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write('<h1>Post added</h1>')
        res.end()
        return data
    })
}

function buildHtml(data) {
    console.log(data)
    let html = json2html.render(data,
        {
            "<>": "li",
            "html": [
                {
                    "<>": "div",
                    "html": [
                        {
                            "<>": "h3",
                            "text": "${title}"
                        }, {
                            "<>": "p",
                            "text": "${text}"
                        }, {
                            "<>": "p",
                            "text": "${author}"
                        }, {
                            "<>": "p",
                            "text": "${date}"
                        }, {
                            "<>": "hr",
                            "class": "my-2"
                        }
                    ]
                }]
        })
    /*
    {
        "<>": "li", 
        "html":[{
            "text": "Title: ${title} Text: ${text} Author: ${author} Date: ${date}"
        }]
    }
    */

    return '<!DOCTYPE html>' +
        '<html>' +
        '<head>NEWS</head>' +
        '<body class="container justify-content-center">' +
        '<h1>News Overview</h1>' +
        '<ul class="d-flex flex-column border">' +
        html +
        '</ul>' +
        '</body>' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>' +
        '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">' +
        '</html>'
}
