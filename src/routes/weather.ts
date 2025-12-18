import axios from "axios";
import { Router, Request, Response } from "express";
import { getWeatherData, setWeatherData } from "../cache/redis";


const router = Router()


router.get('/weather/:city', async (req: Request, res: Response) => {
  const city = req.params.city;
  // console.log(city);
  const apiKey = process.env.WEATHER_API_KEY
  const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=${apiKey}&contentType=json`

  const cachedWeather = await getWeatherData(city);
  if (cachedWeather) {
    res.status(200).json(JSON.parse(cachedWeather))
  } else {

    try {
      const weatherData = await axios.get(apiUrl)
      res.status(200).json(weatherData.data);

      setWeatherData(city, JSON.stringify(weatherData.data), 6000)
    }

    catch (error: any) {
      console.error('Weather API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        res.status(401).json({ 
          message: "Invalid API key. Please check your WEATHER_API_KEY in .env file",
          hint: "Get a free API key from https://www.visualcrossing.com/weather-api"
        });
      } else {
        res.status(500).json({ 
          message: "Error fetching weather data",
          error: error.response?.data || error.message
        });
      }
    }
  }
});

export default router;