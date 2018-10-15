var SpinalColorManager = class SpinalColorManager {

  constructor() {
    this.relationName = "hasColor";
  }


  isBimObjectParent(abstractNode, appName, callback) {

    var children = abstractNode.getChildrenByApp(appName);

    if (children.length == 0)
      return;

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


  async getNodeBimElement(node, appName) {
    var bimElements = [];
    var abstractElement = [];

    var children = node.getChildrenByApp(appName);

    for (var i = 0; i < children.length; i++) {
      var child = await children[i].getElement();
      if (child.constructor.name == "BIMElement") {
        bimElements.push(children[i]);
      } else {
        abstractElement.push(children[i]);
      }
    }

    return {
      bimElements: bimElements,
      abstractElement: abstractElement
    }

  }

  // colorItems2(node, app) {
  //   let res = [];
  //   let element = await node.getElement();
  //   if (element.constructor.name === "BIMElement") {
  //     res = res.concat(element.id.get());
  //   } else if (node.hasChildren()) {
  //     let childrenNodes = node.getChildrenByApp(app);
  //     for (let index = 0; index < childrenNodes.length; index++) {
  //       const childNode = childrenNodes[index];
  //       res = res.concat(await this.getDbids(childNode, app));
  //     }
  //   }
  //   return res;
  // }

  async colorBimElementInViewer(contextSelected, nodeElement, bimElements,
    viewer, show) {
    var absElement = await nodeElement.getElement();
    var dbIs = [];

    for (var i = 0; i < bimElements.length; i++) {
      var el = await bimElements[i].getElement();
      dbIs.push(el.id.get());
    }


    if (!show) {
      viewer.restoreColorMaterial(dbIs, absElement.id.get());
    } else {
      viewer.setColorMaterial(dbIs, absElement.colorParams.value.get(),
        absElement.id.get())
    }


  }

  async seeColorNodeElement(contextSelected, argNode, appName, viewer, show) {
    var el = await this.getNodeBimElement(argNode, appName);

    if (el.bimElements.length > 0) {
      await this.colorBimElementInViewer(contextSelected, argNode, el.bimElements,
        viewer, show);
    }

    if (el.abstractElement.length > 0) {
      for (var i = 0; i < el.abstractElement.length; i++) {
        await this.seeColorNodeElement(contextSelected, el.abstractElement[
            i], appName,
          viewer, show);
      }
    }

  }

}

let spinalColorManager = new SpinalColorManager();
module.exports = spinalColorManager;