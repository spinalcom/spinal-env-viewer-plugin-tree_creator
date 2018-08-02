
<template>
  <md-content class="contextManager">

    <md-content class='mainButtons'>

      <dialog-custom :graph="graph"
                     :showDialog="showDialog"
                     @change="showDialog = $event"></dialog-custom>
      <md-button @click="showDialog = true"
                 class="md-icon-button">
        <md-icon>add</md-icon>
      </md-button>

      <md-button @click="editMode = !editMode"
                 class="md-icon-button"
                 v-bind:class="{ editModeStyle: editMode }">
        <md-icon>edit</md-icon>
      </md-button>

    </md-content>

    <shared-tool-bar-context></shared-tool-bar-context>
    <context-list :contextList="contextList"
                  :editMode="editMode"
                  :eventName="'nodeContext'"></context-list>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
import contextList from "./contextList.vue";
import DialogCustom from "./DialogCustom.vue";
import sharedToolBarContext from "./sharedToolBarContext.vue";
export default {
  name: "contextManager",
  data() {
    return {
      contextList: null,
      inc: 0,
      showDialog: false,
      graph: null,
      editMode: false
    };
  },
  components: { contextList, sharedToolBarContext, DialogCustom },
  methods: {
    getEvents: function() {},
    linkToDB: function() {
      let interval = setInterval(() => {
        if (
          typeof globalType.spinal.contextStudio != "undefined" &&
          typeof globalType.spinal.contextStudio.graph != "undefined"
        ) {
          this.graph = globalType.spinal.contextStudio.graph;
          // if (typeof this.graph.appsListByType.context !== "undefined")
          //   this.contextList = this.graph.appsListByType.context;
          if (typeof this.graph.appsList !== "undefined")
            this.contextList = this.graph.appsList;
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
.contextManager {
  height: calc(100% - 35px);
}
</style>

<style  >
.contextManager button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.contextManager .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.contextManager .md-title {
  font-size: 15px;
}

.contextManager .md-list,
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

.contextManager i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.contextManager span {
  font-size: 14px;
}

.contextManager .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}
.editModeStyle {
  background-color: #356bab;
}
</style>
