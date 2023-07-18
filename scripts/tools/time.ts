export const getCurrentZuluDay = () => {
  const formattedDate = Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'UTC',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'weekday')
    .value.toUpperCase()
  return formattedDate
}

export const getCurrentZuluHour = () => {
  const formattedDate = Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    timeZone: 'UTC',
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'hour').value
  return formattedDate
}
