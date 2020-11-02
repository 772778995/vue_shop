// 设置cookie
const setCookies = (key, value, expires) => {
  // 设置cookie过期时间
  const afterDay = day => {
    const time = new Date()
    time.setDate(time.getDate() + day)
    return time
  }
  expires = afterDay(expires)
  document.cookie = `${key}=${value};expires=${expires}`
}
// 获取cookies的对象
const getCookies = () => {
  const cookies = document.cookie.split('; ')
  const cookiesArr = []
  const cookiesObj = []
  for (let i = 0; i < cookies.length; i++) {
    cookiesArr[i] = cookies[i].split('=')
    cookiesObj[cookiesArr[i][0]] = cookiesArr[i][1]
  }
  return cookiesObj
}
export { setCookies }
export { getCookies }
