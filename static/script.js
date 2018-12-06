const input = document.querySelector('.input')
const response = document.querySelector('.response')
const sumbit = document.querySelector('.sumbit')
const dataTable = document.querySelector('.dataTable')

const makeId = () => {
  var text = "";
  var mask = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++)
    text += mask.charAt(Math.floor(Math.random() * mask.length));
  return text;
}


input.addEventListener('input', () => {
  if (input.value === '') return
  response.innerHTML = ''
  fetch(`/json?${input.value}`).then(res => res.json())
    .then(data => {
      response.innerHTML = ''
      data.forEach(el => {
        response.innerHTML += el
        response.innerHTML += ' '
      })
    })
})

document.addEventListener('DOMContentLoaded', () => {
  const cookie = document.cookie.replace('id=', '')
  if (!cookie) {
    return document.cookie = `id=${makeId()}`
  } else {
    fetch(`/data`).then(res => res.json())
      .then(data => {
        if (!data) return
        let list = ''
        data.forEach(file => {
          return list += `
          <div class='file'>
          <a href='/userdata?${file}'> ${file}</a>
          <form action='delete_${file}' method='delete'>
          <button class='delete'>delete</button>
          </form>
          </div>`
        })
        return dataTable.innerHTML = list
      })
  }
})