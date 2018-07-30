<template>
  <md-content class='appsList md-scrollbar'>
    <md-list>
      <md-list-item @click="test"
                    v-for="(app,index) in appArray"
                    :key="app.name.get()+'-'+index">
        <app :app="app"
             :editMode="editMode"></app>
        <md-divider></md-divider>
      </md-list-item>
    </md-list>
  </md-content>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
import app from "./app.vue";
export default {
  name: "appsList",
  data() {
    return {
      appArray: []
    };
  },
  props: ["appsList", "editMode"],
  components: {
    app
  },
  watch: {
    appsList: function(newContextList, oldContextList) {
      if (oldContextList == null && newContextList != null) {
        this.linkToDB();
      }
    }
  },
  methods: {
    test: function() {},
    updateArray: function() {
      this.appArray = [];
      for (
        let index = 0;
        index < this.appsList._attribute_names.length;
        index++
      ) {
        const element = this.appsList[this.appsList._attribute_names[index]];
        element.load(app => {
          this.appArray.push(app);
        });
      }
    },
    // onModelChange() {
    //   this.updateArray();
    // },
    getEvents: function() {},
    linkToDB: function() {
      this.appsList.bind(this.updateArray);
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
.appsList {
  overflow-y: auto;
  height: calc(100% - 40px);
  width: calc(100% - 10px);
}
</style>
