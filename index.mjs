// nodemon --experimental-modules index.mjs

import fs from 'fs'
import http from 'http'
import URL from 'url'
import formidable from 'formidable'
import data from './static/data'

http.createServer((request, response) => {
  const url = URL.parse(request.url)
  if (url.pathname === '/' || url.pathname === '/index.html') {
    response.end(fs.readFileSync('./static/index.html'))
  }
  if (url.pathname === '/style.css') {
    response.end(fs.readFileSync('./static/style.css'))
  }
  if (url.pathname === '/script.js') {
    response.end(fs.readFileSync('./static/script.js'))
  }

  if (~url.pathname.indexOf('/json')) {
    const query = new RegExp('^' + url.query, 'gi')
    console.log(query)
    const filterData = data.filter(el => {
      if (~el.search(query)) return el
    })
    console.log(filterData)
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(filterData))
  }

  if (~url.pathname.indexOf('/data')) {
    const userData = fs.readdirSync('./static/userData')
    console.log(userData)
    response.writeHead(200, {
      'Content-Type': 'application/json'
    });
    response.end(JSON.stringify(userData))
  }

  if (~url.pathname.indexOf('/userdata')) {
    const file = url.query
    response.writeHead(200, {
      "content-disposition": "attachment; filename=\"" + file + "\"",
      'Content-Type': 'application/zip'
    });
    response.end(fs.readFileSync(`./static/userData/${file}`))
  }

  if (~url.pathname.indexOf('/file') && request.method.toLowerCase() == 'post') {
    const id = request.headers.cookie.replace('id=', '')
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
  if (~url.pathname.indexOf('delete')) {
    const file = url.pathname.replace('delete_', '')
    fs.unlinkSync(`./static/userData/${file}`)
    response.end(fs.readFileSync('./static/index.html'))
  }
}).listen(8080)