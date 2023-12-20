<template>
  <section>
    <section class="mk-add-pop">
      <el-form ref="formAdd" :model="form" :rules="rules" label-width="100px">

        <mk-get-row>
          <el-form-item label="ID" prop="id">
            <el-input v-model="form.id" size="mini" class="input-one" clearable placeholder="请输入ID"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="文件链接" prop="url">
            <el-input v-model="form.url" size="mini" class="input-one" clearable placeholder="请输入文件链接"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="icon" prop="icon">
            <el-input v-model="form.icon" size="mini" class="input-one" clearable placeholder="请输入icon"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="文件后缀" prop="ext">
            <el-input v-model="form.ext" size="mini" class="input-one" clearable placeholder="请输入文件后缀"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="form.name" size="mini" class="input-one" clearable placeholder="请输入文件名称"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="文件大小" prop="size">
            <el-input v-model="form.size" size="mini" class="input-one" clearable placeholder="请输入文件大小"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="文件类型" prop="type">
            <el-input v-model="form.type" size="mini" class="input-one" clearable placeholder="请输入文件类型"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="状态" prop="status">
            <el-input v-model="form.status" size="mini" class="input-one" clearable placeholder="请输入状态"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="备注" prop="content">
            <el-input v-model="form.content" size="mini" class="input-one" clearable placeholder="请输入备注"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="父id" prop="pid">
            <el-input v-model="form.pid" size="mini" class="input-one" clearable placeholder="请输入父id"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="CREATEDAT" prop="createdAt">
            <el-input v-model="form.createdAt" size="mini" class="input-one" clearable placeholder="请输入CREATEDAT"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="UPDATEDAT" prop="updatedAt">
            <el-input v-model="form.updatedAt" size="mini" class="input-one" clearable placeholder="请输入UPDATEDAT"></el-input>
          </el-form-item>
        </mk-get-row>
        <el-divider/>
        <mk-get-button @save="save" @close="close(true)"/>
      </el-form>
    </section>
  </section>

</template>

<script>
import MkGetRow from "@/components/common/mk-get-row";
import MkGetButton from "@/components/common/mk-get-button";
import MkBackList from "@/components/common/mk-back-list";

import {dirFilesCreate, dirFilesUpdate} from "@/api/modules/sys.files.api";


export default {
  name: 'get-files-info',
  components: { MkBackList, MkGetButton, MkGetRow},
  props: {
    updateData: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  created() {

    if (this.updateData && this.updateData.id) {
      this.form = this.updateData
      this.isAdd = false
    }
  },
  data() {
    return {
      commonKey: 0,
      form: {},
      isAdd: true,
      rules: {

        id: [{required: true, message: '请输入ID', trigger: 'blur'},],

        url: [{required: true, message: '请输入文件链接', trigger: 'blur'},],

        icon: [{required: true, message: '请输入icon', trigger: 'blur'},],

        ext: [{required: true, message: '请输入文件后缀', trigger: 'blur'},],

        name: [{required: true, message: '请输入文件名称', trigger: 'blur'},],

        size: [{required: true, message: '请输入文件大小', trigger: 'blur'},],

        type: [{required: true, message: '请输入文件类型', trigger: 'blur'},],

        status: [{required: true, message: '请输入状态', trigger: 'blur'},],

        content: [{required: true, message: '请输入备注', trigger: 'blur'},],

        pid: [{required: true, message: '请输入父id', trigger: 'blur'},],

        createdAt: [{required: true, message: '请输入CREATEDAT', trigger: 'blur'},],

        updatedAt: [{required: true, message: '请输入UPDATEDAT', trigger: 'blur'},],

      }
    }
  },
  methods: {
    save() {
      this.$refs['formAdd'].validate((valid) => {
        if (valid) {
          let _FUC = ''
          _FUC = this.isAdd ? dirFilesCreate : dirFilesUpdate
          _FUC(this.form).then(res => {
            this.$toast.success(this.isAdd ?'添加成功！':'修改成功！')
            this.$emit('close',true);
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    close(show) {
      if (show) {
        this.$toast.confirmSave().then(() => {
          this.$emit('close');
        });
      } else {
        this.$emit('close');
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
