export const Required = '!'

export const titleize = (str: string) => {
  if (typeof str !== 'string') {
    throw new TypeError('String Required')
  }
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function (m) {
    return m.toUpperCase()
  })
}
