'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCurrentWeather, WeatherData } from '@/store/api/weatherApi'
import { City } from '@/store/slices/citiesSlice'
import styles from './CityCard.module.scss'

type CityCardProps = {
  city: City
  onRemove: (id: string) => void
}

export default function CityCard({ city, onRemove }: CityCardProps) {
  const router = useRouter()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadWeather = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getCurrentWeather(city.name)
      setWeatherData(data)
    } catch (err: any) {
      setError(err?.message || 'Error loading weather')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWeather()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.name])

  const handleRefresh = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    
    setIsRefreshing(true)
    try {
      const data = await getCurrentWeather(city.name)
      setWeatherData(data)
      setError(null)
    } catch (err: any) {
      setError(err?.message || 'Error loading weather')
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const handleCardClick = () => {
    router.push(`/${city.id}`)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(city.id)
  }

  const getCityImageUrl = () => {
    let seed = 0
    for (let i = 0; i < city.name.length; i++) {
      seed += city.name.charCodeAt(i)
    }
    return `https://picsum.photos/seed/${seed}/800/600`
  }

  if (isLoading) {
    return (
      <article className={styles.card}>
        <div className={styles.loading} role="status" aria-live="polite">Loading...</div>
      </article>
    )
  }

  if (error && !weatherData) {
    return (
      <article className={styles.card}>
        <div className={styles.error} role="alert">
          <h3>{city.name}</h3>
          <p>Error loading weather</p>
          <p className={styles.errorMessage}>
            {error === 'City not found' ? 'City not found' : 'Please try again later'}
          </p>
          <button 
            onClick={(e) => handleRefresh(e)} 
            className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
            disabled={isRefreshing}
          >
            <span className={styles.refreshIcon}>↻</span>
            <span>Try again</span>
          </button>
          <button onClick={(e) => handleRemove(e)} className={styles.removeButton} aria-label="Remove city">
            Remove
          </button>
        </div>
      </article>
    )
  }

  if (!weatherData) {
    return null
  }

  const weather = weatherData.weather[0]
  const temp = Math.round(weatherData.main.temp)
  const feelsLike = Math.round(weatherData.main.feels_like)

  return (
    <article 
      className={styles.card} 
      onClick={handleCardClick}
      style={{
        backgroundImage: `url(${getCityImageUrl()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <header className={styles.header}>
        <h2 className={styles.cityName}>{weatherData.name}</h2>
        <button
          onClick={(e) => handleRemove(e)}
          className={styles.removeButton}
          aria-label="Remove city"
        >
          ×
        </button>
      </header>
      <section className={styles.weatherInfo}>
        <div className={styles.temperature}>
          <span className={styles.tempValue}>{temp}°</span>
          <span className={styles.feelsLike}>Feels like {feelsLike}°</span>
        </div>
        <div className={`${styles.weatherDetails} ${styles.weatherDetailsWithBg}`}>
          <div className={styles.weatherIcon}>
            <Image
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              width={64}
              height={64}
              unoptimized
            />
          </div>
          <div className={styles.weatherDescription}>
            <p className={styles.mainWeather}>{weather.main}</p>
            <p className={styles.description}>{weather.description}</p>
          </div>
        </div>
        <div className={styles.additionalInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Humidity:</span>
            <span className={styles.infoValue}>{weatherData.main.humidity}%</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Wind:</span>
            <span className={styles.infoValue}>{weatherData.wind.speed} m/s</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Pressure:</span>
            <span className={styles.infoValue}>{weatherData.main.pressure} hPa</span>
          </div>
        </div>
      </section>
      <button 
        onClick={(e) => handleRefresh(e)} 
        className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
        disabled={isRefreshing}
        aria-label="Refresh weather data"
      >
        <span className={styles.refreshIcon}>↻</span>
        <span>Refresh now</span>
      </button>
    </article>
  )
}

