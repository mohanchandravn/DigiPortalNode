/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

define(['jquery', 'config/sessionConfig'
], function ($, session) {

    /**
     * The view model for managing service calls
    */
    function ServiceConfig() {
        
        var self = this;
        
        self.contentTypeApplicationJSON = 'application/json';
        self.contentTypeMultipartFormData = 'multipart/form-data';
        self.contentTypeFormUrlEncoded = 'application/x-www-form-urlencoded';
 
        self.callGetService = function (serviceUrl) {
            var defer = $.Deferred();
            $.ajax({
                type: "GET",
                url: serviceUrl,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer " + session.getFromSession(session.accessToken));
                },
                success: function (data) {
                    console.log('Successfully retrieved details at: ' + serviceUrl);
                    defer.resolve(data);
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
            console.log('Payload : '+ payloadStr);
            var defer = $.Deferred();
            $.ajax({
                type: "POST",
                url: serviceUrl,
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJoZXhpLWNsb3VkLWp3dCIsInN1YiI6ImphY2siLCJpYXQiOjE0OTcwMTYwNTksImV4cCI6MTQ5NzAyMzI1OX0.TDS73CFpJNFvP1rUzsEVJ793o5E_Ky4nVDbcxErwVj9Sr3PuTqEWYQJJPrMnWN3dAPZNLIfnFVoYwfJNlIb9bg");
                },
                contentType: contentType,
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
        }
        
    }
    
    return new ServiceConfig();
});
