function loadImages(customImageurl){
  console.log("THIS ID",customImageurl)
  document.getElementById("loadImage").src = `images/${customImageurl}.png`;
}

function actionClickButton(elementIdClicked){
  clickedElement = document.getElementsByClassName('clicked-box')[0]
  clickedElement.classList.remove('clicked-box')
  selectedElement = document.getElementById(elementIdClicked);
  selectedElement.classList.add("clicked-box");
}

function loadDataMobile(option){
  buttonText =  document.getElementById("mobile-button-text");
  buttonText.innerHTML = option; 
}

function clickableItemModel(index,data){
  this.index = index;
  this.text = data.title;
  this.img = data.img.src
}

function ButtonNavigationTemplate() {

  this.title = ko.observable();
  this.instruction = ko.observable();
  this.feedback = ko.observable();
  this.clickableItemsLeft = ko.observableArray([]);
  this.clickableItemsRight = ko.observableArray([]);
  this.isSubmitted = ko.observable(false);
  this.isAllCorrect = ko.observable(false);

  this.scorm = pipwerks.SCORM; // shortcut

  this.scorm.version = "1.2";

  var ref = this;

  this.init = function () {
    this.loadXML("./data/data.xml", this.xmlLoaded.bind(this));
    this.scorm.init()
  }

  this.xmlLoaded = function (xml) {
    let data = this.xml2json(xml).dataset;
    this.title(data.title);
    this.instruction(data.instruction);

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
  }

  this.init();
}

ButtonNavigationTemplate.prototype = new Util();
ButtonNavigationTemplate.prototype.constructor = ButtonNavigationTemplate;


$(document).ready(function () {
  var obj = new ButtonNavigationTemplate();
  ko.applyBindings(obj, $("#button_navigation_template")[0])
  loadImages("integumentary");
  loadDataMobile("Integumentary");

  $('.tabButton').click(function(){
    let elementSelected = this.id
    loadImages(elementSelected)
    actionClickButton(elementSelected)
  });

  $('.click-arrow-right').click(function(){
    let elementSelected = this.id
    loadImages(elementSelected)
    actionClickButton(elementSelected)
  });

});
