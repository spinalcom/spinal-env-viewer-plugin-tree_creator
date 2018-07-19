
<template>
  <div class="sharedToolBarContext">

    <md-list>
      <md-list-item>
        <div class="md-list-item-text">
          <span>{{name}}</span>
        </div>

        <md-button class="md-icon-button"
                   @click.stop="onRemove">
          <md-icon>clear</md-icon>
        </md-button>

      </md-list-item>
    </md-list>

  </div>

</template>

<script>
var globalType;
var spinalSystem;
var EventBus;
export default {
  name: "sharedToolBarContext",
  data() {
    return {
      self: null,
      name: "select a Context",
      preSelected: null,
      disableSelection: false,
      endpointSelector: null
          };
  },
  components: {},
  methods: {
    onRemove: function() {
     
    },
    getEvents: function() {
      EventBus.$on("contextContext", _self => {
      if (typeof _self._data.context != null) {

        if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.context;
          console.log('test2');
          
  
          
      this.name = this.self.name.get();
      }

      });
    },
  },
  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>

<style scoped>
.sharedToolBarContext {
  width: calc(100% - 5px);
  max-width: 100%;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

<style>
.sharedToolBarContext ul {
  padding: 0px;
}
.sharedToolBarContext > ul > li > div > div {
  background-color: rgba(54, 206, 8, 0.5);
}
.sharedToolBarContext > div > ul > li > div > div {
  padding: 0px;
  padding-left: 8px;
}
</style>





