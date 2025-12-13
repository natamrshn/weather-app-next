import citiesReducer, { addCity, removeCity, setCities } from '../slices/citiesSlice'

describe('citiesSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds city', () => {
    const state = { cities: [] }
    const city = { id: 'kyiv-123', name: 'Kyiv' }

    const result = citiesReducer(state, addCity(city))

    expect(result.cities).toHaveLength(1)
    expect(result.cities[0]).toEqual(city)
  })

  it('does not add duplicate', () => {
    const city = { id: 'kyiv-123', name: 'Kyiv' }
    const state = { cities: [city] }

    const result = citiesReducer(state, addCity(city))

    expect(result.cities).toHaveLength(1)
  })

  it('removes city', () => {
    const state = {
      cities: [
        { id: 'kyiv-123', name: 'Kyiv' },
        { id: 'lviv-456', name: 'Lviv' },
      ],
    }

    const result = citiesReducer(state, removeCity('kyiv-123'))

    expect(result.cities).toHaveLength(1)
    expect(result.cities[0].id).toBe('lviv-456')
  })

  it('sets cities', () => {
    const state = { cities: [] }
    const cities = [
      { id: 'kyiv-123', name: 'Kyiv' },
      { id: 'lviv-456', name: 'Lviv' },
    ]

    const result = citiesReducer(state, setCities(cities))

    expect(result.cities).toEqual(cities)
  })
})

