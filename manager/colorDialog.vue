<template>
  <md-content>
    <md-dialog :md-active="showDialog"
               class="colorDialogDiv">
      <md-dialog-title class="dialogTitle">Select Color</md-dialog-title>

      <div>
        <!-- <photoshop-picker v-model="colors"></photoshop-picker> -->

        <chrome-picker class="dialogColorPicker"
                       v-model="colors" />
      </div>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="closeDialog">Close</md-button>
        <md-button class="md-primary"
                   @click="saveColor">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>



<script>
import Vue from "vue";
import { Chrome } from "vue-color";
export default {
  name: "colorDialog",
  components: { "chrome-picker": Chrome },
  data: () => {
    return {
      colors: "#194d33"
    };
  },
  props: ["showDialog", "nodeSelected"],
  methods: {
    closeDialog: function() {
      this.$emit("closeColorDialog");
    },
    saveColor: function() {
      this.nodeSelected.getElement().then(el => {
        el.colorParams.value.set(this.colors.hex);
        this.closeDialog();
      });
    }
    // getDomElement: function() {
    //   var div = document.createElement("input");
    //   div.id = "colorDiv";

    //   return div;
    // }
  },
  mounted() {},
  watch: {
    showDialog: function() {
      if (this.showDialog) {
        this.nodeSelected.getElement().then(el => {
          this.colors = el.colorParams.value.get();
        });
      }
    }
  }
};
</script>

<style>
.colorDialogDiv {
  /* width: 400px; */
}

.dialogTitle {
  width: 100%;
  text-align: center;
}

.dialogColorPicker {
  width: calc(100% - 10px) !important;
  margin: auto;
  box-shadow: none !important;
}

.dialogColorPicker .vc-chrome-body {
  background-color: #424242;
}

.dialogColorPicker .vc-chrome-body .vc-editable-input .vc-input__input {
  color: #000;
  font-size: 15px;
}

.dialogColorPicker .vc-chrome-body .vc-editable-input .vc-input__label {
  font-size: 16px;
}
</style>
