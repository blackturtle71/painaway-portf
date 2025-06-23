export const getDays = () => Array.from(
  { length: 31 }, (_, i) => String(i + 1).padStart(2, '0'),
)

export const getMonths = () => Array.from(
  { length: 12 }, (_, i) => String(i + 1).padStart(2, '0'),
)

export const getYears = (from = 1920, to = new Date().getFullYear()) => Array.from(
  { length: to - from + 1 }, (_, i) => String(to - i),
)
