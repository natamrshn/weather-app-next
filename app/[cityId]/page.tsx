'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { getForecast, ForecastData } from '@/store/api/weatherApi'
import CityDetail from '@/components/CityDetail/CityDetail'
import styles from './page.module.scss'

export default function CityDetailPage() {
  const router = useRouter()
  const params = useParams()
  const cityId = params.cityId as string
  const cities = useAppSelector((state) => state.cities.cities)
  const city = cities.find((c) => c.id === cityId)

  const [forecastData, setForecastData] = useState<ForecastData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!city?.name) return

    const loadForecast = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const data = await getForecast(city.name)
        setForecastData(data)
      } catch (err: any) {
        setError(err?.message || 'Error loading forecast')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadForecast()
  }, [city?.name])

  if (!city) {
    return (
      <main className={styles.main}>
        <div className={styles.errorContainer} role="alert">
          <p>City not found</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            Return to home
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ← Back
        </button>
        <CityDetail
          cityName={city.name}
          forecastData={forecastData}
          isLoading={isLoading}
          isError={error !== null}
          error={error ? { message: error } : undefined}
        />
      </div>
    </main>
  )
}

