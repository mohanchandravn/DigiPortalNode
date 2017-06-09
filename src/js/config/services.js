/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['knockout', 'config/serviceConfig' 
], function (ko, serviceConfig) {

    /**
     * The view model for managing all services
     */
    function services() {

        var self = this;
        
        // Context root for dev
        var ctx = '/hexiCloudRestSecuredDev';
        if (location.origin.indexOf('localhost') > 0) {
            if (location.protocol === 'http:') {
                self.portalRestHost = ko.observable("http://129.152.128.105:8080".concat(ctx));
            } else {
                self.portalRestHost = ko.observable("https://129.152.128.105".concat(ctx));
            }
        } else {
            // For context root to be relative on PROD
            self.portalRestHost = ko.observable(location.origin.concat(ctx));
        }

        self.uploadDocument = function (document, invoiceNumber) {
            var serviceURL = self.portalRestHost() + "/docs/upload/uploadFile?invoiceNumber=" + invoiceNumber;
            return serviceConfig.callPostService(serviceURL, document, serviceConfig.contentTypeMultipartFormData);
        };

        self.searchDocuments = function (invoiceNumber) {
            var serviceURL = self.portalRestHost() + "/docs/search/searchFiles?invoiceNumber=" + invoiceNumber;
            return serviceConfig.callGetService(serviceURL);
        };

        self.downloadDocument = function (fileId) {
            var serviceURL = self.portalRestHost() + "/docs/download/downloadDocument?fileId=" + fileId;
            return serviceConfig.callGetService(serviceURL);
        };
        
    };

    return new services();
});
