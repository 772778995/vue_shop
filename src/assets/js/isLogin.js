const isLogin = () => {
  this.$axios.post(
    '/login.php',
    this.localPsd
  ).then(res => {
    if (res.status !== 200) {
      this.$router.push('/loginAndRegiste/login')
    }
  })
}
export { isLogin }
