<template>
  <drop class="dropZone"
        :class="{dragOver : dragOverStyle}"
        @dragover="dragOverStyle=true"
        @drop="handleDrop"
        @dragleave="dragOverStyle=false">
    {{computedModel}}
  </drop>

</template>

<script>
let globalType = typeof window === "undefined" ? global : window;

export default {
  name: "dropZone",
  data: () => ({
    dragOverStyle: false
  }),
  computed: {
    computedModel: {
      get: function() {
        return this.model;
      },
      set: function(newValue) {
        this.$emit("modelChange", newValue);
      }
    }
  },
  props: ["model"],
  components: {},
  methods: {
    handleDrop: function(data) {
      this.dragOverStyle = false;
      this.computedModel = data.model;
    }
  }
};
</script>

<style lang="scss" scoped>
.dropZone {
  display: inline-block;
  background-color: rgba(25, 172, 172, 0.5);
  padding: 5px;
  margin-top: 20px;
  text-align: center;
  height: min-content;
  margin-right: 10px;
  margin-left: 10px;
}

.dragOver {
  background-color: rgba(25, 172, 172, 0.5);
  border: 2px dashed rgba(0, 0, 0, 0.5);
}
</style>
