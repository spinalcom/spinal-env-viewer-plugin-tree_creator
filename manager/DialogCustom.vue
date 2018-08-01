<template>
  <div>
    <md-dialog :md-active="showDialog">
      <md-dialog-title>Context Creator</md-dialog-title>

      <md-steppers>
        <md-step id="first"
                 md-label="Global">
          <md-field class="small-field">
            <label>Context Name</label>
            <md-input v-model="contextName"></md-input>
          </md-field>
        </md-step>
        <md-step id="second"
                 md-label="Elements">
          <div class="md-layout">

            <div class="md-layout-item md-size-80">
              <md-field class="small-field">
                <label>Type</label>
                <md-input v-model="type"></md-input>
              </md-field>
              <md-field class="small-field">
                <label for="base">Base</label>
                <md-select class="cool"
                           v-model="base"
                           name="base"
                           id="base">
                  <md-option v-for="(choice,index) in baseChoices"
                             :value="choice"
                             :key="choice+'-'+index">
                    {{ choice }}
                  </md-option>
                </md-select>
              </md-field>
              <md-field class="small-field">
                <label>Properties</label>
                <md-input v-model="properties"></md-input>
              </md-field>
            </div>

            <div class="md-layout-item">
              <md-button @click="test"
                         class="md-icon-button cool2">
                <md-icon>add</md-icon>
              </md-button>
            </div>
          </div>

          <md-table class="md-scrollbar"
                    style=" max-height: 200px;
                            overflow: auto;">
            <md-table-row>
              <md-table-head md-numeric>N°</md-table-head>
              <md-table-head>Type</md-table-head>
              <md-table-head>Base</md-table-head>
            </md-table-row>

            <md-table-row v-for="(item, index) in models"
                          :key="index">
              <md-table-cell md-numeric>{{index}}</md-table-cell>
              <md-table-cell>{{item.type}}</md-table-cell>
              <md-table-cell>{{item.base}}</md-table-cell>
            </md-table-row>

          </md-table>

        </md-step>

        <md-step id="third"
                 md-label="Interactions">
          <drag :image-x-offset=20
                :image-y-offset=5
                tag="md-chip"
                v-for="(element,index) in modelsTypes"
                :key="element+'-'+index"
                :transfer-data="{ model: element }">
            {{element}}
            <!-- <md-chip class="md-accent"
                     md-clickable>{{element}}
            </md-chip> -->
            <template slot="image">
              <md-chip class="md-accent"
                       md-clickable>{{element}}
              </md-chip>
            </template>
          </drag>
          <md-button class="md-icon-button"
                     @click="addInteraction">
            <md-icon>add</md-icon>
          </md-button>
          <interaction v-for="(interaction, index) in interactionsArray"
                       :key="index"
                       :modelA="interaction.modelA"
                       @modelAChange="updateModelA(interaction, ...arguments)"
                       :relation="interaction.relation"
                       @relationChange="updateRelation(interaction, ...arguments)"
                       :modelB="interaction.modelB"
                       @modelBChange="updateModelB(interaction, ...arguments)"></interaction>
        </md-step>

        <!-- <md-step id="third"
                 md-label="Third Step">

        </md-step> -->
      </md-steppers>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="update(false)">Close</md-button>
        <md-button class="md-primary"
                   @click="handleSave">Save</md-button>
      </md-dialog-actions>
    </md-dialog>

  </div>
</template>

<script>
import Vue from "vue";
import { Drag, Drop } from "vue-drag-drop";
import interaction from "./interaction.vue";
Vue.component("drag", Drag);
Vue.component("drop", Drop);
export default {
  name: "DialogCustom",
  data: () => ({
    contextName: "",
    type: "",
    base: "",
    baseChoices: ["AbstractElement", "BIMElement", "SpinalNetwork"],
    models: [
      // { type: "Zone", base: "AbstractElement", nameCount: 0 },
      // { type: "Equipement", base: "BIMElement", nameCount: 0 },
      // { type: "Other", base: "BIMElement", nameCount: 0 }
    ],
    // interactionsObj: {
    //   Zone: {
    //     Zone: "Aggregates",
    //     Equipement: "Aggregates",
    //     Other: "Contains"
    //   },
    //   Equipement: {
    //     // Equipement: "Aggregates",
    //     Other: "Contains"
    //   }
    // },
    interactionsArray: [
      { modelA: "modelA", relation: "relation", modelB: "modelB" }
    ],
    propertiesArray: [],
    dragOverStyle: false,
    properties: ""
  }),
  components: { interaction },
  props: ["showDialog", "graph"],
  // model: {
  //   prop: "showDialog",
  //   event: "change"
  // },
  methods: {
    updateModelA: function(interaction, modelA) {
      interaction.modelA = modelA;
    },
    updateRelation: function(interaction, relation) {
      interaction.relation = relation;
    },
    updateModelB: function(interaction, modelB) {
      interaction.modelB = modelB;
    },
    addInteraction: function() {
      this.interactionsArray.push({
        modelA: "modelA",
        relation: "relation",
        modelB: "modelB"
      });
    },
    update: function(bool) {
      this.$emit("change", bool);
    },
    test: function() {
      let obj = {
        type: this.type,
        base: this.base,
        nameCount: 0
      };
      if (this.properties != "") {
        this.parseProperties();
        console.log(this.propertiesArray);

        obj.properties = this.propertiesArray;
      }

      this.models.push(obj);
      this.type = "";
      this.base = "";
      this.properties = "";
      this.propertiesArray = [];
      console.log(obj.properties);
    },
    drag: function(evt) {
      evt.dataTransfer.setData("model", "test2");
      return evt;
    },
    interactionsObj: function() {
      let res = {};
      for (let index = 0; index < this.interactionsArray.length; index++) {
        const interaction = this.interactionsArray[index];
        if (typeof res[interaction.modelA] === "undefined")
          res[interaction.modelA] = {};
        res[interaction.modelA][interaction.modelB] = interaction.relation;
      }
      return res;
    },
    relations: function() {
      let res = [];
      for (let index = 0; index < this.interactionsArray.length; index++) {
        const interaction = this.interactionsArray[index];
        if (!res.includes[interaction.relation]) res.push(interaction.relation);
      }
      return res;
    },
    handleSave: function() {
      this.update(false);
      let newInteractionsObj = this.interactionsObj();
      let newRelations = this.relations();
      console.log(this.models);

      this.graph.getContext(
        this.contextName,
        newRelations,
        this.models,
        newInteractionsObj
      );
      this.models = [];
      this.interactionsArray = [
        { modelA: "modelA", relation: "relation", modelB: "modelB" }
      ];
      this.contextName = "";
    },
    parseProperties: function() {
      // this.propertiesArray[this.type] = {};
      let props = this.properties.split("==");
      // console.log(props);
      if (props.length > 1) {
        let t = [];
        t.push(props[0].trim());
        t.push(props[1].trim());
        this.propertiesArray.push(t);
      }

      // console.log(this.propertiesArray);
    }
  },
  computed: {
    modelsTypes: function() {
      let res = [];
      for (let index = 0; index < this.models.length; index++) {
        const element = this.models[index];
        res.push(element.type);
      }
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
}
.cool2 {
  top: 70%;
  left: 40%;
}
</style>

<style>
.md-select-menu {
  z-index: 40;
}
</style>
