import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CityCard from '../CityCard/CityCard'
import citiesReducer from '@/store/slices/citiesSlice'
import * as weatherApi from '@/store/api/weatherApi'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/store/api/weatherApi', () => ({
  getCurrentWeather: jest.fn(),
}))

const store = configureStore({
  reducer: { cities: citiesReducer },
})

const city = { id: 'kyiv-123', name: 'Kyiv' }
const weather = {
  weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
  main: { temp: 20, feels_like: 19, pressure: 1013, humidity: 65 },
  wind: { speed: 3.5, deg: 180 },
  name: 'Kyiv',
  id: 123,
}

describe('CityCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading', () => {
    ;(weatherApi.getCurrentWeather as jest.Mock).mockImplementation(() => new Promise(() => {}))

    render(
      <Provider store={store}>
        <CityCard city={city} onRemove={jest.fn()} />
      </Provider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows weather', async () => {
    ;(weatherApi.getCurrentWeather as jest.Mock).mockResolvedValue(weather)

    render(
      <Provider store={store}>
        <CityCard city={city} onRemove={jest.fn()} />
      </Provider>
    )

    expect(await screen.findByText('Kyiv')).toBeInTheDocument()
  })

  it('shows error', async () => {
    ;(weatherApi.getCurrentWeather as jest.Mock).mockRejectedValue(new Error('City not found'))

    render(
      <Provider store={store}>
        <CityCard city={city} onRemove={jest.fn()} />
      </Provider>
    )

    expect(await screen.findByText(/Error loading weather/i)).toBeInTheDocument()
  })

  it('calls onRemove', async () => {
    const onRemove = jest.fn()
    ;(weatherApi.getCurrentWeather as jest.Mock).mockResolvedValue(weather)

    render(
      <Provider store={store}>
        <CityCard city={city} onRemove={onRemove} />
      </Provider>
    )

    expect(await screen.findByText('Kyiv')).toBeInTheDocument()

    screen.getAllByText('×')[0].click()
    expect(onRemove).toHaveBeenCalledWith('kyiv-123')
  })
})

