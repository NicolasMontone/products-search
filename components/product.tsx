export async function Weather({ city, unit }: { city: string; unit: number }) {
  return (
    <div>
      <h1>Weather in {city}</h1>
      <p>Temperature: 25°C</p>
      <p>Humidity: {unit}%</p>
    </div>
  )
}
