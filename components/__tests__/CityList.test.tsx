import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CityList from '../CityList/CityList'
import citiesReducer from '@/store/slices/citiesSlice'

const store = configureStore({
  reducer: {
    cities: citiesReducer,
  },
})

describe('CityList', () => {
  it('shows empty message', () => {
    render(
      <Provider store={store}>
        <CityList cities={[]} />
      </Provider>
    )

    expect(screen.getByText('Add a city to see the weather')).toBeInTheDocument()
  })

  it('shows cities', () => {
    const cities = [
      { id: 'kyiv-123', name: 'Kyiv' },
      { id: 'lviv-456', name: 'Lviv' },
    ]

    render(
      <Provider store={store}>
        <CityList cities={cities} />
      </Provider>
    )

    expect(screen.queryByText('Add a city to see the weather')).not.toBeInTheDocument()
  })
})

