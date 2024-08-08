function isPhone(phone = 'string') {
  const regexToValidatePhone = /^([1-9]{2})(?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/

  // const regexToValidatePhone =
  // /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/

  return regexToValidatePhone.test(phone)
}

export default isPhone
