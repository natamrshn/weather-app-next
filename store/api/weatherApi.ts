const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || ''
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ForecastData {
  cod: string
  message: number
  cnt: number
  list: Array<{
    dt: number
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
    clouds: {
      all: number
    }
    wind: {
      speed: number
      deg: number
    }
    visibility: number
    pop: number
    dt_txt: string
  }>
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}

export async function getCurrentWeather(cityName: string): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather')
  }

  return response.json()
}

export async function getForecast(cityName: string): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch forecast')
  }

  return response.json()
}
