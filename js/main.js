function loadImages(data){
  document.getElementById("loadImage").src = `images/${data.src}`;
  document.getElementById("loadImage").alt = `images/${data.alt}`;
}

function addClickedBoxClass(data){
  selectedElement = document.getElementById(data.title);
  selectedElement.classList.add("clicked-box");
}

function actionClickButton(data){
  clickedElement = document.getElementsByClassName('clicked-box')[0]
  clickedElement.classList.remove("clicked-box")
  addClickedBoxClass(data)
}

function loadDataMobile(option){
  buttonText =  document.getElementById("mobile-button-text");
  buttonText.innerHTML = option; 
}

function loadItemText(data){
  document.getElementById("itemText").innerHTML = data.text
}

function clickableItemModel(index,data){
  this.index = index;
  this.title = data.title;
  this.img = data.img;
  this.text = data.text;
}

function setMobileData(data){
  let elementTitle = document.getElementById("mobile-button-text");
  let elementText = document.getElementById("itemText");
  loadImages(data.img)
  elementTitle.innerHTML = data.title;
  elementText.innerHTML = data.text;
}

function hideAndShowArrow(element,actionAdd,actionRemove){
  element.classList.add(actionAdd);
  element.classList.remove(actionRemove);
}

function ButtonNavigationTemplate() {

  this.title = ko.observable();
  this.instruction = ko.observable();
  this.text = ko.observable();
  this.clickableItemsLeft = ko.observableArray([]);
  this.clickableItemsRight = ko.observableArray([]);
  this.selectedClickableItem = ko.observable();
  this.indexMobile = 0;
  this.scorm = pipwerks.SCORM; // shortcut

  this.scorm.version = "1.2";

  let ref = this;
  let mobileItems = [];
  let rightArrow = document.getElementById("right-arrow");
  let leftArrow = document.getElementById("left-arrow");

  this.init = function () {
    this.loadXML("./data/data.xml", this.xmlLoaded.bind(this));
    this.scorm.init()
  }

  this.xmlLoaded = function (xml) {
    let data = this.xml2json(xml).dataset;
    this.title(data.title);
    this.instruction(data.instruction);
    loadImages(data.items.item[0].clickable.img);
    loadItemText(data.items.item[0].clickable);

    let leftItems = [];
    let rightItems = [];
    let lengthItem = data.items.item.length;
    for(var i = 0; i < lengthItem; i++){
      if(i <= (lengthItem/2)-1){
        leftItems.push(new clickableItemModel(i,data.items.item[i].clickable));
      }else{
        rightItems.push(new clickableItemModel(i,data.items.item[i].clickable));
      }

    }

    this.clickableItemsLeft(leftItems);
    this.clickableItemsRight(rightItems);
    mobileItems = leftItems.concat(rightItems);
    setMobileData(data.items.item[0].clickable);
    addClickedBoxClass(data.items.item[0].clickable);
  }

  this.selectClickableItemHandler = function($data){
    loadImages($data.img);
    loadItemText($data);
    actionClickButton($data)
    ref.selectedClickableItem($data);
  }

  this.selectClickableRightItemHandlerMobile = function($data){
    if (this.indexMobile < mobileItems.length-1){
      hideAndShowArrow(leftArrow,"show-arrow","hide-arrow")
      this.indexMobile += 1;

      if (this.indexMobile == mobileItems.length-1) {
        hideAndShowArrow(rightArrow,"hide-arrow","show-arrow")
      }
      setMobileData(mobileItems[this.indexMobile]);
    }
  }

  this.selectClickableLeftItemHandlerMobile = function($data){
    if (this.indexMobile >= 0){
      hideAndShowArrow(rightArrow,"show-arrow","hide-arrow")
      this.indexMobile -= 1;
      if(this.indexMobile == 0){
        hideAndShowArrow(leftArrow,"hide-arrow","show-arrow")
      }
      setMobileData(mobileItems[this.indexMobile]);
    }
  } 

  this.init();
}

ButtonNavigationTemplate.prototype = new Util();
ButtonNavigationTemplate.prototype.constructor = ButtonNavigationTemplate;


$(document).ready(function () {
  var obj = new ButtonNavigationTemplate();
  ko.applyBindings(obj, $("#button_navigation_template")[0])
});