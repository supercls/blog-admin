<template>
  <d2-container class="page">
    <el-button @click="getDataList" type="primary" icon="el-icon-refresh" size="mini">刷新</el-button>
    <mk-chart v-loading="loading" :charData="charData" width="75%" style="margin: 0 auto" :key="Max" :Max="Max"/>

    <section class="welcome">
      <div class="bubbling">Be encouraged in time, time waits for no one.</div>
      <br/>
      <div class="bubbling1">" 及时当勉励，岁月不待人. "</div>

    </section>
    <section class="info-box">
      <el-card class="box-card" style="margin-top: 40px">
        <el-descriptions title="网站浏览信息">
          <el-descriptions-item  :key="refresh_key" label="文章总浏览数">
            <el-tag size="small" >{{ viewCounts }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :key="refresh_key+1" label="文章总评价数">
            <el-tag size="small"  >{{ commentsCount }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <section style="display: flex;" v-if="show.btn">
          <el-card shadow="hover" style="width: 400px;margin-right: 15px">
            <el-badge :key="refresh_key+2" :value="comments.count" class="item">
              <el-collapse accordion style="width: 340px">
                <el-collapse-item title="今日评论" name="1">
                  <div v-for="(item,index) in comments.rows" :key="index" class="com-item">
                    <p style="color: #a7a7a7"><i class="el-icon-date" style="color: #00b8ff"></i> {{
                        new Date(item.createdAt).toLocaleDateString() + ' ' + new Date(item.createdAt).toLocaleTimeString()
                      }}</p>
                    <p style="color: #a7a7a7;border-bottom: 1px solid #eee"><i class="el-icon-document"
                                                                               style="color: #00b8ff"></i> <
                      {{ item.article_title || '-' }} ></p>
                    <p v-html="item.content"></p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-badge>
          </el-card>
          <el-card shadow="hover" style="width: 400px">
            <el-badge :key="refresh_key+3" :value="message.count" class="item">
              <el-collapse accordion style="width: 340px">
                <el-collapse-item title="今日留言" name="1">
                  <div v-for="(item,index) in message.rows"  :key="index" class="com-item">
                    <p style="color: #a7a7a7"><i class="el-icon-date" style="color: #00b8ff"></i> {{
                        new Date(item.createdAt).toLocaleDateString() + ' ' + new Date(item.createdAt).toLocaleTimeString()
                      }}</p>
                    <p style="color: #a7a7a7;border-bottom: 1px solid #eee"><i class="el-icon-document"
                                                                               style="color: #00b8ff"></i> <
                      {{ item.email.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2") || '-' }} ></p>
                    <p v-html="item.content"></p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-badge>
          </el-card>
        </section>

      </el-card>
    </section>
    <section style="margin-top: 40px" v-if="show.btn">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>快捷通道</span>
        </div>
        <el-button-group style="margin-bottom: 10px">
          <el-button type="primary" icon="el-icon-edit" @click="goMenu('a')">博文编写</el-button>
          <el-button type="primary" icon="el-icon-s-tools" @click="goMenu('b')">站点管理</el-button>
          <el-button type="primary" icon="el-icon-s-custom" @click="goMenu('c')">友链管理</el-button>
          <el-button type="primary" icon="el-icon-c-scale-to-original" @click="goMenu('d')">前台客户端</el-button>
        </el-button-group>
      </el-card>
    </section>
  </d2-container>
</template>
<script>
import D2Badge from './components/d2-badge'
import D2Help from './components/d2-help'
import D2PageCover from './components/d2-page-cover'
import MkMdEditor from "@/components/md-editor";
import MkIpCard from "@/components/common/mk-ip-card";
import MkChart from "@/components/common/mk-chart";
import {getArticleGroup, queryNowMsgAndComments} from "@/api/modules/sys.index.api";
import D2ContainerCard from "@/components/d2-container/components/d2-container-card";

export default {
  components: {
    D2ContainerCard,
    MkChart,
    MkIpCard,
    MkMdEditor,
    D2Badge,
    D2Help,
    D2PageCover
  },
  data() {
    return {
      show: {
        btn: false
      },
      viewCounts: 0,
      refresh_key: 0,
      commentsCount: 0,
      message: {},
      comments: {},
      loading: false,
      monthData: [],
      charData: [],
      Max: 0,
      query: {
        //查询推荐并且按是否顶置查询
        params: {},
        limit: 20,//每页条数
        offset: 1,//当前页
        sort: {
          prop: 'isTop',
          order: 'desc',
        },
        // group: 'id',
      },

    }
  },
  updated() {
    if (this.$store.state.d2admin.perms.permsArr.includes('*')) {
      this.show.btn = true
    }
  },
  mounted() {
    this.getDataList()
    if (this.$store.state.d2admin.perms.permsArr.includes('*')) {
      this.show.btn = true
    }
  },
  methods: {
    getDataList() {
      this.loading = true

      getArticleGroup(this.query).then(res => {
        this.monthData = res.monthData
        this.charData = res.dayData
        let max = 0
        for (const charData of this.charData) {
          if (charData[1] > max) {
            max = charData[1]
          }
        }
        this.Max = max
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
      this.getNowMsgAndCom()
    },
    getNowMsgAndCom() {
      queryNowMsgAndComments({}).then(res => {
        this.refresh_key +=1
        this.comments = res.comments
        this.message = res.message
        this.viewCounts = res.viewCounts
        this.commentsCount = res.commentsCount
      })
    },
    goMenu(type) {
      switch (type) {
        case 'a':
          this.$router.push({path: '/dir-article-info'})
          break;
        case 'b':
          this.$router.push({path: '/dir-website-info'})
          break
        case 'c':
          this.$router.push({path: '/dir-friends-info'})
          break
        case 'd':
          window.open('https://www.baidu.com/', '_blank')
          break
      }
    }
  },


}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Bubblegum+Sans&display=swap');

.page {
  .logo {
    width: 120px;
  }

  .btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    line-height: 12px;
    margin-top: 0px;
    margin-bottom: 20px;

    .btn-group__btn {
      color: $color-text-sub;

      &:hover {
        color: $color-text-main;
      }

      &.btn-group__btn--link {
        color: $color-primary;
      }
    }
  }

}

.welcome {

  padding-top: 35px;
  text-align: center;
  //background: #3498db;
  border-radius: 5px;


  .bubbling {
    position: relative;
    z-index: 2;
    display: inline-block;
    color: #ffffff;
    font-size: 2.5rem;
    font-family: 'Bubblegum Sans', cursive;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 5px #525252;
  }

  .bubbling1 {
    font-size: .8rem;
    padding-top: 10px;
    font-family: 'Bubblegum Sans', cursive;
  }

  .bubble {
    position: absolute;
    background: #f80000;
    border-radius: 100%;
    z-index: 9999;
  }
}

.com-item {
  border-radius: 5px;
  border: 1px dotted #00b8ff;
  padding: 0px 5px;
  margin-bottom: 8px;
}

.info-box {
  position: relative;

  .gitee-tag {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
