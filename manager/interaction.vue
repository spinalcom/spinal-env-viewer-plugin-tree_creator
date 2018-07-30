<template>
  <div class=" interaction md-layout">

    <drop-zone :model="modelA"
               @modelChange="updateModelA"
               class="md-layout-item  md-size-20"></drop-zone>
    <div class="md-layout-item">
      <md-field class="small-field">
        <label style=" padding-left: 40%;">Relation</label>

        <md-input @input="updateRelation"
                  :value="relation"></md-input>
      </md-field>
    </div>

    <drop-zone :model="modelB"
               @modelChange="updateModelB"
               class="md-layout-item md-size-20"></drop-zone>

  </div>
</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
import dropZone from "./dropZone.vue";
export default {
  name: "interaction",
  data: () => ({
    dragOverStyle: false
  }),

  props: ["modelA", "relation", "modelB"],
  components: { dropZone },
  methods: {
    updateRelation: function(newValue) {
      this.$emit("relationChange", newValue);
    },
    test: function() {},
    updateModelA: function(newValue) {
      this.$emit("modelAChange", newValue);
    },
    updateModelB: function(newValue) {
      this.$emit("modelBChange", newValue);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
