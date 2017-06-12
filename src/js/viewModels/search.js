/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * search module
 */
define(['knockout',
    'config/services', 'appController',
    'ojs/ojcore',
    'jquery',
    'ojs/ojtable',
    'ojs/ojpagingcontrol',
    'ojs/ojarraytabledatasource',
    'ojs/ojpagingtabledatasource',
    'ojs/ojcollectiontabledatasource',
    'ojs/ojswitch'
], function (ko, service, app, oj) {

    /**
     * The view model for the main content view template
     */
    function searchContentViewModel() {
        var self = this;
        self.invoiceNumber = ko.observable('');
        self.recordsDatasource = ko.observable();

        self.searchDocs = function (data, event) {
//            self.clearRecord();
            if (self.invoiceNumber() !== '') {
                app.showPreloader();
                service.searchDocuments(self.invoiceNumber()).then(searchSuccessFn, failCallBackFn);
            } else {
                app.showPreloader();
                service.searchDocuments().then(searchSuccessFn, failCallBackFn);
            }
        };
        self.downloadDoc = function(id, version) {
            console.log("id : " +id + "  Version : "  + version);
        };
         var failCallBackFn = function (xhr) {
            console.log(xhr);
            app.hidePreloader();
        };
        var searchSuccessFn = function (data, status) {
            if (status !== 'nocontent') {
                console.log(data);
                var array = [];
                var item;
                for (var idx = 0; idx < data.items.length; idx++) {
                    item = data.items[idx];
                    array.push({
                        sNo: idx + 1,
                        type: item.type,
                        typeImage : item.type === 'file' ? 'css/images/file_1.svg' : 'css/images/folder.svg',
                        name: item.name,
                        createdTime: item.createdTime,
                        modifiedTime: item.modifiedTime,
                        id: item.id,
                        parentID: item.parentID,
                        size: item.size,
                        version: item.version,
                        description: item.description});
                }
                self.recordsDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource(array)));
                app.hidePreloader();
            } else {
                console.log('Content not available for the selected step');
                self.recordsDatasource(new oj.PagingTableDataSource(new oj.ArrayTableDataSource([])));
                app.hidePreloader();
            }
        };

    }

    return searchContentViewModel;
});
