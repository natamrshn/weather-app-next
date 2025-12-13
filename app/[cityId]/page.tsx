'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector } from '@/store/hooks'
import { getForecast, ForecastData } from '@/store/api/weatherApi'
import CityDetail from '@/components/CityDetail/CityDetail'
import styles from './page.module.scss'

export default function CityDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cityId = params.cityId as string
  const cities = useAppSelector((state) => state.cities.cities)
  const city = cities.find((c) => c.id === cityId)

  const [forecastData, setForecastData] = useState<ForecastData | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    if (!city?.name) return

    const fetchForecast = async () => {
      setIsLoading(true)
      try {
        const data = await getForecast(city.name)
        setForecastData(data)
        setError(null)
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchForecast()
  }, [city?.name])

  if (!city) {
    return (
      <div className={styles.errorContainer}>
        <p>City not found</p>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          Return to home
        </button>
      </div>
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
          error={error}
        />
      </div>
    </main>
  )
}

