<template>
  <div class="receiveZone">
    {{this.name}}
  </div>

</template>

<script>
let globalType = typeof window === "undefined" ? global : window;
var EventBus;

export default {
  name: "receiveZone",
  data: () => ({
    currentNode: null,
    name: "select An element",
    app: null
  }),
  computed: {},
  props: ["eventName"],
  components: {},
  methods: {
    handleReceive: function() {},
    getEvents: function() {
      EventBus.$on(this.eventName, _self => {
        this.node = _self.node;
        this.app = _self.context;
        this.name = this.node.name.get();
      });
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;

    this.getEvents();
  }
};
</script>

<style lang="scss" scoped>
.receiveZone {
  display: inline-block;
  background-color: rgba(25, 172, 172, 0.5);
  padding: 5px;
  margin-top: 20px;
  text-align: center;
  height: min-content;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
