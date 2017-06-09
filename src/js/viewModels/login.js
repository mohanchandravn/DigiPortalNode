/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * login module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojinputtext', 'ojs/ojbutton'
], function (oj, ko) {
    
    /**
     * The view model for the main content view template
     */
    function loginContentViewModel(params) {
        
        var self = this;
        
        var router = params.ojRouter.parentRouter;
        
        self.userName = ko.observable('');
        self.password = ko.observable('');
        
        self.onUserLogin = function() {
            console.log('User Name: ' + self.userName());
            console.log('Password: ' + self.password());
            
            // TODO - auth service call
            
            router.go('dashboard');
        };
        
    }
    
    return loginContentViewModel;
});
