import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import AddCityForm from '../AddCityForm/AddCityForm'
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

const weather = {
  weather: [{ main: 'Clear', description: 'clear', icon: '01d' }],
  main: { temp: 20, feels_like: 19, pressure: 1013, humidity: 65 },
  wind: { speed: 3.5, deg: 180 },
  name: 'Kyiv',
  id: 123,
}

describe('AddCityForm', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('shows form', () => {
    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    )

    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument()
    expect(screen.getByText('Add city')).toBeInTheDocument()
  })

  it('shows error for empty input', async () => {
    const user = userEvent.setup()

    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    )

    await user.click(screen.getByText('Add city'))
    await waitFor(() => {
      expect(screen.getByText('Enter city name')).toBeInTheDocument()
    })
  })

  it('adds city', async () => {
    const user = userEvent.setup()
    ;(weatherApi.getCurrentWeather as jest.Mock).mockResolvedValue(weather)

    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    )

    const input = screen.getByPlaceholderText('Enter city name')
    await user.type(input, 'Kyiv')
    await user.click(screen.getByText('Add city'))

    await waitFor(() => {
      expect(input).toHaveValue('')
    })
    expect(store.getState().cities.cities.length).toBe(1)
  })

  it('shows error', async () => {
    const user = userEvent.setup()
    ;(weatherApi.getCurrentWeather as jest.Mock).mockRejectedValue(new Error('City not found'))

    render(
      <Provider store={store}>
        <AddCityForm />
      </Provider>
    )

    await user.type(screen.getByPlaceholderText('Enter city name'), 'InvalidCity')
    await user.click(screen.getByText('Add city'))

    await waitFor(() => {
      expect(screen.getByText(/City not found/i)).toBeInTheDocument()
    })
  })
})

