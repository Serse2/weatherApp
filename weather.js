//global 
const submit = document.querySelector('#submit')
const myPosition = document.querySelector('#geolocation')
const result = document.querySelector('#result')
const nextDay = document.querySelector('.next-day')
const showDate = document.querySelector('#date')
const body = document.querySelector('body')
const input = document.querySelector('input[type="text"]')
//global next day prev
let resultOne = document.querySelector('#resultOne')
let resultTwo = document.querySelector('#resultTwo')
let resultThree = document.querySelector('#resultThree')
//creazione elementi
let tempOne = document.createElement('div')
let tempTwo = document.createElement('div')
let tempThree = document.createElement('div')

async function success(position){
  if (position) {
    const response = await execFetch(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
    const responsePrev = await execFetchPrev(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
    if (!response.name){
      document.querySelector('.main').classList.add('error')
    }
    document.querySelector('#country').value = response.name
    showWeather(response)
    showWeatherPrev(responsePrev)
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
  }else if (getHours >= 16 && getHours <= 19){
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

const mapIconClass = {
  'cielo sereno': 'sole',
  'poche nuvole': 'soleggiato',
  'nubi sparse': 'nuvoloso',
  'pioggia leggera': 'piovoso',
  'pioggia moderata': 'piovoso',
  'pioggerella': 'piovoso',
  'temporale con pioggia': 'temporale',
  'cielo coperto': 'soleggiato',
  'foschia': 'nebbia'
}

// show today weather 
function showWeather(data){
  //init class
  result.classList = ''
  
  //add class
  if (!data.weather || !data.weather.length) { return }
  let descriptionWeather = data.weather[0].description
  result.classList.add('icon', mapIconClass[descriptionWeather])

  const sunset = new Date(data.sys.sunset * 1000)
  result.classList.add((sunset < new Date() ? 'pm' : 'am'))


  // Result date
  document.querySelector('#temperature').innerText = `${Math.round(data.main.temp)}°`
  document.querySelector('#humidity').innerText = `umidità: ${data.main.humidity}%`
  document.querySelector('#weather').innerText = descriptionWeather
  showDate.innerText = 'ora: ' + refreshDate()
}
// show other day weather 
function showWeatherPrev(responsePrev){
  //init class
  resultOne.classList = ''
  resultTwo.classList = ''
  resultThree.classList = ''


  //scelta dell'icona in base alla descrizione della previsione
  let descriptionWeatherOne = responsePrev.list[8].weather[0].description
  resultOne.classList.add('prev-icon', mapIconClass[descriptionWeatherOne])

  let descriptionWeatherTwo = responsePrev.list[16].weather[0].description
  resultTwo.classList.add('prev-icon', mapIconClass[descriptionWeatherTwo])

  let descriptionWeatherThree = responsePrev.list[24].weather[0].description
  resultThree.classList.add('prev-icon', mapIconClass[descriptionWeatherThree])

  //data della previsione
  let dayOne = responsePrev.list[8].dt_txt.slice(0, 10)
  let dayTwo = responsePrev.list[16].dt_txt.slice(0, 10)
  let dayThree = responsePrev.list[24].dt_txt.slice(0, 10)

  //visualizzazione della data e descrizione 
  document.querySelector('#dateOne').innerText = dayOne
  document.querySelector('#weatherDayOne').innerText = descriptionWeatherOne 

  document.querySelector('#dateTwo').innerText = dayTwo
  document.querySelector('#weatherDayTwo').innerText = descriptionWeatherTwo

  document.querySelector('#dateThree').innerText = dayThree
  document.querySelector('#weatherDayThree').innerText = descriptionWeatherThree
  
  //temperatura day one creata con js
  tempOne.classList.add('temp-prev')
  tempOne.innerHTML = `${Math.round(responsePrev.list[8].main.temp)}°`
  let parentTempOne = document.querySelector('.day-one')
  parentTempOne.insertBefore(tempOne, document.querySelector('#weatherDayOne'))

  //temperatura day two creata con js
  tempTwo.classList.add('temp-prev')
  tempTwo.innerHTML = `${Math.round(responsePrev.list[16].main.temp)}°`
  let parentTempTwo = document.querySelector('.day-two')
  parentTempTwo.insertBefore(tempTwo, document.querySelector('#weatherDayTwo'))

  //temperatura day three creata con js
  tempThree.classList.add('temp-prev')
  tempThree.innerHTML = `${Math.round(responsePrev.list[28].main.temp)}°`
  let parentTempThree = document.querySelector('.day-three')
  parentTempThree.insertBefore(tempThree, document.querySelector('#weatherDayThree'))
 


}
// init content
function initContent(){
  document.querySelector('#temperature').innerText = ''
  document.querySelector('#humidity').innerText = ''
  document.querySelector('#weather').innerText = ''
  showDate.innerText = ''
  document.querySelector('.main').classList.remove('error')
  document.querySelectorAll('.prev').forEach(prev => prev.innerText = '')
  tempOne.innerText= ''
  tempTwo.innerText= ''
  tempThree.innerText= ''

}

async function getData(){
  //ad ogni chiamata resetta i risultati
  initContent()
  //chiamata fetch
  let city = document.querySelector('#country').value
  //call for today weather
  const response = await execFetch(`q=${city}`)
  //call for future weather
  const responsePrev = await execFetchPrev(`q=${city}`)
  if (!response.name){
    document.querySelector('.main').classList.add('error')
  } 
  chengeBackground()
  showWeather(response)
  showWeatherPrev(responsePrev)
}

//fetch call to get data for today weather
async function execFetch(query) {
  let units = 'metric'
  let language =  'it'    //document.querySelector('#language').value
  let apikey = '&APIKEY=b9f269bc4ef38fa12c192b0fd1f1a897'
  let apiWeather = `https://api.openweathermap.org/data/2.5/weather?${query}&units=${units}&lang=${language}${apikey}`
  let response = await fetch(apiWeather)
  response = await response.json()
  console.log(response)

  return response
}

//fetch call to get data for other weather
async function execFetchPrev(query) {
  let units = 'metric'
  let language =  'it'    //document.querySelector('#language').value
  let apikey = '&APIKEY=b9f269bc4ef38fa12c192b0fd1f1a897'
  let apiWeather = `https://api.openweathermap.org/data/2.5/forecast?${query}&units=${units}&lang=${language}${apikey}`
  let response = await fetch(apiWeather)
  response = await response.json()
  console.log(response)
  return response
}

submit.addEventListener('click', getData)


//funzione per inviare tramite il tasto enter
function enterPress(e){
  if(e.key === 'Enter'){
    getData()
    chengeBackground()
  }
  return
}
document.addEventListener('keydown', enterPress)