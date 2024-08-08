export const scrollOntoFieldError = (errors: {
  [x: string]: string | undefined
}): void => {
  let firstNameField

  for (const error in errors) {
    if (errors[error]) {
      firstNameField = error
      break
    }
  }

  const element: HTMLElement | null = document.querySelector(
    `[name="${firstNameField}"]`,
  )

  if (element) {
    scrollTo(0, window.pageYOffset + element.getBoundingClientRect().top - 24)
  }
}
