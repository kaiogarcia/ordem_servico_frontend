export type FromApiProps = {
  _id: string
  description: string
  laudos: string[]
  value: number
  user?: string
  __v?: 0
}

export type ResponseApiService = {
  description: string
  _id: string
  value: number
  laudoService: string
  laudos: string[]
}

export const fromApiService = (data: FromApiProps): ResponseApiService => {
  return {
    description: data.description,
    _id: data._id,
    value: data.value,
    laudoService: '',
    laudos: data.laudos,
  }
}
