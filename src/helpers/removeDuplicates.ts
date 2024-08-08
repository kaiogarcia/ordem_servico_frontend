import { AutocompleteOptions } from 'src/components/Form/Autocomplete'

export const removeDuplicatesAutocomplete = (array: AutocompleteOptions[]) => {
  return array.reduce((acc: AutocompleteOptions[], option) => {
    const isDuplicate = acc.some((item) => item.label === option.label)
    if (!isDuplicate) {
      acc.push(option)
    }
    return acc
  }, [])
}
