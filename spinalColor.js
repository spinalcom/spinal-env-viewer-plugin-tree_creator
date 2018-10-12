const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;



var SpinalColorManager = class SpinalColorManager {

  constructor() {
    this.relationName = "hasColor";
  }


  isBimObjectParent(abstractNode, appName, callback) {

    var children = abstractNode.getChildrenByApp(appName);
    var allPromise = [];

    for (var i = 0; i < children.length; i++) {
      allPromise.push(children[i].getElement());
    }

    Promise.all(allPromise).then(el => {
      for (var j = 0; j < el.length; j++) {
        if (el[j].constructor.name === "BIMElement") {
          return callback(true);
        }
      }
      return callback(false);
    })

  }





  getColorIcons(abstractNode, appName, callback) {

    this.isBimObjectParent(abstractNode, appName, (el) => {

      abstractNode.getElement().then(absElement => {
        if (el) {
          if (!absElement.colorParams) {
            absElement.add_attr({
              colorParams: {
                // isVisible: false,
                value: "#000000"
              }
            })
          }
        } else {
          if (absElement.colorParams) {
            absElement.rem_attr("colorParams")
          }
        }
        callback(absElement.colorParams, el);

      })

    })

  }

}

let spinalColorManager = new SpinalColorManager();
module.exports = spinalColorManager;