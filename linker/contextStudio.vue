
<template>
  <div class="contextStudio">
    <div class="md-layout contextStudioLayout">
      <div class="md-layout-item">
        <!-- <context-list :contextList="contextList"
                      :editMode="false"
                      :eventName="'NodeElement1'"></context-list> -->
      </div>

      <div class="md-layout-item">
        <!-- <context-list :contextList="contextList"
                      :editMode="false"
                      :eventName="'NodeElement2'"></context-list> -->
      </div>
    </div>

    <div class="md-layout linkerLayout">
      <div>
        <md-button class="md-icon-button"
                   @click.stop="print">
          <md-icon>add</md-icon>
        </md-button>
      </div>
      <div class="md-layout-item">
        <receive-zone :eventName="'NodeElement1'"></receive-zone>
      </div>

      <div class="md-layout-item">
        <md-field class="small-field">
          <label>Relation</label>
          <md-input v-model="relation"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item">
        <receive-zone :eventName="'NodeElement2'"></receive-zone>
      </div>

    </div>

    <!-- <md-table class=" tableLayout md-scrollbar"
              style=" max-height: 20%;
                            overflow: auto;">
      <md-table-row>
        <md-table-head md-numeric>N°</md-table-head>
        <md-table-head>ElementA</md-table-head>
        <md-table-head>Relation</md-table-head>
        <md-table-head>ElementB</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in links"
                    :key="index">
        <md-table-cell md-numeric>{{index}}</md-table-cell>
        <md-table-cell>{{links.elementA}}</md-table-cell>
        <md-table-cell>{{links.elementA}}</md-table-cell>
        <md-table-cell>{{links.elementB}}</md-table-cell>
      </md-table-row>

    </md-table> -->

    <sharedToolBar :eventName="'NodeElement1'">
    </sharedToolBar>
    <sharedToolBar :eventName="'NodeElement2'">
    </sharedToolBar>
  </div>

</template>

<script >
import { SpinalGraph } from "spinal-models-context_studio";
import contextList from "../manager/contextList.vue";
import sharedToolBar from "./sharedToolBar.vue";
import receiveZone from "./receiveZone.vue";

var globalType = typeof window === "undefined" ? global : window;
var spinalSystem;

export default {
  name: "contextStudio",
  data() {
    return {
      contextList: null,
      relation: "link"
    };
  },
  components: { contextList, sharedToolBar, receiveZone },
  methods: {
    print: function() {
      console.log("test");
    },
    getEvents: function() {},
    linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.graph) {
              forgefile.graph.init();
              if (typeof forgefile.graph.appsList !== "undefined")
                this.contextList = forgefile.graph.appsList;
            } else {
              let g = new SpinalGraph(forgefile.name.get());
              g.init();
              forgefile.add_attr({
                graph: g
              });
              if (typeof g.appsList !== "undefined")
                this.contextList = g.appsList;
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.contextStudio {
  height: calc(100% - 35px);
}
</style>

<style  >
.contextStudio button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.contextStudio .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.contextStudio .md-title {
  font-size: 15px;
}

.contextStudio .md-list,
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

.contextStudio i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.contextStudio span {
  font-size: 14px;
}

.contextStudio .md-ripple.md-list-item-content {
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
.contextStudioLayout {
  height: 50%;
}
.linkerLayout {
  height: 20%;
}
.tableLayout {
  height: 20%;
}
</style>
