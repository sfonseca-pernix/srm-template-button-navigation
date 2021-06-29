function loadImages(data){
  document.getElementById("loadImage").src = `images/${data.src}`;
  document.getElementById("loadImage").alt = `images/${data.alt}`;
}

function addClickedBoxClass(data){
  selectedElement = document.getElementById(data.title);
  selectedElement.classList.add("clicked-box");
}

function actionClickButton(data){
  clickedElement = document.getElementsByClassName('clicked-box')[0];
  clickedElement.classList.remove("clicked-box");
  addClickedBoxClass(data);
}

function loadDataMobile(option){
  buttonText =  document.getElementById("mobile-button-text");
  buttonText.innerHTML = option; 
}

function loadItemText(data){
  document.getElementById("itemText").innerHTML = data.text;
}

function clickableItemModel(index,data){
  this.index = index;
  this.title = data.title;
  this.img = data.img;
  this.text = data.text;
}

function referenceItemModel(index,data){
  this.index = index;
  this.img2 = data.img;
  this.text2 = data.text;
}

function setMobileData(data){
  let elementTitle = document.getElementById("mobile-button-text");
  let elementText = document.getElementById("itemText");
  loadImages(data.img);
  elementTitle.innerHTML = data.title;
  elementText.innerHTML = data.text;
}

function hideAndShowArrow(element,actionAdd,actionRemove){
  element.classList.add(actionAdd);
  element.classList.remove(actionRemove);
}

function getBiggerTittleSize(data){
  let titleLenght = data[0].title.length;
  let result = "";
  for( title of data){
    if (titleLenght <= title.title.length){
      titleLenght = title.title.length;
      result = title.title;
    }
  }
  return result;
}

function createButtonTemporary(data){
  let button =  document.createElement("button");
  button.classList.add("data-cards");
  button.classList.add("d-flex");
  button.classList.add("justify-content-end")
  button.setAttribute("id", "tempButton")
  let p = document.createElement("p");
  p.classList.add("button-text");
  var text = document.createTextNode(getBiggerTittleSize(data));
  p.appendChild(text);
  button.appendChild(p);
  p.style.visibility = "hidden";
  document.body.appendChild(button);

  return p;
}

function getHeightForButton(data){
  let sheet = document.createElement('style');
  p = createButtonTemporary(data);
  let str = ":root{--buttonSize:" + (p.clientHeight-40).toString() + "px;}"; 
  sheet.innerHTML = str;
  document.head.appendChild(sheet);
  let tempButton = document.getElementById('tempButton');
  tempButton.remove();
}

function returnButton(){
  let desktopMode = document.getElementById("desktop-mode");
  let mobileScreen = document.getElementById("mobile-screen");
  let artworkMode = document.getElementById("artwork-reference")
  desktopMode.classList.remove("hide-element");
  mobileScreen.classList.remove("hide-element");
  mobileScreen.classList.add("mobile-screen");
  artworkMode.classList.add("hide-element");
}

function ButtonNavigationTemplate() {

  this.title = ko.observable();
  this.instruction = ko.observable();
  this.artworkInstruction = ko.observable();
  this.text = ko.observable();
  this.clickableItemsLeft = ko.observableArray([]);
  this.clickableItemsRight = ko.observableArray([]);
  this.artworkReferencesItems = ko.observableArray([]);
  this.selectedClickableItem = ko.observable();
  this.indexMobile = 0;
  this.biggerTitle = "";
  this.scorm = pipwerks.SCORM;
  this.scorm.version = "1.2";

  let ref = this;
  let mobileItems = [];
  let rightArrow = document.getElementById("right-arrow");
  let leftArrow = document.getElementById("left-arrow");
  let resetArrow = document.getElementById("reset-arrow");
  let desktopMode = document.getElementById("desktop-mode");
  let mobileScreen = document.getElementById("mobile-screen");
  let artworkMode = document.getElementById("artwork-reference")
  let artworkInstruction = document.getElementById("artwork-instruction")
  let instructions = document.getElementById("instruction")

  this.init = function () {
    this.loadXML("./data/data.xml", this.xmlLoaded.bind(this));
    this.scorm.init();
  }

  this.xmlLoaded = function (xml) {
    let data = this.xml2json(xml).dataset;
    this.title(data.title);
    this.instruction(data.instruction);
    this.artworkInstruction(data.artworkreferences.instruction);
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

    let referencesItems = [];
    let referencesLenght = data.artworkreferences.items.item.length;

    for(var i = 0; i < referencesLenght; i++){
      referencesItems.push(new referenceItemModel(i,data.artworkreferences.items.item[i]));
    }

    mobileItems = leftItems.concat(rightItems);
    this.biggerTitle = getBiggerTittleSize(mobileItems);
    getHeightForButton(mobileItems);
    this.clickableItemsLeft(leftItems);
    this.clickableItemsRight(rightItems);
    setMobileData(data.items.item[0].clickable);
    addClickedBoxClass(data.items.item[0].clickable);
    this.artworkReferencesItems(referencesItems);
  }

  this.selectClickableItemHandler = function($data){
    loadImages($data.img);
    loadItemText($data);
    actionClickButton($data);
    ref.selectedClickableItem($data);
  }

  this.selectClickableRightItemHandlerMobile = function($data){
    if (this.indexMobile < mobileItems.length-1){
      hideAndShowArrow(leftArrow,"show-arrow","hide-arrow");
      this.indexMobile += 1;

      if (this.indexMobile == mobileItems.length-1) {
        hideAndShowArrow(rightArrow,"hide-arrow","show-arrow");
        hideAndShowArrow(resetArrow,"show-arrow","hide-arrow");
      }
      setMobileData(mobileItems[this.indexMobile]);
    }
  }

  this.selectClickableLeftItemHandlerMobile = function($data){
    if (this.indexMobile >= 0){
      hideAndShowArrow(rightArrow,"show-arrow","hide-arrow");
      this.indexMobile -= 1;
      if(this.indexMobile == 0){
        hideAndShowArrow(leftArrow,"hide-arrow","show-arrow");
      }
      setMobileData(mobileItems[this.indexMobile]);
    }
  }

  this.selectClickableLeftItemHandlerMobile = function($data){
    if (this.indexMobile >= 0){
      hideAndShowArrow(rightArrow,"show-arrow","hide-arrow");
      hideAndShowArrow(resetArrow,"hide-arrow","show-arrow");
      this.indexMobile -= 1;
      if(this.indexMobile == 0){
        hideAndShowArrow(leftArrow,"hide-arrow","show-arrow");
      }
      setMobileData(mobileItems[this.indexMobile]);
    }
  }

  this.returnFirstButtonClick = function($data){
    this.indexMobile = 0;
    hideAndShowArrow(resetArrow,"hide-arrow","show-arrow");
    hideAndShowArrow(leftArrow,"hide-arrow","show-arrow");
    hideAndShowArrow(rightArrow,"show-arrow","hide-arrow");
    setMobileData(mobileItems[this.indexMobile]);
  }

  this.activeArtworkReferences = function($data){
    desktopMode.classList.add("hide-element");
    mobileScreen.classList.add("hide-element");
    instructions.classList.add("hide-element");
    artworkInstruction.classList.remove("hide-element");
    mobileScreen.classList.remove("mobile-screen");
    artworkMode.classList.remove("hide-element");
  }

  this.init();
}

ButtonNavigationTemplate.prototype = new Util();
ButtonNavigationTemplate.prototype.constructor = ButtonNavigationTemplate;


$(document).ready(function () {
  var obj = new ButtonNavigationTemplate();
  ko.applyBindings(obj, $("#button_navigation_template")[0]);
  
});