<template>
  <a ref="link" class="download-btn" v-on:click="handleClick">导出</a>
</template>
<script type="text/javascript">
export default {
  props: {
    header: {
      type: Array,
      default: function() {
        return [];
      }
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    fileName: {
      type: String,
      default: 'data.csv'
    }
  },
  methods: {
    handleClick: function() {
        if (!this.data || this.data.length <= 0) {
            this.$message({
                message: '请先选择导出数据',
                type: 'warning'
            });
            return;
        }
        //   var csvContent = 'data:text/csv;charset=utf-8,\ufeff';
        var csvContent = '';
        csvContent += this.headerLabel + '\r\n';
        this.data.forEach((item, index) => {
            let dataString = '';
            for (let i = 0; i < this.headerProp.length; i++) {
            dataString += item[this.headerProp[i]] + ',';
            }
            csvContent += index < this.data.length ? dataString.replace(/,$/, '\r\n') : dataString.replace(/,$/, '');
        });

        csvContent = csvContent;
        var blob = new Blob([csvContent], { type: 'text/csv'});
        var uri = URL.createObjectURL(blob);

        this.$refs.link.setAttribute('href', uri);
        this.$refs.link.setAttribute('download', this.fileName);
    }
  },
  computed: {
    // 要求head是数组，数组中的每个元素是对象，并且每个对象都有label属性
    headerLabel: function() {
      let result;
      result = this.header.map((item) => {
        return item.label;
      })
      result = result.join(',');
      return result;
    },
    headerProp: function() {
      let result;
      result = this.header.map((item) => {
        return item.prop;
      })
      return result;
    }
  }
}

</script>
<style lang="scss" scoped>
.download-btn {
  display: inline-block;
  margin-left: 10px;
  padding: 2px 15px;
  font-size: 12px;
  border-radius: 4px;
  color: #FFF;
  background-color: #f7ba2a;
  border-color: #f7ba2a;
  outline: 0;
  text-align: center;
  -webkit-appearence: none;
  appearence: none;
  cursor: pointer;
}

</style>
