const express = require('express')
const axios = require('axios')


const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')


//Middlewares
app.use(express.urlencoded({extended:true})) //read form data
app.use(express.static('public')) //get our css files

app.get('/', function(req, res){
    res.render('index', {
        weather: null,
        error: null,
        city: '',
    })
})


app.post('/', async function(req, res) {
    const city = req.body.city.trim()
    const apiKey = '5b8ca44052b95873f14e4cedb9f6719f'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try{
        const response = await axios.get(url)
        const d = response.data

        const weather = {
            city:  d.name,
            country: d.sys.country,
            temp: Math.round(d.main.temp),
            feelsLike: Math.round(d.main.feels_like),
            humidity: d.main.humidity,
            wind: d.wind.speed || d.wind_speed,
            description: d.weather[0].description,
            icon: d.weather[0].icon,
        }
        res.render('index',{
            weather: weather, error: null, city: city
        })
    }catch(err){
        const status = err.response ? err.response.status: 500
        let message = "Something went wrong, please try again!"

        if(status===404){
            message = `City "${city}" was not found. Check the spelling and try again!`
        }
        if(status===401){
            message = "Invalid API key. Please check your API Key"
        }

        res.render('index',{
            weather: null, error: message, city: city
        })
    }
})


app.listen(3001, function(){
    console.log('Weather App is running on port http://localhost:3001')
})