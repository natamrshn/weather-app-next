'use client'

import { useState, FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addCity } from '@/store/slices/citiesSlice'
import { getCurrentWeather } from '@/store/api/weatherApi'
import styles from './AddCityForm.module.scss'

export default function AddCityForm() {
  const [cityName, setCityName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const cities = useAppSelector((state) => state.cities.cities)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (cityName.trim() === '') {
      setError('Enter city name')
      return
    }

    setIsLoading(true)

    try {
      const weatherData = await getCurrentWeather(cityName)
      const cityId = `${weatherData.name.toLowerCase().replace(/\s+/g, '-')}-${weatherData.id}`
      
      const exists = cities.find(
        (city) => city.id === cityId || city.name.toLowerCase() === weatherData.name.toLowerCase()
      )
      
      if (exists) {
        setError('This city is already added')
        setIsLoading(false)
        return
      }
      
      dispatch(addCity({ id: cityId, name: weatherData.name }))
      setCityName('')
    } catch (err: any) {
      if (err?.message === 'City not found') {
        setError('City not found')
      } else {
        setError('Error loading weather')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="Enter city name"
          className={styles.input}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add city'}
        </button>
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </form>
  )
}

