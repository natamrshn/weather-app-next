import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface City {
  id: string
  name: string
}

interface CitiesState {
  cities: City[]
}

const initialState: CitiesState = {
  cities: [],
}

function saveToLocalStorage(cities: City[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cities', JSON.stringify(cities))
  }
}

const citiesSlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      const exists = state.cities.some((city) => city.id === action.payload.id)
      if (!exists) {
        state.cities.push(action.payload)
        saveToLocalStorage(state.cities)
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city.id !== action.payload)
      saveToLocalStorage(state.cities)
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload
      saveToLocalStorage(state.cities)
    },
  },
})

export const { addCity, removeCity, setCities } = citiesSlice.actions
export default citiesSlice.reducer

