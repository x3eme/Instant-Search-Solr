/**
 * Attaches the instant behavior to all required fields
 */
Drupal.behaviors.instant = function (context) {
  var acdb = [];
  $('input.apachesolr-instant:not(.apachesolr-instant-processed)', context).each(function () {
    var uri = Drupal.settings.basePath + 'apachesolr_instant';
    if (!acdb[uri]) {
      acdb[uri] = new Drupal.ACDB(uri);
    }
    $(this).attr('autocomplete', 'OFF')[0];
    new Drupal.instant(this, acdb[uri]);
    $(this).addClass('apachesolr-instant-processed');
  });
};

Drupal.instant = function(input, db) {
  var ac = this;
  this.input = input;
  this.db = db;

  $(this.input)
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.db.cancel(); });
};

/**
 * Handler for the "keyup" event
 */
Drupal.instant.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // shift
    case 17: // ctrl
    case 18: // alt
    case 20: // caps lock
    case 33: // page up
    case 34: // page down
    case 35: // end
    case 36: // home
    case 37: // left arrow
    case 38: // up arrow
    case 39: // right arrow
    case 40: // down arrow
    case 9:  // tab
    case 13: // enter
    case 27: // esc
      return true;

    default: // all other keys
      if (input.value.length > 0) {
        // Do search
        this.db.owner = this;
        this.db.search(this.input.value);
      }
      return true;
  }
};

Drupal.instant.prototype.setStatus = function (status) {};

Drupal.instant.prototype.found = function (matches) {
  if (matches['has_results']) {
    $('div.spelling-suggestions').remove();
    $('form#search-form').siblings('.box').remove();
    $('form#search-form').parent().append(matches['results']);
  }
};
