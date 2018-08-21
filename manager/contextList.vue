<template>
  <md-content class='contextList md-scrollbar'>
    <md-list>
      <md-list-item @click="test"
                    v-for="(context,index) in contextArray"
                    :key="context.name.get()+'-'+index">
        <!-- v-show="typeof context.startingNode !='undefined'" -->
        <context :context="context"
                 :editMode="editMode&&context.type.get()==='context'"
                 :eventName="eventName"></context>
        <!-- <md-divider></md-divider> -->
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
import context from "./context.vue";
export default {
  name: "contextList",
  data() {
    return {
      contextArray: []
    };
  },
  props: ["contextList", "editMode", "eventName"],
  components: {
    context
  },
  watch: {
    contextList: function(newContextList, oldContextList) {
      if (oldContextList == null && newContextList != null) {
        this.linkToDB();
      }
    }
  },
  methods: {
    test: function() {},
    updateArray: function() {
      this.contextArray = [];
      for (
        let index = 0;
        index < this.contextList._attribute_names.length;
        index++
      ) {
        const element = this.contextList[
          this.contextList._attribute_names[index]
        ];
        element.load(context => {
          this.contextArray.push(context);
        });
      }
    },
    // onModelChange() {
    //   this.updateArray();
    // },
    getEvents: function() {},
    linkToDB: function() {
      this.contextList.bind(this.updateArray);
    }
  },

  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    // this.linkToDB();
    this.getEvents();
  }
};
</script>

<style scoped>
.contextList {
  overflow-y: auto;
  height: calc(100% - 40px);
  width: calc(100% - 10px);
}
</style>
