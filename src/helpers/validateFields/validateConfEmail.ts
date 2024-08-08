export const validateConfEmail = (
  email: string,
  confirmEmail: string,
): string => {
  if (email !== confirmEmail || !confirmEmail) {
    return 'Os e-mails preenchidos estão diferentes, por favor verifique os campos E-mail e Confirme seu e-mail.'
  }

  return ''
}
