'use client'

import { ForecastData } from '@/store/api/weatherApi'
import styles from './CityDetail.module.scss'

type CityDetailProps = {
  cityName: string
  forecastData?: ForecastData
  isLoading: boolean
  isError: boolean
  error?: any
}

export default function CityDetail({
  cityName,
  forecastData,
  isLoading,
  isError,
  error,
}: CityDetailProps) {
  if (isLoading) {
    return (
      <article className={styles.container}>
        <div className={styles.loading} role="status" aria-live="polite">Loading forecast...</div>
      </article>
    )
  }

  if (isError) {
    return (
      <article className={styles.container}>
        <div className={styles.error} role="alert">
          <h2>{cityName}</h2>
          <p>Error loading forecast</p>
          <p className={styles.errorMessage}>
            {error?.message === 'City not found' ? 'City not found' : 'Please try again later'}
          </p>
        </div>
      </article>
    )
  }

  if (!forecastData || !forecastData.list) {
    return (
      <article className={styles.container}>
        <div className={styles.error} role="alert">No forecast data available</div>
      </article>
    )
  }

  const hourlyForecast = forecastData.list.slice(0, 8)
  const temps = hourlyForecast.map((item) => Math.round(item.main.temp))
  const minTemp = Math.min(...temps)
  const maxTemp = Math.max(...temps)
  const tempRange = maxTemp - minTemp || 1

  return (
    <article className={styles.container}>
      <header>
        <h1 className={styles.title}>{forecastData.city.name}</h1>
        <div className={styles.currentInfo}>
          <p className={styles.country}>{forecastData.city.country}</p>
        </div>
      </header>

      <section className={styles.forecastSection}>
        <h2 className={styles.sectionTitle}>Hourly Forecast (24 hours)</h2>
        <div className={styles.temperatureChart}>
          <div className={styles.chartContainer}>
            {hourlyForecast.map((item) => {
              const temp = Math.round(item.main.temp)
              const height = ((temp - minTemp) / tempRange) * 100
              const date = new Date(item.dt * 1000)
              const time = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })

              return (
                <div key={item.dt} className={styles.chartItem}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.tempBar}
                      style={{ height: `${Math.max(height, 10)}%` }}
                    >
                      <span className={styles.tempValue}>{temp}°</span>
                    </div>
                  </div>
                  <div className={styles.timeLabel}>{time}</div>
                  <div className={styles.weatherIcon}>
                    <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                      alt={item.weather[0].description}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className={styles.chartLegend}>
            <span>Min: {minTemp}°</span>
            <span>Max: {maxTemp}°</span>
          </div>
        </div>

        <div className={styles.forecastList}>
          {hourlyForecast.map((item) => {
            const date = new Date(item.dt * 1000)
            const time = date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
            const temp = Math.round(item.main.temp)
            const feelsLike = Math.round(item.main.feels_like)
            const windDirection = item.wind.deg || 0
            const windSpeed = item.wind.speed
            const pressure = item.main.pressure
            const humidity = item.main.humidity
            const visibility = item.visibility ? (item.visibility / 1000).toFixed(1) : null
            const cloudiness = item.clouds?.all || 0

            const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
            const windDir = dirs[Math.round(windDirection / 45) % 8] || 'N'

            return (
              <div key={item.dt} className={styles.forecastItem}>
                <div className={styles.forecastHeader}>
                  <div className={styles.forecastTimeSection}>
                    <div className={styles.forecastTime}>{time}</div>
                    <div className={styles.forecastDate}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className={styles.forecastTempMain}>
                    <span className={styles.forecastTempValue}>{temp}°</span>
                    <span className={styles.forecastFeelsLike}>Feels like {feelsLike}°</span>
                  </div>
                </div>

                <div className={styles.forecastBody}>
                  <div className={styles.forecastWeather}>
                    <div className={styles.weatherIconWrapper}>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        className={styles.forecastIcon}
                      />
                    </div>
                    <div className={styles.forecastDescription}>
                      <p className={styles.forecastMain}>{item.weather[0].main}</p>
                      <p className={styles.forecastDesc}>{item.weather[0].description}</p>
                    </div>
                  </div>

                  <div className={styles.forecastDetails}>
                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>💧</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Humidity</span>
                        <span className={styles.detailValue}>{humidity}%</span>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${humidity}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>💨</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Wind</span>
                        <span className={styles.detailValue}>
                          {windSpeed.toFixed(1)} m/s
                        </span>
                        <div className={styles.windDirection}>
                          <span className={styles.windArrow} style={{ transform: `rotate(${windDirection}deg)` }}>
                            ↑
                          </span>
                          <span className={styles.windDirText}>{windDir}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>🌧️</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Precipitation</span>
                        <span className={styles.detailValue}>{Math.round(item.pop * 100)}%</span>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${Math.round(item.pop * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>📊</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Pressure</span>
                        <span className={styles.detailValue}>{pressure} hPa</span>
                      </div>
                    </div>

                    {visibility && (
                      <div className={styles.detailCard}>
                        <div className={styles.detailIcon}>👁️</div>
                        <div className={styles.detailContent}>
                          <span className={styles.detailLabel}>Visibility</span>
                          <span className={styles.detailValue}>{visibility} km</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.detailCard}>
                      <div className={styles.detailIcon}>☁️</div>
                      <div className={styles.detailContent}>
                        <span className={styles.detailLabel}>Cloudiness</span>
                        <span className={styles.detailValue}>{cloudiness}%</span>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${cloudiness}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </article>
  )
}

