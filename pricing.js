// Публичная сетка Ntags. Цены Standard включают доставку.
export const pricing = {
  standard: [
    { min: 1, max: 1, pricePerUnit: 1190 },
    { min: 2, max: 4, pricePerUnit: 1090 },
    { min: 5, max: 9, pricePerUnit: 990 },
    { min: 10, max: 19, pricePerUnit: 890 },
    { min: 20, max: 49, pricePerUnit: 790 },
    { min: 50, max: null, pricePerUnit: 690, from: true },
  ],
  custom: [
    { min: 1, max: null, pricePerUnit: null },
  ],
}

export function bandFor(product, quantity) {
  const bands = pricing[product]
  if (!bands) return null
  return bands.find((item) => quantity >= item.min && (item.max === null || quantity <= item.max)) || null
}

export function unitPriceFor(product, quantity) {
  return bandFor(product, quantity)?.pricePerUnit ?? null
}

export function quoteFor(product, quantity) {
  const unit = unitPriceFor(product, quantity)
  return unit == null ? null : unit * quantity
}

export function isStartingPrice(product, quantity) {
  return bandFor(product, quantity)?.from === true
}

export function bandLabel(product, quantity) {
  if (product === 'custom') return 'Индивидуальный расчёт'
  const band = bandFor(product, quantity)
  if (!band) return 'Индивидуальный расчёт'
  return band.max === null ? `от ${band.min} шт.` : band.min === band.max ? `${band.min} шт.` : `${band.min}–${band.max} шт.`
}