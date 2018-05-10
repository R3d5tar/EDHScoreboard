scoreboard.log = function () {
    var _self = {};
    _self._dateSpacing = new Date("31/12/2018 23:59").toLocaleString().length;
    _self._logContainer;
    _self._defaultPattern = "{time} | {message} <br />";
    var test = 'test';

    _self.init = function (logContainer) {
        this._logContainer = $(logContainer);
        this._logContainer.empty();
    }


    _self.write = function (message, params = null) {
        var logEnrty = this._defaultPattern
            .replace("{time}", this.getTimestamp())
            .replace("{message}", message);

        if (params) {
            for (var key in params) {
                logEnrty = logEnrty.replace(
                    '{' + key + '}', 
                    _self.decorate(params[key])
                );
            }
        }

        this._logContainer.prepend(logEnrty);
    };

    _self.getTimestamp = function () {
        var stamp = new Date().toLocaleString();

        var extraSpacing = this._dateSpacing - stamp;
        for (var i = 0; i < extraSpacing; i++) {
            now = " " + stamp;
        }
        return stamp;
    };

    _self.decorate = function (text) {
        return "<span>" + text + "</span>";
    };

    return _self;
}();