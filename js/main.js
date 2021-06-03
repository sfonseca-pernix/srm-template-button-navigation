function ClickableItemModel(index, data) {
  this.index = index;
  this.text = data.text;
  this.isMoved = ko.observable(false);
}

function MatchingItemModel(index, data) {
  this.index = index;
  this.text = data.text;
  this.clickableItem = ko.observable();

  this.isShowingUnmatch = ko.observable(false);

  this.isFilled = ko.computed(function () {
    return this.clickableItem();
  }, this);

  this.isCorrect = ko.observable();
}

function ButtonNavigationTemplate() {
  // this.container = null;	

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
    console.log("xml loaded");
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

});