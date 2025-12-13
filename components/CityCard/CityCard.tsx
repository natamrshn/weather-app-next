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
  const [cityImageUrl, setCityImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    
    const fetchWeather = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCurrentWeather(city.name)
        if (!cancelled) {
          setWeatherData(data)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || 'Error loading weather')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    fetchWeather()
    
    return () => {
      cancelled = true
    }
  }, [city.name])

  useEffect(() => {
    if (!weatherData) return
    
    const loadImage = async () => {
      const cityName = weatherData.name
      const key = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''
      
      let seed = 0
      for (let i = 0; i < cityName.length; i++) {
        seed += cityName.charCodeAt(i)
      }
      
      if (!key) {
        setCityImageUrl(`https://picsum.photos/seed/${seed}/800/600`)
        return
      }
      
      try {
        const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(cityName + ' city')}&orientation=landscape&client_id=${key}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setCityImageUrl(data.urls.regular)
        } else {
          setCityImageUrl(`https://picsum.photos/seed/${seed}/800/600`)
        }
      } catch {
        setCityImageUrl(`https://picsum.photos/seed/${seed}/800/600`)
      }
    }
    
    loadImage()
  }, [weatherData])

  const handleRefresh = async () => {
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

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (error && !weatherData) {
    return (
      <div className={styles.card}>
        <div className={styles.error}>
          <h3>{city.name}</h3>
          <p>Error loading weather</p>
          <p className={styles.errorMessage}>
            {error === 'City not found' ? 'City not found' : 'Please try again later'}
          </p>
          <button 
            onClick={handleRefresh} 
            className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
            disabled={isRefreshing}
          >
            <span className={styles.refreshIcon}>↻</span>
            <span>Try again</span>
          </button>
          <button onClick={(e) => handleRemove(e)} className={styles.removeButton}>
            Remove
          </button>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  const weather = weatherData.weather[0]
  const temp = Math.round(weatherData.main.temp)
  const feelsLike = Math.round(weatherData.main.feels_like)

  const imageUrl = cityImageUrl || 'https://picsum.photos/800/600'

  return (
    <div 
      className={styles.card} 
      onClick={handleCardClick}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={styles.header}>
        <h2 className={styles.cityName}>{weatherData.name}</h2>
        <button
          onClick={(e) => handleRemove(e)}
          className={styles.removeButton}
        >
          ×
        </button>
      </div>
      <div className={styles.weatherInfo}>
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
      </div>
      <button 
        onClick={handleRefresh} 
        className={`${styles.refreshButton} ${isRefreshing ? styles.refreshing : ''}`}
        disabled={isRefreshing}
      >
        <span className={styles.refreshIcon}>↻</span>
        <span>Refresh now</span>
      </button>
    </div>
  )
}

