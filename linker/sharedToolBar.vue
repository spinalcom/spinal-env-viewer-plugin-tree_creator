
<template>
  <div class="sharedToolBarContext">

  </div>

</template>

<script>
var globalType;
var spinalSystem;
var EventBus;
var viewer;

export default {
  name: "sharedToolBarContext",
  data() {
    return {
      self: null,
      name: "select a Context",
      preSelected: null,
      disableSelection: false,
      endpointSelector: null,
      currentApp: null
    };
  },
  props: ["eventName"],
  components: {},
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
    getEvents: function() {
      EventBus.$on("contextContext", _self => {
        if (_self.context != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.context;
          this.name = this.self.name.get();
        }
      });

      EventBus.$on(this.eventName, _self => {
        if (_self.node != null) {
          if (this.preSelected != null) this.preSelected.deselect();
          this.preSelected = _self;
          this.self = _self.node;
          this.currentApp = _self.context;
          this.name = this.self.name.get();
          if (_self.context.name.get() != "logger") {
            this.getDbids(this.self, this.currentApp).then(dbids => {
              viewer.select(dbids);
              console.log("*************************************************");

              console.log("NODE:", this.self);
              this.self.getElement().then(el => {
                console.log("ELEMENT", el);

                if (typeof el.name != "undefined")
                  console.log("NAME:", el.name.get());

                if (typeof el.currentValue != "undefined")
                  console.log("CURRENTVALUE:", el.currentValue.get());

                if (typeof el.unit != "undefined")
                  console.log("unit:", el.unit.get());
                if (typeof el.path != "undefined")
                  console.log("PATH:", el.path.get());
              });
              // for (let index = 0; index < dbids.length; index++) {
              //   const element = dbids[index];
              //   viewer.getProperties(element, r => {
              //     console.log(r);
              //   });
              // }
            });
          }
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
</style>
