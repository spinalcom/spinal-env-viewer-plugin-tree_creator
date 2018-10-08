<template>
  <md-content class="_sidebar">

    <div class="sidebar_button"
         v-for="_btn in allIcons"
         :key="_btn.title"
         @click="clickEvent(_btn)"
         :title="_btn.title">
      <md-icon>{{_btn.icon}}</md-icon>
      <div class="text">{{_btn.name}}</div>

    </div>

    <div class="sidebar_button"
         v-if="activeRelations != null && contextSelected != null && type == 'Globalcontext'"
  
         v-for="(value,key) in activeRelations"
         :key="key"
         @click="checkBoxClick(activeRelations,key)">

      <!-- <md-checkbox v-model="activeRelations[key]"
                   class="md-primary"></md-checkbox> -->
      <md-icon v-if="activeRelations[key]">check_box</md-icon>
      <md-icon v-if="!activeRelations[key]">check_box_outline_blank</md-icon>

      <div class="text">
        {{key}}
      </div>
      <!-- {{key}}:{{value}} -->

    </div>

    <dialog-prompt v-if="nodeSelected"
                   :active="editName"
                   :oldJson="nodeSelected.name.get()"
                   @promptValue="handlePrompt"
                   @disablePrompt="editName=false"></dialog-prompt>

    <dialog-custom :graph="graph"
                   :showDialog="showDialog"
                   :contextToEdit="contextSelected"
                   @change="showDialog = $event"></dialog-custom>

    <md-dialog-confirm :md-active="activeRemove"
                       md-title="Remove"
                       md-content="Do you want to remove it ?"
                       md-confirm-text="Yes"
                       md-cancel-text="No"
                       @md-cancel="activeRemove = false"
                       @md-confirm="onConfirm" />

  </md-content>
</template>

<script>
import dialogPrompt from "./dialogPrompt.vue";
import DialogCustom from "./DialogCustom.vue";
const globalType = typeof window === "undefined" ? global : window;
var viewer;
export default {
  name: "sidebarMenu",
  components: { dialogPrompt, DialogCustom },
  data() {
    return {
      activeRelations: null,
      type: null,
      allIcons: [],
      vueComponentSelected: null,
      contextSelected: null,
      nodeSelected: null,
      editName: false,
      showDialog: false,
      activeRemove: false,
      btnClicked: null,
      buttonList: {
        edit: {
          name: "Edit",
          title: "Edit",
          icon: "edit",
          action: "edit"
        },
        dashboard: {
          name: "DashBoard",
          title: "DashBoard",
          icon: "show_chart",
          action: "dashboard",
          bimObj: false
        },
        isolate: {
          name: "Isolate",
          title: "Isolate",
          icon: "all_out",
          action: "isolate"
        },
        remove: {
          name: "remove",
          title: "remove",
          icon: "delete",
          action: "remove"
        },
        documents: {
          name: "collaborator",
          title: "collaborator",
          icon: "folder",
          action: "collaborator"
        },
        notes: {
          name: "comments",
          title: "comments",
          icon: "border_color",
          action: "comments"
        },
        color: {
          name: "color",
          title: "color elements",
          icon: "invert_colors",
          action: "color"
        },
        zoom: {
          name: "zoom",
          title: "zoom",
          icon: "zoom_in",
          action: "zoom"
        }
        // add: {
        //   title: "add",
        //   icon: "add",
        //   disabled: false
        // }
      }
    };
  },
  mounted() {
    viewer = globalType.v;
    var _self = this;
    globalType.spinal.eventBus.$on("contextContext", el => {
      _self.vueComponentSelected = el;
      if (el.context.type.get() == "context") {
        _self.type = "Globalcontext";
        _self.contextSelected = el.context;
        _self.nodeSelected = null;
        this.activeRelations = el.activeRelations;
        // this.activeRelations = {};
      } else {
        _self.type = "smartConnector";
      }

      _self.getAllIconsByTypes();
    });

    globalType.spinal.eventBus.$on("nodeContext", el => {
      _self.vueComponentSelected = el;

      if (
        el.context.type.get() == "context" &&
        el.context.name.get() != "logger"
      ) {
        _self.type = "nodeContext";
        _self.contextSelected = el.context;
        _self.nodeSelected = el.node;
      } else if (el.context.name.get() == "logger") {
        _self.type = "logContext";
        _self.contextSelected = el.context;
        _self.nodeSelected = el.node;
      } else {
        _self.type = "spinalNode";
        _self.nodeSelected = el.node;
      }
      _self.getAllIconsByTypes();
    });
  },
  methods: {
    onConfirm: function() {
      if (this.btnClicked.action == "remove" && this.nodeSelected) {
        this.removeNodeContext();
      } else if (
        this.btnClicked.action == "remove" &&
        this.nodeSelected == null
      ) {
        this.removeContext();
      }
      this.activeRemove = false;
    },
    removeContext: function() {
      this.graph.appsList.rem_attr(this.contextSelected.name.get());
      this.graph.appsListByType.context.rem_attr(
        this.contextSelected.name.get()
      );
    },
    removeNodeContext: function() {
      var relations = this.nodeSelected.getRelationsByAppName(
        this.contextSelected.name.get()
      );

      for (var i = 0; i < relations.length; i++) {
        let relation = relations[i];
        relation.removeFromNodeList2(this.nodeSelected);
      }
    },
    handlePrompt: function(value) {
      // this.editedName = value;
      this.editName = false;
      this.nodeSelected.name.set(value);
      this.nodeSelected.getElement().then(ele => {
        ele.name.set(value);
      });
    },
    editModeIconsContext: function() {
      for (var i = 0; i < this.contextSelected.models.length; i++) {
        const element = this.contextSelected.models[i];
        // this.contextSelected.models[i];
        if (element.base.get() != "BIMElement") {
          this.allIcons.push({
            name: element.type.get(),
            title: "add " + element.type.get(),
            icon: "add",
            model: element.get(),
            context: this.contextSelected,
            action: "create_context"
          });
        }
      }
    },
    editModeIconsNode: function() {
      if (
        typeof this.nodeSelected.type != "undefined" &&
        typeof this.contextSelected.interactions[
          this.nodeSelected.type[this.contextSelected.name.get()].get()
        ] != "undefined"
      ) {
        var ic = this.contextSelected.interactions[
          this.nodeSelected.type[this.contextSelected.name.get()].get()
        ]._attribute_names;

        for (var i = 0; i < ic.length; i++) {
          this.allIcons.push({
            name: ic[i],
            title: "add " + ic[i],
            icon: "add",
            context: this.contextSelected,
            node: this.nodeSelected,
            action: "create_node"
          });
        }
      }
    },

    getAllIconsByTypes: function() {
      this.allIcons = [];
      switch (this.type) {
        case "Globalcontext":
          if (this.editMode) {
            this.allIcons.push(this.buttonList.edit);
            // this.allIcons.push(this.buttonList.add);
            this.editModeIconsContext();
            this.allIcons.push(this.buttonList.remove);
          }

          break;
        case "nodeContext":
          if (this.editMode) {
            this.allIcons.push(this.buttonList.edit);
            // this.allIcons.push(this.buttonList.add);
            this.editModeIconsNode();
          }
          this.allIcons.push(this.buttonList.isolate);
          var relations = this.nodeSelected.getRelationsByAppNameByType(
            "linker",
            "link"
          );

          if (relations.length > 0) {
            this.buttonList.dashboard.bimObj = true;
            this.allIcons.push(this.buttonList.dashboard);
          }

          this.allIcons.push(this.buttonList.documents);
          this.allIcons.push(this.buttonList.notes);
          if (this.editMode) this.allIcons.push(this.buttonList.remove);
          break;
        case "spinalNode":
          if (this.editMode) this.allIcons.push(this.buttonList.edit);
          this.allIcons.push(this.buttonList.isolate);
          this.buttonList.dashboard.bimObj = false;
          this.allIcons.push(this.buttonList.dashboard);
          this.allIcons.push(this.buttonList.documents);
          this.allIcons.push(this.buttonList.notes);
          // this.allIcons.push(this.buttonList.remove);
          break;
        case "logContext":
          if (this.editMode) {
            this.allIcons.push(this.buttonList.edit);
          }

          this.buttonList.dashboard.bimObj = false;
          this.allIcons.push(this.buttonList.dashboard);
          this.allIcons.push(this.buttonList.color);
          this.allIcons.push(this.buttonList.zoom);

          this.allIcons.push(this.buttonList.documents);
          this.allIcons.push(this.buttonList.notes);

          if (this.editMode) this.allIcons.push(this.buttonList.remove);
          break;
      }
    },
    clickEvent: function(btn) {
      // globalType.spinal.eventBus.$emit(btn.action, btn);
      if (btn.action == "create_context") {
        this.vueComponentSelected.onAddContextElement(btn.model);
      } else if (btn.action == "create_node") {
        this.vueComponentSelected.addBySelection(btn.name, false);
      } else if (btn.action == "isolate") {
        this.vueComponentSelected.isolate();
      } else if (btn.action == "dashboard" && !btn.bimObj) {
        globalType.spinal.eventBus.$emit(
          "openDashboard",
          this.vueComponentSelected
        );
      } else if (btn.action == "dashboard" && btn.bimObj) {
        globalType.spinal.eventBus.$emit(
          "dashBoardBimObject",
          this.nodeSelected
        );
      } else if (btn.action == "edit" && this.nodeSelected) {
        this.editName = true;
      } else if (btn.action == "edit" && this.nodeSelected == null) {
        this.showDialog = true;
      } else if (btn.action == "remove") {
        this.btnClicked = btn;
        this.activeRemove = true;
      } else if (btn.action == "collaborator" && this.nodeSelected) {
        globalType.spinal.eventBus.$emit(
          "openCollaboratorPanel",
          "this.nodeSelected"
        );
        globalType.spinal.eventBus.$emit("getNodeClick", this.nodeSelected);
      } else if (btn.action == "comments" && this.nodeSelected) {
        globalType.spinal.eventBus.$emit(
          "openCommentsPanel",
          this.nodeSelected
        );
        globalType.spinal.eventBus.$emit("getNodeClick", this.nodeSelected);
      } else if (btn.action == "color" && this.nodeSelected) {
        this.colorElement();
      } else if (btn.action == "zoom" && this.nodeSelected) {
        this.zoomOnElement();
      }
    },
    checkBoxClick: function(relationName, relationKey) {
      relationName[relationKey] = !relationName[relationKey];
    },
    colorElement: function() {
      this.nodeSelected.getElement().then(log => {
        log.endpoint.load(endpointNode => {
          Promise.all(this.getBimElement(endpointNode)).then(el => {
            var x = [];
            for (var i = 0; i < el.length; i++) {
              x = x.concat(el[i]);
            }

            viewer.setColorMaterial(x, "#FF4D3F", "1234");
          });
        });
      });
    },
    zoomOnElement: function() {
      this.nodeSelected.getElement().then(log => {
        log.endpoint.load(endpointNode => {
          Promise.all(this.getBimElement(endpointNode)).then(el => {
            var x = [];
            for (var i = 0; i < el.length; i++) {
              x = x.concat(el[i]);
            }

            viewer.fitToView(x);
          });
        });
      });
    },
    getDbids: async function(node, app) {
      let res = [];
      let element = await node.getElement();
      if (element.constructor.name === "BIMElement") {
        res = res.concat(element.id.get());
      } else if (node.hasChildren()) {
        let childrenNodes = node.getChildrenByApp(app);
        for (let index = 0; index < childrenNodes.length; index++) {
          const childNode = childrenNodes[index];
          res = res.concat(await this.getDbids(childNode, app));
        }
      }
      return res;
    },
    getBimElement: function(endpointNode) {
      var allBimOjects = [];

      var relations = endpointNode.getRelationsByAppNameByType(
        "linker",
        "link"
      );

      for (var i = 0; i < relations.length; i++) {
        allBimOjects = allBimOjects.concat(
          this.getDbids(relations[i].nodeList1[0], "linker")
        );
      }

      return allBimOjects;
    }
  },
  props: ["editMode", "graph"],
  watch: {
    editMode: function() {
      this.getAllIconsByTypes();
    }
  }
};
</script>

<style>
._sidebar {
  width: 10%;
  height: calc(95% - 40px);
  float: left;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}

._sidebar .sidebar_button {
  width: 100%;
  height: 40px;
  padding-top: 10px;
  text-align: center;
  margin-bottom: 10px;
}

._sidebar .sidebar_button:hover {
  cursor: pointer;
}

._sidebar .sidebar_button .md-icon,
._sidebar .sidebar_button .md-checkbox {
  height: 50%;
}

._sidebar .sidebar_button .text {
  height: 50%;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
