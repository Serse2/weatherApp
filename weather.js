//global 

const $ = document.querySelector


const submit = $('#submit')
const result = $('#result')
const showDate = $('#date')
const body = $('body')
const input = $('input[type="text"]')


navigator.geolocation.getCurrentPosition(async (position) => {
  if (position) {
    const response = await execFetch(`lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
    if (!response.name){
      $('.main').classList.add('error')
    }
    $('#country').value = response.name
    showWeather(response)
  }
});


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


  result.classList = ''
  if (!data.weather || !data.weather.length) { return }
  let descriptionWeather = data.weather[0].description
  result.classList.add('icon', mapIconClass[descriptionWeather])

  const sunset = new Date(data.sys.sunset * 1000)
  result.classList.add((sunset < new Date() ? 'pm' : ''))


  // Info
  $('#temperature').innerText = `${Math.round(data.main.temp)}°`
  $('#humidity').innerText = `umidità: ${data.main.humidity}%`
  $('#weather').innerText = descriptionWeather
  showDate.innerText = 'ora: ' + refreshDate()
}

function initContent(){
  $('#temperature').innerText = ''
  $('#humidity').innerText = ''
  $('#weather').innerText = ''
  showDate.innerText = ''
  $('.main').classList.remove('error')
}

//chiamata fetch per recupero dei dati
async function getData(){
  //ad ogni chiamata resetta i risultati
  initContent()
  //chiamata fetch
  let city = $('#country').value
  const response = await execFetch(`q=${city}`)
  if (!response.name){
    $('.main').classList.add('error')
  } 
  showWeather(response)
}

async function execFetch(query) {
  let units = 'metric'
  let language =  'it'    //$('#language').value
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