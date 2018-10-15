<template>
    <div>
        <md-dialog :md-active="showDialog"> 
            <md-dialog-title>Select Color</md-dialog-title>


            <md-dialog-actions>
                <md-button class="md-primary"
                        @click="cancel">Close</md-button>
                <md-button class="md-primary"
                        @click="saveColor">Save</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        name: "colorDialog",
        data: () => {
            return {}
        },
        props: ["showDialog"],
        methods: {

            cancel: function() {
                this.showDialog = false;
            },
            saveColor: function() {
                this.showDialog = false;
            }
        }
    }
</script>