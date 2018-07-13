<script>
import Vue from "vue";
import contextStudio from "./contextStudio.vue"
const ComponentCtor1 = Vue.extend(contextStudio);

const ClassName = "contextStudio";

const globalType = typeof window === "undefined" ? global : window;
const spinalSystem = globalType.spinal.spinalSystem;

const PanelTitle1 = "Context Studio";
const ButtonLabel1 = "Context Studio";
const ButtonIcon1 = "description";


const classExtention = class {
  constructor(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this.viewer = viewer;
    this.panel1 = null;
    this.show = false;
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
    globalType.spinal.panelManager.registerPanel(
      this.panel1,
      "contextStudio"
    );


    var button1 = new Autodesk.Viewing.UI.Button(ButtonLabel1);
    globalType.spinal.panelManager.registerButton(button1, "contextStudio");

 
    button1.container.style.color = "red";
    var icon = button1.container.firstChild;
    icon.className = "adsk-button-icon md-icon md-icon-font md-theme-default";
    icon.innerHTML = ButtonIcon1;
    button1.setToolTip(ButtonLabel1);

   

    this.subToolbar = this.viewer.toolbar.getControl("spinalcom");
    if (!this.subToolbar) {
      this.subToolbar = new Autodesk.Viewing.UI.ControlGroup("spinalcom");
      this.viewer.toolbar.addControl(this.subToolbar);
    }
    // this.subToolbar.addControl(button1);
    this.subToolbar.addClass("bkcolor");
    // this.subToolbar.addControl(button2);
    this.initialize();
  }
  initialize() {
    var _container1 = document.createElement("div");
    _container1.className = this.panel1.container.id + "-pannelcontainer";
    _container1.style.height = "calc(100% - 45px)";
    _container1.style.overflowY = "auto";
    this.panel1.container.appendChild(_container1);
    new ComponentCtor1().$mount(_container1);
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
