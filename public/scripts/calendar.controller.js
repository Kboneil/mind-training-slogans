angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('calendarCtrl', function($http, $location, moment, alert, calendarConfig) {


    var vm = this;
    vm.slogans = []
    $http.get('/date').then(function(response){
      vm.slogans = response.data;
      console.log('slogans', vm.slogans);
      // var slogans = []
      vm.slogans.forEach(function (slogan) {
        // var entry = {
        // date: new Date(slogan.date),
        // id: slogan.slogan_id,
        // slogan: slogan.slogan,
        // comment: slogan.comment,
        // question: slogan.question
        // }
        // slogans.push(entry);
        // vm.events.push({
        //   title: 'Slogan: ' + entry.id,
        //   comment: entry.comment,
        //   question: entry.question,
        //   slogan: entry.slogan,
        //   startsAt: entry.date,
        //   endsAt: entry.date,
        //   color: calendarConfig.colorTypes.important,
        //   draggable: false,
        //   resizable: false
        // });

        date = new Date(slogan.date),
        id = slogan.slogan_id,
        slogan = slogan.slogan,
        comment = slogan.comment,
        question = slogan.question
        vm.events.push({
          title: 'Slogan: ' + id,
          comment: comment,
          question: question,
          slogan: slogan,
          startsAt: date,
          endsAt: date,
          color: calendarConfig.colorTypes.important,
          draggable: false,
          resizable: false
        });





      });
    

    }, function(error) {
      console.log('error getting slogans', error);
    });


    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert.show('Deleted', args.calendarEvent);
      }
    }];
    vm.events = [
    ];

    vm.cellIsOpen = true;

    vm.addEvent = function() {
      vm.events.push({
        title: 'New event',
        comment: 'none',
        question: 'none',
        slogan: 'slogan',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color: calendarConfig.colorTypes.important,
        draggable: false,
        resizable: false
      });
    };

    vm.eventClicked = function(event) {
      console.log(event);
      vm.id = event.title;
      vm.slogan = event.slogan
      vm.date = event.startsAt;
      vm.comment = 'Comment: ' + event.comment;
      vm.question = 'Questions: ' + event.question;
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    vm.timespanClicked = function(date, cell) {

      if (vm.calendarView === 'month') {
        if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      } else if (vm.calendarView === 'year') {
        if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
          vm.cellIsOpen = false;
        } else {
          vm.cellIsOpen = true;
          vm.viewDate = date;
        }
      }

    };

  });
