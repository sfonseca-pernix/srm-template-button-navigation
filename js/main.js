function loadImages(customImageurl){
  var customImageurl = `images/${customImageurl}.png`;
  document.getElementById("loadImage").src = customImageurl;
}

function actionClickButton(elementIdClicked){
  clickedElement = document.getElementsByClassName('clicked-box')[0]
  clickedElement.classList.remove('clicked-box')
  selectedElement = document.getElementById(elementIdClicked);
  selectedElement.classList.add("clicked-box");
}

function ButtonNavigationTemplate() {

  this.title = ko.observable();
  this.instruction = ko.observable();
  this.feedback = ko.observable();

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
    var data = this.xml2json(xml).dataset;
    this.title(data.title);
    this.instruction(data.instruction);
  }

  this.init();
}

ButtonNavigationTemplate.prototype = new Util();
ButtonNavigationTemplate.prototype.constructor = ButtonNavigationTemplate;


$(document).ready(function () {
  var obj = new ButtonNavigationTemplate();
  ko.applyBindings(obj, $("#button_navigation_template")[0])
  loadImages("integumentary");

  $('.tabButton').click(function(){
    let elementSelected = this.id
    loadImages(elementSelected)
    actionClickButton(elementSelected)
  });
});