'use client'

import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCities } from '@/store/slices/citiesSlice'
import CityList from '@/components/CityList/CityList'
import AddCityForm from '@/components/AddCityForm/AddCityForm'
import styles from './page.module.scss'

export default function Home() {
  const cities = useAppSelector((state) => state.cities.cities)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (cities.length === 0 && typeof window !== 'undefined') {
      const stored = localStorage.getItem('cities')
      if (stored) {
        try {
          const parsedCities = JSON.parse(stored)
          dispatch(setCities(parsedCities))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [dispatch, cities.length])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Weather in Cities</h1>
        <AddCityForm />
        <CityList cities={cities} />
      </div>
    </main>
  )
}

