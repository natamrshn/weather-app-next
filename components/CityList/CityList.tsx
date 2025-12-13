'use client'

import { useAppDispatch } from '@/store/hooks'
import { removeCity, City } from '@/store/slices/citiesSlice'
import CityCard from '../CityCard/CityCard'
import styles from './CityList.module.scss'

type CityListProps = {
  cities: City[]
}

export default function CityList({ cities }: CityListProps) {
  const dispatch = useAppDispatch()

  const handleRemove = (id: string) => {
    dispatch(removeCity(id))
  }

  if (cities.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Add a city to see the weather</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {cities.map((city) => (
        <CityCard key={city.id} city={city} onRemove={handleRemove} />
      ))}
    </div>
  )
}

