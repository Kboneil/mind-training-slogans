angular
  .module('lojongApp')
  .controller('ClickableEventsCtrl', function($http, $location, moment, alert, calendarConfig) {

    var vm = this;

    vm.events = [
      {
        title: 'Click me',
        color: calendarConfig.colorTypes.warning,
        startsAt: moment().startOf('month').toDate()
      },
      {
        title: 'Or click me',
        color: calendarConfig.colorTypes.info,
        startsAt: moment().startOf('month').toDate()
      }
    ];

    vm.calendarView = 'month';
    vm.viewDate = moment().startOf('month').toDate();
    vm.cellIsOpen = true;

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

  });
