// nodemon --experimental-modules index.mjs

import fs from 'fs'
import http from 'http'
import URL from 'url'

const data = JSON.parse(fs.readFileSync('./static/data.json', 'utf-8'))


http.createServer((request, response) => {
  const url = URL.parse(request.url)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    response.end(fs.readFileSync('./static/index.html'))
  }

  if (~url.pathname.indexOf('/json')) {
    const query = new RegExp('^'+url.query,'gi')
    console.log(query)
    const filterData = data.filter(el => {
      if (~el.search(query)) return el
    })
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(filterData))
  }
}).listen(8080)

