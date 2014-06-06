(function() {
    if (!jasmine) throw new Exception("jasmine library does not exist in global namespace!");
    var TitaniumReporter = function() {
        var titaniumTestWindow = Titanium.UI.createWindow({
            title: "Application Tests",
            backgroundColor: "white",
            zIndex: 999
        });
        var titaniumTestsResultsWebView = Ti.UI.createWebView({
            html: ""
        });
        titaniumTestWindow.add(titaniumTestsResultsWebView);
        titaniumTestWindow.open();
        var testResults = "";
        var testResultsHeader = '<html><head><style type="text/css">body{font-size:10px;font-family:helvetica;}</style></head><body>';
        var testResultsFooter = "</body></html>";
        this.updateTestResults = function(message) {
            testResults += message;
            titaniumTestsResultsWebView.html = testResultsHeader + testResults + testResultsFooter;
        };
    };
    TitaniumReporter.prototype = {
        reportRunnerResults: function() {},
        reportRunnerStarting: function() {
            this.log("<h3>Test Runner Started.</h3>");
        },
        reportSpecResults: function(spec) {
            var color = "#009900";
            var pass = spec.results().passedCount + " pass";
            var fail = null;
            if (!spec.results().passed()) {
                color = "#FF0000";
                fail = spec.results().failedCount + " fail";
            }
            var msg = " (" + pass;
            fail && (msg += ", " + fail);
            msg += ")";
            this.log('• <font color="' + color + '">' + spec.description + "</font>" + msg + "<br>");
            if (!spec.results().passed()) for (var i = 0; spec.results().items_.length > i; i++) if (!spec.results().items_[i].passed_) {
                this.log("&nbsp;&nbsp;&nbsp;&nbsp;(" + (i + 1) + ") <i>" + spec.results().items_[i].message + "</i><br>");
                spec.results().items_[i].expected && this.log('&nbsp;&nbsp;&nbsp;&nbsp;• Expected: "' + spec.results().items_[i].expected + '"<br>');
                this.log('&nbsp;&nbsp;&nbsp;&nbsp;• Actual result: "' + spec.results().items_[i].actual + '"<br>');
                this.log("<br>");
            }
        },
        reportSpecStarting: function() {},
        reportSuiteResults: function(suite) {
            var results = suite.results();
            this.log("<b>[" + suite.description + "] " + results.passedCount + " of " + results.totalCount + " assertions passed.</b><br><br>");
        },
        log: function(str) {
            this.updateTestResults(str);
        }
    };
    jasmine.TitaniumReporter = TitaniumReporter;
})();