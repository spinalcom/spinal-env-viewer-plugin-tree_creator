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
                isVisible: false,
                value: "#000000"
              }
            })
          }
        } else {
          if (absElement.colorParams) {
            absElement.colorParams.rem_attr("value");
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
      } else if (child.constructor.name == "AbstractElement") {
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


  async verifyAbstractElement(abstract, appName) {
    var element = await abstract.getElement();

    this.isBimObjectParent(abstract, appName, (el) => {
      if (!element.colorParams) {
        element.add_attr({
          colorParams: {
            value: el ? "#000000" : null,
            isVisible: false
          }
        })
      }
    })


  }


  async colorBimElementInViewer(contextSelected, nodeElement, bimElements,
    viewer, appName, show) {
    var absElement = await nodeElement.getElement();

    var dbIs = [];

    for (var i = 0; i < bimElements.length; i++) {
      var el = await bimElements[i].getElement();
      dbIs.push(el.id.get());
    }

    await this.verifyParentVisibility(nodeElement, appName);

    if (!show) {
      viewer.restoreColorMaterial(dbIs, absElement.id.get());
    } else {
      viewer.setColorMaterial(dbIs, absElement.colorParams.value.get(),
        absElement.id.get())
    }



  }

  async seeColorNodeElement(contextSelected, argNode, appName, viewer, show) {
    await this.changeIsVisibleAttribut(argNode, show);
    var el = await this.getNodeBimElement(argNode, appName);

    if (el.bimElements.length > 0) {
      await this.colorBimElementInViewer(contextSelected, argNode, el.bimElements,
        viewer, appName, show);
    }

    if (el.abstractElement.length > 0) {
      for (var i = 0; i < el.abstractElement.length; i++) {
        await this.verifyAbstractElement(el.abstractElement[i], appName);
        await this.seeColorNodeElement(contextSelected, el.abstractElement[
            i], appName,
          viewer, show);
      }
    }

  }

  /****** Functions added to change Icon */

  async changeIsVisibleAttribut(argNode, value) {
    var el = await argNode.getElement();
    if (!el.colorParams) {
      el.add_attr({
        colorParams: {
          isVisible: value
        }
      })
    } else if (el.colorParams && !el.colorParams.isVisible) {
      el.colorParams.add_attr({
        isVisible: value
      })
    } else {
      el.colorParams.isVisible.set(value)
    }
  }

  async getNodeParents(argNode) {

    var relations = await argNode.getRelations();
    var parents = [];

    for (var i = 0; i < relations.length; i++) {
      let relation = relations[i];

      parents = parents.concat(argNode.getParentsByRelationType(relation.type
        .get()));

    }

    for (var j = 0; j < parents.length; j++) {
      let parent = await parents[j].getElement();

      if (parent.constructor.name != "AbstractElement") {
        parents.splice(j, 1);
      }

    }

    return parents;

  }

  async verifyParentVisibility(argNode, appName) {

    var parents = await this.getNodeParents(argNode);

    for (var i = 0; i < parents.length; i++) {
      let parent = parents[i];
      var allAreVisible = await this.AllChildrenAreVisible(parent, appName);

      if (allAreVisible) {
        await this.changeIsVisibleAttribut(parent, true);
      } else {
        await this.changeIsVisibleAttribut(parent, false);
      }

      await this.verifyParentVisibility(parent, appName);

    }

  }

  async AllChildrenAreVisible(argNode, appName) {
    var children = await argNode.getChildrenByApp(appName);

    for (var i = 0; i < children.length; i++) {
      let child = await children[i].getElement();

      if (child.constructor.name == "AbstractElement") {
        await this.verifyAbstractElement(child);

        if (child.colorParams && !child.colorParams.isVisible.get()) {
          return false;
        }


      }
    }

    return true;

  }

}

let spinalColorManager = new SpinalColorManager();
module.exports = spinalColorManager;