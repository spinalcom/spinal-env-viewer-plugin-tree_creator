
<template>
  <md-content class="spinalNode"
              v-bind:class="{spinalNodeSelect : isSelected}">
    <md-list class="test2"
             @click="sendNode">
      <md-list-item>
        <md-button v-if="addActive && !nodeArrayEmpty"
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
        <span style="flex: 1">{{node.name.get()}}</span>

        <md-menu v-if="addActive  &&editMode "
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>add</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item v-for="(modelType,index) in interactions"
                          :key="modelType+'-'+index"
                          @click.stop="onAddNodeElement(modelType)">
              {{modelType}}
            </md-menu-item>

          </md-menu-content>
        </md-menu>

        <md-menu v-else-if="!editMode"
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>more_horiz</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item @click="print">
              print
            </md-menu-item>

            <md-menu-item>
              test2
            </md-menu-item>

          </md-menu-content>
        </md-menu>

      </md-list-item>
    </md-list>

    <md-list class="test4"
             v-show="show">
      <md-list-item @click="test"
                    v-for="(childNode,index) in nodeArray"
                    :key="childNode.name.get()+'-'+index">
        <!-- {{childNode.name.get()}} -->
        <spinal-node :node="childNode"
                     :context="context"
                     :editMode="editMode"></spinal-node>
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
      show: true,
      isSelected: false,
      nodeArray: []
    };
  },
  props: ["node", "context", "editMode"],
  components: { spinalNode },
  computed: {
    addActive: function() {
      if (
        typeof this.node.type != "undefined" &&
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
      if (
        typeof this.node.type != "undefined" &&
        typeof this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ] != "undefined"
      )
        return this.context.interactions[
          this.node.type[this.context.name.get()].get()
        ]._attribute_names;
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
    nodeArrayEmpty: function() {
      return this.nodeArray.length === 0;
    }
  },
  methods: {
    print: function() {
      console.log(this.node);
    },
    test: function() {},
    incrementNameId(model) {
      model.nameCount.set(model.nameCount.get() + 1);
      return model.nameCount.get();
    },
    getEvents: function() {},
    getModel: function(modelType) {
      for (let index = 0; index < this.context.models.length; index++) {
        const element = this.context.models[index];
        if (element.type.get() === modelType) return element;
      }
    },
    onAddNodeElement: function(modelType) {
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
        if (modelBase === "BIMElement") {
          let selected = viewer.getSelection();
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
    sendNode: function() {
      EventBus.$emit("nodeContext", this);
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
      this.nodeArray = [];
      let relations = this.node.getRelationsByApp(this.context);
      for (let index = 0; index < relations.length; index++) {
        const relation = relations[index];
        this.nodeArray = this.nodeArray.concat(
          this.node.getChildrenByAppByRelation(this.context, relation)
        );
      }
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
