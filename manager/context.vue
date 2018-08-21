
<template>
  <md-content class="context"
              v-bind:class="{contextSelect : isSelected}">
    <md-list>
      <md-list-item @click="sendContext">
        <md-button class="md-icon-button"
                   @click.stop="show = !show">
          <md-icon v-if="show">unfold_less</md-icon>
          <md-icon v-else>unfold_more</md-icon>
        </md-button>

        <div class="md-list-item-text">
          <span>{{context.name.get()}}</span>
        </div>
        <!-- <span style="flex: 1"
              class="md-title">{{context.name.get()}}</span> -->

        <md-menu :md-active="activeMenu"
                 v-if="editMode"
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     @click.stop.prevent="activeMenu=true">
            <md-icon>add</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item v-for="(model,index) in models"
                          :key="model.type+'-'+index"
                          @click.stop="onAddContextElement(model)">
              {{model.type}}
            </md-menu-item>

          </md-menu-content>
        </md-menu>

        <md-menu v-else
                 md-direction="bottom-start">
          <md-button class="md-icon-button"
                     md-menu-trigger>
            <md-icon>more_horiz</md-icon>
          </md-button>

          <md-menu-content class="small-menu">
            <md-menu-item>
              <md-button @click='print'
                         class="md-icon-button">
                <md-icon>print</md-icon>
              </md-button>
            </md-menu-item>

            <md-menu-item>
              <md-checkbox v-model="t1"
                           class="md-primary">relation</md-checkbox>
            </md-menu-item>

          </md-menu-content>
        </md-menu>

      </md-list-item>
    </md-list>
    <md-list v-if="show">
      <md-list-item class="test3"
                    @click="test"
                    v-for="(node,index) in nodeArray"
                    :key="node.name.get()+'-'+index">
        <spinal-node style=" padding-left: 5px; !important"
                     :node="node"
                     :context="context"
                     :editMode="editMode"
                     :eventName="eventName"></spinal-node>
      </md-list-item>
    </md-list>

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;

var EventBus;
import spinalNode from "./spinalNode.vue";
export default {
  name: "context",
  data() {
    return {
      nodeArray: [],
      show: false,
      isSelected: false,
      t1: true,
      activeMenu: false
    };
  },
  computed: {
    models: function() {
      let res = [];
      for (let index = 0; index < this.context.models.length; index++) {
        const model = this.context.models[index];
        if (model.base.get() != "BIMElement") {
          res.push(model.get());
        }
      }
      return res;
    }
  },
  props: ["context", "editMode", "eventName"],
  // watch: {
  //   context: function(newContext, oldContext) {
  //     if ((newContext != null, oldContext == null)) {
  //       this.linkToDB();
  //       console.log("test");
  //     }
  //   }
  // },
  components: { spinalNode },
  methods: {
    print: function() {
      console.log(this.context);
    },
    test: function() {},
    sendContext: function() {
      console.log("BAKA IS TESTING ALL FUNCTION");
      EventBus.$emit("contextContext", this);
      this.isSelected = true;
    },
    deselect: function() {
      console.log("BAKA IS TESTING ALL FUNCTION");
      this.isSelected = false;
    },
    getModel: function(modelType) {
      for (let index = 0; index < this.context.models.length; index++) {
        const element = this.context.models[index];
        if (element.type.get() === modelType) return element;
      }
    },
    getEvents: function() {},
    promiseLoad(_ptr) {
      return new Promise(resolve => {
        _ptr.load(resolve);
      });
    },
    incrementNameId(model) {
      model.nameCount.set(model.nameCount.get() + 1);
      return model.nameCount.get();
    },
    onAddContextElement: function(model) {
      let newElement = null;
      let sModel = this.getModel(model.type);
      let modelBase = sModel.base.get();
      let contextName = this.context.name.get();
      if (modelBase === "BIMElement") {
        newElement = new globalType.spinalCore._def[modelBase](
          0,
          model.type + this.incrementNameId(sModel),
          model.type
        );
      } else {
        newElement = new globalType.spinalCore._def[modelBase](
          model.type + this.incrementNameId(sModel),
          model.type
        );
      }
      let newNode = this.context.startingNode.addToExistingRelationByApp(
        contextName,
        "has",
        newElement,
        true
      ).node;
      if (newNode != null) newNode.addType(contextName, model.type);

      this.show = true;
    },
    linkToDB: function() {
      let charac = this.context.getCharacteristicElement();
      charac.bind(this.updateData);
    },
    updateData: function() {
      this.nodeArray = [];
      if (typeof this.context.startingNode != "undefined") {
        let relations = this.context.startingNode.getRelationsByApp(
          this.context
        );
        for (let index = 0; index < relations.length; index++) {
          const relation = relations[index];
          this.nodeArray = this.nodeArray.concat(
            this.context.startingNode.getChildrenByAppByRelation(
              this.context,
              relation
            )
          );
        }
      }
      // this.nodeArray = this.context.startingNode.getChildrenByAppByRelation(
      //   this.context.name.get(),
      //   "has"
      // );
    }
  },
  mounted() {
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.context {
  width: 100%;
}
.context > ul:first-child {
  background-color: black;
}

.contextSelect > ul:first-child {
  background-color: #2d3d93;
}
.test3 {
  border-right: 2px solid black !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
  border-left: 2px solid black !important;
}
</style>
