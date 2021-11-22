<template>
  <div class="home">
    <h1>{{status}}</h1>
    <div style="width: 800px; margin: auto;">
      <el-button  type="primary" v-if="isNotLogin" @click="loginWallet()">Login Wax Wallet</el-button>
      <el-button  type="warning" v-else @click="getSlots()">Get Your Power!</el-button>
      <div style="margin-top: 50px;">
        <el-tabs type="border-card">
          <!--Heros-->
          <el-tab-pane  label="Heros">
            <template #label>
              <span>
                <el-icon><user-filled /></el-icon>Heros
              </span>
            </template>
            <el-table border v-if="showPandasData" :data="pandasData" stripe style="width: 100%">
              <el-table-column prop="asset_id" label="PandaId" width="160px" />
              <el-table-column label="Img" width="160px">
                <template #default="scope">
                  <el-image
                    style="width: 100px; height: 100px"
                    referrerPolicy="no-referrer"
                    :src="'https://ipfs.atomichub.io/ipfs/'+scope.row.asset.data.img+'/'"
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
          </el-tab-pane>
          <!--Foods-->
          <el-tab-pane label="Foods">
            <template #label>
              <span>
                <el-icon><bowl /></el-icon>Foods
              </span>
            </template>
            <el-row v-if="foodsData">
              <el-col
                v-for="x in foodsData"
                :key="x"
                :span="6"
                style="margin-left: 10px;"
              >
                <el-card
                  :body-style="{margin: '14px'}"
                >
                  <el-image
                  style="width: 100px; height: 100px"
                  referrerPolicy="no-referrer"
                  :src="'https://ipfs.atomichub.io/ipfs/'+x[0].img+'/'"
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
                  <div style="padding 14px;">
                      <span>{{ x[0].rarity }} Food</span><br>
                      <el-button type="text">Left {{x.length}}</el-button>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!--Config-->
          <el-tab-pane label="Config">
            <template #label>
              <span>
                <el-icon><cpu /></el-icon>Config
              </span>
            </template>
            
            <div style="margin: 10px auto; padidng: auto;">
              <el-row>
                <el-col :span="4"></el-col>
                <el-col :span="8">Auto Adventure:</el-col>
                <el-col :span="8">
                  <el-switch
                    v-model="isAutoAdventure" 
                    active-color="#13ce66" 
                  />
                </el-col>
                <el-col :span="4"></el-col>
              </el-row>
              <el-row style="margin-top: 10px;" >
                <el-col :span="4"></el-col>
                <el-col :span="8">Auto Feed Food:</el-col>
                <el-col :span="8">
                  <el-switch
                    v-model="isAutoFeedFood" 
                    active-color="#13ce66" 
                  />
                </el-col>
                <el-col :span="4"></el-col>
              </el-row>
              <el-row style="margin-top: 10px;" >
                <el-col :span="4"></el-col>
                <el-col :span="8">Auto Buy Food:</el-col>
                <el-col :span="8">
                  <el-switch 
                    v-model="isAutoBuyFood" 
                    active-color="#13ce66" 
                  />
                </el-col>
                <el-col :span="4"></el-col>
              </el-row>
              <el-row >
                <el-col :span="10" style="padding-top: 10px;"> Energy Below 10 Buy Quantity:</el-col>
                <el-col :span="14">
                  <el-slider
                    v-if="isAutoBuyFood" 
                    v-model="autoBuyQuantity" 
                    show-input
                    :min="1"
                    :max="10"
                  />
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <!--Output-->
          <el-tab-pane label="Output">
            <template #label>
              <span>
                <el-icon><calendar /></el-icon>Output
              </span>
            </template>
            <el-card class="box-card" style="margin-top: 10px;">
              <template #header>
                <div class="card-header">
                  <span>OutPut</span>
                </div>
              </template>
              <div v-html="logmsg"></div>
            </el-card>
          </el-tab-pane>
        </el-tabs>


      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import FlipDown from '@/components/vue-flip-down.vue';
import { h } from 'vue';
import dayjs from 'dayjs';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default {
  name: 'Home',
  data() {
    return {
      userAccount: '',
      status: 'Please Login your Wax Wallet',
      isNotLogin : true,
      logmsg: "",
      showPandasData: false,
      pandasData: [],
      foodsData: {},
      isAutoAdventure: true,
      isAutoFeedFood: true,
      isAutoBuyFood: true,
      feedFoodEnergy: 10,
      autoBuyQuantity: 1,
    }
  },
  components: {
    FlipDown
  },
  methods:{
    show_logmsg(msg){
      this.logmsg = dayjs().format('YYYY-MM-DD HH:mm:ssZ') + ' ' + msg + '\r\n<br>' + this.logmsg;      
    },
    async getFoodCost(rarity, quantity){
      switch (rarity) {
        case "Common":
          return quantity * 0.11;
        case "Uncommon":
          return quantity * 0.22;
        case "Rare":
          return quantity * 0.6;
        case "Epic":
          return quantity * 1;
        case "Legendary":
          return quantity * 4;
        case "Mythic":
          return quantity * 12;
        default:
          break;
      }
    },
    async loginWallet(){
      try {
        this.userAccount = await this.$wax.login();
        this.pubKeys = this.$wax.pubKeys;
        this.status = 'Welcome Back! Dear ' + this.userAccount;
        this.isNotLogin = false;
        this.$notify.success({title:"Success", message: "Login Wax Wallet Success!Welcome Back!", duration: 0});
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Login Error', message: error});
      }
    },
    async getPandaObj(asset_id){
      try {
        let e = {};
        this.pandasData.forEach(element => {
          if (element.assoc_id == asset_id){
            e = element;
            return;
          }
        });
        return e;
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Get Panda Object Error', message: error});
      }

    },
    async reload(){
      try {
        await sleep(1000);
        this.getSlots();
        await sleep(1000);
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Reload Error', message: error});
      }
      
    },
    async feedFood(asset_id, food_id){
      try {
        console.log({
          actions: [{
              account: 'atomicassets', // contract account
              name: 'transfer', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                asset_ids: [food_id], // food_id
                memo: `eatpanda ${asset_id} ${food_id} `,
                from: this.$wax.userAccount,
                to: 'nftpandawofg',
              },
          }],
        },{
          blocksBehind: 3,
          expireSeconds: 30
        });
        const result = await this.$wax.api.transact(
        {
          actions: [{
              account: 'atomicassets', // contract account
              name: 'transfer', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                asset_ids: [food_id], // food_id
                memo: `eatpanda ${asset_id} ${food_id} `,
                from: this.$wax.userAccount,
                to: 'nftpandawofg',
              },
          }],
        },{
          blocksBehind: 3,
          expireSeconds: 30
        }); 
        console.log('Feed Food:',result);
        this.$notify.success({title:'Feed Food Success', message: `Panda ${asset_id} Feed Food Success`});
        // refresh foodsData
        this.refreshFoodsData();
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Feed Food Error', message: error});
      }
    },
    async refreshFoodsData() {
      try {
        let foodsData_json = JSON.stringify(this.foodsData);
        while (foodsData_json == JSON.stringify(this.foodsData)){
          await sleep(1000);
          this.getFoods();
        }
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Refresh FoodsData Error', message: error});
      }
    },
    async buyFood(rarity, quantity){
      try {
        const result = await this.$wax.api.transact({
          actions: [{
              account: 'nftpandabamb', // contract account
              name: 'transfer', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                memo: `buyeat ${rarity.toLowerCase()} ${quantity} `,
                quantity: `${(await this.getFoodCost(rarity,quantity)).toFixed(4)} BAM`,
                from: this.$wax.userAccount,
                to: 'nftpandawofg',
              },
          }],
        },{
          blocksBehind: 3,
          expireSeconds: 30
        });
        console.log('buyFood:',result);
        this.show_logmsg(`Buy ${rarity} Food * ${quantity} Success`);
        this.$notify.success({title:'Buy Food Success', message: `Buy ${rarity} Food * ${quantity} Success`});
        // refresh foodsData
        this.refreshFoodsData();
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Buy Food Error', message: error});
      }
    },
    async toAdventure(asset_id){
      try {
        if (!this.isAutoAdventure){
          return;
        }
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
        // console.log('toAdventure.result', result);
        let bam = 0;
        if (result.processed.action_traces.length != 0){
          result.processed.action_traces.forEach(element => {
            if (element.inline_traces.length != 0) {
              bam = element.inline_traces[0].act.data.quantity;
              return;
            }else{
              bam = '0.0000 BAM';
            }
          });
        }else{
          bam = '0.0000 BAM';
        }
        this.show_logmsg('Panda-'+ asset_id + ' Got ' + bam);
        this.reload(asset_id);
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Adventure Error', message: error});
        await sleep(1000);
        this.reload(asset_id);
      }
    },
    async getFoods(){
      try {
        this.foodsData = {};
        let result = await this.$assetApi.getAssets({
          owner: this.$wax.userAccount,
          collection_name: "nftpandawaxp",
          schema_name: "food",
        });
        result.forEach(element => {
          let food = {
            assetid: element.asset_id,
            img: element.data.img,
            rarity: element.data.rarity,
          };
          // is food's rarity exist
          if (!this.foodsData[element.data.rarity]){
            this.foodsData[element.data.rarity] = new Array();
          }
          this.foodsData[element.data.rarity].push(food);
        });
        console.log('foodsData', this.foodsData);
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Get Foods Error', message: error});
      }
    },
    async getSlots(){
      try {
        // getFoods
        this.getFoods()
        // getSlots
        let result = await this.$wax.rpc.get_table_rows({
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
              if (pid == element.asset_id) {
                element.asset = await this.$assetApi.getAsset(element.asset_id);
                // is Auto-Feed Food?
                if (this.isAutoFeedFood) {
                  if (parseInt(element.energy/100) <= this.feedFoodEnergy) {
                    // is have rarity food?
                    if (this.foodsData[element.asset.data.rarity]) {
                      // feed food
                      await this.feedFood(element.asset_id, this.foodsData[element.asset.data.rarity][0].assetid);
                    }else{
                      this.show_logmsg(`${element.asset.data.rarity} Food dont enough, We need more.`);
                      // to buy food
                      await this.buyFood(element.asset.data.rarity, this.autoBuyQuantity);
                    }
                  }
                }
                this.pandasData[index] = element;
              }
            }
          }
        });
        this.showPandasData = false;
        this.showPandasData = true;
        // console.log('pandasData:', this.pandasData);
      } catch (error) {
        this.show_logmsg(error);
        this.$notify.error({title:'Get Slots Error', message: error});
      }
    },
  },
  created: async function(){
    this.$message.warning({
      message: h('p', null, [
        h('span', null, 'This version Build at UTC+8 2021-11-22 11:14, If you wanna use '),
        h('i', { style: 'color: teal' }, ' Latest '),
        h('span', null, ' version , Please press '),
        h('strong', { style: 'color: red'}, '[CTRL + SHIFT +R]'),
        h('span', null, ' to reload cache.')
      ]),
      duration: 0,
      showClose: true
    });
    // try to auto-logged
    let isAutoLoginAvailable = await this.$wax.isAutoLoginAvailable(); 
      if (isAutoLoginAvailable) { 
        this.userAccount = this.$wax.userAccount;
        this.pubKeys = this.$wax.pubKeys;
        this.isNotLogin = false;
        this.$notify.success({title:"Success", message: "Auto-Login Wax Wallet Success!Welcome Back!", duration: 0});
        this.status = 'Welcome Back! Dear ' + this.userAccount;
      }else{
        this.status = 'Your account not enable Auto-Logged in, Please Login your Wax Wallet';
      }
  }
}
</script>
