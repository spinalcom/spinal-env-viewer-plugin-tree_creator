var buttonList = require("./allIcons.json");

var ManageSidebarIcons = class ManageSidebarIcons {
  constructor() {
    this.allIcons = buttonList;
  }


  addIconsInSidebar(name, title, icon, typeLst, action) {
    if (!this.allIcons[name]) {
      this.allIcons[name] = {
        name: name,
        title: title,
        icon: icon,
        typeLst: typeLst,
        action: action
      };
    }

  }

  elementExistInLst(element, argLst) {
    for (var i = 0; i < argLst.length; i++) {
      if (argLst[i].toLowerCase() == element.toLowerCase()) return true;
    }
    return false;
  }

  async getIconsByType(nodeElement) {
    var elementIcons = [];
    var element = await nodeElement.getElement();

    for (var icon in this.allIcons) {
      var typeLst = this.allIcons[icon].typeLst;

      if (this.elementExistInLst(element.constructor.name, typeLst)) {
        elementIcons.push(this.allIcons[icon]);
      }
    }

  }



}

let manageSidebarIcons = new ManageSidebarIcons();
module.exports = manageSidebarIcons;