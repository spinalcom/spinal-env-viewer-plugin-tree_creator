<script>
import Vue from "vue";
import contextStudio from "./linker/contextStudio.vue";
import contextManager from "./manager/contextManager.vue";

require("spinal-env-viewer-plugin-apps");
var ForgeViewer = require("../spinal-viewer-library/src/forgeViewer.js");

// import appVisualizer from "./apps-visualizer/appVisualizer.vue";
const ComponentCtor1 = Vue.extend(contextStudio);
const ComponentCtor2 = Vue.extend(contextManager);
// const ComponentCtor3 = Vue.extend(appVisualizer);

const ClassName = "contextStudio";
const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;

const PanelTitle1 = "Context Linker";
const ButtonLabel1 = "Context Linker";
const ButtonIcon1 = "description";

const PanelTitle2 = "Context Manager";
const ButtonLabel2 = "Context Manager";
const ButtonIcon2 = "bookmarks";

const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.panel2 = null;

    window.forgeViewer = new ForgeViewer(this.viewer);
  }
  load() {
    if (this.viewer.toolbar) {
      this.createUI();
    } else {
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(
        av.TOOLBAR_CREATED_EVENT,
        this.onToolbarCreatedBinded
      );
    }

    return true;
  }
  onToolbarCreated() {
    this.viewer.removeEventListener(
      av.TOOLBAR_CREATED_EVENT,
      this.onToolbarCreatedBinded
    );
    this.onToolbarCreatedBinded = null;
    this.createUI();
  }
  unload() {
    this.viewer.toolbar.removeControl(this.subToolbar);
    return true;
  }
  // This function is to create your button on viewer, it used autodesk forge api
  createUI() {
    this.panel1 = new PanelClass(this.viewer, PanelTitle1);
    globalType.spinal.panelManager.registerPanel(this.panel1, "contextStudio");

    this.panel2 = new PanelClass(this.viewer, PanelTitle2);
    globalType.spinal.panelManager.registerPanel(this.panel2, "contextManager");

    var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    globalType.spinal.panelManager.registerButton(button1, "contextStudio");
    button1.container.style.color = "red";
    var icon = button1.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon1;
    button1.setToolTip(ButtonLabel1);

    var button2 = new Autodesk.Viewing.UI.Button(ButtonLabel2);
    globalType.spinal.panelManager.registerButton(button2, "contextManager");
    button2.container.style.color = "red";
    var icon = button2.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon2;
    button2.setToolTip(ButtonLabel2);

    this.initialize();
  }
  initialize() {
    var _container1 = document.createElement("div");
    _container1.className = this.panel1.container.id + "-pannelcontainer";
    _container1.style.height = "calc(100% - 45px)";
    _container1.style.overflowY = "auto";
    this.panel1.container.appendChild(_container1);
    new ComponentCtor1().$mount(_container1);

    var _container2 = document.createElement("div");
    _container2.className = this.panel2.container.id + "-pannelcontainer";
    _container2.style.height = "calc(200% - 45px)";
    _container2.style.overflowY = "auto";
    this.panel2.container.appendChild(_container2);
    new ComponentCtor2().$mount(_container2);
  }
};
export default new class {
  constructor() {
    Autodesk.Viewing.theExtensionManager.registerExtension(
      ClassName,
      classExtention
    ); // this is the register of your class
    window.spinal.ForgeExtentionManager.addExtention(ClassName);
  }
}();
</script>


<style>
.bkcolor {
  background-color: rgba(17, 48, 223, 0.644);
}
</style>
