<template>
  <div class="home">
    <h1>{{status}}</h1>
    <div style="width: 800px; margin: auto;">
      <el-button  type="primary" v-if="isNotLogin" @click="loginWallet()">Login Wax Wallet</el-button>
      <el-button  type="warning" v-else @click="getSlots()">Get Your Panda Slots</el-button>
      <div style="margin-top: 50px;">
        <el-table border v-if="showPandasData" :data="pandasData" stripe style="width: 100%">
          <el-table-column prop="asset_id" label="PandaId" width="160px" />
          <el-table-column label="Img" width="160px">
            <template #default="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="'https://media.wax.io/'+scope.row.asset.data.img+'/'"
                >
                <template #placeholder>
                  <div style="width: 100%; height: 100%" 
                    element-loading-background="rgba(192,192,192,0.3)" 
                    v-loading="true" 
                    element-loading-text="Loading..."
                    >
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="asset.data.rarity" label="Rarity" width="180px"/>
          <el-table-column label="Energy" width="100px">
            <template #default="scope">{{ parseInt(scope.row.energy/100) }}%</template>
          </el-table-column>
          <el-table-column label="Time" width="150px">
            <template #default="scope">
              <FlipDown type="3" :endDate="scope.row.timer*1000"  @timeUp="toAdventure(scope.row.asset_id)"></FlipDown> 
            </template>
          </el-table-column>
        </el-table>
        <el-card class="box-card" style="margin-top: 50px;">
          <template #header>
            <div class="card-header">
              <span>OutPut</span>
            </div>
          </template>
          <div>{{ logmsg }}</div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { ElNotification } from 'element-plus';
import FlipDown from '@/components/vue-flip-down.vue';

export default {
  name: 'Home',
  data() {
    return {
      userAccount: '',
      status: 'Please Login your Wax Wallet',
      isNotLogin : true,
      logmsg: "",
      showPandasData: false,
      pandasData: []
    }
  },
  components: {
    FlipDown
  },
  methods:{
    show(){
      // console.log(this.$wax);
      
    },
    async loginWallet(){
      try {
        this.userAccount = await this.$wax.login();
        this.pubKeys = this.$wax.pubKeys;
        this.status = 'Welcome Back! Dear ' + this.userAccount;
        this.isNotLogin = false;
        ElNotification({title:'Success', message:'Login Wax Wallet Success!Welcome Back!', type:'success'});
      } catch (error) {
        this.logmsg += error;
        ElNotification({title:'Login Error', message: error, type: 'error'});
      }
    },
    async toAdventure(asset_id){
      try {
        const result = await this.$wax.api.transact({
          actions: [{
              account: 'nftpandawofg', // contract account
              name: 'printrand', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                assoc_id: asset_id, // panda_id
                signing_value: Math.floor(Math.random()*10**14)+1 , //a random value
                username: this.$wax.userAccount
              },
          }]
          }, {
          blocksBehind: 3,
          expireSeconds: 30
        });
        this.logmsg += (JSON.stringify(result, null, 2))+'\r\n';
        this.getSlots();
      } catch (error) {
        this.logmsg += error;
        ElNotification({title:'Sign Transcation Error', message: error, type: 'error'});
      }
    },
    async getSlots(){
      try {
        // getSlots
        var result = await this.$wax.rpc.get_table_rows({
          json:true,
          code:"nftpandawofg",
          scope:"nftpandawofg",
          table:"usersnew",
          table_key:"",
          lower_bound: this.$wax.userAccount,
          upper_bound: this.$wax.userAccount,
          index_position: 1,
          key_type: "",
          limit: 1,
          reverse: false,
          show_payer: false
        });
        const slotSort = result.rows[0].slots_count
        this.pandasData.length = result.rows[0].max_slots;
        // console.log('slotSort', slotSort);

        // get pandas
        result = await this.$wax.rpc.get_table_rows({
          code: "nftpandawofg",
          index_position: 2,
          json: true,
          key_type: "i64",
          limit: -1,
          lower_bound: this.$wax.userAccount,
          reverse: true,
          scope: "nftpandawofg",
          show_payer: false,
          table: "nftsongamec",
          table_key: "",
          upper_bound: this.$wax.userAccount,
        });
        result.rows.forEach(async element => {
          if (element.is_in_slot == 1) {
            // get panda's slotnumber
            for (let index = 0; index < slotSort.length; index++) {
              const pid = slotSort[index];
              if (pid == element.asset_id){
                element.asset = await this.$assetApi.getAsset(element.asset_id);
                this.pandasData[index] = element;
              }
            }
          }
        });
        this.showPandasData = true;
        // console.log('pandasData:', this.pandasData);
      } catch (error) {
        this.logmsg += error;
        ElNotification({title:'Sign Transcation Error', message: error, type: 'error'});
      }
    },
  },
  created: async function(){
    // try to auto-logged
    let isAutoLoginAvailable = await this.$wax.isAutoLoginAvailable(); 
      if (isAutoLoginAvailable) { 
        this.userAccount = this.$wax.userAccount;
        this.pubKeys = this.$wax.pubKeys;
        this.isNotLogin = false;
      }else{
        this.status = 'Your account not enable Auto-Logged in, Please Login your Wax Wallet';
      }
  }
}
</script>
