//global 



const submit = document.querySelector('#submit')
const myPosition = document.querySelector('#geolocation')
const result = document.querySelector('#result')
const showDate = document.querySelector('#date')
const body = document.querySelector('body')
const input = document.querySelector('input[type="text"]')

async function success(position){
  if (position) {
    const response = await execFetch(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
    if (!response.name){
      document.querySelector('.main').classList.add('error')
    }
    document.querySelector('#country').value = response.name
    showWeather(response)
  }
}
function geolocation(){
  navigator.geolocation.getCurrentPosition(success);
}

myPosition.addEventListener('click', geolocation)

//change background and color text from hour
function chengeBackground(){
  let date = new Date();
  let getHours = date.getHours()
  console.log(getHours)
  if (getHours >= 7 && getHours <= 15){
    //imposta il background del colore mattino e color dark
    body.style.background = 'var(--morning)'
    body.style.color = 'var(--dark)'
    input.style.color = 'var(--dark)'
  }else if (getHours >= 16 && getHours <= 20){
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
setInterval(chengeBackground, 3600000)

function refreshDate(){
  let date = new Date();
  let getHours = date.getHours()
  let getMinute = date.getMinutes()
  let totalDate = getHours + ':' + getMinute
  return totalDate
}
// show weather 
function showWeather(data){

  const mapIconClass = {
    'cielo sereno': 'sole',
    'poche nuvole': 'soleggiato',
    'nubi sparse': 'nuvoloso',
    'pioggia leggera': 'piovoso',
    'pioggerella': 'piovoso'
  }

  //init class
  result.classList = ''
  //add class
  if (!data.weather || !data.weather.length) { return }
  let descriptionWeather = data.weather[0].description
  result.classList.add('icon', mapIconClass[descriptionWeather])

  const sunset = new Date(data.sys.sunset * 1000)
  result.classList.add((sunset < new Date() ? 'pm' : 'am'))


  // Info
  document.querySelector('#temperature').innerText = `${Math.round(data.main.temp)}°`
  document.querySelector('#humidity').innerText = `umidità: ${data.main.humidity}%`
  document.querySelector('#weather').innerText = descriptionWeather
  showDate.innerText = 'ora: ' + refreshDate()
}

function initContent(){
  document.querySelector('#temperature').innerText = ''
  document.querySelector('#humidity').innerText = ''
  document.querySelector('#weather').innerText = ''
  showDate.innerText = ''
  document.querySelector('.main').classList.remove('error')
}

//chiamata fetch per recupero dei dati
async function getData(){
  //ad ogni chiamata resetta i risultati
  initContent()
  //chiamata fetch
  let city = document.querySelector('#country').value
  const response = await execFetch(`q=${city}`)
  if (!response.name){
    document.querySelector('.main').classList.add('error')
  } 
  showWeather(response)
}

async function execFetch(query) {
  let units = 'metric'
  let language =  'it'    //document.querySelector('#language').value
  let apikey = '&APIKEY=b9f269bc4ef38fa12c192b0fd1f1a897'
  let apiWeather = `https://api.openweathermap.org/data/2.5/weather?${query}&units=${units}&lang=${language}${apikey}`
  let response = await fetch(apiWeather)
  response = await response.json()

  return response
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