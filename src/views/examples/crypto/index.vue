<template>
  <div class="hdty-fill hdty-base-bg">
    <div class="hdty-container hdty-scroll">
        <div class="hdty-title">sm2加解密</div>
        <div>
            <hd-input type="text" v-model="sm2Text" placeholder="请输入明文或密文" />
            <hd-button type="primary" @click="sm2Encrypt">加密</hd-button>
            <hd-button type="warning" @click="sm2Decrypt">解密</hd-button>
            <hd-input type="textarea" v-model="sm2Result"/>
        </div>
        <div class="hdty-title">sm3加密（不可逆）
            <el-alert
                title="数据【123abc测试】的预期结果：9551e6b5d289bd1b4b601f42225ac4c181e096d91cf288b1f342aa74f809a320"
                type="success"
                show-icon>
            </el-alert>
            
        </div>
        <div>
            <hd-input type="text" v-model="sm3Text" placeholder="请输入明文"/>
            <hd-button type="primary" @click="sm3Encrypt">加密</hd-button>
            <hd-input type="textarea" :value="sm3Result"/>
        </div>
        <div class="hdty-title">sm4加解密</div>
        <div>
            <hd-input type="text" v-model="sm4Text" placeholder="请输入明文或密文" />
            <hd-button type="primary" @click="sm4Encrypt">加密</hd-button>
            <hd-button type="warning" @click="sm4Decrypt">解密</hd-button>
            <hd-input type="textarea" v-model="sm4Result"/>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  data() {
    return {
        sm3Text: '123abc测试',
        sm3Result: '',
        sm4Text: '123abc测试',
        sm4Result: '',
        password: 'e807f1fcf82d132f9bb018ca6738a19f',
        sm2Text: '123abc测试',
        sm2Result: '',
        // 公钥
        publicKey: '04c0e9a49baa995b3b9601ce97f720bc27539cd00d18a6396abcb9577fb01daa730b484c5c7fd7890efdfa57419968696e59ff00dcab55270bb036a0022445a7c1',
        // 私钥
        privateKey: '14a2a84e96d820b9c9b9b1bf290c710182265a9b8ebdf1af177a98153616a6a6'
    };
  },
  methods: {
    // SM3加密
    sm3Encrypt() {
        this.sm3Result = this.$crypto.sm3Encrypt(this.sm3Text);
    },
    // SM4加密
    sm4Encrypt() {
        this.sm4Result = this.$crypto.sm4Encrypt(this.sm4Text, this.password);
    },
    // SM4解密
    sm4Decrypt() {
        this.sm4Result = this.$crypto.sm4Decrypt(this.sm4Text, this.password);
        console.log(`【${this.sm4Result}】`);
        
    },
    // SM2加密
    sm2Encrypt() {
        this.sm2Result = this.$crypto.sm2Encrypt(this.sm2Text, this.publicKey);
        console.log(this.sm2Result);
    },
    // SM2解密
    sm2Decrypt() {
        this.sm2Result = this.$crypto.sm2Decrypt(this.sm2Text, this.privateKey);
        
    },

  }
};
</script>

<style scoped>
</style>