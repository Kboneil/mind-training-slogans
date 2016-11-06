#!/bin/sh
mkdir -p public/vendors;

cp node_modules/angular/angular.min.js public/vendors;
cp node_modules/angular/angular.min.js.map public/vendors;

cp node_modules/bootstrap/dist/css/bootstrap.min.css public/vendors;
cp node_modules/bootstrap/dist/css/bootstrap.min.css.map public/vendors;

cp node_modules/angular-route/angular-route.min.js public/vendors;
cp node_modules/angular-route/angular-route.min.js.map public/vendors;



cp node_modules/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.min.js public/vendors;
cp node_modules/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.min.js.map public/vendors;

cp node_modules/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css public/vendors;
cp node_modules/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css.map public/vendors;

cp node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js public/vendors;

cp node_modules/moment/min/moment.min.js public/vendors;
