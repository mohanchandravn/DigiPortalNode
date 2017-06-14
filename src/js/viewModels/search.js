/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * search module
 */
define(['knockout',
    'config/services', 'appController', 'config/sessionConfig',
    'ojs/ojcore',
    'jquery',
    'ojs/ojtable',
    'ojs/ojpagingcontrol',
    'ojs/ojarraytabledatasource',
    'ojs/ojpagingtabledatasource',
    'ojs/ojcollectiontabledatasource',
    'ojs/ojswitch'
], function (ko, service, app, sessionConfig, oj, $) {

    /**
     * The view model for the main content view template
     */
    function searchContentViewModel() {
        var self = this;
        self.invoiceNumber = ko.observable('');
        self.recordsDatasource = ko.observable();
        self.searchDocs = function (data, event) {
            if (self.invoiceNumber() !== '') {
                app.showPreloader();
                service.searchDocuments(self.invoiceNumber()).then(searchSuccessFn, failCallBackFn);
            } else {
                app.showPreloader();
                service.searchDocuments().then(searchSuccessFn, failCallBackFn);
            }
        };
        self.downloadDoc = function (id, version) {
            console.log("id : " + id + "  Version : " + version);
        };
        self.downlooadLinkRenderer = function (context) {
            if (context.row.type === 'file') {
                var link = $(document.createElement('span'));
//            link.attr('data-bind' , 'click: downloadDoc(' + context.row.id + ', ' + context.row.version + ')');
//                link.append('Download');
                link.attr('class', 'docDwldSpan');
                link.attr('docId', context.row.id);
                link.attr('docVersion', context.row.version);
                $(context.cellContext.parentElement).append(link);
            }

        };
        self.fileTypeRender = function (context) {
            var sDiv = $(document.createElement('div'));
            sDiv.attr('style', 'max-height: 25px;max-width: 25px;');
            var imageTag = $(document.createElement('img'));
            imageTag.attr('src', context.row.typeImage);
            sDiv.append(imageTag);
            $(context.cellContext.parentElement).append(sDiv);
        };
        var failCallBackFn = function (xhr) {
            console.log(xhr);
            app.hidePreloader();
        };
        var searchSuccessFn = function (data, status) {
            if (status && status !== 'nocontent') {
                console.log(data);
                var array = [];
                var item;
                for (var idx = 0; idx < data.items.length; idx++) {
                    item = data.items[idx];
                    array.push({
                        sNo: idx + 1,
                        type: item.type,
                        typeImage: item.type === 'file' ? 'css/images/file_1.svg' : 'css/images/folder.svg',
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
        $(document).on('click', '.docDwldSpan', function () {
            var spanElm = $(this);
            var docId = spanElm.attr('docId');
            var docVersion = spanElm.attr('docVersion');
            service.downloadDocument(docId, docVersion);
        });
    }
    return searchContentViewModel;
});
