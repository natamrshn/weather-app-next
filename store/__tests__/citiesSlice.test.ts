import citiesReducer, { addCity, removeCity, setCities, City } from '../slices/citiesSlice'

describe('citiesSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a city', () => {
    const initialState = { cities: [] }
    const newCity: City = { id: 'kyiv-123', name: 'Kyiv' }

    const action = addCity(newCity)
    const state = citiesReducer(initialState, action)

    expect(state.cities).toHaveLength(1)
    expect(state.cities[0]).toEqual(newCity)
  })

  it('does not add duplicate city', () => {
    const existingCity: City = { id: 'kyiv-123', name: 'Kyiv' }
    const initialState = { cities: [existingCity] }

    const action = addCity(existingCity)
    const state = citiesReducer(initialState, action)

    expect(state.cities).toHaveLength(1)
  })

  it('removes a city', () => {
    const cities: City[] = [
      { id: 'kyiv-123', name: 'Kyiv' },
      { id: 'lviv-456', name: 'Lviv' },
    ]
    const initialState = { cities }

    const action = removeCity('kyiv-123')
    const state = citiesReducer(initialState, action)

    expect(state.cities).toHaveLength(1)
    expect(state.cities[0].id).toBe('lviv-456')
  })

  it('sets list of cities', () => {
    const initialState = { cities: [] }
    const newCities: City[] = [
      { id: 'kyiv-123', name: 'Kyiv' },
      { id: 'lviv-456', name: 'Lviv' },
    ]

    const action = setCities(newCities)
    const state = citiesReducer(initialState, action)

    expect(state.cities).toEqual(newCities)
  })
})

