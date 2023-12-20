<template>
  <section>
    <d2-container type="full" v-if="!show.edit&&!show.view">
      <section class="data-list-box">
        <mk-search-form :model="query" v-if="permBtn.queryButton" @search="goPage(1)">
          <el-form-item class="inline-item" prop="name">
            <el-input v-model.trim="query.params.name" @clear="goPage(1)" @keyup.native.enter="goPage(1)"
                      clearable placeholder="输入文件名称搜索"
                      size="mini"></el-input>
          </el-form-item>
<!--          <el-form-item class="inline-item" prop="type">-->
<!--            <el-input v-model.trim="query.params.type" @clear="goPage(1)" @keyup.native.enter="goPage(1)"-->
<!--                      clearable placeholder="输入文件类型搜索"-->
<!--                      size="mini"></el-input>-->
<!--          </el-form-item>-->

<!--          <el-form-item class="inline-item" prop="status">-->
<!--            <el-input v-model.trim="query.params.status" @clear="goPage(1)" @keyup.native.enter="goPage(1)"-->
<!--                      clearable placeholder="输入状态搜索"-->
<!--                      size="mini"></el-input>-->
<!--          </el-form-item>-->
        </mk-search-form>
        <div class="table-operate">
          <table-field-filter :fields="fields" @showChange="updataKey +=1"/>
          <mk-table-button
            dis-delete
            :dis-add="true"
            @add="goEdit"
          >
            <MkUploadFile v-if="permBtn.createButton" @handleSuccess="goPage(1)"/>
<!--            <el-button size="mini" icon="el-icon-upload" @click="exportEcx">导出</el-button>-->
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
                                :dis-edit="true"
                                :dis-view="true"
                >
                  <el-button type="success"  v-if="scope.row.url&&permBtn.downloadButton" size="mini" @click="downloadFile(scope.row.name)">下载</el-button>
                </mk-tool-button>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='status'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status">正常</el-tag>
                <el-tag type="info" v-else>禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else-if="field.key=='icon'" :align="field.align" :label="field.name"
                             :width="field.width" :fixed="field.fixed">
              <template slot-scope="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.icon"
                  :preview-src-list="[scope.row.img]">
                </el-image>
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
import {dirFilesDelete, dirFilesFindOne, dirFilesList} from "@/api/modules/sys.files.api";
import GetFilesInfo from "./get-files-info";
import ViewFilesInfo from "./view-files-info";
import util from "@/libs/util";
import MkUpload from "@/components/common/mk-upload";
import MkUploadFile from "@/components/common/mk-upload-file";


export default {
  name: 'dir-files-info',
  components: {MkUploadFile, MkUpload, ViewFilesInfo, GetFilesInfo,},
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
        downloadButton: false,
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
        {key: 'toolButton', name: '操作', show: true, align: "center", width: '160', enableSort: false, fixed: 'right'},
        // {key: 'id', name: 'ID', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'url', name: '文件链接', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'icon', name: 'icon', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'name', name: '文件名称', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'ext', name: '文件后缀', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'size', name: '文件大小', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'type', name: '文件类型', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'status', name: '状态', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'content', name: '备注', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'pid', name: '父id', show: true, align: "center", enableSort: false, fixed: false},
        {key: 'createdAt', name: '上传时间', show: true, align: "center", enableSort: false, fixed: false},
        // {key: 'updatedAt', name: '修改时间', show: true, align: "center", enableSort: false, fixed: false},
      ]
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
      // let perms = this.$store.state.d2admin.perms.permsArr
      let perms = JSON.parse(util.cookies.get('permMenus'))
      if (perms.includes('*')) {
        this.permBtn.createButton = true;
        this.permBtn.queryButton = true;
        this.permBtn.deleteButton = true;
        this.permBtn.updateButton = true;
        this.permBtn.downloadButton = true;
      } else {
        if (perms.includes('POST /api/private/files/create')) {
          this.permBtn.createButton = true;
        }
        if (perms.includes('POST /api/private/files/list')) {
          this.permBtn.queryButton = true;
        }
        if (perms.includes('POST /api/private/files/update')) {
          this.permBtn.updateButton = true;
        }
        if (perms.includes('POST /api/private/files/delete')) {
          this.permBtn.deleteButton = true;
        }
        if (perms.includes('POST /api/private/files/findOne')) {
          this.permBtn.downloadButton = true;
        }
      }
    },
    //下载文件
    downloadFile(id){
      dirFilesFindOne(id).then(res=>{
        var blob = new Blob([res]);
        // 创建一个URL对象
        var url = window.URL.createObjectURL(blob);
        // 创建一个a标签
        var a = document.createElement("a");
        a.href = url;
        a.download = id;// 这里指定下载文件的文件名
        a.click();
        // 释放之前创建的URL对象
        window.URL.revokeObjectURL(url);
      }).catch(err=>{
        console.log(err)
      })
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
        dirFilesList(this.query).then(res => {
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
        dirFilesDelete({id:data.id,name:data.name}).then(res => {
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
      this.$toast.showSmallModal(data && data.id ? '修改' : '增加', GetFilesInfo, {updateData: data}, data => {
        if (data) {
          this.getDataList()
        }
      })
    },
    //跳转到查看详情
    goView(data) {
      this.$toast.showSmallModal('查看', ViewFilesInfo, {viewData: data || {}}, data => {
        // console.log(data)
      })
    }
  }
}
</script>

<style scoped>

</style>
