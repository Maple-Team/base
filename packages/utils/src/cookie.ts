export const getCookie = (name: string) => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift()

export const clearCookies = document.cookie
  .split(';')
  .forEach(
    (cookie) =>
      (document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`))
  )
