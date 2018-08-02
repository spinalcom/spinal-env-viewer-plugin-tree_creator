
<template>
  <div class="sharedToolBarContext">

    <md-list>
      <md-list-item>
        <div class="md-list-item-text">
          <span>{{name}}</span>
        </div>

        <md-button v-if="self!=null &&self.constructor.name==='SpinalNode'"
                   class="md-icon-button"
                   @click.stop="editName=true">
          <md-icon>edit</md-icon>
        </md-button>
        <dialog-prompt :active="editName"
                       :oldJson="name"
                       @promptValue="handlePrompt"
                       @disablePrompt="editName=false"></dialog-prompt>

        <md-button class="md-icon-button"
                   @click.stop="onRemove">
          <md-icon>clear</md-icon>
        </md-button>

        <md-button class="md-icon-button"
                   @click.stop="selectLevel3">
          <md-icon>select_all</md-icon>
        </md-button>

      </md-list-item>
    </md-list>

  </div>

</template>

<script>
var globalType;
var spinalSystem;
var EventBus;
var viewer;
import dialogPrompt from "./dialogPrompt.vue";

export default {
  name: "sharedToolBarContext",
  data() {
    return {
      self: null,
      name: "select a Context",
      preSelected: null,
      disableSelection: false,
      endpointSelector: null,
      // element: null,
      currentApp: null,
      editName: false
      // editedName: ""
    };
  },
  components: { dialogPrompt },
  methods: {
    handlePrompt: function(value) {
      // this.editedName = value;
      this.editName = false;
      this.self.name.set(value);
      this.name = value;
      this.self.getElement().then(ele => {
        ele.name.set(value);
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
    onRemove: function() {},
    getAlldbIds: function(rootId) {
      let instanceTree = viewer.model.getData().instanceTree;
      let alldbId = [];
      if (!rootId) {
        return alldbId;
      }
      let queue = [];
      queue.push(rootId);
      while (queue.length > 0) {
        let node = queue.shift();
        alldbId.push(node);
        instanceTree.enumNodeChildren(node, function(childrenIds) {
          queue.push(childrenIds);
        });
      }
      return alldbId;
    },
    promiseGetProperties: function(dbId) {
      return new Promise(resolve => {
        viewer.getProperties(dbId, resolve);
      });
    },

    async selectLevel3() {
      let selection = [];
      let instanceTree = viewer.model.getData().instanceTree;
      let rootId = instanceTree.getRootId();
      let alldbids = this.getAlldbIds(rootId);
      for (let index = 0; index < alldbids.length; index++) {
        const element = alldbids[index];
        let properties = await this.promiseGetProperties(element);
        for (let index = 0; index < properties.properties.length; index++) {
          const prop = properties.properties[index];
          if (
            (typeof prop.displayName != "undefined" &&
              typeof prop.displayValue != "undefined" &&
              (prop.displayName == "Base Constraint" &&
                prop.displayValue == "Level 3")) ||
            (prop.displayName == "Level" && prop.displayValue == "Level 3")
          )
            selection.push(element);
        }
      }
      var index = selection.indexOf(5539);
      if (index > -1) {
        selection.splice(index, 1);
      }
      viewer.isolateById(selection);
      // viewer.select(selection);
    },
    getEvents: function() {
      EventBus.$on("contextContext", _self => {
        if (_self.context != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.context;
          this.name = this.self.name.get();
        }
      });

      EventBus.$on("nodeContext", _self => {
        if (_self.node != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.node;
          this.currentApp = _self.context;
          this.name = this.self.name.get();
          this.getDbids(this.self, this.currentApp).then(dbids => {
            viewer.select(dbids);

            // for (let index = 0; index < dbids.length; index++) {
            //   const element = dbids[index];
            //   viewer.getProperties(element, r => {
            //     console.log(r);
            //   });
            // }
          });
        }
      });
    }
  },
  mounted() {
    globalType = typeof window === "undefined" ? global : window;
    spinalSystem = globalType.spinal.spinalSystem;
    EventBus = globalType.spinal.eventBus;
    viewer = globalType.v;

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
  background-color: #2d3d93;
}
.sharedToolBarContext > div > ul > li > div > div {
  padding: 0px;
  padding-left: 8px;
}
</style>