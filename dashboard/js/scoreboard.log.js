scoreboard.log = function () {
    
    var _self = {},
        _logContainer,	
        _dateSpacing = new Date('31/12/2018 23:59').toLocaleString().length,
        _defaultPattern = '{time} | {message} <br />';

    _self.init = function (logContainer) {
        _logContainer = $(logContainer);
        _logContainer.empty();
    };


    _self.write = function (message, params) {
        var logEnrty = _defaultPattern
            .replace('{time}', _getTimestamp())
            .replace('{message}', message);

        if (params) {
            for (var key in params) {
                logEnrty = logEnrty.replace(
                    '{' + key + '}', 
                    _decorate(params[key])
                );
            }
        }

        _logContainer.prepend(logEnrty);
    };

    function _getTimestamp() {
        var stamp = new Date().toLocaleString();

        var extraSpacing = _dateSpacing - stamp;
        for (var i = 0; i < extraSpacing; i++) {
            stamp = ' ' + stamp;
        }
        return stamp;
    }

    function _decorate(text) {
        return '<span>' + text + '</span>';
    }

    return _self;
}();