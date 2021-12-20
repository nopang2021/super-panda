<template>
  <div class="home" style="background-color: #f4f5f7;color: #6b778c;">
    <h1>{{status}}</h1>
    <div style="width: 900px; margin: auto;">
      <el-button  type="primary" v-if="isNotLogin" @click="loginWallet()">Login Wax Wallet</el-button>
      <el-button  type="warning" v-else-if="isFirstRun" @click="loopThread()">Get Your Power!</el-button>
      <el-button  type="danger" v-else @click="stopLoopThread()">Stop</el-button>
      <el-button  type="primary" @click="discord()">Join Our Discord</el-button>
      <div style="margin-top: 50px;">
        <el-tabs :tab-position="'left'">
          <!--Heros-->
          <el-tab-pane  label="Heros">
            <template #label>
              <span>
                <el-icon><user-filled /></el-icon>Heros
              </span>
            </template>
            <el-table border v-if="showPandasData" :data="pandasData" stripe style="width: 100%">
              <el-table-column prop="asset_id" label="PandaId" width="125px" />
              <el-table-column label="Img" width="125px">
                <template #default="scope">
                  <el-image
                    style="width: 100px; height: 100px"
                    referrerPolicy="no-referrer"
                    :src="'https://ipfs.atomichub.io/ipfs/'+scope.row.asset.data.img+'/'"
                    >
                    <template #placeholder>
                      <div style="width: 100%;" 
                        element-loading-background="rgba(192,192,192,0.3)" 
                        v-loading="true" 
                        element-loading-text="Loading..."
                        >
                      </div>
                    </template>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column prop="asset.data.rarity" label="Rarity" width="100px"/>
              <el-table-column prop="lvl" label="Rank" width="60px"/>
              <el-table-column label="Stake" width="80px">
                <template #default="scope">{{(scope.row.stake_count/10000).toFixed(4)}}<br>BAM</template>
              </el-table-column>
              <el-table-column label="Steps" width="80px">
                <template #default="scope"> {{scope.row.steps}}/{{getNeedSteps(scope.row.lvl)}}</template>
              </el-table-column>
              <el-table-column label="Energy" width="80px">
                <template #default="scope">{{ parseInt(scope.row.energy/100) }}%</template>
              </el-table-column>
              <el-table-column label="Time" width="150px">
                <template #default="scope">
                  <FlipDown type="3" :endDate="scope.row.timer*1000" ></FlipDown> 
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
                    :max="50"
                  />
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px;" >
                <el-col :span="4"></el-col>
                <el-col :span="8">Auto Stake BAM&Rank Level Up:</el-col>
                <el-col :span="8">
                  <el-switch 
                    v-model="isAutoRankUP" 
                    active-color="#13ce66" 
                  />
                </el-col>
                <el-col :span="4"></el-col>
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
              <div style="text-align: left;" v-html="logmsg"></div>
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
      isAutoRankUP: true,
      feedFoodEnergy: 10,
      autoBuyQuantity: 1,
      isFirstRun:true,
      stoploop:false,
    }
  },
  components: {
    FlipDown
  },
  methods:{
    discord(){
      window.open('https://discord.gg/TNAg46CkzW','_blank');
    },
    show_logmsg(msg){
      this.logmsg = dayjs().format('YYYY-MM-DD HH:mm:ssZ') + ' ' + msg + '\r\n<br>' + this.logmsg;      
    },
    async loginWallet(){
      try {
        this.userAccount = await this.$wax.login();
        this.pubKeys = this.$wax.pubKeys;
        this.status = 'Welcome Back! Dear ' + this.userAccount;
        this.isNotLogin = false;
        this.$notify.success({title:"Success", message: "Login Wax Wallet Success!Welcome Back!", duration: 10000});
        await this.loopThread();
      } catch (error) {
        this.show_logmsg('Login Error: '+error);
        this.$notify.error({title:'Login Error', message: error});
      }
    },
    async loopThread(){
      if(this.isFirstRun){
        this.isFirstRun = false
        while(!this.stoploop){
          await this.getSlots();
          await sleep(60000);
        }
      }
    },
    stopLoopThread(){
      this.stoploop = true;
      this.isFirstRun = true;
    },
    async getSlots(){
      try {
        // getFoods
        await this.getFoods()
        // empty this.pandasData
        this.pandasData = [];
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
        console.log('slotSort Result:', result);
        const slotSort = result.rows[0].slots_count;
        const max_slots = result.rows[0].max_slots;
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
        console.log('pandas Result:', result);

        for (let slotnumber = 0; slotnumber < max_slots; slotnumber++){
          for (let index = 0; index < result.rows.length; index++) {
            const element = result.rows[index];
            if (element.asset_id == slotSort[slotnumber]) {
              let asset = await this.$assetApi.getAsset(element.asset_id);
              element.asset = asset;
              console.log(slotnumber);
              this.pandasData.push(element);
            }
          }
        }

        this.showPandasData = false;
        this.showPandasData = true;
        console.log('pandasData:', this.pandasData);
        // is Auto-Feed Food?
        if (this.isAutoFeedFood) {
          await this.feedFood();
        }
        if (this.isAutoAdventure){
          await this.toAdventure();
        }
      } catch (error) {
        this.show_logmsg('Get Slots Error: '+error);
        this.$notify.error({title:'Get Slots Error', message: error});
      }
    },
    async getRank(panda){
      try {
        let sleeptime = Math.floor(Math.random()*10**3)+1;
        console.log(`getRank sleep ${(sleeptime/1000).toFixed(2)}s`);
        await sleep(sleeptime);
        // check steps
        while(!panda){
          await sleep(1000);
        }
        console.log(`is this panda can level up? ${panda.steps} >= ${this.getNeedSteps(panda.lvl)}`);
        if(panda.steps >= this.getNeedSteps(panda.lvl)){
          //check bam stake
          let needBam = this.getNeedBam(panda.lvl, panda.rarity);
          console.log(`is this panda's BAM enough to level up? ${panda.stake_count/10000} < ${needBam}`);
          if(panda.stake_count/10000 < needBam){
            //to stake bam
            await this.pandaStakeBam(panda, needBam-panda.stake_count/10000);
            await sleep(10000)
          }
          // tolvlup
          await this.pandaLvlUp(panda);
          await sleep(10000)
        }
      } catch (error) {
        console.log('getRank Error: '+error)
        this.show_logmsg('getRank Error: '+error);
        this.$notify.error({title:'getRank Error', message: error});
      }
    },
    getNeedSteps(lvl){
      switch (lvl) {
        case 0:
          return 8;
        case 1:
          return 13;
        case 2:
          return 21;
        case 3:
          return 34;
        case 4:
          return 55;
        case 5:
          return 89;
        case 6:
          return 144;
        case 7:
          return 233;
        case 8:
          return 377;
        case 9:
          return 610;
        case 10:
          return 987;
        case 11:
          return 1597;
        default:
          return 9999;
      }
    },
    getNeedBam(lvl, rarity){
      let bam = [
        [
          0.87,
          2.29,
          4.58,
          8.29,
          14.29,
          24,
          39.71,
          65.13,
          106.26,
          172.39,
          280.07,
          454.29,
        ],[
          1.44,
          3.78,
          7.56,
          13.68,
          23.58,
          39.58,
          65.5,
          107.44,
          175.3,
          285.1,
          462.76,
          750.22,
        ],[
          1.77,
          4.66,
          9.33,
          16.89,
          29.11,
          48.89,
          80.89,
          132.67,
          216.45,
          352.01,
          571.35,
          926.24,
        ],[
          4.8,
          12.6,
          25.2,
          45.6,
          78.6,
          132,
          218.4,
          358.2,
          584.4,
          920.4,
          1512.6,
          2470.8,
        ],[
          8,
          21,
          42,
          76,
          131,
          220,
          364,
          597,
          974,
          1584,
          2571,
          4168,
        ],[
          32,
          84,
          168,
          304,
          524,
          880,
          1456,
          2388,
          3896,
          6336,
          10284,
          16672,
        ],[
          96,
          252,
          504,
          912,
          1572,
          2640,
          4368,
          7164,
          11688,
          19008,
          30852,
          50016,
        ]
      ];
      // let total = 0
      // for (let index = 0; index <= lvl; index++) {
      //   const num = bam[rarity][index];
      //   total += num;
      // }
      // return total;
      return bam[rarity][lvl];
    },
    async pandaStakeBam(panda, satke_quantity){
      try {
        this.show_logmsg(`tostake ${panda.asset_id} stake quantity ${satke_quantity}`);
        console.log(`tostake ${panda.asset_id} stake quantity ${satke_quantity}`);
        const result = await this.$wax.api.transact({
          actions: [{
              account: 'nftpandabamb', // contract account
              name: 'transfer', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                memo: panda.asset_id, // panda_id
                from: this.$wax.userAccount,
                to: "nftpandawofg",
                quantity: `${satke_quantity.toFixed(4)} BAM`,
              },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        });
        console.log('pandaStakeBam.result', result);  
      } catch (error) {
        this.show_logmsg('pandaStakeBam Error: '+ error);
        this.$notify.error({title:'pandaStakeBam Error', message: error});
      }
    },
    async pandaLvlUp(panda){
      try {
        while(!panda){
          await sleep(1000)
        }
        this.show_logmsg(`pandaLvlUp ${panda.asset_id}`);
        console.log(`pandaLvlUp ${panda.asset_id}`);
        const result = await this.$wax.api.transact({
          actions: [{
              account: 'nftpandawofg', // contract account
              name: 'lvlup', // contract action name
              authorization: [{
                actor: this.$wax.userAccount,
                permission: 'active',
              }],
              data: { // action argments
                asset_id: panda.asset_id, // panda_id
                username: this.$wax.userAccount,
              },
          }]
        }, {
          blocksBehind: 3,
          expireSeconds: 30
        });
        console.log('pandaLvlUp.result', result);  
      } catch (error) {
        this.show_logmsg('pandaLvlUp Error: '+ error);
        this.$notify.error({title:'pandaLvlUp Error', message: error});
      }
    },
    async toAdventure(){
      try {

        console.log('Looking for toAdventure panda.', this.pandasData);
        for (let index = 0; index < this.pandasData.length; index++) {
          const panda = this.pandasData[index];
          // if now >=  panda.timer . then continue adventure 
          console.log(`is can toAdventure? ${panda.asset_id}  does timer ${dayjs().format('YYYY-MM-DD HH:mm:ssZ')} > ${dayjs(panda.timer*1000).format('YYYY-MM-DD HH:mm:ssZ')} ?`);
          console.log(`is can toAdventure? ${panda.asset_id}  does timer ${dayjs().valueOf()} > ${panda.timer*1000} ?`);
          if (dayjs().valueOf() <= panda.timer*1000){
            continue;
          }
          if (this.isAutoRankUP){
            await this.getRank(panda);
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
                  assoc_id: panda.asset_id, // panda_id
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
              }else{
                if (bam == 0){
                    bam = '0.0000 BAM';
                }
              }
            });
          }
          if (bam == 0){
            bam = '0.0000 BAM';
          }
          this.show_logmsg('Panda-'+ panda.asset_id + ' Got ' + bam);
        }
      } catch (error) {
        this.show_logmsg('Adventure Error: ' + error);
        this.$notify.error({title:'Adventure Error', message: error});
      }
    },
    getPandaObj(asset_id){
      try {
        for (let index = 0; index < this.pandasData.length; index++) {
          const element = this.pandasData[index];
          if (element.asset_id === asset_id){
            return element;
          }
        }
        console.log('getPandaObj defeat')
      } catch (error) {
        this.show_logmsg('Get Panda Object Error: ' + error);
        this.$notify.error({title:'Get Panda Object Error', message: error});
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
        console.log('getFoods result:', result);
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
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
        }
        console.log('foodsData', this.foodsData);
      } catch (error) {
        this.show_logmsg('Get Foods Error: '+ error);
        this.$notify.error({title:'Get Foods Error', message: error});
      }
    },
    async feedFood(){
      try {
        console.log('Looking for hungry panda.', this.pandasData);
        for (let index = 0; index < this.pandasData.length; index++) {
          while (!this.pandasData[index]){
            await sleep(1000)
          }
          const panda = this.pandasData[index];
          let sleeptime = Math.floor(Math.random()*10**3)+1;
          console.log(`is this panda hungry? sleep ${(sleeptime/1000).toFixed(2)}s :${panda.asset_id}`, );
          await sleep(sleeptime);
          let food_id;
          if (parseInt(panda.energy/100) <= this.feedFoodEnergy) {
            if ((!this.foodsData[panda.asset.data.rarity]) || (this.foodsData[panda.asset.data.rarity].length == 0)) {
              // is deosn't have rarity food? || // check is rarity food empty
              this.show_logmsg(`${panda.asset.data.rarity} Food dont enough, We need more.`);
              // to buy food
              await this.buyFood(panda.asset.data.rarity, this.autoBuyQuantity);
              return;
            }
            // take the first food's assetid
            while(!food_id){
              await sleep(1000)
              console.log(`feed food food_id ${food_id}`)
              food_id = this.foodsData[panda.asset.data.rarity].shift().assetid
            }
          }else{
            continue;
          }
          this.show_logmsg(`Panda ${panda.asset_id}'s Energy blow 10 , We Have ${panda.asset.data.rarity} * ${ this.foodsData[panda.asset.data.rarity].length } Food.`);
          console.log('feed food transaction data: ', {
                  asset_ids: [food_id], // food_id
                  memo: `eatpanda ${panda.asset_id} ${food_id} `,
                  from: this.$wax.userAccount,
                  to: 'nftpandawofg',
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
                  memo: `eatpanda ${panda.asset_id} ${food_id} `,
                  from: this.$wax.userAccount,
                  to: 'nftpandawofg',
                },
            }],
          },{
            blocksBehind: 3,
            expireSeconds: 30
          }); 
          console.log('Feed Food Result:', result);
          this.show_logmsg(`Panda ${panda.asset_id} Ate 1 Food.`);
          this.$notify.success({title:'Feed Food Success', message: `Panda ${panda.asset_id} Feed Food Success`});
        }
      } catch (error) {
        this.show_logmsg('Feed Food Error: '+error);
        this.$notify.error({title:'Feed Food Error', message: error});
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
                quantity: `${(this.getFoodCost(rarity,quantity)).toFixed(4)} BAM`,
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
      } catch (error) {
        this.show_logmsg('Buy Food Error: '+error);
        this.$notify.error({title:'Buy Food Error', message: error});
      }
    },
    getFoodCost(rarity, quantity){
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
  },
  created: async function(){
    this.$message.warning({
      message: h('p', null, [
        h('span', null, 'This version Build at UTC+8 2021-12-20 18:26, If you wanna use '),
        h('i', { style: 'color: teal' }, ' Latest '),
        h('span', null, ' version , Please press '),
        h('strong', { style: 'color: red'}, '[CTRL + SHIFT +R]'),
        h('span', null, ' to reload cache.')
      ]),
      duration: 10000,
      showClose: true
    });
    // try to auto-logged
    let isAutoLoginAvailable = await this.$wax.isAutoLoginAvailable(); 
      if (isAutoLoginAvailable) { 
        this.userAccount = this.$wax.userAccount;
        this.pubKeys = this.$wax.pubKeys;
        this.isNotLogin = false;
        this.$notify.success({title:"Success", message: "Auto-Login Wax Wallet Success!Welcome Back!", duration: 10000});
        this.status = 'Welcome Back! Dear ' + this.userAccount;
        await sleep(Math.floor(Math.random()*10**3)+1)
        await this.loopThread();
      }else{
        this.status = 'Your account not enable Auto-Logged in, Please Login your Wax Wallet';
      }
  }
}
</script>
