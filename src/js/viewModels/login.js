/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['ojs/ojcore', 'knockout', 'config/sessionConfig', 'config/services', 'appController', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojknockout', 'ojs/ojknockout-validation'
], function (oj, ko, session, services, app) {

    /**
     * The view model for the main content view template
     */
    function loginContentViewModel(params) {

        var self = this;

        var router = params.ojRouter.parentRouter;

        self.userName = ko.observable('');
        self.password = ko.observable('');
        self.tracker = ko.observable();
        self.loginFailureText = ko.observable();
        
        self.isLoggedinTrue = function () {
            router.go('search/');
        };
        
        self._showComponentValidationErrors = function (trackerObj) {
            trackerObj.showMessages();
            if (trackerObj.focusOnFirstInvalid())
                return false;

            return true;
        };

        self.onUserLogin = function () {
            var trackerObj = ko.utils.unwrapObservable(self.tracker);

            // Step 1
            if (!this._showComponentValidationErrors(trackerObj)) {
                return;
            }
            
            app.showPreloader();
            
            var payload = {
                "username": self.userName(),
                "password": self.password()
            };

            var successCallBackFn = function (data, xhrStatus) {
                console.log("what's the status:" + xhrStatus);
                if (xhrStatus.status === 200)
                {
                    self.loginFailureText("");
                    session.setToSession(session.accessToken, data.access_token);
                    session.setToSession(session.expiresIn, data.expires_in);
                    session.setToSession(session.isLoggedInUser, true);
                    session.setToSession(session.loggedInUser, data.userId);
                    session.setToSession(session.portalRole, data.portalRole);
                    self.isLoggedinTrue();
                    app.isLoggedInUser(session.getFromSession(session.isLoggedInUser));
                    app.userLogin(session.getFromSession(session.loggedInUser));
                }
                app.hidePreloader();
            };
  
            var failCallBackFn = function (xhr) {
                console.log("what's the status:" + xhr.status);
                self.loginFailureText("Invalid Username or Password");
                app.hidePreloader();
            };

            services.login(payload).then(successCallBackFn, failCallBackFn);
        };

    }

    return loginContentViewModel;
});
