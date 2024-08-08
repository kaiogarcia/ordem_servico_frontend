import { AutocompleteOptions } from 'src/components/Form/Autocomplete'

export const fromApi = (data: any[]): AutocompleteOptions[] => {
  return data?.map((item) => ({
    label: item.expense,
    value: item._id,
  }))
}
