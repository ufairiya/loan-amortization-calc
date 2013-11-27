(function($, finance) {

  var amount = $('#amount');
  var rate = $('#rate');
  var term = $('#term');
  var month = $('#month');
  var year = $('#year');
  var display = $('input[name=display]');
  var table = $('#schedule');

  var render = function() {
    return "BAZZAM!!";
  }
  // Attach handers
  $([amount, rate, term, month, year, display]).on('change', function() {
    table.html(render(amount, rate, term, month, year, display));
  });

  // On page load
  $(document).ready(function() {
    table.html(render(amount, rate, term, month, year, display));
  });

}(jQuery, finance));
