
<template>
  <md-content class="contextStudio md-scrollbar">
    <!-- class="md-layout contextStudioLayout " -->
    <div class="contextStudioLayout"
         style="
    display: flex;">
      <div class="NodeElement1CL">
        <context-list :contextList="contextList"
                      :editMode="false"
                      :eventName="'NodeElement1'"></context-list>
      </div>
      <!-- class="md-layout-item md-xsmall-size-50" -->
      <div class="NodeElement2CL">
        <context-list :contextList="contextList"
                      :editMode="false"
                      :eventName="'NodeElement2'"></context-list>
      </div>
    </div>

    <div v-if=" this.context1 != null">
      <md-radio v-model="radio"
                :value="'context1'">{{this.context1.name.get()}}({{nodeElement1.name.get()}})</md-radio>
      <md-radio v-model="radio"
                value="linker">Linker</md-radio>
      <md-radio v-if=" this.context2 !=null"
                v-model="radio"
                :value="'context2'">{{this.context2.name.get()}}({{nodeElement2.name.get()}})</md-radio>
    </div>

    <div class="md-layout linkerLayout">
      <div>
        <md-button class="md-icon-button"
                   @click.stop="addLink">
          <md-icon>add</md-icon>
        </md-button>
      </div>
      <div class="md-layout-item">
        <receive-zone :eventName="'NodeElement1'"
                      @node="updateNodeElement1"
                      @context="setContext1"></receive-zone>
      </div>

      <div class="md-layout-item">
        <md-field class="small-field">
          <label>Relation</label>
          <md-input v-model="relation"></md-input>
        </md-field>
      </div>

      <div class="md-layout-item">
        <receive-zone :eventName="'NodeElement2'"
                      @node="updateNodeElement2"
                      @context="setContext2"></receive-zone>
      </div>

    </div>

    <md-table class=" tableLayout md-scrollbar"
              style=" max-height: 25%;
                            overflow: auto;">
      <md-table-row>
        <md-table-head md-numeric>N°</md-table-head>
        <md-table-head>Element1</md-table-head>
        <md-table-head>Relation</md-table-head>
        <md-table-head>Element2</md-table-head>
        <md-table-head>Application/Context</md-table-head>
        <md-table-head>Actions</md-table-head>
      </md-table-row>

      <md-table-row v-for="(item, index) in links"
                    :key="index">
        <md-table-cell md-numeric>{{index}}</md-table-cell>
        <md-table-cell>{{item.element1.name.get()}}</md-table-cell>
        <md-table-cell>{{item.relationType}}</md-table-cell>
        <md-table-cell>{{item.element2.name.get()}}</md-table-cell>
        <md-table-cell>{{item.application}}</md-table-cell>
        <md-table-cell>
          <md-button class="md-icon-button"
                     @click.stop="removeLink(index)">
            <md-icon>clear</md-icon>
          </md-button>
        </md-table-cell>
      </md-table-row>

    </md-table>
    <div class="validate">
      <md-button @click.stop="validate">
        Validate
      </md-button>
    </div>

    <sharedToolBar :eventName="'NodeElement1'">
    </sharedToolBar>
    <sharedToolBar :eventName="'NodeElement2'">
    </sharedToolBar>
  </md-content>

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
      relation: "link",
      links: [],
      nodeElement1: null,

      nodeElement2: null,
      context1: null,
      context2: null,

      radio: "linker"
    };
  },
  components: { contextList, sharedToolBar, receiveZone },
  methods: {
    validate: function() {
      for (let index = 0; index < this.links.length; index++) {
        const link = this.links[index];
        link.element1.addToExistingRelationByApp(
          link.application,
          link.relationType,
          link.element2,
          link.directed
        );
      }
      this.links = [];
    },
    removeLink: function(index) {
      this.links.splice(index, 1);
    },
    print: function() {
      console.log("test");
    },
    updateNodeElement1: function(value) {
      this.nodeElement1 = value;
    },

    updateNodeElement2: function(value) {
      this.nodeElement2 = value;
    },
    setContext1: function(value) {
      this.context1 = value;
    },
    setContext2: function(value) {
      this.context2 = value;
    },
    addLink: function() {
      let application = "linker";
      let directed = false;
      if (this.radio === "context2") {
        application = this.context2.name.get();
        this.links.push({
          element1: this.nodeElement2,
          relationType: this.relation,
          element2: this.nodeElement1,
          application: application,
          directed: true
        });
      } else {
        if (this.radio === "context1") {
          application = this.context1.name.get();
          directed = true;
        }
        this.links.push({
          element1: this.nodeElement1,
          relationType: this.relation,
          element2: this.nodeElement2,
          application: application,
          directed: directed
        });
      }
      console.log(this.links);
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
              forgefile.graph.getApp("linker", ["link"]);
            } else {
              let g = new SpinalGraph(forgefile.name.get());
              g.init();
              forgefile.add_attr({
                graph: g
              });
              if (typeof g.appsList !== "undefined")
                this.contextList = g.appsList;
              forgefile.graph.getApp("linker", ["link"]);
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
  max-height: calc(100% - 35px);
  overflow: auto;
  width: 98%;
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
  height: 100px;
}
.tableLayout {
  height: 25%;
}
.NodeElement1CL {
  width: 50%;
}
.NodeElement2CL {
  width: 50%;
}
.validate {
  text-align: right;
  height: 20px;
}
</style>
