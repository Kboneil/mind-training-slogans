angular.module('lojongApp') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .controller('calendarCtrl', function($http, $location, moment, alert, calendarConfig, IndexService) {


  var vm = this;
  vm.date = new Date();

  IndexService.getUser().then(function(response) {
    vm.user = response;
  });
  vm.sloganArray = []
  getCalendarInfo ($http, moment, alert, calendarConfig, vm, actions);

  vm.deleteComment = function (id){
    $http.delete('/com/' + id)
      .then(function (response) {
      }).then(function (response) {
        //this isn't refreshing
      getCalendarInfo ($http, moment, alert, calendarConfig, vm);
    });
  }

  vm.deleteQuestion = function (id){
    $http.delete('/ques/' + id)
      .then(function (response) {
      }).then(function (response) {
        //this isn't refreshing
      getCalendarInfo ($http, moment, alert, calendarConfig, vm);
    });
  }

  vm.changeComment = function (comment, id){
    var id = id;
    var data = {comment: comment, id: id}
    $http.put('/com/' + id, data)
     .then(function (response) {
        getCalendarInfo ($http, moment, alert, calendarConfig, vm);
     });
  }

  vm.changeQuestion = function (question, id){
    var id = id;
    var data = {question: question, id: id}
    $http.put('/ques/' + id, data)
     .then(function (response) {
        getCalendarInfo ($http, moment, alert, calendarConfig, vm);
     });
  }

  vm.postComment = function (comment, slogan){
    var date = new Date();
    var data = {comment: comment, date: date, slogan_id: slogan}
    $http.post('/com', data)
     .then(function (response) {
        getCalendarInfo ($http, moment, alert, calendarConfig, vm);
        vm.newComment = '';
     });
  }

  vm.postQuestion = function (question, slogan){
    var date = new Date();
    var data = {question: question, date: date, slogan_id: slogan}
    $http.post('/ques', data)
     .then(function (response) {
        getCalendarInfo ($http, moment, alert, calendarConfig, vm);
        vm.newQuestion = '';
     });
  }



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
      alert.show('Clicked', event);
      vm.id = event.title;
      vm.slogan = event.slogan;
      vm.date = event.startsAt;
      vm.getCom = event.comment;
      vm.getQues = event.question;
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

  function getCalendarInfo($http, moment, alert, calendarConfig, vm, actions) {
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
    $http.get('/date').then(function(response){
      vm.slogans = response.data;


       vm.slogans.forEach(function (slogan) {
         var date = new Date(slogan.date);
         var id = slogan.slogan_id;

         slogan.comments = [];
         slogan.questions = [];

         $http.get('/com/' + id).then(function(response){
           if (!response.data[0]) {
             slogan.comments.push({comment: 'no comments yet'});;
           } else {
             response.data.forEach(function(comment){
               slogan.comments.push({comment: comment.comment, date: comment.date, id: comment.id});
             });
           }
         }, function(error) {
           console.log('error getting slogan comments', error);
         });//endGEt

         $http.get('/ques/' + id).then(function(response){
           if (!response.data[0]) {
             slogan.questions.push({question: 'no questions yet'});
           } else {
             response.data.forEach(function(question){
             slogan.questions.push({question: question.question, date: question.date, id: question.id});
             });
           }
         }, function(error) {
           console.log('error getting slogan comments', error);
         });//endGEt
         vm.sloganArray.push({slogan: slogan.slogan, id: slogan.id, point: slogan.point, extra: slogan.extra, comments: slogan.comments, questions: slogan.questions})

       vm.events.push({
         title: slogan.slogan_id,
         slogan: slogan.slogan,
         startsAt: date,
         color: calendarConfig.colorTypes.important,
         comment: slogan.comments,
         question: slogan.questions,
         draggable: false,
         resizable: false,
         incrementsBadgeTotal: false
         });
       });
     }, function(error) {
       console.log('error getting slogans', error);
     });
  }
