export const everyFirstLetterCapitalize = (text: string): string => {
  if (!text) {
    return ''
  }

  const loweredText = text.toLowerCase()
  const words = loweredText.trim().split(' ')
  const wordsCleared = words.filter((word) => word !== '')

  for (let index = 0; index < wordsCleared.length; index++) {
    const word = wordsCleared[index]

    const firstLetter = word[0]

    const newWord = firstLetter.toUpperCase() + word.slice(1)

    wordsCleared[index] = newWord
  }

  return wordsCleared.join(' ')
}
