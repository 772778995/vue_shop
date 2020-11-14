<template>
  <div>
    Welcome come to my shop-admin-web!
    <div :class="sleep?'sleep':'walk'" @mousedown="sleep=!sleep" @mouseup="sleep=!sleep"></div>
  </div>
</template>

<script>
export default {
  name: 'Welcom',
  data () {
    return {
      sleep: true
    }
  }
}
</script>

<style>
  .sleep { background-image: url(../../../../../assets/img/sleep1.gif); }
  .walk { background-image: url(../../../../../assets/img/sleep2.gif); }
  .sleep, .walk {
    width: 190px; height: 190px;
    cursor: pointer;
    position: absolute;
    right: 100px;
    bottom: 0;
  }
</style>
