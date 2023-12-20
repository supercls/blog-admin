
<template>
  <section>
    <d2-container type="full" v-if="!show.edit&&!show.view">
      <section class="data-list-box">
        <mk-search-form :model="query" v-if="permBtn.queryButton" @search="goPage(1)">
          <el-form-item class="inline-item" prop="nickname">
            <el-input v-model.trim="query.params.nickname" @clear="goPage(1)" @keyup.native.enter="goPage(1)"
                      clearable placeholder="输入昵称搜索"
                      size="mini"></el-input>
          </el-form-item>
          <el-form-item class="inline-item" prop="content">
            <el-input v-model.trim="query.params.content" @clear="goPage(1)" @keyup.native.enter="goPage(1)"
                      clearable placeholder="输入留言内容搜索"
                      size="mini"></el-input>
          </el-form-item>
        </mk-search-form>
        <div class="table-operate">
          <table-field-filter :fields="fields" @showChange="updataKey +=1"/>
          <mk-table-button
            dis-delete
            :dis-add="false"
            @add="goEdit"
          >
            <el-button size="mini" icon="el-icon-upload" @click="exportEcx">导出</el-button>
          </mk-table-button>
        </div>
        <mk-el-table @sort="sortChange" :datas="datas" :key="updataKey" :height="tableHeight"
                     :loadingText="loading.text"
                     :loading="loading.list">
          <template v-for="field in fields" v-if="field.show">
            <el-table-column v-if="field.key=='checkBox'" :align="field.align" type="selection"></el-table-column>
            <el-table-column v-else-if="field.key=='toolButton'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <mk-tool-button @view="goView(scope.row)"
                                @edit="goEdit(scope.row)"
                                @delete="goDelete(scope.row)"
                                :dis-delete="!permBtn.deleteButton"
                                :dis-edit="!permBtn.updateButton"
                >
                </mk-tool-button>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='status'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status">是</el-tag>
                <el-tag type="info" v-else>否</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='isAdmin'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.isAdmin">是</el-tag>
                <el-tag type="info" v-else>否</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='img'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.img"
                  :preview-src-list="[scope.row.img]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='content'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <div v-html="scope.row.content"></div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              show-overflow-tooltip
              :prop="field.key"
              :align="field.align"
              :label="field.name"
              :width="field.width"
              :sortable="field.enableSort?'custom':false"
              :fixed="field.fixed"
            ></el-table-column>
          </template>

        </mk-el-table>
        <mk-pagination :current-page="query.offset" :page-size="query.limit"
                       :data-size="temp.dataSize" @go="goPage" @changePageSize="changePageSize"/>
      </section>
    </d2-container>
  </section>
</template>

<script>

import Tools from "@/libs/utils.tool";
import {exportExecl} from "@/libs/util.export";

import {dirWebsiteMessageDelete, dirWebsiteMessageList} from "@/api/modules/sys.website.message.api";
import GetWebsite_messageInfo from "./get-website-message";
import ViewWebsite_messageInfo from "./view-website-message";
import util from "@/libs/util";


export default {
  name: 'dir-website-message',
  components:{ViewWebsite_messageInfo, GetWebsite_messageInfo,},
  data() {
    return {
      show: {
        edit: false,
        view: false
      },
      updateData: {},
      type: '',
      updataKey: 0,
      heightL: 580,
      tableHeight: 580,
      //查询条件
      query: {
        params: {},
        limit: 15,//每页显示条数
        offset: 1,//页码
        sort: {
          prop: 'createdAt',
          order: 'desc',
        }
      },
      //权限按钮
      permBtn: {
        createButton: false,
        queryButton: false,
        deleteButton: false,
        updateButton: false,
      },
      //返回数据列表
      datas: [],
      //临时变量
      temp: {
        //数据总调数
        dataSize: 0,
        //当前选中的id
        id: '',
        //
        item: []
      },
      //汇总数据
      totals: [],
      //加载中效果
      loading: {
        //获取列表数据中
        list: false,
        text: '加载中'
      },
      item_data: {},
      //列表渲染数据列
      fields: [
        {key: 'toolButton', name: '操作', show: true, align: "center", width: '220', enableSort: false, fixed: 'right'},

        {key: 'id', name: 'ID', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'img', name: '头像', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'nickname', name: '昵称', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'email', name: '留言邮箱', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'status', name: '回复状态', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'content', name: '留言内容', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'isAdmin', name: '是否管理员', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'createdAt', name: 'CREATEDAT', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'updatedAt', name: 'UPDATEDAT', show: true, align: "center", enableSort: false, fixed: false},]
    }
  },
  watch: {
    'heightL'(val) {
      this.updataKey += 1
      this.tableHeight = val
    },
  },
  mounted() {
    this.getWinHeight()
    this.getDataList();
    this.getPerms()
  },
  methods: {

    getPerms() {
      let perms = JSON.parse(util.cookies.get('permMenus'))
      if (perms.includes('*')) {
        this.permBtn.createButton = true;
        this.permBtn.queryButton = true;
        this.permBtn.deleteButton = true;
        this.permBtn.updateButton = true;
      } else {
        if (perms.includes('POST /api/private/websiteMessage/create')) {
          this.permBtn.createButton = true;
        }
        if (perms.includes('POST /api/private/websiteMessage/list')) {
          this.permBtn.queryButton = true;
        }
        if (perms.includes('POST /api/private/websiteMessage/update')) {
          this.permBtn.updateButton = true;
        }
        if (perms.includes('POST /api/private/websiteMessage/delete')) {
          this.permBtn.deleteButton = true;
        }
      }
    },

    //导出
    exportEcx() {
      exportExecl(this, this.fields, this.datas, '列表', new Date().toLocaleDateString() + '导出的列表')
    },
    //获取窗口高度
    getWinHeight() {
      let that = this
      this.heightL = window.innerHeight - 320
      window.addEventListener('resize', () => {
        that.updataKey += 1
        that.heightL = window.innerHeight - 320
      })
    },
    getDataList() {
      try {
        this.loading.list = true;
        dirWebsiteMessageList(this.query).then(res => {
          let datas = res.data || []
          for (const data of datas) {
            //时间格式化
            data.createdAt = data.createdAt && Tools.fmtLong2DateTime(data.createdAt)
            data.updatedAt = data.updatedAt && Tools.fmtLong2DateTime(data.updatedAt)
          }
          this.datas = datas;
          this.temp.dataSize = res.count;
          this.loading.list = false;
        })
      } catch (err) {
        this.$message.error('数据加载失败')
        this.loading.list = false;
      }
    },
    goDelete(data) {
      this.$toast.confirm('此操作将永久删除该条数据, 是否继续?').then(() => {
        dirWebsiteMessageDelete(data.id).then(res => {
          this.$toast.success('删除成功')
          this.getDataList()
        }).catch(err => {
          console.log(err)
        })
      });
    },
    close() {
      this.show.edit = false
      this.show.view = false
      this.getDataList()
    },
    //跳到页
    goPage(pageNum) {
      this.query.offset = pageNum
      //查询数据
      this.getDataList();
    },
    //改变每页数据量
    changePageSize(size) {
      this.query.limit = size;
      this.query.offset = 1;
      this.getDataList();
    },
    //重置查询条件
    resetQuery(formName) {
      this.$refs[formName].resetFields();
      this.goPage(1);
    },
    // 排序
    sortChange(row) {
      this.query.sort.order = row.order === 'ascending' ? 'asc' : 'desc'
      this.query.sort.prop = row.prop
      this.getDataList()
    },
    //添加编辑
    goEdit(data) {
      this.$toast.showSmallModal(data && data.id ? '修改' : '增加', GetWebsite_messageInfo, {updateData: data}, data => {
        if (data) {
          this.getDataList()
        }
      })
    },
    //跳转到查看详情
    goView(data) {
      this.$toast.showSmallModal('查看', ViewWebsite_messageInfo, {viewData: data || {}}, data => {
        // console.log(data)
      })
    }
  }
}
</script>

<style scoped>

</style>
