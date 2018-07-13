
<template>
  <md-content class="contextStudio">
    hello
  </md-content>
</template>

<script>
import { Graph} from "spinal-models-context_studio";
var globalType = typeof window === "undefined" ? global : window;

var spinalSystem;
export default {
  name: "contextStudio",
  data() {
    return {};
  },
  components: {},
  methods: {
    getEvents: function() {},
     linkToDB: function() {
      spinalSystem
        .getModel()
        .then(forgefile => {
          if (forgefile) {
            if (forgefile.graph) {
              console.log("exist");
              forgefile.graph.init()
             
            //  let spinalNode = new SpinalNode("test2", new Str("t"),forgefile.graph);
            } else {
              let g = new Graph("context Studio");
              g.init()
            //  let spinalNode = new SpinalNode("test2", new Str("t"),g);
             forgefile.add_attr({
                  graph:g
                });
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






