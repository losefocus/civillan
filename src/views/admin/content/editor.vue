<template>
    <div id="app">
        <vue-editor v-model="content" useCustomImageHandler @imageAdded="handleImageAdded" :editorToolbar="customToolbar" ></vue-editor>
    </div>
</template>
<script>
  import {VueEditor} from 'vue2-editor'
  import {addObj, updataObj, upload} from "@/api/content";

  export default {
    props:['editorContent'],
    components: {
      VueEditor
    },
    data(){
        return{
            content:this.editorContent,
            customToolbar:[ //:editorToolbar="customToolbar"
                ['bold','italic','underline','strike','image'],
                ['blockquote','code-block'],
                [{'header':1},{'header':2},{'header':3}],
                [{'list':'ordered'},{'list':'bullet'}],
                [{'script':'sub'},{'script':'super'}],
                [{'indent':'-1'},{'indent':'+1'}],
                // [{'size':['small',false,'large','huge']}],
                // [{'header':[1,2,3,4,5,6,false]}],
                [{'color':[]},{'background':[]}],
                // [{'font':[]}],
                [{'align':[]}],
            ]
        }
    },
    methods:{
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {
            var formData = new FormData();
            formData.append('uploadFile', file)
            formData.append('component', 'project')
            upload(formData).then(res => {
                let url = res.data.result.baseUrl + res.data.result.path
                // let url = 'http://192.168.0.234:8899/' + res.data.result.path
                Editor.insertEmbed(cursorLocation, 'image', url);
                resetUploader();
            })
            .catch((err) => {
            })
        }
    }
}
</script>
