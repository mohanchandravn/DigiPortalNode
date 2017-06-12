/**
 * Copyright © 2016, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * Singleton with all common helper methods
 */
define(['moment'
], function (moment) {

    function CommonHelper() {

        var self = this;
        
        /**
         * Format date for display.
         * @param  {string} dateStr date in string format
         * @return {string}
         */
        self.formatDateStr = function (dateStr, format) {
            if (dateStr) {
                return moment(new Date(dateStr)).format(format);
            } 
            return 'N/A';
        };

        self.isEmpty = function (value) {
            return (value && value !== "" && typeof value !== 'undefined') ? false : true;
        };
        
        self.isNullOrEmpty = function(value) {
            return value === null || value === '';
        };
        
        self.emptyIfNull = function(value) {
            return value === null ? '' : value;
        };
    }

    return new CommonHelper();
});
