<template>
  <section>
    <section class="mk-add-pop">
      <el-form ref="formAdd" :model="form" :rules="rules" label-width="100px">
        <mk-get-row>
          <el-form-item label="头像" prop="img">
            <el-input clearable v-model.trim="form.img" size="mini" style="width: 600px" type="textarea"
                      :rows="3"
                      maxlength="255"
                      show-word-limit
                      placeholder="请输入在线图片地址"
            />
            <mk-upload v-model="form.img"/>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" size="mini" class="input-one" clearable placeholder="请输入昵称"></el-input>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="是否管理员" prop="isAdmin">
            <el-radio-group size="mini" class="input-one" clearable placeholder="请选择是否新年" v-model="form.isAdmin">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </mk-get-row>
        <mk-get-row>
          <el-form-item label="留言邮箱" prop="email">
            <el-input v-model="form.email" size="mini" class="input-one" clearable placeholder="请输入留言邮箱"></el-input>
          </el-form-item>
        </mk-get-row>

        <mk-get-row>
          <el-form-item label="留言内容" prop="content">
            <el-input clearable v-model.trim="form.content" size="mini" style="width: 600px" type="textarea"
                      :rows="2"
                      maxlength="200"
                      show-word-limit
                      placeholder="请输入留言内容"
            />
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

import {dirWebsiteMessageCreate, dirWebsiteMessageUpdate} from "@/api/modules/sys.website.message.api";
import MkUpload from "@/components/common/mk-upload";


export default {
  name: 'get-website_message-info',
  components: {MkUpload, MkBackList, MkGetButton, MkGetRow},
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
        //
        img: [{required: true, message: '请输入头像', trigger: 'blur'},],

        // nickname: [{required: true, message: '请输入昵称', trigger: 'blur'},],
        email: [{required: true, message: '请输入留言邮箱', trigger: 'blur'},],

        // status: [{required: true, message: '请输入回复状态', trigger: 'blur'},],
        content: [{required: true, message: '请输入留言内容', trigger: 'blur'},],

        isAdmin: [{required: true, message: '请输入是否管理员', trigger: 'blur'},],

      }
    }
  },
  methods: {
    save() {
      this.$refs['formAdd'].validate((valid) => {
        if (valid) {
          let _FUC = ''
          _FUC = this.isAdd ? dirWebsiteMessageCreate : dirWebsiteMessageUpdate
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
