function getJasmineRequireObj() {
    if ("undefined" != typeof module && module.exports) return exports;
    window.jasmineRequire = window.jasmineRequire || {};
    return window.jasmineRequire;
}

getJasmineRequireObj().console = function(jRequire, j$) {
    j$.ConsoleReporter = jRequire.ConsoleReporter();
};

getJasmineRequireObj().ConsoleReporter = function() {
    function ConsoleReporter(options) {
        function printNewline() {
            print("\n");
        }
        function colored(color, str) {
            return showColors ? ansi[color] + str + ansi.none : str;
        }
        function plural(str, count) {
            return 1 == count ? str : str + "s";
        }
        function repeat(thing, times) {
            var arr = [];
            for (var i = 0; times > i; i++) arr.push(thing);
            return arr;
        }
        function indent(str, spaces) {
            var lines = (str || "").split("\n");
            var newArr = [];
            for (var i = 0; lines.length > i; i++) newArr.push(repeat(" ", spaces).join("") + lines[i]);
            return newArr.join("\n");
        }
        function specFailureDetails(result) {
            printNewline();
            print(result.fullName);
            for (var i = 0; result.failedExpectations.length > i; i++) {
                var failedExpectation = result.failedExpectations[i];
                printNewline();
                print(indent(failedExpectation.stack, 2));
            }
            printNewline();
        }
        var specCount, failureCount, pendingCount, print = options.print, showColors = options.showColors || false, onComplete = options.onComplete || function() {}, timer = options.timer || noopTimer, failedSpecs = [], ansi = {
            green: "[32m",
            red: "[31m",
            yellow: "[33m",
            none: "[0m"
        };
        this.jasmineStarted = function() {
            specCount = 0;
            failureCount = 0;
            pendingCount = 0;
            print("Started");
            printNewline();
            timer.start();
        };
        this.jasmineDone = function() {
            printNewline();
            for (var i = 0; failedSpecs.length > i; i++) specFailureDetails(failedSpecs[i]);
            printNewline();
            var specCounts = specCount + " " + plural("spec", specCount) + ", " + failureCount + " " + plural("failure", failureCount);
            pendingCount && (specCounts += ", " + pendingCount + " pending " + plural("spec", pendingCount));
            print(specCounts);
            printNewline();
            var seconds = timer.elapsed() / 1e3;
            print("Finished in " + seconds + " " + plural("second", seconds));
            printNewline();
            onComplete(0 === failureCount);
        };
        this.specDone = function(result) {
            specCount++;
            if ("pending" == result.status) {
                pendingCount++;
                print(colored("yellow", "*"));
                return;
            }
            if ("passed" == result.status) {
                print(colored("green", "."));
                return;
            }
            if ("failed" == result.status) {
                failureCount++;
                failedSpecs.push(result);
                print(colored("red", "F"));
            }
        };
        return this;
    }
    var noopTimer = {
        start: function() {},
        elapsed: function() {
            return 0;
        }
    };
    return ConsoleReporter;
};