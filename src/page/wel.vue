<template>
  <div class="pull-chheight wel-contailer">
    <!-- <div class="banner-text">
      <h2>{{website.wel.title}}</h2>
      <span :class="['actor',{typeing:isText}]">{{text}}</span>
    </div> -->
    <div class="wel_ wel_1">
      <div class="part_ part_1 border_">
        <wel-project ref="chart_project"></wel-project>
      </div>
      <div class="part_ part_2 border_">
        <wel-map :data-info="mapList"></wel-map>
      </div>
      <div class="part_ part_3 border_">
        <wel-device></wel-device>
      </div>
    </div>
    <div class="wel_ wel_2">
      <div class="part_ part_1">
        <div class="part_1_1 border_">
          <wel-data ref="chart_data"></wel-data>
        </div>
        <div class="part_1_2 border_">
          <wel-alarm ref="chart_alarm"></wel-alarm>
        </div>
      </div>
      <div class="part_ part_2 border_">
        <wel-notify></wel-notify>
      </div>
      
    </div>
    <div class="wel_ wel_3 border_">
      <wel-data-l ref="chart_data_l"></wel-data-l>
    </div>
    <div class="wel_ wel_4">
      <div class="part_ part_1 border_">
        <wel-device-list></wel-device-list>
      </div>
      <div class="part_ part_2 border_">
        <wel-operate></wel-operate>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import welProject from "./wel_module/project";
import welMap from "./wel_module/map";
import welDevice from "./wel_module/device";
import welData from "./wel_module/data";
import welAlarm from "./wel_module/alarm";
import welNotify from "./wel_module/notify";
import welDataL from "./wel_module/data_l";
import welDeviceList from "./wel_module/deviceList";
import welOperate from "./wel_module/operate";
export default {
  components:{
    welProject,
    welMap,
    welDevice,
    welData,
    welAlarm,
    welNotify,
    welDataL,
    welDeviceList,
    welOperate
  },
  name: "wel",
  data() {
    return {
      mapList:[],
      DATA: [],
      text: "",
      actor: "",
      count: 0,
      isText: false
    };
  },
  computed: {
    ...mapGetters(["website","isCollapse"])
  },
  created() {
    this.DATA = this.website.wel.list;
    this.actor = this.DATA[this.count] || "";
    setTimeout(() => {
      this.isText = true;
      this.setData();
    }, 2000);
  },
  mounted(){
    window.onresize = ()=>{
        this.resizeChart_()
      }
    },
  methods: {
    resizeChart_(){
      this.$refs.chart_project.resizeChart()
      this.$refs.chart_data.resizeChart()
      this.$refs.chart_alarm.resizeChart()
      this.$refs.chart_data_l.resizeChart()
    },
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++;
      } else {
        this.count = 0;
      }
      this.isText = true;
      this.actor = this.DATA[this.count];
    },
    setData() {
      let num = 0;
      let count = 0;
      let active = false;
      let timeoutstart = 5000;
      let timeoutend = 1000;
      let timespeed = 10;
      setInterval(() => {
        if (this.isText) {
          if (count == this.actor.length) {
            active = true;
          } else {
            active = false;
          }
          if (active) {
            num--;
            this.text = this.actor.substr(0, num);
            if (num == 0) {
              this.isText = false;
              setTimeout(() => {
                count = 0;
                this.getData();
              }, timeoutend);
            }
          } else {
            num++;
            this.text = this.actor.substr(0, num);
            if (num == this.actor.length) {
              this.isText = false;
              setTimeout(() => {
                this.isText = true;
                count = this.actor.length;
              }, timeoutstart);
            }
          }
        }
      }, timespeed);
    }
  },
  watch:{
    isCollapse(oldVal,val){
        setTimeout(this.resizeChart_,300)
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.wel-contailer {
  // position: relative;
  // height: 1000px;
  // background: url('../assets/img/wel.png')no-repeat top;
  // background-size: contain
  display: flex;
  flex-wrap:wrap ;
  align-items: center;
  justify-content: space-between;
  .border_{
    border: 1px solid #EBEDF8;
    box-sizing: border-box;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
  }
  .wel_{
    height: 455px;
    // background: #fff;
    margin-bottom:10px;
  }
  .wel_1,.wel_3{
    width: 59%;
  }
  .wel_2,.wel_4{
    width: 40%;
  }
  .wel_1{
    display: flex;
    flex-wrap:wrap ;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom:15px;
    .part_1{
      width: 39.5%;
      margin-bottom:15px;
      height: 320px;
    }
    .part_2{
      width: 59%;
      margin-bottom:15px;
      height: 320px;
    }
    .part_3{
      width: 100%;
      height: 120px;
    }
  }
  .wel_2{
    display: flex;
    flex-wrap:wrap ;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom:15px;
    .part_1{
      width: 49%;
      height: 220px;
      .part_1_1{
        margin-bottom:15px;
      }
      .part_1_1,.part_1_2{
        width: 100%;
        height: 100%;
      }
    }
    .part_2{
      width: 49%;
      height: 455px;
    }
  }
  .wel_3,.wel_4{
    height: 300px;
  }
  .wel_4{
    display: flex;
    flex-wrap:wrap ;
    align-items: flex-start;
    justify-content: space-between;
    .part_{
      width: 49%;
      height: 100%;
    }
  }
}
.banner-text {
  position: relative;
  padding: 0 20px;
  font-size: 20px;
  text-align: center;
  color: #333;
}
.banner-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  display: none;
}
.actor {
  height: 250px;
  overflow: hidden;
  font-size: 18px;
  color: #333;
}

.actor:after {
  content: "";
  width: 3px;
  height: 25px;
  vertical-align: -5px;
  margin-left: 5px;
  background-color: #333;
  display: inline-block;
  animation: blink 0.4s infinite alternate;
}

.typeing:after {
  animation: none;
}

@keyframes blink {
  to {
    opacity: 0;
  }
}
@media screen and (max-width: 1366px){
  .wel_1,.wel_3,.wel_2,.wel_4{
    width: 100% !important;
    margin-bottom:15px !important;
    
  }
}
</style>
