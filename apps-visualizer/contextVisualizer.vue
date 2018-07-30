
<template>
  <md-content class="appsVisualizer">

    <md-content class='mainButtons'>

      <!-- <dialog-apps-visualizer :graph="graph"
                              :showDialog="showDialog"
                              @change="showDialog = $event"></dialog-apps-visualizer> -->
      <md-button @click="showDialog = true"
                 class="md-icon-button">
        <md-icon>add</md-icon>
      </md-button>

    </md-content>

    <!-- <shared-tool-bar-apps></shared-tool-bar-apps> -->
    <!-- <apps-list :appsList="appsList"></apps-list> -->

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
// import appsList from "./appsList.vue";
// import DialogAppsVisualizer from "./DialogAppsVisualizer.vue";
// import sharedToolBarApps from "./sharedToolBarApps.vue";
export default {
  name: "appsVisualizer",
  data() {
    return {
      appsList: null,
      appsArray: [],
      inc: 0,
      showDialog: false,
      graph: null,
      editMode: false
    };
  },
  // components: { appsList, sharedToolBarApps, DialogAppsVisualizer },
  methods: {
    getEvents: function() {},
    linkToDB: function() {
      let interval = setInterval(() => {
        if (
          typeof globalType.spinal.contextStudio != "undefined" &&
          typeof globalType.spinal.contextStudio.graph != "undefined"
        ) {
          this.graph = globalType.spinal.contextStudio.graph;

          clearInterval(interval);
        }
      }, 500);
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.appsVisualizer {
  height: calc(100% - 35px);
}
</style>

<style  >
.appsVisualizer button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.appsVisualizer .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.appsVisualizer .md-title {
  font-size: 15px;
}

.appsVisualizer .md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.appsVisualizer i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.appsVisualizer span {
  font-size: 14px;
}

.appsVisualizer .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}
</style>
