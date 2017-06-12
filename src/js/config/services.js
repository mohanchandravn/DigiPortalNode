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
        
        var ctx = '';
        if (location.origin.indexOf('localhost') > 0) {
            if (location.protocol === 'http:') {
                self.portalRestHost = ko.observable("http://localhost:8080".concat(ctx));
            } 
        } else {
            self.portalRestHost = ko.observable("https://docsportalservices-inoracless38727.apaas.us2.oraclecloud.com".concat(ctx));
        }
        
        self.login = function(payload) {
            var serviceURL = self.portalRestHost() + "/login";
            return serviceConfig.authenticatePost(serviceURL, payload, serviceConfig.contentTypeFormUrlEncoded);
        };
        
        self.uploadDocument = function (document, invoiceNumber, invoiceDate) {
            var serviceURL = self.portalRestHost() + "/docs/upload/uploadFile?invoiceNumber=" + invoiceNumber + "&invoiceDate=" + invoiceDate;
            return serviceConfig.callPostService(serviceURL, document, serviceConfig.contentTypeMultipartFormData);
        };

        self.searchDocuments = function (invoiceNumber) {
            var serviceURL = self.portalRestHost() + "/docs/search/searchFiles?invoiceNumber=";
            if (invoiceNumber) {
              serviceURL = serviceURL + invoiceNumber;  
            }
            return serviceConfig.callGetService(serviceURL);
        };

        self.downloadDocument = function (fileId) {
            var serviceURL = self.portalRestHost() + "/docs/download/downloadDocument?fileId=" + fileId;
            return serviceConfig.callGetService(serviceURL);
        };
        
    };

    return new services();
});
