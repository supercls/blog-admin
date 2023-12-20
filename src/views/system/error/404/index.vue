<template>

  <div>
    <section class="error-page">
      <div class="info">
        <img src="https://storytale-public2.b-cdn.net/2021/08/16/79ea3d66-1f76-4b28-ae87-a77aa9a7dbb0-Sailor.png?height=348"/>
        <h2 class="error-title"> 404 ERROR</h2>
        <p>您所访问的页面不存在，它或已被移动，删除或者重命名。</p>
        <p>请访问其他页面</p>
        <div class="btn">
          <el-button size="mini" @click="goHome" style="margin-right:3px">首页</el-button>
          <el-button size="mini" @click="goBack" style="margin-left:20px">返回上一页</el-button>
        </div>
      </div>
    </section>
  </div>

</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.replace({ path: '/' });
    }
  }
};
</script>

<style lang="scss" scoped>
.error-page {
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: calc(100vh - 200px);
  box-sizing: border-box;
  text-align: center;
  .error-title {
    font-size: 35px;
    padding-bottom: 3px;
    font-weight: bold;
  }
  p {
    font-size: 13px;
    padding: 5px 0;
  }
  img {
    width: 100%;
  }

}
</style>
