export const checkHttpStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }

  throw response
}

export const checkHttpSuccess = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  throw response
}
