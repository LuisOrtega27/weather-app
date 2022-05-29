'use strict'



const searchBtn = document.querySelector('#search-btn')
const resultsArea = document.querySelector('.results-area')



const createWeatherCard= (weatherInfo)=>{


    console.log(weatherInfo.weather)
    
    console.log(weatherInfo)
    
    const date = new Date().toLocaleDateString("es-VE");


    let sunrise_unix = new Date(weatherInfo.sys.sunrise *1000)
    let sunrise = sunrise_unix.toLocaleTimeString()
    // console.log(sunrise)

    let sunset_unix = new Date(weatherInfo.sys.sunset *1000)
    let sunset = sunset_unix.toLocaleTimeString()
    // console.log(sunset)


    const card = document.createElement('DIV')

    card.className= 'weather-card'
    card.innerHTML= `

        <h2 class="city-name">${weatherInfo.name} ${weatherInfo.sys.country}</h2>
                    
        <div class="pri-info">
            
            <div class="text-info">

                <h2 class="temperature">${Math.floor(weatherInfo.main.temp)}<sup>ºC</sup></h2>

                <h3 class="weather-type">${weatherInfo.weather[0].description}</h3>

                <p class="date">${date}</p>

                
            </div>
            
            <picture class="img-info">
                <img src="https://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png" alt="${weatherInfo.weather.description}">
            </picture>
            
            <div class="min-max-area">
                <span>Min ${weatherInfo.main.temp_min}<sup>ºC</sup></span> <span>Max ${weatherInfo.main.temp_max}<sup>ºC</sup></span>
            </div>

        </div>

        <div class="sec-info">
            
            <div>
                <span><small>${sunrise}</small> Sunrise</span>
            </div>
            
            <div>
                <span>${weatherInfo.main.feels_like}<sup>ºC</sup> Feels like</span>
            </div>
            
            <div>
                <span>${weatherInfo.main.pressure}<sup>mm</sup> Pressure</span>
            </div>
            
            <div>
                <span>${weatherInfo.main.humidity}<sup>%</sup> Humidity</span>
            </div>
            
            <div>
                <span>${weatherInfo.wind.speed}<sup>m/s</sup> Wind</span>
            </div>
            
            <div>
                <span><small>${sunset}</small> Sunset</span>
            </div>
        </div> 
    `;

    resultsArea.appendChild(card)
}



const fetcher = async(url)=>{

    // console.log(url)
    let interval 

    try{

        clearInterval(interval)

        return await fetch(url)
        .then(res => res.json())
        .then(res => res)


    }catch(err){
        
        console.log('Shitty internet connection, sorry')

        interval = setInterval(fetcher(url), 30000)
        
        return false
    }

}



const getGeoLocation = async()=>{
    
    let geo = await navigator.geolocation

    geo.getCurrentPosition( async(position)=> {
        // console.log(position)
        let longi = await position.coords.longitude
        let lati = await position.coords.latitude
        
        const APIKEY = '15e89ad88fb5c41efc80aad0ea40b422'
        let result = await fetcher(`https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${APIKEY}&units=metric`)

        if(result) createWeatherCard(result)
    })

}
window.addEventListener('load', getGeoLocation)



searchBtn.addEventListener('click', async(e)=>{
    
    e.preventDefault()
    
    let inputCityName = document.querySelector('#search-cityName')
    
    let cityName= inputCityName.value
    
    
    const APIKEY = '15e89ad88fb5c41efc80aad0ea40b422'
    let result = await fetcher(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=metric`)
    
    if(result) createWeatherCard(result)
    
    inputCityName.value = ''
    inputCityName.focus()
    // console.log(result)
})
