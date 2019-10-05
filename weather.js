const submit = document.querySelector('#submit')
const result = document.querySelector('#result')
const showDate = document.querySelector('#date')
const body = document.querySelector('body')
const input = document.querySelector('input[type="text"]')


//change background and color text from hour
function chengeBackground(){
  let date = new Date();
  let getHours = date.getHours()
  console.log(getHours)
  if (getHours > 7 && getHours < 16){
    //imposta il background del colore mattino e color dark
    body.style.background = 'var(--morning)'
    body.style.color = 'var(--dark)'
    input.style.color = 'var(--dark)'
  }else if (getHours > 17 && getHours < 20){
    //imposta il background del colore in afternoon e color light
    body.style.background = 'var(--afternoon)'
    body.style.color = 'var(--light)'
    input.style.color = 'var(--light)'
  }else{
    //imposta il background del colore in night e color light
    body.style.background = 'var(--night)'
    body.style.color = 'var(--light)'
    input.style.color = 'var(--light)'
  }
}
chengeBackground()
setInterval(chengeBackground, 1000 * 60 * 60)

function refreshDate(){
  let date = new Date();
  let getHours = date.getHours()
  let getMinute = date.getMinutes()
  let totalDate = getHours + ':' + getMinute
  return totalDate
}
// show weather 
function showWeather(data){
  result.classList.remove('icon','sole','nuvoloso','piovoso')
  let descriptionWeather = data.weather[0].description
  if (descriptionWeather == 'cielo sereno'){
    result.classList.add('icon','sole')
  }
  if (descriptionWeather == 'poche nuvole'){
    result.classList.add('icon','soleggiato')
  }
  if (descriptionWeather == 'nubi sparse'){
    result.classList.add('icon','nuvoloso')
  }
  if (descriptionWeather == 'pioggia leggera'){
    result.classList.add('icon','piovoso')
  }
  document.querySelector('#temperature').innerText = `${Math.round(data.main.temp)}°`
  document.querySelector('#humidity').innerText = `umidità: ${data.main.humidity}%`
  document.querySelector('#weather').innerText = descriptionWeather
  showDate.innerText = 'ora: ' + refreshDate()
}
//chiamata fetch per recupero dei dati
async function getData(){
  //ad ogni chiamata resetta i risultati
  document.querySelector('#temperature').innerText = ''
  document.querySelector('#humidity').innerText = ''
  document.querySelector('#weather').innerText = ''
  showDate.innerText = ''
  //chiamata fetch
  let city = document.querySelector('#country').value
  let units = 'metric'
  let language =  'it'    //document.querySelector('#language').value
  let apikey = '&APIKEY=b9f269bc4ef38fa12c192b0fd1f1a897'
  let apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${language}${apikey}`
  let response = await fetch(apiWeather).then(data => data.json())
  showWeather(response)
}
submit.addEventListener('click', getData)



//funzione per inviare tramite il tasto enter
function enterPress(e){
  if(e.key === 'Enter'){
    getData()
  }
  return
}
document.addEventListener('keydown', enterPress)


//implementazioni
// 1- fuso orario
// 2- previsione