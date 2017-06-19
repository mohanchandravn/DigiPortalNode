/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * upload module
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'config/services', 'appController', 'config/utils/commonhelper', 'ojs/ojselectcombobox', 'ojs/ojinputtext', 'ojs/ojdatetimepicker', 'ojs/ojbutton'
], function (oj, $, ko, services, app, commonHelper) {

    /**
     * The view model for the main content view template
     */
    function uploadContentViewModel() {

        var self = this;

        self.customers = ko.observableArray([
            {value: '1', label: 'Bugatti'},
            {value: '2', label: 'Audi'},
            {value: '3', label: 'Mercedes'},
            {value: '4', label: 'Cadillac'},
            {value: '5', label: 'Porsche'}
        ]);
        self.customer = ko.observable('');
        self.invoiceNumber = ko.observable('');
        self.invoiceDate = ko.observable('');
        self.selectedFile = ko.observable();
        self.isUploadSuccess = ko.observable(false);
        self.uploadStatusDesc = ko.observable('');

        self.onSelectFile = function (data, event) {
            self.selectedFile(event.target.files[0]);
        };

        self.onUploadDocument = function (data, event) {
            app.showPreloader();

            var uploadDocumentSuccessCbFn = function (data, status) {
                self.isUploadSuccess(true);
                self.uploadStatusDesc('Document uploaded successfully!');
                self.clearForm();
                app.hidePreloader();
            };

            var uploadDocumentFailCbFn = function (xhr) {
                self.isUploadSuccess(false);
                self.uploadStatusDesc('Failed to upload document!');
                console.log(xhr);
                app.hidePreloader();
            };

            var formData = new FormData();
            formData.append('primaryFile', self.selectedFile());
            var invoiceDate = commonHelper.formatDateStr(self.invoiceDate(), 'MM/DD/YYYY');
            services.uploadDocument(formData, self.customer(), self.invoiceNumber(), invoiceDate).then(uploadDocumentSuccessCbFn, uploadDocumentFailCbFn);
        };

        self.clearForm = function () {
            self.customer('');
            self.invoiceNumber('');
            self.invoiceDate('');
            self.selectedFile();
        }

    }

    return uploadContentViewModel;
});
