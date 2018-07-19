
<template>
  <md-content class="context"
              v-bind:class="{contextSelect : isSelected}">
    <md-list @click="sendContext">
      <md-list-item>
        <md-button class="md-icon-button"
                   @click.stop="show = !show">
          <md-icon v-if="show">unfold_less</md-icon>
          <md-icon v-else>unfold_more</md-icon>
        </md-button>
        <span style="flex: 1"
              class="md-title">{{context.name.get()}}</span>

        <md-button @click.stop="onAddcontextElement"
                   class="md-icon-button"
                   md-menu-trigger>
          <md-icon>add</md-icon>
        </md-button>

      </md-list-item>
    </md-list>

    <span style="flex: 1"
          v-show="show"
          class="md-title">{{context.name.get()}}</span>

    <!-- <context-elements-forest 
                             v-if="contextElementsForest!=null"
                             :contextElementsForest="contextElementsForest"></context-elements-forest> -->

  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;

var EventBus;
// import contextElementsForest from "./contextElementsForest.vue";
export default {
  name: "context",
  data() {
    return {
      contextElementsForest: null,
      // contextName: null,
      show: false,
      isSelected: false
    };
  },
  props: ["context"],
  // watch:{context:function(newContext,oldContext){
  //  if(newContext != null){
  //  this.linkToDB()
  // console.log('test');
  
  //  }
  // }},
  //contextElementsForest
  components: {  },
  methods: {
    sendContext: function() {
      EventBus.$emit("contextContext", this);
      this.isSelected = true;
    },
    deselect: function() {
      this.isSelected = false;
    },
    getEvents: function() {},
    promiseLoad(_ptr) {
      return new Promise(resolve => {
        _ptr.load(resolve);
      });
    },
    onAddcontextElement: function() {
      // if (this.contextElementsForest != null) {
      //   this.contextElementsForest.addTree();
      // }
      // this.show = true;
      console.log('test');
      
    },
    // updateData:function(){
    //  this.contextName = this.context.name.get()
    // },
    // linkToDB: function() {
    //   this.context.bind(this.updateData)
    // }

  },
  mounted() {
    EventBus =globalType.spinal.eventBus;
    this.getEvents();
  }
};
</script>

<style scoped>
.context {
  width: 100%;
}
.context > ul {
  background-color: black;
}

.contextSelect > ul {
  background-color: rgba(54, 206, 8, 0.5);
}
</style>









