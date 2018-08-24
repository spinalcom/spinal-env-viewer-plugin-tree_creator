<template>
  <md-content class="_sidebar">
    <div class="sidebar_button"
         v-for="_btn in allIcons"
         :key="_btn.title">
      <md-button class="md-icon-button"
                 @click="clickEvent(_btn)"
                 :title="_btn.title">
        <md-icon>{{_btn.icon}}</md-icon>
      </md-button>
    </div>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;

export default {
  name: "sidebarMenu",
  data() {
    return {
      type: null,
      allIcons: [],
      vueComponentSelected: null,
      contextSelected: null,
      nodeSelected: null,
      buttonList: {
        edit: {
          title: "Edit",
          icon: "edit",
          disabled: false
        },
        dashboard: {
          title: "Open dashBoard",
          icon: "show_chart",
          action: "dashboard"
        },
        isolate: {
          title: "Isolate",
          icon: "all_out",
          action: "isolate"
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
    var _self = this;
    globalType.spinal.eventBus.$on("contextContext", el => {
      _self.vueComponentSelected = el;
      if (el.context.type.get() == "context") {
        _self.type = "Globalcontext";
        _self.contextSelected = el.context;
      } else {
        _self.type = "smartConnector";
      }
      _self.getAllIconsByTypes();
    });

    globalType.spinal.eventBus.$on("nodeContext", el => {
      _self.vueComponentSelected = el;
      if (el.context.type.get() == "context") {
        _self.type = "nodeContext";
        _self.contextSelected = el.context;
        _self.nodeSelected = el.node;
      } else {
        _self.type = "spinalNode";
      }
      _self.getAllIconsByTypes();
    });
  },
  methods: {
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
          this.allIcons.push(this.buttonList.edit);

          if (this.editMode) {
            // this.allIcons.push(this.buttonList.add);
            this.editModeIconsContext();
          }
          break;
        case "nodeContext":
          this.allIcons.push(this.buttonList.edit);
          this.allIcons.push(this.buttonList.isolate);

          if (this.editMode) {
            // this.allIcons.push(this.buttonList.add);
            this.editModeIconsNode();
          }
          break;
        case "spinalNode":
          this.allIcons.push(this.buttonList.edit);
          this.allIcons.push(this.buttonList.isolate);
          this.allIcons.push(this.buttonList.dashboard);
          break;
      }
    },
    clickEvent: function(btn) {
      console.log(btn);
      // globalType.spinal.eventBus.$emit(btn.action, btn);
      if (btn.action == "create_context") {
        this.vueComponentSelected.onAddContextElement(btn.model);
      } else if (btn.action == "create_node") {
        this.vueComponentSelected.addBySelection(btn.name, false);
      } else if (btn.action == "isolate") {
        this.vueComponentSelected.isolate();
      } else if (btn.action == "dashboard") {
        globalType.spinal.eventBus.$emit(
          "openDashboard",
          this.vueComponentSelected
        );
      }
    }
  },
  props: ["editMode"],
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
}
</style>
