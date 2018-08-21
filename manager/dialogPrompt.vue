<template>
  <div>
    <md-dialog-prompt :md-active="active"
                      v-model="value"
                      :md-title="oldJson"
                      md-input-maxlength="30"
                      md-confirm-text="Change"
                      @md-confirm="sendEvent"
                      @md-cancel="cancelEvent" />
  </div>
</template>

<script>
// import EventsBus from "./EventBus.vue";
export default {
  name: "DialogPrompt",
  data() {
    return {
      value: ""
    };
  },
  props: ["active", "oldJson"],
  methods: {
    sendEvent: function() {
      var toSend = this.value;
      this.value = "";
      this.$emit("promptValue", toSend);
    },
    cancelEvent: function() {
      this.value = "";
      this.$emit("disablePrompt");
    }
  }
};
</script>
