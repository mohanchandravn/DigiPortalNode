/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(['jquery', 'config/sessionConfig'
], function ($, sessionConfig) {

    /**
     * The view model for managing service calls
    */
    function ServiceConfig() {
        
        var self = this;
        
        self.contentTypeApplicationJSON = 'application/json';
        self.contentTypeMultipartFormData = 'multipart/form-data';
        self.contentTypeFormUrlEncoded = 'application/x-www-form-urlencoded';
        self.contentTypeDownloadFile = 'application/*';
 
        self.callGetService = function (serviceUrl) {
            var defer = $.Deferred();
            $.ajax({
                type: "GET",
                url: serviceUrl,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionConfig.getFromSession(sessionConfig.accessToken));
                },
                success: function (data, status) {
                    console.log('Successfully retrieved details at: ' + serviceUrl);
                    defer.resolve(data, status);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error retrieving service details at: " + serviceUrl);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };

        self.callPostService = function (serviceUrl, payload, contentType) {
            var payloadStr = JSON.stringify(payload);
            var cType = contentType;
            var pData = true;
            if (cType === self.contentTypeMultipartFormData) {
                payloadStr = payload;
                cType = false;
                pData = false;
            }
            console.log('Payload : '+ payloadStr);
            var defer = $.Deferred();
            $.ajax({
                type: "POST",
                url: serviceUrl,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + sessionConfig.getFromSession(sessionConfig.accessToken));
                },
                processData: pData,
                contentType: cType,
                data: payloadStr,
                success: function (data) {
                    console.log('Successfully posted data at: ' + serviceUrl);
                    defer.resolve(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error posting data to the service" + serviceUrl);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.authenticatePost = function(serviceUrl, payload, contentType) {
            var defer = $.Deferred();
            $.ajax({
                type: "POST",
                url: serviceUrl,
                dataType: "json",
                beforeSend: function (request) {
                    request.setRequestHeader("Portal-Type", "admin");
                },
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                contentType: contentType,
                data: payload,
                success: function (data, textStatus, xhr) {
                    console.log('Successfully posted data at: ' + serviceUrl);
                    defer.resolve(data, {status: xhr.status});
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log("Error posting data to the service : " + serviceUrl);
                    defer.reject(xhr);
                }
            });
            return $.when(defer);
        };
        
        self.downloadFile = function (serviceUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', serviceUrl);
            xhr.setRequestHeader("Authorization", "Bearer " + sessionConfig.getFromSession(sessionConfig.accessToken));
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status == '200') {
                    var filename = '';
                    //get the filename from the header.
                    var disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches !== null && matches[1])
                            filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = xhr.getResponseHeader('Content-Type');
                    var blob = new Blob([this.response], {type: type});
                    //workaround for IE
                    if (typeof window.navigator.msSaveBlob != 'undefined') {
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var download_URL = URL.createObjectURL(blob);
                        if (filename) {
                            var a_link = document.createElement('a');
                            if (typeof a_link.download == 'undefined') {
                                window.location = download_URL;
                            } else {
                                a_link.href = download_URL;
                                a_link.download = filename;
                                document.body.appendChild(a_link);
                                a_link.click();
                            }
                        } else {
                            window.location = download_URL;
                        }
                        setTimeout(function () {
                            URL.revokeObjectURL(download_URL);
                        }, 10000);
                    }
                } else {
                    alert('Error when downloading the file');
                }
            };
            xhr.setRequestHeader('Content-type', self.contentTypeDownloadFile);
            xhr.send();
        };
        
    }
    
    return new ServiceConfig();
});
