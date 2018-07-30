
<template>
  <md-content class="contextCreator">

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
export default {
  name: "contextCreator",
  data() {
    return {
      show: true,
      isSelected: false,
      nodeArray: []
    };
  },
  props: [],
  components: {},
  computed: {},
  methods: {
    test: function() {},
    getEvents: function() {},
    deselect: function() {
      this.isSelected = false;
    },
    linkToDB: function() {},
    getRelations: function() {},
    updateData: function() {}
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
</style>
