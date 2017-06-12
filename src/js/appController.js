/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'config/sessionConfig', 'config/serviceConfig', 'config/services', 'config/utils/commonhelper', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
        function (oj, ko, session) {

            function ControllerViewModel() {

                var self = this;

                // Media queries for repsonsive layouts
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);


                // Router setup
                self.router = oj.Router.rootInstance;
                self.router.configure({
                    'login': {label: 'Login', isDefault: true},
                    'dashboard': {label: 'Dashboard'},
                    'search': {label: 'Search'},
                    'upload': {label: 'Upload'}
                });
                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                // Navigation setup
                var navData = [
                    {name: 'Search', id: 'search', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
                    {name: 'Upload', id: 'upload', iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'}
                ];
                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

                // Header
                // Application Name used in Branding Area
                self.appName = ko.observable("DigiPortal");
                // User Info used in Global Navigation area
                self.userLogin = ko.observable(session.getFromSession(session.loggedInUser));

                self.isLoggedInUser = ko.observable(session.getFromSession(session.isLoggedInUser));

                self.loggedInUserRole = ko.observable();
                self.getStateId = function () {
                    return self.router.currentState().id;
                };


                self.showPreloader = function () {
                    $("#preloader").removeClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "none");
                    $("#routingContainer").css("opacity", "0.5");
                };

                self.hidePreloader = function () {
                    $("#preloader").addClass("oj-sm-hide");
                    $("#routingContainer").css("pointer-events", "");
                    $("#routingContainer").css("opacity", "");
                };
                
                self.logout = function () {
                    session.removeAllFromSession();
                    self.router.go('login/');
                    window.location.reload();
                }

                //restricting direct access without login
                if (self.router) {
                    if (self.router.stateId() !== 'login') {
                        if (!session.getFromSession('accessToken')) {
                            self.router.go('login/');
                        }
                    } else if (session.getFromSession('accessToken')) {
                        self.router.go('app.router.stateId()');
                    }
                }
                // Footer
                function footerLink(name, id, linkTarget) {
                    this.name = name;
                    this.linkId = id;
                    this.linkTarget = linkTarget;
                }

                self.footerLinks = ko.observableArray([
                    new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
                    new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
                    new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
                    new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
                    new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
                ]);


            }

            return new ControllerViewModel();

        });
