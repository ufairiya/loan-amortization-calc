    (function($, finance) {

      var amount = $('#amount');
      var rate = $('#rate');
      var term = $('#term');
      var termtime = $('#termtime');
      var termInYears = true;
      var month = $('#month');
      var year = $('#year');
      var display = $('*[name=display]');
      var table = $('#schedule');
      var summery = $('#summery');
      var tableTemplate, summeryTemplate;

      var getInput = function (value) {
        var num = value.match( /\d|\./g);
        if (num == null) {
          return 0;
        }
        num = num.join("");
        return num;
      }

      var render = function() {
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (termInYears == true) {
          var termVal = getInput(term.val()) * 12;
        } else {
          var termVal = getInput(term.val());
        }
        var data = finance.calculateAmortization(
          getInput(amount.val()),
          termVal,
          getInput(rate.val()),
          new Date(year.val(), month.val(), 1)
        );

        /* Calculate the tallys */
        var monthlyPayment = data.length > 0 ? data[0].payment : 0;
        var totalInterest = data.length > 0 ? data[data.length-1].interest : 0;
        var totalPayments = data.length > 0 ? data[0].payment * data.length: 0;
        var totalPaymentsNum = data.length > 0 ? data.length: 0;
        var totalPrinciple = getInput(amount.val());
        var payoffDate = data.length > 0 ? months[data[data.length-1].date.getMonth()] + ", " + data[data.length-1].date.getFullYear() : '';

        /* Handle display by year functionality */
        if ($('*[name=display]:checked').val() == 'year') {
          var schedule = [];
          /* Ensure Loan term = 0 is handled gracefully */
          var startingDate = data.length > 0 ? data[0].date.getFullYear() : new Date().getFullYear();

          var obj = {date: startingDate, interest: 0, payment: 0, paymentToInterest: 0, paymentToPrinciple: 0, principle: 0};
          for (var i=0; i<data.length; i++) {
            if (obj.date == data[i].date.getFullYear()) {
              obj.interest = data[i].interest;
              obj.payment += data[i].payment;
              obj.paymentToInterest += data[i].paymentToInterest;
              obj.paymentToPrinciple += data[i].paymentToPrinciple;
              obj.principle = data[i].principle;
            } else {
              schedule.push(obj);
              var obj = {
               date: data[i].date.getFullYear(),
               interest: data[i].interest,
               payment: data[i].payment,
               paymentToInterest: data[i].paymentToInterest,
               paymentToPrinciple: data[i].paymentToPrinciple,
               principle: data[i].principle
              };
            }
          }
          /* The last element will never be pushed on the array */
          schedule.push(obj);
          data = schedule;
        } else {
          /* Format the date for month view  */
          for (var i=0; i<data.length; i++) {
            data[i].date = months[data[i].date.getMonth()] + ", " + data[i].date.getFullYear();
          }
        }

        summery.html(summeryTemplate({
          monthlyPayment: monthlyPayment,
          totalPayments: totalPayments,
          totalPaymentsNum: totalPaymentsNum,
          totalInterest: totalInterest,
          payoffDate: payoffDate
        }));

        /* render template and replace table's html with result */
        table.html(tableTemplate({
          items: data,
          totalInterest: totalInterest,
          totalPayments: totalPayments,
          totalPrinciple: totalPrinciple
        }));
      }

      /* Attach handlers */
      $(amount).add(rate).add(term).add(month).add(year).add(display).bind('keyup change', function() {
        render();
      });
      /* When the input looses focus then format the number */
      $(amount).bind('change', function() {
        var num = Number(getInput(amount.val())).toLocaleString('en');
        amount.val(num);
      });

      termtime.find('.dropdown-menu a').bind('click', function(event) {
        termInYears = !termInYears;
        var text = termtime.find('.change').html();
        var text2 = event.target.innerHTML;
        termtime.find('.change').html(text2);
        event.target.innerHTML = text;
        if (text == 'Years ') {
          term.val(term.val() * 12);
        } else {
          term.val(term.val() / 12);
        }
        render();
      });

      $(document).ready(function() {
        /* The variable tempate results will be accessable through this variable */
        _.templateSettings.variable = "rc";
        /*  pre-compile template for performance */
        tableTemplate = _.template( $("#table-template").html() );
        summeryTemplate = _.template( $("#summery-template").html() );

        /* set the start date to the next month */
        var currentDate = new Date(2013, 11, 1);
        if (currentDate.getMonth() < 11) {
          month.val(currentDate.getMonth() + 1);
          year.val(currentDate.getFullYear());
        } else {
          month.val(0);
          year.val(currentDate.getFullYear() + 1);
        }
        /* Render the schedule with default values when document loaded. */
        render();
      });

    }(jQuery, finance));
