<template>
    <div>
        <script id="editor" type="text/plain"></script>
    </div>
</template>
<script>
    export default {
        name: 'UE',
        data () {
            return {
                editor: null
            }
        },
        props: {
            config: {
                type: Object
            },
            defaultMsg:{
                type:String,
                default:""
            }
        },
        mounted() {
            console.log('我是子组件');
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
            });
        },
        watch:{
            defaultMsg(curVal,oldVal){
               this.editor.setContent(curVal,false);
            }
        },
        methods: {
            getUEContent() { // 获取内容方法
                return this.editor.getContent()
            },
            setUEContent(data,status){
                return this.editor.setContent(data,status);
            }
        },
        destroyed() {
            console.log('销毁了');
            this.editor.destroy();
        }
    }
</script>