jasmineRequire.html = function(j$) {
    j$.ResultsNode = jasmineRequire.ResultsNode();
    j$.HtmlReporter = jasmineRequire.HtmlReporter(j$);
    j$.QueryString = jasmineRequire.QueryString();
    j$.HtmlSpecFilter = jasmineRequire.HtmlSpecFilter();
};

jasmineRequire.HtmlReporter = function(j$) {
    function HtmlReporter(options) {
        function find(selector) {
            return getContainer().querySelector(selector);
        }
        function createDom(type, attrs) {
            var el = createElement(type);
            for (var i = 2; arguments.length > i; i++) {
                var child = arguments[i];
                "string" == typeof child ? el.appendChild(createTextNode(child)) : child && el.appendChild(child);
            }
            for (var attr in attrs) "className" == attr ? el[attr] = attrs[attr] : el.setAttribute(attr, attrs[attr]);
            return el;
        }
        function pluralize(singular, count) {
            var word = 1 == count ? singular : singular + "s";
            return "" + count + " " + word;
        }
        function specHref(result) {
            return "?spec=" + encodeURIComponent(result.fullName);
        }
        function setMenuModeTo(mode) {
            htmlReporterMain.setAttribute("class", "html-reporter " + mode);
        }
        var htmlReporterMain, symbols, env = options.env || {}, getContainer = options.getContainer, createElement = options.createElement, createTextNode = options.createTextNode, onRaiseExceptionsClick = options.onRaiseExceptionsClick || function() {}, timer = options.timer || noopTimer, specsExecuted = 0, failureCount = 0, pendingSpecCount = 0;
        this.initialize = function() {
            htmlReporterMain = createDom("div", {
                className: "html-reporter"
            }, createDom("div", {
                className: "banner"
            }, createDom("span", {
                className: "title"
            }, "Jasmine"), createDom("span", {
                className: "version"
            }, j$.version)), createDom("ul", {
                className: "symbol-summary"
            }), createDom("div", {
                className: "alert"
            }), createDom("div", {
                className: "results"
            }, createDom("div", {
                className: "failures"
            })));
            getContainer().appendChild(htmlReporterMain);
            symbols = find(".symbol-summary");
        };
        var totalSpecsDefined;
        this.jasmineStarted = function(options) {
            totalSpecsDefined = options.totalSpecsDefined || 0;
            timer.start();
        };
        var summary = createDom("div", {
            className: "summary"
        });
        var topResults = new j$.ResultsNode({}, "", null), currentParent = topResults;
        this.suiteStarted = function(result) {
            currentParent.addChild(result, "suite");
            currentParent = currentParent.last();
        };
        this.suiteDone = function() {
            if (currentParent == topResults) return;
            currentParent = currentParent.parent;
        };
        this.specStarted = function(result) {
            currentParent.addChild(result, "spec");
        };
        var failures = [];
        this.specDone = function(result) {
            "disabled" != result.status && specsExecuted++;
            symbols.appendChild(createDom("li", {
                className: result.status,
                id: "spec_" + result.id,
                title: result.fullName
            }));
            if ("failed" == result.status) {
                failureCount++;
                var failure = createDom("div", {
                    className: "spec-detail failed"
                }, createDom("div", {
                    className: "description"
                }, createDom("a", {
                    title: result.fullName,
                    href: specHref(result)
                }, result.fullName)), createDom("div", {
                    className: "messages"
                }));
                var messages = failure.childNodes[1];
                for (var i = 0; result.failedExpectations.length > i; i++) {
                    var expectation = result.failedExpectations[i];
                    messages.appendChild(createDom("div", {
                        className: "result-message"
                    }, expectation.message));
                    messages.appendChild(createDom("div", {
                        className: "stack-trace"
                    }, expectation.stack));
                }
                failures.push(failure);
            }
            "pending" == result.status && pendingSpecCount++;
        };
        this.jasmineDone = function() {
            function summaryList(resultsTree, domParent) {
                var specListNode;
                for (var i = 0; resultsTree.children.length > i; i++) {
                    var resultNode = resultsTree.children[i];
                    if ("suite" == resultNode.type) {
                        var suiteListNode = createDom("ul", {
                            className: "suite",
                            id: "suite-" + resultNode.result.id
                        }, createDom("li", {
                            className: "suite-detail"
                        }, createDom("a", {
                            href: specHref(resultNode.result)
                        }, resultNode.result.description)));
                        summaryList(resultNode, suiteListNode);
                        domParent.appendChild(suiteListNode);
                    }
                    if ("spec" == resultNode.type) {
                        if ("specs" != domParent.getAttribute("class")) {
                            specListNode = createDom("ul", {
                                className: "specs"
                            });
                            domParent.appendChild(specListNode);
                        }
                        specListNode.appendChild(createDom("li", {
                            className: resultNode.result.status,
                            id: "spec-" + resultNode.result.id
                        }, createDom("a", {
                            href: specHref(resultNode.result)
                        }, resultNode.result.description)));
                    }
                }
            }
            var banner = find(".banner");
            banner.appendChild(createDom("span", {
                className: "duration"
            }, "finished in " + timer.elapsed() / 1e3 + "s"));
            var alert = find(".alert");
            alert.appendChild(createDom("span", {
                className: "exceptions"
            }, createDom("label", {
                className: "label",
                "for": "raise-exceptions"
            }, "raise exceptions"), createDom("input", {
                className: "raise",
                id: "raise-exceptions",
                type: "checkbox"
            })));
            var checkbox = find("input");
            checkbox.checked = !env.catchingExceptions();
            checkbox.onclick = onRaiseExceptionsClick;
            if (totalSpecsDefined > specsExecuted) {
                var skippedMessage = "Ran " + specsExecuted + " of " + totalSpecsDefined + " specs - run all";
                alert.appendChild(createDom("span", {
                    className: "bar skipped"
                }, createDom("a", {
                    href: "?",
                    title: "Run all specs"
                }, skippedMessage)));
            }
            var statusBarMessage = "" + pluralize("spec", specsExecuted) + ", " + pluralize("failure", failureCount);
            pendingSpecCount && (statusBarMessage += ", " + pluralize("pending spec", pendingSpecCount));
            var statusBarClassName = "bar " + (failureCount > 0 ? "failed" : "passed");
            alert.appendChild(createDom("span", {
                className: statusBarClassName
            }, statusBarMessage));
            var results = find(".results");
            results.appendChild(summary);
            summaryList(topResults, summary);
            if (failures.length) {
                alert.appendChild(createDom("span", {
                    className: "menu bar spec-list"
                }, createDom("span", {}, "Spec List | "), createDom("a", {
                    className: "failures-menu",
                    href: "#"
                }, "Failures")));
                alert.appendChild(createDom("span", {
                    className: "menu bar failure-list"
                }, createDom("a", {
                    className: "spec-list-menu",
                    href: "#"
                }, "Spec List"), createDom("span", {}, " | Failures ")));
                find(".failures-menu").onclick = function() {
                    setMenuModeTo("failure-list");
                };
                find(".spec-list-menu").onclick = function() {
                    setMenuModeTo("spec-list");
                };
                setMenuModeTo("failure-list");
                var failureNode = find(".failures");
                for (var i = 0; failures.length > i; i++) failureNode.appendChild(failures[i]);
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
    return HtmlReporter;
};

jasmineRequire.HtmlSpecFilter = function() {
    function HtmlSpecFilter(options) {
        var filterString = options && options.filterString() && options.filterString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var filterPattern = new RegExp(filterString);
        this.matches = function(specName) {
            return filterPattern.test(specName);
        };
    }
    return HtmlSpecFilter;
};

jasmineRequire.ResultsNode = function() {
    function ResultsNode(result, type, parent) {
        this.result = result;
        this.type = type;
        this.parent = parent;
        this.children = [];
        this.addChild = function(result, type) {
            this.children.push(new ResultsNode(result, type, this));
        };
        this.last = function() {
            return this.children[this.children.length - 1];
        };
    }
    return ResultsNode;
};

jasmineRequire.QueryString = function() {
    function QueryString(options) {
        function toQueryString(paramMap) {
            var qStrPairs = [];
            for (var prop in paramMap) qStrPairs.push(encodeURIComponent(prop) + "=" + encodeURIComponent(paramMap[prop]));
            return "?" + qStrPairs.join("&");
        }
        function queryStringToParamMap() {
            var paramStr = options.getWindowLocation().search.substring(1), params = [], paramMap = {};
            if (paramStr.length > 0) {
                params = paramStr.split("&");
                for (var i = 0; params.length > i; i++) {
                    var p = params[i].split("=");
                    var value = decodeURIComponent(p[1]);
                    ("true" === value || "false" === value) && (value = JSON.parse(value));
                    paramMap[decodeURIComponent(p[0])] = value;
                }
            }
            return paramMap;
        }
        this.setParam = function(key, value) {
            var paramMap = queryStringToParamMap();
            paramMap[key] = value;
            options.getWindowLocation().search = toQueryString(paramMap);
        };
        this.getParam = function(key) {
            return queryStringToParamMap()[key];
        };
        return this;
    }
    return QueryString;
};