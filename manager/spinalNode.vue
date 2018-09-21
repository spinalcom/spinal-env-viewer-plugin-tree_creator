
<template>
  <md-content class="spinalNode"
              v-bind:class="{spinalNodeSelect : isSelected}">
    <md-list class="test2"
             @click="sendNode">
      <md-list-item>
        <md-button v-if="node.hasChildren(context.name.get())"
                   class="md-icon-button test"
                   @click.stop="show = !show">
          <md-icon v-if="show">arrow_drop_down</md-icon>
          <md-icon v-else>arrow_drop_up</md-icon>
        </md-button>
        <md-button v-else-if="addActive"
                   class="md-icon-button test">
          <md-icon>remove</md-icon>
        </md-button>
        <md-button v-else
                   class="md-icon-button test">
          <md-icon>stop</md-icon>
        </md-button>
        <div class="md-list-item-text">
          <span>{{node.name.get()}}</span>
        </div>

        <!-- <md-menu v-if="addActive  &&editMode "
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>add</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item v-for="(modelType,index) in interactions"
                          :key="modelType+'-'+index"
                          @click.prevent.stop="onAddNodeElement(modelType)">
              {{modelType}}
            </md-menu-item>

          </md-menu-content>
        </md-menu> -->

        <!-- <md-menu v-else-if="!editMode"
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>more_horiz</md-icon>
          </md-button>

          <md-menu-content class="small-menu">

            <md-menu-item @click="openDashboard">
              Open Dashboard
            </md-menu-item>

            <md-menu-item @click="isolate">
              Isolate
            </md-menu-item>

            <md-menu-item @click="print">
              print
            </md-menu-item>

          </md-menu-content>
        </md-menu> -->

        <!-- <md-button @click="print">
          <md-icon>print</md-icon>
        </md-button> -->

      </md-list-item>
    </md-list>

    <md-list class="test4"
             v-if="show"
             v-for="(nodeArray,relation) in nodeObj"
             :key="relation">
      <md-list-item v-if="activeRelations !=null && activeRelations[relation]"
                    @click="test"
                    v-for="(childNode,index) in nodeArray"
                    :key="childNode.name.get()+'-'+index">
        <!-- {{childNode.name.get()}} -->
        <spinal-node :node="childNode"
                     :context="context"
                     :editMode="editMode"
                     :activeRelations="activeRelations"
                     :eventName="eventName"></spinal-node>
      </md-list-item>
    </md-list>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var EventBus;
var viewer;
import spinalNode from "./spinalNode.vue";
export default {
  name: "spinalNode",
  data() {
    return {
      show: false,
      isSelected: false,
      nodeObj: {}
    };
  },
  props: ["node", "context", "editMode", "eventName", "activeRelations"],
  components: { spinalNode },
  computed: {
    addActive: function() {
      if (
        typeof this.node.type != "undefined" &&
        typeof this.node.type[this.context.name.get()] != "undefined" &&
        typeof this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ] != "undefined"
      )
        return (
          this.context.interactions[
            this.node.type[this.context.name.get()].get()
          ]._attribute_names.length > 0
        );
    },
    interactions: function() {
      let res = [];

      if (
        typeof this.node.type != "undefined" &&
        typeof this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ] != "undefined"
      )
        res = res.concat(
          this.context.interactions[
            this.node.type[this.context.name.get()].get()
          ]._attribute_names
        );
      let discoveryArray = [];
      for (let index = 0; index < res.length; index++) {
        const element = res[index];
        let model = this.getModel(element);
        if (typeof model.properties != "undefined")
          discoveryArray.push(element + "(D)");
      }
      res = res.concat(discoveryArray);
      return res;
    },
    filteredInteractions: function() {
      let res = [];
      let interactions = this.interactions;
      for (let index = 0; index < interactions.length; index++) {
        const modelType = interactions[index];
        let sModel = this.getModel(modelType);
        if (sModel.base.get() != "BIMElement") res.push(modelType);
      }
      return res;
    },
    nodeObjEmpty: function() {
      return this.nodeObj.length === 0;
    }
  },
  methods: {
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
    isolate: function() {
      this.getDbids(this.node, this.context).then(dbids => {
        viewer.isolateById(dbids);
      });
    },
    openDashboard: function() {
      EventBus.$emit("openDashboard", this);
    },
    print: function() {
      console.log("*************************************************");

      console.log("NODE:", this.node);
      this.node.getElement().then(el => {
        console.log("ELEMENT", el);

        if (typeof el.name != "undefined") console.log("NAME:", el.name.get());

        if (typeof el.currentValue != "undefined")
          console.log("CURRENTVALUE:", el.currentValue.get());

        if (typeof el.unit != "undefined")
          console.log("unit:", el.currentValue.get());

        if (typeof el.path != "undefined") console.log("PATH:", el.path.get());
      });
    },
    test: function() {},
    incrementNameId(model) {
      model.nameCount.set(model.nameCount.get() + 1);
      return model.nameCount.get();
    },
    getEvents: function() {
      globalType.spinal.eventBus.$on("create_node", el => {
        if (el.context._server_id == this.context._server_id) {
          console.log(this.context.name.get());
          // this.onAddContextElement(el.icon_action.model);
          console.log("create_context", el);
        }
      });
    },
    getModel: function(modelType) {
      for (let index = 0; index < this.context.models.length; index++) {
        const element = this.context.models[index];
        if (element.type.get() === modelType) return element;
      }
    },

    promiseGetProperties: function(dbId) {
      return new Promise(resolve => {
        viewer.getProperties(dbId, resolve);
      });
    },
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
    async selectByProperties(modelType) {
      let model = this.getModel(modelType);
      // return;

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
            typeof prop.displayName != "undefined" &&
            typeof prop.displayValue != "undefined" &&
            (prop.displayName == model.properties[0][0].get() &&
              prop.displayValue == model.properties[0][1].get())
            // || (prop.displayName == "Level" && prop.displayValue == "Level 3")
          )
            selection.push(element);
        }
      }

      return selection;
    },
    async addBySelection(modelType, auto) {
      if (
        typeof this.node.type != "undefined" &&
        typeof this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ] != "undefined"
      ) {
        let relationType = this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ][modelType];
        let sModel = this.getModel(modelType);
        let modelBase = sModel.base.get();
        let newElement = null;
        let selected = [];
        if (modelBase === "BIMElement") {
          if (auto) selected = await this.selectByProperties(modelType);
          else selected = viewer.getSelection();
          if (selected.length < 1) alert("Please select an object");
          for (let i = 0; i < selected.length; i++) {
            const itemId = selected[i];
            globalType.spinal.contextStudio.graph
              .getNodeBydbId(itemId)
              .then(node => {
                this.node.addToExistingRelationByApp(
                  this.context.name.get(),
                  relationType.get(),
                  node,
                  true
                );
              });
          }
          return;
        } else {
          newElement = new globalType.spinalCore._def[modelBase](
            modelType + this.incrementNameId(sModel),
            modelType
          );
        }
        let res = this.node.addToExistingRelationByApp(
          this.context.name.get(),
          relationType.get(),
          newElement,
          true
        );
        if (res.node != null)
          res.node.addType(this.context.name.get(), modelType);
      }
      this.show = true;
    },
    onAddNodeElement: function(modelType) {
      if (modelType.includes("(D)", modelType.length - 3)) {
        this.addBySelection(modelType.split("(D)")[0], true);
      } else {
        this.addBySelection(modelType, false);
      }
    },
    sendNode: function() {
      EventBus.$emit(this.eventName, this);
      this.isSelected = true;
    },
    deselect: function() {
      this.isSelected = false;
    },
    linkToDB: function() {
      this.node.bind(this.updateData);
    },
    getRelations: function() {
      let res = [];
      if (typeof this.node.type != "undefined") {
        let type = this.node.type[this.context.name.get()].get();
        if (typeof this.context.interactions[type] != "undefined") {
          for (
            let index = 0;
            index < this.context.interactions[type]._attribute_names.length;
            index++
          ) {
            const ele = this.context.interactions[type][
              this.context.interactions[type]._attribute_names[index]
            ];
            if (!res.includes(ele.get())) res.push(ele.get());
          }
        }
      }
      return res;
    },
    // updateData: function() {
    //   //TODO
    //   let res = [];
    //   let relations = this.getRelations();
    //   for (let index = 0; index < relations.length; index++) {
    //     const relation = relations[index];
    //     res = res.concat(
    //       this.node.getChildrenByAppByRelation(
    //         this.context.name.get(),
    //         relation
    //       )
    //     );
    //   }
    //   this.nodeArray = res;
    // }
    updateData: function() {
      this.nodeObj = this.node.getChildrenByAppFiltered(this.context);
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    viewer = globalType.v;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.spinalNode {
  width: 100%;
  padding-left: 15px;

  /* border-left: 2px solid rgba(0, 0, 0, 1) !important; */
}

.spinalNodeSelect,
.spinalNodeSelect > ul {
  background-color: #2d3d93;
}
.test {
  margin-left: 0px;
}
.test2 {
  /* border-top: 1px solid black !important;
  border-bottom: 1px solid black !important;
  border-left: 2px solid rgba(0, 0, 0, 1); */
  border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.test4 {
  /* border-left: 2px solid rgba(0, 0, 0, 1) !important; */
  /* border-bottom: 1px solid rgba(0, 0, 0, 1) !important; */
}
</style>
