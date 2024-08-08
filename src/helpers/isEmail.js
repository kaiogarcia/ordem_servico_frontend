function isEmail(email) {
  const regexToValidateEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  return regexToValidateEmail.test(email?.trim())
}

export default isEmail
