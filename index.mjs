// nodemon --experimental-modules index.mjs

import fs from 'fs'
import http from 'http'
import URL from 'url'
import formidable from 'formidable'
import data from './static/data'

// const data = JSON.parse(fs.readFileSync('./static/data.json', 'utf-8'))

http.createServer((request, response) => {
  const url = URL.parse(request.url)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    response.end(fs.readFileSync('./static/index.html'))
  }

  if (~url.pathname.indexOf('/json')) {
    const query = new RegExp('^' + url.query, 'gi')
    console.log(query)
    const filterData = data.filter(el => {
      if (~el.search(query)) return el
    })
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(filterData))
  }

  if (~url.pathname.indexOf('/file') && request.method.toLowerCase() == 'post') {
    console.log(request.headers)
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
      var oldpath = files.file.path;
      var newpath = './static/userData/' + files.file.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        response.end(fs.readFileSync('./static/index.html'))
      });
    });
  }
}).listen(8080)