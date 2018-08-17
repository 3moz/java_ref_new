/*!
 * Licensed Materials - Property of IBM
 * � Copyright IBM Corp. 2017
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 *
 * @version 5.4.0.1805
 * @flags w3c,NDEBUG
 */
if (window.TLT) {
    throw "Attempting to recreate TLT. Library may be included more than once on the page."
}
window.TLT = (function() {
    function r(F, x, y, G) {
        var D = null,
            H = null,
            C = TLT.getService("queue"),
            A = TLT.getModule("replay"),
            E = TLT.getModule("TLCookie"),
            z = null,
            B = TLT.utils.getOriginAndPath();
        if (!x || typeof x !== "string") {
            return
        }
        if (!y || typeof y !== "string") {
            y = ""
        }
        H = {
            type: 2,
            screenview: {
                type: F,
                name: x,
                url: B.path,
                host: B.origin,
                referrer: y
            }
        };
        if (F === "LOAD") {
            z = {
                type: "screenview_load",
                name: x
            }
        } else {
            if (F === "UNLOAD") {
                z = {
                    type: "screenview_unload",
                    name: x
                }
            }
        }
        if (z && A) {
            D = A.onevent(z)
        }
        if (D) {
            H.dcid = D
        }
        if (F === "LOAD" || F === "UNLOAD") {
            C.post("", H, "DEFAULT")
        }
        if (z && E) {
            E.onevent(z)
        }
    }

    function s(y) {
        var z, x = TLT.getService("queue");
        if (!y || !y.coords) {
            return
        }
        z = {
            type: 13,
            geolocation: {
                lat: y.coords.latitude,
                "long": y.coords.longitude,
                accuracy: Math.ceil(y.coords.accuracy)
            }
        };
        x.post("", z, "DEFAULT")
    }

    function m() {
        var y, x = TLT.getService("queue");
        y = {
            type: 13,
            geolocation: {
                errorCode: 201,
                error: "Permission denied."
            }
        };
        x.post("", y, "DEFAULT")
    }
    var v = (new Date()).getTime(),
        q, w = {},
        b = {},
        e = false,
        g = null,
        o = (function() {
            var y, A = [];

            function z(F) {
                var E = u.getService("browser"),
                    B = u.getCoreConfig().framesBlacklist,
                    D, C;
                y = y || [];
                F = F || null;
                if (typeof B !== "undefined" && B.length > 0) {
                    for (C = 0; C < B.length; C += 1) {
                        D = E.queryAll(B[C], F);
                        if (D && D.length > 0) {
                            y = y.concat(D)
                        }
                    }
                    A = A.concat(E.queryAll("iframe", F))
                }
            }

            function x(B) {
                if (u.utils.indexOf(A, B) < 0) {
                    z(B.ownerDocument)
                }
                return u.utils.indexOf(y, B) > -1
            }
            x.clearCache = function() {
                y = null
            };
            return x
        }()),
        p = null,
        h = {
            config: ["getConfig", "updateConfig", "getCoreConfig", "updateCoreConfig", "getModuleConfig", "updateModuleConfig", "getServiceConfig", "updateServiceConfig"],
            queue: ["post", "setAutoFlush", "flushAll"],
            browserBase: ["getXPathFromNode", "processDOMEvent"]
        },
        t = (function() {
            var x = {};
            return {
                normalizeModuleEvents: function(C, A, F, z) {
                    var y = x[C],
                        E = false,
                        B = false,
                        D = u.getService("browser");
                    F = F || u._getLocalTop();
                    z = z || F.document;
                    if (y) {
                        return
                    }
                    x[C] = {
                        loadFired: false,
                        pageHideFired: false
                    };
                    u.utils.forEach(A, function(G) {
                        switch (G.name) {
                            case "load":
                                E = true;
                                A.push(u.utils.mixin(u.utils.mixin({}, G), {
                                    name: "pageshow"
                                }));
                                break;
                            case "unload":
                                B = true;
                                A.push(u.utils.mixin(u.utils.mixin({}, G), {
                                    name: "pagehide"
                                }));
                                A.push(u.utils.mixin(u.utils.mixin({}, G), {
                                    name: "beforeunload"
                                }));
                                break;
                            case "change":
                                if (u.utils.isLegacyIE && u.getFlavor() === "w3c") {
                                    A.push(u.utils.mixin(u.utils.mixin({}, G), {
                                        name: "propertychange"
                                    }))
                                }
                                break
                        }
                    });
                    if (!E && !B) {
                        delete x[C];
                        return
                    }
                    x[C].silentLoad = !E;
                    x[C].silentUnload = !B;
                    if (!E) {
                        A.push({
                            name: "load",
                            target: F
                        })
                    }
                    if (!B) {
                        A.push({
                            name: "unload",
                            target: F
                        })
                    }
                },
                canPublish: function(y, A) {
                    var z;
                    if (x.hasOwnProperty(y) === false) {
                        return true
                    }
                    z = x[y];
                    switch (A.type) {
                        case "load":
                            z.pageHideFired = false;
                            z.loadFired = true;
                            return !z.silentLoad;
                        case "pageshow":
                            z.pageHideFired = false;
                            A.type = "load";
                            return !z.loadFired && !z.silentLoad;
                        case "pagehide":
                            A.type = "unload";
                            z.loadFired = false;
                            z.pageHideFired = true;
                            return !z.silentUnload;
                        case "unload":
                        case "beforeunload":
                            A.type = "unload";
                            z.loadFired = false;
                            return !z.pageHideFired && !z.silentUnload
                    }
                    return true
                },
                isUnload: function(y) {
                    return typeof y === "object" ? (y.type === "unload" || y.type === "beforeunload" || y.type === "pagehide") : false
                }
            }
        }()),
        c = {},
        a = {},
        j = function() {},
        l = null,
        k = true,
        d = function() {},
        i = false,
        n = (function() {
            var x = window.location,
                z = x.pathname,
                y = x.hash,
                A = "";
            return function() {
                var D = x.pathname,
                    B = x.hash,
                    C = A;
                if (D !== z) {
                    C = D + B
                } else {
                    if (B !== y) {
                        C = B
                    }
                }
                if (C !== A) {
                    if (A) {
                        r("UNLOAD", A)
                    }
                    r("LOAD", C);
                    A = C;
                    z = D;
                    y = B
                }
            }
        }()),
        f = function(A, H) {
            var B, z, C, G = false,
                x = u.getService("browser"),
                y = u.getCoreConfig().blockedElements,
                E, F, D;
            if (!y || !y.length) {
                f = function() {
                    return false
                };
                return G
            }
            if (!A || !A.nodeType) {
                return G
            }
            H = H || u.utils.getDocument(A);
            for (B = 0, C = y.length; B < C && !G; B += 1) {
                F = x.queryAll(y[B], H);
                for (z = 0, D = F.length; z < D && !G; z += 1) {
                    E = F[z];
                    G = E.contains ? E.contains(A) : E === A
                }
            }
            return G
        },
        u = {
            getStartTime: function() {
                return v
            },
            getPageId: function() {
                return q || "#"
            },
            getLibraryVersion: function() {
                return "5.4.0.1805"
            },
            init: function(y, z) {
                var x;
                l = z;
                if (!k) {
                    throw "init must only be called once!"
                }
                q = "P." + this.utils.getRandomString(28);
                k = false;
                x = function(A) {
                    A = A || window.event || {};
                    if (document.addEventListener || A.type === "load" || document.readyState === "complete") {
                        if (document.removeEventListener) {
                            document.removeEventListener("DOMContentLoaded", x, false);
                            window.removeEventListener("load", x, false)
                        } else {
                            document.detachEvent("onreadystatechange", x);
                            window.detachEvent("onload", x)
                        }
                        j(y, z)
                    }
                };
                if (document.readyState === "complete") {
                    setTimeout(x)
                } else {
                    if (document.addEventListener) {
                        document.addEventListener("DOMContentLoaded", x, false);
                        window.addEventListener("load", x, false)
                    } else {
                        document.attachEvent("onreadystatechange", x);
                        window.attachEvent("onload", x)
                    }
                }
            },
            isInitialized: function() {
                return e
            },
            getState: function() {
                return g
            },
            destroy: function(y) {
                var x = "",
                    A = "",
                    D = null,
                    E = null,
                    B = null,
                    z = null,
                    F = false;
                if (k) {
                    return false
                }
                this.stopAll();
                if (!y) {
                    z = this.getService("browser");
                    for (x in c) {
                        if (c.hasOwnProperty(x) && z !== null) {
                            A = x.split("|")[0];
                            D = c[x].target;
                            F = c[x].delegateTarget || undefined;
                            z.unsubscribe(A, D, this._publishEvent, F)
                        }
                    }
                }
                for (E in b) {
                    if (b.hasOwnProperty(E)) {
                        B = b[E].instance;
                        if (B && typeof B.destroy === "function") {
                            B.destroy()
                        }
                        b[E].instance = null
                    }
                }
                o.clearCache();
                c = {};
                e = false;
                k = true;
                g = "destroyed";
                if (typeof l === "function") {
                    try {
                        l("destroyed")
                    } catch (C) {}
                }
            },
            _updateModules: function(B) {
                var A = this.getCoreConfig(),
                    z = this.getService("browser"),
                    D = null,
                    y = null,
                    x = true;
                if (A && z && A.modules) {
                    try {
                        for (y in A.modules) {
                            if (A.modules.hasOwnProperty(y)) {
                                D = A.modules[y];
                                if (w.hasOwnProperty(y)) {
                                    if (D.enabled === false) {
                                        this.stop(y);
                                        continue
                                    }
                                    this.start(y);
                                    if (D.events) {
                                        this._registerModuleEvents(y, D.events, B)
                                    }
                                }
                            }
                        }
                        this._registerModuleEvents.clearCache()
                    } catch (C) {
                        u.destroy();
                        x = false
                    }
                } else {
                    x = false
                }
                return x
            },
            rebind: function(x) {
                u._updateModules(x)
            },
            getSessionData: function() {
                if (!u.isInitialized()) {
                    return
                }
                var B = null,
                    y = null,
                    z, A, x = u.getCoreConfig();
                if (!x || !x.sessionDataEnabled) {
                    return null
                }
                y = x.sessionData || {};
                z = y.sessionQueryName;
                if (z) {
                    A = u.utils.getQueryStringValue(z, y.sessionQueryDelim)
                } else {
                    z = y.sessionCookieName || "TLTSID";
                    A = u.utils.getCookieValue(z)
                }
                if (z && A) {
                    B = B || {};
                    B.tltSCN = z;
                    B.tltSCV = A;
                    B.tltSCVNeedsHashing = !!y.sessionValueNeedsHashing
                }
                return B
            },
            logGeolocation: function(x) {
                var B = u.getModuleConfig("replay") || {},
                    A = u.utils.getValue(B, "geolocation.options", {
                        timeout: 30000,
                        enableHighAccuracy: true,
                        maximumAge: 0
                    }),
                    z = u.utils.getValue(B, "geolocation.enabled", false),
                    y = window.navigator;
                if (!x) {
                    if (!z || !y || !y.geolocation || !y.geolocation.getCurrentPosition) {
                        return
                    }
                    y.geolocation.getCurrentPosition(s, m, A)
                } else {
                    s(x)
                }
            },
            logCustomEvent: function(A, y) {
                if (!u.isInitialized()) {
                    return
                }
                var z = null,
                    x = this.getService("queue");
                if (!A || typeof A !== "string") {
                    A = "CUSTOM"
                }
                y = y || {};
                z = {
                    type: 5,
                    customEvent: {
                        name: A,
                        data: y
                    }
                };
                x.post("", z, "DEFAULT")
            },
            logExceptionEvent: function(B, z, y) {
                if (!u.isInitialized()) {
                    return
                }
                var A = null,
                    x = this.getService("queue");
                if (!B || typeof B !== "string") {
                    return
                }
                z = z || "";
                y = y || "";
                A = {
                    type: 6,
                    exception: {
                        description: B,
                        url: z,
                        line: y
                    }
                };
                x.post("", A)
            },
            logFormCompletion: function(y, A) {
                if (!u.isInitialized()) {
                    return
                }
                var x = this.getService("queue"),
                    z = {
                        type: 15,
                        formCompletion: {
                            submitted: !!y,
                            valid: (typeof A === "boolean" ? A : null)
                        }
                    };
                x.post("", z)
            },
            logScreenviewLoad: function(z, y, x) {
                if (!u.isInitialized()) {
                    return
                }
                r("LOAD", z, y, x)
            },
            logScreenviewUnload: function(x) {
                if (!u.isInitialized()) {
                    return
                }
                r("UNLOAD", x)
            },
            logDOMCapture: function(z, C) {
                var D = null,
                    B, y, A, E, x;
                if (!this.isInitialized()) {
                    return D
                }
                if (u.utils.isLegacyIE) {
                    return D
                }
                y = this.getService("domCapture");
                if (y) {
                    z = z || window.document;
                    A = this.getServiceConfig("domCapture");
                    C = this.utils.mixin({}, A.options, C);
                    B = y.captureDOM(z, C);
                    if (B) {
                        D = C.dcid || ("dcid-" + this.utils.getSerialNumber() + "." + (new Date()).getTime());
                        B.dcid = D;
                        B.eventOn = !!C.eventOn;
                        E = {
                            type: 12,
                            domCapture: B
                        };
                        x = this.getService("queue");
                        x.post("", E, "DEFAULT");
                        if (C.qffd !== false && !i && E.domCapture.fullDOM) {
                            x.flush();
                            i = true
                        }
                    } else {
                        D = null
                    }
                }
                return D
            },
            performDOMCapture: function(z, x, y) {
                return this.logDOMCapture(x, y)
            },
            performFormCompletion: function(y, x, z) {
                return this.logFormCompletion(x, z)
            },
            _bridgeCallback: function(y) {
                var x = a[y];
                if (x && x.enabled) {
                    return x
                }
                return null
            },
            logScreenCapture: function() {
                if (!u.isInitialized()) {
                    return
                }
                var x = u._bridgeCallback("screenCapture");
                if (x !== null) {
                    x.cbFunction()
                }
            },
            enableTealeafFramework: function() {
                if (!u.isInitialized()) {
                    return
                }
                var x = u._bridgeCallback("enableTealeafFramework");
                if (x !== null) {
                    x.cbFunction()
                }
            },
            disableTealeafFramework: function() {
                if (!u.isInitialized()) {
                    return
                }
                var x = u._bridgeCallback("disableTealeafFramework");
                if (x !== null) {
                    x.cbFunction()
                }
            },
            startNewTLFSession: function() {
                if (!u.isInitialized()) {
                    return
                }
                var x = u._bridgeCallback("startNewTLFSession");
                if (x !== null) {
                    x.cbFunction()
                }
            },
            currentSessionId: function() {
                if (!u.isInitialized()) {
                    return
                }
                var y, x = u._bridgeCallback("currentSessionId");
                if (x !== null) {
                    y = x.cbFunction()
                }
                return y
            },
            defaultValueForConfigurableItem: function(x) {
                if (!u.isInitialized()) {
                    return
                }
                var z, y = u._bridgeCallback("defaultValueForConfigurableItem");
                if (y !== null) {
                    z = y.cbFunction(x)
                }
                return z
            },
            valueForConfigurableItem: function(x) {
                if (!u.isInitialized()) {
                    return
                }
                var z, y = u._bridgeCallback("valueForConfigurableItem");
                if (y !== null) {
                    z = y.cbFunction(x)
                }
                return z
            },
            setConfigurableItem: function(y, A) {
                if (!u.isInitialized()) {
                    return
                }
                var x = false,
                    z = u._bridgeCallback("setConfigurableItem");
                if (z !== null) {
                    x = z.cbFunction(y, A)
                }
                return x
            },
            addAdditionalHttpHeader: function(y, A) {
                if (!u.isInitialized()) {
                    return
                }
                var x = false,
                    z = u._bridgeCallback("addAdditionalHttpHeader");
                if (z !== null) {
                    x = z.cbFunction(y, A)
                }
                return x
            },
            logCustomEventBridge: function(z, A, y) {
                if (!u.isInitialized()) {
                    return
                }
                var x = false,
                    B = u._bridgeCallback("logCustomEventBridge");
                if (B !== null) {
                    x = B.cbFunction(z, A, y)
                }
                return x
            },
            registerBridgeCallbacks: function(E) {
                var B, z, C, y = null,
                    A, G, x, F = this.utils;
                if (!E) {
                    return false
                }
                if (E.length === 0) {
                    a = {};
                    return false
                }
                try {
                    for (B = 0, C = E.length; B < C; B += 1) {
                        y = E[B];
                        if (typeof y === "object" && y.cbType && y.cbFunction) {
                            A = {
                                enabled: y.enabled,
                                cbFunction: y.cbFunction,
                                cbOrder: y.order || 0
                            };
                            if (F.isUndefOrNull(a[y.cbType])) {
                                a[y.cbType] = A
                            } else {
                                if (!F.isArray(a[y.cbType])) {
                                    a[y.cbType] = [a[y.cbType]]
                                }
                                G = a[y.cbType];
                                for (z = 0, x = G.length; z < x; z += 1) {
                                    if (G[z].cbOrder > A.cbOrder) {
                                        break
                                    }
                                }
                                G.splice(z, 0, A)
                            }
                        }
                    }
                } catch (D) {
                    return false
                }
                return true
            },
            redirectQueue: function(D) {
                var C, B, E, z, G, x, y, F = this.utils,
                    A;
                if (!D || !D.length) {
                    return D
                }
                z = a.messageRedirect;
                if (!z) {
                    return D
                }
                if (!F.isArray(z)) {
                    G = [z]
                } else {
                    G = z
                }
                A = u.getService("serializer");
                for (B = 0, x = G.length; B < x; B += 1) {
                    z = G[B];
                    if (z && z.enabled) {
                        for (C = 0, E = D.length; C < E; C += 1) {
                            y = z.cbFunction(A.serialize(D[C]), D[C]);
                            if (y && typeof y === "object") {
                                D[C] = y
                            } else {
                                D.splice(C, 1);
                                C -= 1;
                                E = D.length
                            }
                        }
                    }
                }
                return D
            },
            _hasSameOrigin: function(x) {
                try {
                    return x.document.location.host === document.location.host && x.document.location.protocol === document.location.protocol
                } catch (y) {}
                return false
            },
            provideRequestHeaders: function() {
                var y = null,
                    x = a.addRequestHeaders;
                if (x && x.enabled) {
                    y = x.cbFunction()
                }
                return y
            },
            _registerModuleEvents: (function() {
                var z, B = 0,
                    A = function(F, E, D) {
                        if (F === "window") {
                            return E
                        }
                        if (F === "document") {
                            return D
                        }
                        return F
                    };

                function C(D, K, N) {
                    var M = u.getService("browserBase"),
                        H = u.getService("browser"),
                        L = u.utils.getDocument(N),
                        F = u._getLocalTop(),
                        E = u.utils.isIFrameDescendant(N),
                        J, I, G;
                    N = N || L;
                    t.normalizeModuleEvents(D, K, F, L);
                    if (E) {
                        J = M.ElementData.prototype.examineID(N).id;
                        if (typeof J === "string") {
                            J = J.slice(0, J.length - 1);
                            for (I in c) {
                                if (c.hasOwnProperty(I)) {
                                    for (G = 0; G < c[I].length; G += 1) {
                                        if (D === c[I][G]) {
                                            if (I.indexOf(J) !== -1) {
                                                delete c[I];
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    u.utils.forEach(K, function(O) {
                        var R = A(O.target, F, L) || L,
                            Q = A(O.delegateTarget, F, L),
                            P = "";
                        if (O.recurseFrames !== true && E) {
                            return
                        }
                        if (typeof R === "string") {
                            if (O.delegateTarget && u.getFlavor() === "jQuery") {
                                P = u._buildToken4delegateTarget(O.name, R, O.delegateTarget);
                                if (!c.hasOwnProperty(P)) {
                                    c[P] = [D];
                                    c[P].target = R;
                                    c[P].delegateTarget = Q;
                                    H.subscribe(O.name, R, u._publishEvent, Q, P)
                                } else {
                                    c[P].push(D)
                                }
                            } else {
                                u.utils.forEach(H.queryAll(R, N), function(S) {
                                    var T = z.get(S);
                                    if (!T) {
                                        T = M.ElementData.prototype.examineID(S);
                                        z.set(S, T)
                                    }
                                    P = O.name + "|" + T.id + T.idType;
                                    if (u.utils.indexOf(c[P], D) !== -1) {
                                        return
                                    }
                                    c[P] = c[P] || [];
                                    c[P].push(D);
                                    c[P].target = S;
                                    H.subscribe(O.name, S, u._publishEvent)
                                })
                            }
                        } else {
                            P = u._buildToken4bubbleTarget(O.name, R, typeof O.target === "undefined");
                            if (!c.hasOwnProperty(P)) {
                                c[P] = [D];
                                H.subscribe(O.name, R, u._publishEvent)
                            } else {
                                if (u.utils.indexOf(c[P], D) === -1) {
                                    c[P].push(D)
                                }
                            }
                        }
                        if (P !== "") {
                            if (typeof R !== "string") {
                                c[P].target = R
                            }
                        }
                    })
                }

                function y(D) {
                    var E = u.utils.getIFrameWindow(D);
                    return (E !== null) && u._hasSameOrigin(E) && (E.document !== null) && E.document.readyState === "complete"
                }

                function x(E, K, M) {
                    M = M || u._getLocalTop().document;
                    z = z || new u.utils.WeakMap();
                    C(E, K, M);
                    if (E !== "performance") {
                        var I = null,
                            D = null,
                            F = u.getService("browser"),
                            L = u.getService("domCapture"),
                            J = F.queryAll("iframe, frame", M),
                            H, G;
                        for (H = 0, G = J.length; H < G; H += 1) {
                            I = J[H];
                            if (o(I)) {
                                continue
                            }
                            if (y(I)) {
                                D = u.utils.getIFrameWindow(I);
                                u._registerModuleEvents(E, K, D.document);
                                L.observeWindow(D);
                                continue
                            }
                            B += 1;
                            (function(P, N, Q) {
                                var O = null,
                                    R = {
                                        moduleName: P,
                                        moduleEvents: N,
                                        hIFrame: Q,
                                        _registerModuleEventsDelayed: function() {
                                            var S = null;
                                            if (!o(Q)) {
                                                S = u.utils.getIFrameWindow(Q);
                                                if (u._hasSameOrigin(S)) {
                                                    u._registerModuleEvents(P, N, S.document);
                                                    L.observeWindow(S)
                                                }
                                            }
                                            B -= 1;
                                            if (!B) {
                                                u._publishEvent({
                                                    type: "loadWithFrames",
                                                    custom: true
                                                })
                                            }
                                        }
                                    };
                                u.utils.addEventListener(Q, "load", function() {
                                    R._registerModuleEventsDelayed()
                                });
                                if (u.utils.isLegacyIE && y(Q)) {
                                    O = u.utils.getIFrameWindow(Q);
                                    u.utils.addEventListener(O.document, "readystatechange", function() {
                                        R._registerModuleEventsDelayed()
                                    })
                                }
                            }(E, K, I))
                        }
                    }
                }
                x.clearCache = function() {
                    if (z) {
                        z.clear();
                        z = null
                    }
                };
                return x
            }()),
            _buildToken4currentTarget: function(y) {
                var z = y.nativeEvent ? y.nativeEvent.currentTarget : null,
                    x = z ? this.getService("browserBase").ElementData.prototype.examineID(z) : {
                        id: y.target ? y.target.id : null,
                        idType: y.target ? y.target.idType : -1
                    };
                return y.type + "|" + x.id + x.idType
            },
            _buildToken4delegateTarget: function(x, z, y) {
                return x + "|" + z + "|" + y
            },
            _buildToken4bubbleTarget: function(y, F, E, J) {
                var C = u._getLocalTop(),
                    x, z = u.getService("browser"),
                    K = function(L) {
                        var M = null;
                        if (u._hasSameOrigin(x.parent)) {
                            u.utils.forEach(z.queryAll("iframe, frame", x.parent.document), function(N) {
                                var O = null;
                                if (!o(N)) {
                                    O = u.utils.getIFrameWindow(N);
                                    if (u._hasSameOrigin(O) && O.document === L) {
                                        M = N
                                    }
                                }
                            })
                        }
                        return M
                    },
                    G = u.utils.getDocument(F),
                    I = this.getService("browserBase"),
                    H = null,
                    B, A = y,
                    D;
                if (G) {
                    x = G.defaultView || G.parentWindow
                }
                if (F === window || F === window.window) {
                    A += "|null-2|window"
                } else {
                    if (E && x && u._hasSameOrigin(x.parent) && typeof G !== "undefined" && C.document !== G) {
                        H = K(G);
                        if (H) {
                            B = I.ElementData.prototype.examineID(H);
                            A += "|" + B.xPath + "-2"
                        }
                    } else {
                        if (J && J !== document && u.getFlavor() === "jQuery") {
                            A += "|null-2|" + u.utils.getTagName(F) + "|" + u.utils.getTagName(J)
                        } else {
                            A += "|null-2|document"
                        }
                    }
                }
                return A
            },
            _reinitConfig: function() {
                u._updateModules()
            },
            _publishEvent: function(x) {
                var y = null,
                    B = null,
                    D = (x.delegateTarget && x.data) ? x.data : u._buildToken4currentTarget(x),
                    E = null,
                    F, G, H, A = null,
                    I = false,
                    J = false,
                    C = u.getCoreConfig(),
                    z = u.getService("browser"),
                    L = x.delegateTarget || null,
                    K;
                if (x.type.match(/^(click|change|blur|mouse|touch)/)) {
                    d()
                }
                K = u.utils.getValue(C, "screenviewAutoDetect", true);
                if (K) {
                    n()
                }
                if ((x.type === "load" || x.type === "pageshow") && !x.nativeEvent.customLoad) {
                    return
                }
                if (u.utils.isIE) {
                    if (x.type === "click") {
                        p = x.target.element
                    }
                    if (x.type === "beforeunload") {
                        I = false;
                        u.utils.forEach(C.ieExcludedLinks, function(N) {
                            var O, M, P = z.queryAll(N);
                            for (O = 0, M = P ? P.length : 0; O < M; O += 1) {
                                if (typeof P[O] !== undefined && P[O] === p) {
                                    I = true;
                                    return
                                }
                            }
                        });
                        if (I) {
                            return
                        }
                    }
                }
                if (t.isUnload(x)) {
                    g = "unloading"
                }
                if (x.type === "change" && u.utils.isLegacyIE && u.getFlavor() === "w3c" && (x.target.element.type === "checkbox" || x.target.element.type === "radio")) {
                    return
                }
                if (x.type === "propertychange") {
                    if (x.nativeEvent.propertyName === "checked" && (x.target.element.type === "checkbox" || (x.target.element.type === "radio" && x.target.element.checked))) {
                        x.type = "change";
                        x.target.type = "INPUT"
                    } else {
                        return
                    }
                }
                if (x.target && f(x.target.element)) {
                    return
                }
                if (!c.hasOwnProperty(D)) {
                    if (x.hasOwnProperty("nativeEvent")) {
                        H = x.nativeEvent.currentTarget || x.nativeEvent.target
                    }
                    D = u._buildToken4bubbleTarget(x.type, H, true, L)
                }
                if (c.hasOwnProperty(D)) {
                    E = c[D];
                    for (F = 0, G = E.length; F < G; F += 1) {
                        y = E[F];
                        B = u.getModule(y);
                        A = u.utils.mixin({}, x);
                        if (B && u.isStarted(y) && typeof B.onevent === "function") {
                            J = t.canPublish(y, A);
                            if (J) {
                                B.onevent(A)
                            }
                        }
                    }
                }
                if (A && A.type === "unload" && J) {
                    u.destroy()
                }
            },
            _getLocalTop: function() {
                return window.window
            },
            addModule: function(x, y) {
                w[x] = {
                    creator: y,
                    instance: null,
                    context: null,
                    messages: []
                };
                if (this.isInitialized()) {
                    this.start(x)
                }
            },
            getModule: function(x) {
                if (w[x] && w[x].instance) {
                    return w[x].instance
                }
                return null
            },
            removeModule: function(x) {
                this.stop(x);
                delete w[x]
            },
            isStarted: function(x) {
                return w.hasOwnProperty(x) && w[x].instance !== null
            },
            start: function(y) {
                var z = w[y],
                    x = null;
                if (z && z.instance === null) {
                    z.context = new TLT.ModuleContext(y, this);
                    x = z.instance = z.creator(z.context);
                    if (typeof x.init === "function") {
                        x.init()
                    }
                }
            },
            startAll: function() {
                var x = null;
                for (x in w) {
                    if (w.hasOwnProperty(x)) {
                        this.start(x)
                    }
                }
            },
            stop: function(y) {
                var z = w[y],
                    x = null;
                if (z && z.instance !== null) {
                    x = z.instance;
                    if (typeof x.destroy === "function") {
                        x.destroy()
                    }
                    z.instance = z.context = null
                }
            },
            stopAll: function() {
                var x = null;
                for (x in w) {
                    if (w.hasOwnProperty(x)) {
                        this.stop(x)
                    }
                }
            },
            addService: function(y, x) {
                b[y] = {
                    creator: x,
                    instance: null
                }
            },
            getService: function(x) {
                if (b.hasOwnProperty(x)) {
                    if (!b[x].instance) {
                        try {
                            b[x].instance = b[x].creator(this);
                            if (typeof b[x].instance.init === "function") {
                                b[x].instance.init()
                            }
                        } catch (y) {
                            return null
                        }
                        if (typeof b[x].instance.getServiceName !== "function") {
                            b[x].instance.getServiceName = function() {
                                return x
                            }
                        }
                    }
                    return b[x].instance
                }
                return null
            },
            removeService: function(x) {
                delete b[x]
            },
            broadcast: function(A) {
                var z = 0,
                    x = 0,
                    B = null,
                    y = null;
                if (A && typeof A === "object") {
                    for (B in w) {
                        if (w.hasOwnProperty(B)) {
                            y = w[B];
                            if (u.utils.indexOf(y.messages, A.type) > -1) {
                                if (typeof y.instance.onmessage === "function") {
                                    y.instance.onmessage(A)
                                }
                            }
                        }
                    }
                }
            },
            listen: function(x, z) {
                var y = null;
                if (this.isStarted(x)) {
                    y = w[x];
                    if (u.utils.indexOf(y.messages, z) === -1) {
                        y.messages.push(z)
                    }
                }
            },
            fail: function(z, y, x) {
                z = "UIC FAILED. " + z;
                try {
                    u.destroy(!!x)
                } finally {
                    u.utils.clog(z);
                    throw new u.UICError(z, y)
                }
            },
            UICError: (function() {
                function x(y, z) {
                    this.message = y;
                    this.code = z
                }
                x.prototype = new Error();
                x.prototype.name = "UICError";
                x.prototype.constructor = x;
                return x
            }()),
            getFlavor: function() {
                return "w3c"
            }
        };
    d = function() {
        var z = u.getCoreConfig(),
            A = null,
            y = u.utils.getValue(z, "inactivityTimeout", 600000);
        if (!y) {
            d = function() {};
            return
        }

        function x() {
            u.utils.clog("UIC self-terminated due to inactivity timeout.");
            u.destroy()
        }
        d = function() {
            if (A) {
                clearTimeout(A);
                A = null
            }
            A = setTimeout(x, y)
        };
        d()
    };
    j = function(A, M) {
        var F, x, D, N, y, C, J, K, H, B, L, z, E, G;
        if (e) {
            u.utils.clog("TLT.init() called more than once. Ignoring.");
            return
        }
        if (TLT && TLT.replay) {
            return
        }
        F = u.getService("config");
        F.updateConfig(A);
        C = F.getModuleConfig("TLCookie") || {};
        B = C.sessionizationCookieName || "TLTSID";
        L = u.utils.getCookieValue(B);
        if (L === "DND") {
            if (g !== "destroyed") {
                u.destroy()
            }
            return
        }
        if (!u._updateModules()) {
            if (g !== "destroyed") {
                u.destroy()
            }
            return
        }
        if (F.subscribe) {
            F.subscribe("configupdated", u._reinitConfig)
        }
        e = true;
        g = "loaded";
        x = {
            type: "load",
            target: window.window,
            srcElement: window.window,
            currentTarget: window.window,
            bubbles: true,
            cancelBubble: false,
            cancelable: true,
            timeStamp: +new Date(),
            customLoad: true
        };
        N = u.getService("browserBase");
        D = new N.WebEvent(x);
        u._publishEvent(D);
        K = u.getService("ajax");
        J = u.getServiceConfig("queue");
        H = J.queues || [];
        for (G = 0; G < H.length; G += 1) {
            if (!L && C.tlAppKey) {
                z = H[G].endpoint;
                E = H[G].killswitchURL || (z.match("collectorPost") ? z.replace("collectorPost", "switch/" + C.tlAppKey) : null);
                if (E) {
                    K.sendRequest({
                        type: "GET",
                        url: E,
                        async: true,
                        timeout: 5000,
                        oncomplete: function(O) {
                            if (O.responseText === "0") {
                                u.setAutoFlush(false);
                                u.utils.setCookie(B, "DND");
                                u.destroy()
                            }
                        }
                    })
                }
            }
            if (H[G].checkEndpoint) {
                K.sendRequest({
                    oncomplete: function(O) {},
                    timeout: H[G].endpointCheckTimeout || 3000,
                    url: H[G].endpoint,
                    headers: {
                        "X-PageId": q,
                        "X-Tealeaf-SaaS-AppKey": C.tlAppKey,
                        "X-Tealeaf-EndpointCheck": true
                    },
                    async: true,
                    error: function(O) {
                        if (O.success) {
                            return
                        }
                        u.setAutoFlush(false);
                        u.destroy()
                    }
                })
            }
        }
        if (typeof l === "function") {
            try {
                l("initialized")
            } catch (I) {}
        }
    };
    (function() {
        var y = null,
            z, x;
        for (y in h) {
            if (h.hasOwnProperty(y)) {
                for (z = 0, x = h[y].length; z < x; z += 1) {
                    (function(B, A) {
                        u[A] = function() {
                            var C = this.getService(B);
                            if (C) {
                                return C[A].apply(C, arguments)
                            }
                        }
                    }(y, h[y][z]))
                }
            }
        }
    }());
    return u
}());
(function() {
    var a = window.navigator.userAgent.toLowerCase(),
        i = (a.indexOf("msie") !== -1 || a.indexOf("trident") !== -1),
        b = (function() {
            var j = !!window.performance;
            return (i && (!j || document.documentMode < 9))
        }()),
        e = (a.indexOf("android") !== -1),
        f = /(ipad|iphone|ipod)/.test(a),
        c = (a.indexOf("opera mini") !== -1),
        h = 1,
        d = {
            "a:": "link",
            "button:button": "button",
            "button:submit": "button",
            "input:button": "button",
            "input:checkbox": "checkBox",
            "input:color": "colorPicker",
            "input:date": "datePicker",
            "input:datetime": "datetimePicker",
            "input:datetime-local": "datetime-local",
            "input:email": "emailInput",
            "input:file": "fileInput",
            "input:image": "button",
            "input:month": "month",
            "input:number": "numberPicker",
            "input:password": "textBox",
            "input:radio": "radioButton",
            "input:range": "slider",
            "input:reset": "button",
            "input:search": "searchBox",
            "input:submit": "button",
            "input:tel": "tel",
            "input:text": "textBox",
            "input:time": "timePicker",
            "input:url": "urlBox",
            "input:week": "week",
            "select:": "selectList",
            "select:select-one": "selectList",
            "textarea:": "textBox",
            "textarea:textarea": "textBox"
        },
        g = {
            isIE: i,
            isLegacyIE: b,
            isAndroid: e,
            isLandscapeZeroDegrees: false,
            isiOS: f,
            isOperaMini: c,
            isUndefOrNull: function(j) {
                return typeof j === "undefined" || j === null
            },
            isArray: function(j) {
                return !!(j && Object.prototype.toString.call(j) === "[object Array]")
            },
            getSerialNumber: function() {
                var j;
                j = h;
                h += 1;
                return j
            },
            getRandomString: function(o, n) {
                var m, l, j = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
                    k = "";
                if (!o) {
                    return k
                }
                if (typeof n !== "string") {
                    n = j
                }
                for (m = 0, l = n.length; m < o; m += 1) {
                    k += n.charAt(Math.floor(Math.random() * l))
                }
                return k
            },
            getValue: function(o, n, k) {
                var m, j, l;
                k = typeof k === "undefined" ? null : k;
                if (!o || typeof o !== "object" || typeof n !== "string") {
                    return k
                }
                l = n.split(".");
                for (m = 0, j = l.length; m < j; m += 1) {
                    if (this.isUndefOrNull(o) || typeof o[l[m]] === "undefined") {
                        return k
                    }
                    o = o[l[m]]
                }
                return o
            },
            indexOf: function(m, l) {
                var k, j;
                if (m && m.indexOf) {
                    return m.indexOf(l)
                }
                if (m && m instanceof Array) {
                    for (k = 0, j = m.length; k < j; k += 1) {
                        if (m[k] === l) {
                            return k
                        }
                    }
                }
                return -1
            },
            forEach: function(n, m, l) {
                var k, j;
                if (!n || !n.length || !m || !m.call) {
                    return
                }
                for (k = 0, j = n.length; k < j; k += 1) {
                    m.call(l, n[k], k, n)
                }
            },
            some: function(n, m) {
                var k, j, l = false;
                for (k = 0, j = n.length; k < j; k += 1) {
                    l = m(n[k], k, n);
                    if (l) {
                        return l
                    }
                }
                return l
            },
            convertToArray: function(l) {
                var m = 0,
                    k = l.length,
                    j = [];
                while (m < k) {
                    j.push(l[m]);
                    m += 1
                }
                return j
            },
            mixin: function(n) {
                var m, l, k, j;
                for (k = 1, j = arguments.length; k < j; k += 1) {
                    l = arguments[k];
                    for (m in l) {
                        if (Object.prototype.hasOwnProperty.call(l, m)) {
                            n[m] = l[m]
                        }
                    }
                }
                return n
            },
            extend: function(j, k, l) {
                var m = "";
                for (m in l) {
                    if (Object.prototype.hasOwnProperty.call(l, m)) {
                        if (j && Object.prototype.toString.call(l[m]) === "[object Object]") {
                            if (typeof k[m] === "undefined") {
                                k[m] = {}
                            }
                            g.extend(j, k[m], l[m])
                        } else {
                            k[m] = l[m]
                        }
                    }
                }
                return k
            },
            clone: function(k) {
                var l, j;
                if (null === k || "object" !== typeof k) {
                    return k
                }
                if (k instanceof Object) {
                    l = (Object.prototype.toString.call(k) === "[object Array]") ? [] : {};
                    for (j in k) {
                        if (Object.prototype.hasOwnProperty.call(k, j)) {
                            l[j] = g.clone(k[j])
                        }
                    }
                    return l
                }
            },
            parseVersion: function(l) {
                var m, j, k = [];
                if (!l || !l.length) {
                    return k
                }
                k = l.split(".");
                for (m = 0, j = k.length; m < j; m += 1) {
                    k[m] = /^[0-9]+$/.test(k[m]) ? parseInt(k[m], 10) : k[m]
                }
                return k
            },
            isEqual: function(l, k) {
                var m, j;
                if (l === k) {
                    return true
                }
                if (typeof l !== typeof k) {
                    return false
                }
                if (l instanceof Object) {
                    if (Object.prototype.toString.call(l) === "[object Array]") {
                        if (l.length !== k.length) {
                            return false
                        }
                        for (m = 0, j = l.length; m < j; m += 1) {
                            if (!this.isEqual(l[m], k[m])) {
                                return false
                            }
                        }
                        return true
                    }
                }
                return false
            },
            createObject: (function() {
                var j = null,
                    k = null;
                if (typeof Object.create === "function") {
                    j = Object.create
                } else {
                    k = function() {};
                    j = function(l) {
                        if (typeof l !== "object" && typeof l !== "function") {
                            throw new TypeError("Object prototype need to be an object!")
                        }
                        k.prototype = l;
                        return new k()
                    }
                }
                return j
            }()),
            access: function(o, m) {
                var n = m || window,
                    k, l, j;
                if (typeof o !== "string" || (typeof n !== "object" && n !== null)) {
                    return
                }
                k = o.split(".");
                for (l = 0, j = k.length; l < j; l += 1) {
                    if (l === 0 && k[l] === "window") {
                        continue
                    }
                    if (!Object.prototype.hasOwnProperty.call(n, k[l])) {
                        return
                    }
                    n = n[k[l]];
                    if (l < (j - 1) && !(n instanceof Object)) {
                        return
                    }
                }
                return n
            },
            isNumeric: function(j) {
                var k = false;
                if (g.isUndefOrNull(j) || j === "") {
                    return k
                }
                k = !isNaN(j * 2);
                return k
            },
            isUpperCase: function(j) {
                return j === j.toUpperCase() && j !== j.toLowerCase()
            },
            isLowerCase: function(j) {
                return j === j.toLowerCase() && j !== j.toUpperCase()
            },
            getDocument: function(j) {
                if (j && j.nodeType !== 9) {
                    return (!g.isUndefOrNull(j.ownerDocument)) ? (j.ownerDocument) : (j.document)
                }
                return j
            },
            getWindow: function(k) {
                try {
                    if (k.self !== k) {
                        var j = g.getDocument(k);
                        return (!g.isUndefOrNull(j.defaultView)) ? (j.defaultView) : (j.parentWindow)
                    }
                } catch (l) {
                    k = null
                }
                return k
            },
            getOriginAndPath: function(j) {
                var l = {},
                    k;
                j = j || window.location;
                if (j.origin) {
                    l.origin = j.origin
                } else {
                    l.origin = (j.protocol || "") + "//" + (j.host || "")
                }
                l.path = (j.pathname || "").split(";", 1)[0];
                if (l.origin.indexOf("file://") > -1) {
                    k = l.path.match(/(.*)(\/.*app.*)/);
                    if (k !== null) {
                        l.path = k[2]
                    }
                }
                return l
            },
            getIFrameWindow: function(l) {
                var j = null;
                if (!l) {
                    return j
                }
                try {
                    j = l.contentWindow || (l.contentDocument ? l.contentDocument.parentWindow : null)
                } catch (k) {}
                return j
            },
            getTagName: function(k) {
                var j = "";
                if (g.isUndefOrNull(k)) {
                    return j
                }
                if (k === document || k.nodeType === 9) {
                    j = "document"
                } else {
                    if (k === window || k === window.window) {
                        j = "window"
                    } else {
                        if (typeof k === "string") {
                            j = k.toLowerCase()
                        } else {
                            if (k.tagName) {
                                j = k.tagName.toLowerCase()
                            } else {
                                if (k.nodeName) {
                                    j = k.nodeName.toLowerCase()
                                } else {
                                    j = ""
                                }
                            }
                        }
                    }
                }
                return j
            },
            getTlType: function(l) {
                var j, k, m = "";
                if (g.isUndefOrNull(l) || !l.type) {
                    return m
                }
                j = l.type.toLowerCase();
                k = j + ":";
                if (l.subType) {
                    k += l.subType.toLowerCase()
                }
                m = d[k] || j;
                return m
            },
            isIFrameDescendant: function(k) {
                var j = g.getWindow(k);
                return (j ? (j != TLT._getLocalTop()) : false)
            },
            getOrientationMode: function(j) {
                var k = "INVALID";
                if (typeof j !== "number") {
                    return k
                }
                switch (j) {
                    case 0:
                    case 180:
                    case 360:
                        k = "PORTRAIT";
                        break;
                    case 90:
                    case -90:
                    case 270:
                        k = "LANDSCAPE";
                        break;
                    default:
                        k = "UNKNOWN";
                        break
                }
                return k
            },
            clog: (function(j) {
                return function() {}
            }(window)),
            trim: function(j) {
                if (!j || !j.toString) {
                    return j
                }
                return j.toString().replace(/^\s+|\s+$/g, "")
            },
            ltrim: function(j) {
                if (!j || !j.toString) {
                    return j
                }
                return j.toString().replace(/^\s+/, "")
            },
            rtrim: function(j) {
                if (!j || !j.toString) {
                    return j
                }
                return j.toString().replace(/\s+$/, "")
            },
            setCookie: function(r, j, q, t, m) {
                var o, p, n, l, k = "",
                    s;
                if (!r) {
                    return
                }
                r = encodeURIComponent(r);
                j = encodeURIComponent(j);
                n = (m || location.hostname).split(".");
                s = ";path=" + (t || "/");
                if (typeof q === "number") {
                    if (this.isIE) {
                        l = new Date();
                        l.setTime(l.getTime() + (q * 1000));
                        k = ";expires=" + l.toUTCString()
                    } else {
                        k = ";max-age=" + q
                    }
                }
                for (p = n.length, o = (p === 1 ? 1 : 2); o <= p; o += 1) {
                    document.cookie = r + "=" + j + ";domain=" + n.slice(-o).join(".") + s + k;
                    if (this.getCookieValue(r) === j) {
                        break
                    }
                    if (p === 1) {
                        document.cookie = r + "=" + j + s + k
                    }
                }
            },
            getCookieValue: function(p, r) {
                var m, n, l, q, k = null,
                    j;
                try {
                    r = r || document.cookie;
                    if (!p || !p.toString) {
                        return null
                    }
                    p += "=";
                    j = p.length;
                    q = r.split(";");
                    for (m = 0, n = q.length; m < n; m += 1) {
                        l = q[m];
                        l = g.ltrim(l);
                        if (l.indexOf(p) === 0) {
                            k = l.substring(j, l.length);
                            break
                        }
                    }
                } catch (o) {
                    k = null
                }
                return k
            },
            getQueryStringValue: function(o, r, k) {
                var n, m, s, l = null,
                    p;
                try {
                    k = k || window.location.search;
                    s = k.length;
                    if (!o || !o.toString || !s) {
                        return null
                    }
                    r = r || "&";
                    k = r + k.substring(1);
                    o = r + o + "=";
                    n = k.indexOf(o);
                    if (n !== -1) {
                        p = n + o.length;
                        m = k.indexOf(r, p);
                        if (m === -1) {
                            m = s
                        }
                        l = decodeURIComponent(k.substring(p, m))
                    }
                } catch (q) {}
                return l
            },
            addEventListener: (function() {
                if (window.addEventListener) {
                    return function(k, j, l) {
                        k.addEventListener(j, l, false)
                    }
                }
                return function(k, j, l) {
                    k.attachEvent("on" + j, l)
                }
            }()),
            matchTarget: function(u, q) {
                var o, m, n, t = -1,
                    s, k, l, p, r, v = document;
                if (!u || !q) {
                    return t
                }
                if (!this.browserService || !this.browserBaseService) {
                    this.browserService = TLT.getService("browser");
                    this.browserBaseService = TLT.getService("browserBase")
                }
                if (q.idType === -2) {
                    n = this.browserBaseService.getNodeFromID(q.id, q.idType);
                    v = this.getDocument(n)
                }
                for (o = 0, p = u.length; o < p && t === -1; o += 1) {
                    r = u[o];
                    if (typeof r === "string") {
                        s = this.browserService.queryAll(r, v);
                        for (m = 0, k = s ? s.length : 0; m < k; m += 1) {
                            if (s[m]) {
                                l = this.browserBaseService.ElementData.prototype.examineID(s[m]);
                                if (l.idType === q.idType && l.id === q.id) {
                                    t = o;
                                    break
                                }
                            }
                        }
                    } else {
                        if (r && r.id && r.idType && q.idType.toString() === r.idType.toString()) {
                            switch (typeof r.id) {
                                case "string":
                                    if (r.id === q.id) {
                                        t = o
                                    }
                                    break;
                                case "object":
                                    if (!r.cRegex) {
                                        r.cRegex = new RegExp(r.id.regex, r.id.flags)
                                    }
                                    r.cRegex.lastIndex = 0;
                                    if (r.cRegex.test(q.id)) {
                                        t = o
                                    }
                                    break
                            }
                        }
                    }
                }
                return t
            },
            WeakMap: (function() {
                function j(n, m) {
                    var l, k;
                    n = n || [];
                    for (l = 0, k = n.length; l < k; l += 1) {
                        if (n[l][0] === m) {
                            return l
                        }
                    }
                    return -1
                }
                return function() {
                    var k = [];
                    this.set = function(m, n) {
                        var l = j(k, m);
                        k[l > -1 ? l : k.length] = [m, n]
                    };
                    this.get = function(m) {
                        var l = k[j(k, m)];
                        return (l ? l[1] : undefined)
                    };
                    this.clear = function() {
                        k = []
                    };
                    this.has = function(l) {
                        return (j(k, l) >= 0)
                    };
                    this.remove = function(m) {
                        var l = j(k, m);
                        if (l >= 0) {
                            k.splice(l, 1)
                        }
                    };
                    this["delete"] = this.remove
                }
            }())
        };
    if (typeof TLT === "undefined" || !TLT) {
        window.TLT = {}
    }
    TLT.utils = g
}());
(function() {
    TLT.EventTarget = function() {
        this._handlers = {}
    };
    TLT.EventTarget.prototype = {
        constructor: TLT.EventTarget,
        publish: function(c, f) {
            var d = 0,
                a = 0,
                b = this._handlers[c],
                e = {
                    type: c,
                    data: f
                };
            if (typeof b !== "undefined") {
                for (a = b.length; d < a; d += 1) {
                    b[d](e)
                }
            }
        },
        subscribe: function(a, b) {
            if (!this._handlers.hasOwnProperty(a)) {
                this._handlers[a] = []
            }
            this._handlers[a].push(b)
        },
        unsubscribe: function(c, e) {
            var d = 0,
                a = 0,
                b = this._handlers[c];
            if (b) {
                for (a = b.length; d < a; d += 1) {
                    if (b[d] === e) {
                        b.splice(d, 1);
                        return
                    }
                }
            }
        }
    }
}());
TLT.ModuleContext = (function() {
    var a = ["broadcast", "getConfig:getModuleConfig", "listen", "post", "getXPathFromNode", "performDOMCapture", "performFormCompletion", "isInitialized", "getStartTime"];
    return function(f, d) {
        var h = {},
            g = 0,
            b = a.length,
            j = null,
            e = null,
            c = null;
        for (g = 0; g < b; g += 1) {
            j = a[g].split(":");
            if (j.length > 1) {
                c = j[0];
                e = j[1]
            } else {
                c = j[0];
                e = j[0]
            }
            h[c] = (function(i) {
                return function() {
                    var k = d.utils.convertToArray(arguments);
                    k.unshift(f);
                    return d[i].apply(d, k)
                }
            }(e))
        }
        h.utils = d.utils;
        return h
    }
}());
TLT.addService("config", function(a) {
    function d(f, e) {
        a.utils.extend(true, f, e);
        c.publish("configupdated", c.getConfig())
    }
    var b = {
            core: {},
            modules: {},
            services: {}
        },
        c = a.utils.extend(false, a.utils.createObject(new TLT.EventTarget()), {
            getConfig: function() {
                return b
            },
            updateConfig: function(e) {
                d(b, e)
            },
            getCoreConfig: function() {
                return b.core
            },
            updateCoreConfig: function(e) {
                d(b.core, e)
            },
            getServiceConfig: function(e) {
                return b.services[e] || {}
            },
            updateServiceConfig: function(f, e) {
                if (typeof b.services[f] === "undefined") {
                    b.services[f] = {}
                }
                d(b.services[f], e)
            },
            getModuleConfig: function(e) {
                return b.modules[e] || {}
            },
            updateModuleConfig: function(f, e) {
                if (typeof b.modules[f] === "undefined") {
                    b.modules[f] = {}
                }
                d(b.modules[f], e)
            },
            destroy: function() {
                b = {
                    core: {},
                    modules: {},
                    services: {}
                }
            }
        });
    return c
});
TLT.addService("queue", function(w) {
    var B = w.utils,
        I = null,
        f = {},
        o = 600000,
        g = w.getService("ajax"),
        n = w.getService("browser"),
        p = w.getService("encoder"),
        k = w.getService("serializer"),
        F = w.getService("config"),
        i = w.getService("message"),
        s = null,
        H = {},
        c = true,
        v = {
            5: {
                limit: 300,
                count: 0
            },
            6: {
                limit: 400,
                count: 0
            }
        },
        m = [],
        r = false,
        l = (function() {
            var N = {};

            function Q(R) {
                return typeof N[R] !== "undefined"
            }

            function J(R, S) {
                if (!Q(R)) {
                    N[R] = {
                        lastOffset: 0,
                        data: [],
                        queueId: R,
                        url: S.url,
                        eventThreshold: S.eventThreshold,
                        sizeThreshold: S.sizeThreshold || 0,
                        size: -1,
                        serializer: S.serializer,
                        encoder: S.encoder,
                        crossDomainEnabled: !!S.crossDomainEnabled,
                        crossDomainIFrame: S.crossDomainIFrame
                    }
                }
                return N[R]
            }

            function L(R) {
                if (Q(R)) {
                    delete N[R]
                }
            }

            function O(R) {
                if (Q(R)) {
                    return N[R]
                }
                return null
            }

            function M(S) {
                var R = O(S);
                if (R !== null) {
                    R.data = []
                }
            }

            function P(R) {
                var S = null;
                if (Q(R)) {
                    S = O(R).data;
                    M(R)
                }
                return S
            }

            function K(T, V) {
                var R = null,
                    U = null,
                    X = window.tlBridge,
                    S = window.iOSJSONShuttle;
                try {
                    U = k.serialize(V)
                } catch (W) {
                    U = "Serialization failed: " + (W.name ? W.name + " - " : "") + W.message;
                    V = {
                        error: U
                    }
                }
                if ((typeof X !== "undefined") && (typeof X.addMessage === "function")) {
                    X.addMessage(U)
                } else {
                    if ((typeof S !== "undefined") && (typeof S === "function")) {
                        S(U)
                    } else {
                        if (Q(T)) {
                            R = O(T);
                            R.data.push(V);
                            R.data = w.redirectQueue(R.data);
                            if (R.sizeThreshold) {
                                U = k.serialize(R.data);
                                R.size = U.length
                            }
                            return R.data.length
                        }
                    }
                }
                return 0
            }
            return {
                exists: Q,
                add: J,
                remove: L,
                reset: function() {
                    N = {}
                },
                get: O,
                clear: M,
                flush: P,
                push: K
            }
        }());

    function b(J) {
        if (J && J.id) {
            B.extend(true, m[J.id - 1], {
                xhrRspEnd: i.createMessage({
                    type: 0
                }).offset,
                success: J.success,
                statusCode: J.statusCode,
                statusText: J.statusText
            })
        }
    }

    function q() {
        return window.location.pathname
    }

    function a(L, P, M, O) {
        var J = l.get(L),
            N = {
                name: P,
                value: M
            },
            K = null;
        if (typeof P !== "string" || typeof M !== "string") {
            return
        }
        if (!J.headers) {
            J.headers = {
                once: [],
                always: []
            }
        }
        K = !!O ? J.headers.always : J.headers.once;
        K.push(N)
    }

    function G(L, O) {
        var N = 0,
            K = 0,
            J = l.get(L),
            P = J.headers,
            M = null;
        O = O || {};

        function Q(S, U) {
            var T = 0,
                R = 0,
                V = null;
            for (T = 0, R = S.length; T < R; T += 1) {
                V = S[T];
                U[V.name] = V.value
            }
        }
        if (P) {
            M = [P.always, P.once];
            for (N = 0, K = M.length; N < K; N += 1) {
                Q(M[N], O)
            }
        }
        return O
    }

    function y(K) {
        var J = null,
            L = null;
        if (!l.exists(K)) {
            throw new Error("Queue: " + K + " does not exist!")
        }
        J = l.get(K);
        L = J ? J.headers : null;
        if (L) {
            L.once = []
        }
    }

    function E() {
        var K = 0,
            J, M, L = w.provideRequestHeaders();
        if (L && L.length) {
            for (K = 0, J = L.length; K < J; K += 1) {
                M = L[K];
                a("DEFAULT", M.name, M.value, M.recurring)
            }
        }
        return K
    }

    function h(N) {
        var M, J, L = [],
            K = "";
        if (!N || !N.length) {
            return K
        }
        for (M = 0, J = N.length; M < J; M += 1) {
            L[N[M].type] = true
        }
        for (M = 0, J = L.length; M < J; M += 1) {
            if (L[M]) {
                if (K) {
                    K += ","
                }
                K += M
            }
        }
        return K
    }

    function A(L, W) {
        var Q = l.flush(L),
            S = Q ? Q.length : 0,
            R = l.get(L),
            M = {
                "Content-Type": "application/json",
                "X-PageId": w.getPageId(),
                "X-Tealeaf": "device (UIC) Lib/5.4.0.1805",
                "X-TealeafType": "GUI",
                "X-TeaLeaf-Page-Url": q(),
                "X-Tealeaf-SyncXHR": (!!W).toString()
            },
            U = null,
            O = i.createMessage({
                type: 0
            }).offset,
            X = R.serializer || "json",
            K = R.encoder,
            N, P, J, V = null;
        if (!S || !R) {
            return
        }
        J = O - Q[S - 1].offset;
        if (J > (o + 60000)) {
            return
        }
        R.lastOffset = Q[S - 1].offset;
        M["X-Tealeaf-MessageTypes"] = h(Q);
        Q = i.wrapMessages(Q);
        if (I.xhrLogging) {
            U = Q.serialNumber;
            m[U - 1] = {
                serialNumber: U,
                xhrReqStart: O
            };
            Q.log = {
                xhr: m
            }
        }
        if (X) {
            Q = k.serialize(Q, X)
        }
        if (K) {
            P = p.encode(Q, K);
            if (P) {
                if (P.data && !P.error) {
                    Q = P.data;
                    M["Content-Encoding"] = P.encoding
                } else {
                    Q = P.error
                }
            }
        }
        E();
        G(L, M);
        if (R.crossDomainEnabled) {
            V = B.getIFrameWindow(R.crossDomainIFrame);
            if (!V) {
                return
            }
            N = {
                request: {
                    id: U,
                    url: R.url,
                    async: !W,
                    headers: M,
                    data: Q
                }
            };
            if (!B.isIE && typeof window.postMessage === "function") {
                V.postMessage(N, R.crossDomainIFrame.src)
            } else {
                try {
                    V.sendMessage(N)
                } catch (T) {
                    return
                }
            }
        } else {
            g.sendRequest({
                id: U,
                oncomplete: b,
                url: R.url,
                async: !W,
                headers: M,
                data: Q
            })
        }
        y(L)
    }

    function e(M) {
        var J = null,
            L = I.queues,
            K = 0;
        for (K = 0; K < L.length; K += 1) {
            J = L[K];
            A(J.qid, M)
        }
        return true
    }

    function j(L, N) {
        var K, O = i.createMessage(N),
            J = l.get(L),
            M, P;
        K = J.data.length;
        if (K) {
            P = O.offset - J.data[K - 1].offset;
            if (P > o) {
                l.flush(L);
                w.destroy();
                return
            }
        }
        K = l.push(L, O);
        M = J.size;
        if ((K >= J.eventThreshold || M >= J.sizeThreshold) && c && w.getState() !== "unloading") {
            A(L)
        }
    }

    function t(L) {
        var J, K = false;
        if (!L || !L.type) {
            return true
        }
        J = v[L.type];
        if (J) {
            J.count += 1;
            if (J.count > J.limit) {
                K = true;
                if (J.count === J.limit + 1) {
                    j("DEFAULT", {
                        type: 16,
                        dataLimit: {
                            messageType: L.type,
                            maxCount: J.limit
                        }
                    })
                }
            }
        }
        return K
    }

    function d(L) {
        var K = null,
            O = I.queues,
            N = "",
            M = 0,
            J = 0;
        for (M = 0; M < O.length; M += 1) {
            K = O[M];
            if (K && K.modules) {
                for (J = 0; J < K.modules.length; J += 1) {
                    N = K.modules[J];
                    if (N === L) {
                        return K.qid
                    }
                }
            }
        }
        return s.qid
    }

    function C(L, J) {
        H[L] = window.setTimeout(function K() {
            A(L);
            H[L] = window.setTimeout(K, J)
        }, J)
    }

    function z() {
        var J = 0;
        for (J in H) {
            if (H.hasOwnProperty(J)) {
                window.clearTimeout(H[J]);
                delete H[J]
            }
        }
        H = {}
    }

    function x(J) {}

    function u(J) {
        I = J;
        f = w.getCoreConfig();
        o = B.getValue(f, "inactivityTimeout", 600000);
        B.forEach(I.queues, function(K, L) {
            var M = null;
            if (K.qid === "DEFAULT") {
                s = K
            }
            if (K.crossDomainEnabled) {
                M = n.query(K.crossDomainFrameSelector);
                if (!M) {
                    w.fail("Cross domain iframe not found")
                }
            }
            l.add(K.qid, {
                url: K.endpoint,
                eventThreshold: K.maxEvents,
                sizeThreshold: K.maxSize || 0,
                serializer: K.serializer,
                encoder: K.encoder,
                timerInterval: K.timerInterval || 0,
                crossDomainEnabled: K.crossDomainEnabled || false,
                crossDomainIFrame: M
            });
            if (typeof K.timerInterval !== "undefined" && K.timerInterval > 0) {
                C(K.qid, K.timerInterval)
            }
        });
        F.subscribe("configupdated", x);
        r = true
    }

    function D() {
        if (c) {
            e(!I.asyncReqOnUnload)
        }
        F.unsubscribe("configupdated", x);
        z();
        l.reset();
        I = null;
        s = null;
        r = false
    }
    return {
        init: function() {
            if (!r) {
                u(F.getServiceConfig("queue") || {})
            } else {}
        },
        destroy: function() {
            D()
        },
        _getQueue: function(J) {
            return l.get(J).data
        },
        setAutoFlush: function(J) {
            if (J === true) {
                c = true
            } else {
                c = false
            }
        },
        flush: function(J) {
            J = J || s.qid;
            if (!l.exists(J)) {
                throw new Error("Queue: " + J + " does not exist!")
            }
            A(J)
        },
        flushAll: function(J) {
            return e(!!J)
        },
        post: function(K, L, J) {
            if (!w.isInitialized()) {
                return
            }
            J = J || d(K);
            if (!l.exists(J)) {
                return
            }
            if (!t(L)) {
                j(J, L)
            }
        }
    }
});
TLT.addService("browserBase", function(r) {
    var h, L = r.utils,
        i = {
            optgroup: true,
            option: true,
            nobr: true
        },
        q = {},
        e, n = null,
        A, w, g, u, F = false;

    function s() {
        e = r.getService("config");
        n = r.getService("serializer");
        A = e ? e.getServiceConfig("browser") : {};
        w = A.hasOwnProperty("blacklist") ? A.blacklist : [];
        g = A.hasOwnProperty("customid") ? A.customid : []
    }

    function b() {
        s();
        if (e) {
            e.subscribe("configupdated", s)
        }
        F = true
    }

    function G() {
        if (e) {
            e.unsubscribe("configupdated", s)
        }
        F = false
    }

    function v(P) {
        var N, M, O;
        if (!P || !P.id || typeof P.id !== "string") {
            return false
        }
        for (N = 0, M = w.length; N < M; N += 1) {
            if (typeof w[N] === "string") {
                if (P.id === w[N]) {
                    return false
                }
            } else {
                if (typeof w[N] === "object") {
                    if (!w[N].cRegex) {
                        w[N].cRegex = new RegExp(w[N].regex, w[N].flags)
                    }
                    w[N].cRegex.lastIndex = 0;
                    if (w[N].cRegex.test(P.id)) {
                        return false
                    }
                }
            }
        }
        return true
    }

    function p(O, P) {
        var M = {
                type: null,
                subType: null
            },
            N;
        if (!O) {
            return M
        }
        N = O.type;
        switch (N) {
            case "focusin":
                N = "focus";
                break;
            case "focusout":
                N = "blur";
                break;
            default:
                break
        }
        M.type = N;
        return M
    }

    function y(N) {
        var M = {
            type: null,
            subType: null
        };
        if (!N) {
            return M
        }
        M.type = L.getTagName(N);
        M.subType = N.type || null;
        return M
    }

    function c(M, O, N) {
        var S = {
                HTML_ID: "-1",
                XPATH_ID: "-2",
                ATTRIBUTE_ID: "-3"
            },
            R, P = null,
            Q;
        if (!M || !O) {
            return P
        }
        R = N || window.document;
        O = O.toString();
        if (O === S.HTML_ID) {
            if (R.getElementById) {
                P = R.getElementById(M)
            } else {
                if (R.querySelector) {
                    P = R.querySelector("#" + M)
                }
            }
        } else {
            if (O === S.ATTRIBUTE_ID) {
                Q = M.split("=");
                if (R.querySelector) {
                    P = R.querySelector("[" + Q[0] + '="' + Q[1] + '"]')
                }
            } else {
                if (O === S.XPATH_ID) {
                    P = q.xpath(M, R)
                }
            }
        }
        return P
    }
    u = (function() {
        var M = {
            nobr: true,
            p: true
        };

        function N(S, Q) {
            var V, T, U = false,
                Y = null,
                O = null,
                Z = null,
                X = [],
                W = true,
                R = r._getLocalTop(),
                P = "";
            while (W) {
                W = false;
                if (!L.isUndefOrNull(S)) {
                    P = L.getTagName(S);
                    if (!L.isUndefOrNull(P)) {
                        if (M.hasOwnProperty(P)) {
                            S = S.parentNode;
                            P = L.getTagName(S)
                        }
                    }
                    for (U = v(S); S !== document && (!U || Q); U = v(S)) {
                        Z = S.parentNode;
                        if (!Z) {
                            O = r.utils.getWindow(S);
                            if (!O) {
                                return X
                            }
                            Z = (O !== R) ? O.frameElement : document
                        }
                        Y = Z.firstChild;
                        if (typeof Y === "undefined") {
                            return X
                        }
                        for (T = 0; Y; Y = Y.nextSibling) {
                            if (Y.nodeType === 1 && L.getTagName(Y) === P) {
                                if (Y === S) {
                                    X[X.length] = [P, T];
                                    break
                                }
                                T += 1
                            }
                        }
                        S = Z;
                        P = L.getTagName(S)
                    }
                    if (U && !Q) {
                        X[X.length] = [S.id];
                        if (r.utils.isIFrameDescendant(S)) {
                            W = true;
                            S = r.utils.getWindow(S).frameElement
                        }
                    }
                }
            }
            return X
        }
        return function(R, P) {
            var O = N(R, !!P),
                S = [],
                Q = O.length;
            if (Q < 1) {
                return "null"
            }
            while (Q) {
                Q -= 1;
                if (O[Q].length > 1) {
                    S[S.length] = '["' + O[Q][0] + '",' + O[Q][1] + "]"
                } else {
                    S[S.length] = "[" + n.serialize(O[Q][0], "json") + "]"
                }
            }
            return ("[" + S.join(",") + "]")
        }
    }());

    function K(N) {
        var O = {
                left: -1,
                top: -1
            },
            M;
        N = N || document;
        M = N.documentElement || N.body.parentNode || N.body;
        O.left = Math.round((typeof window.pageXOffset === "number") ? window.pageXOffset : M.scrollLeft);
        O.top = Math.round((typeof window.pageYOffset === "number") ? window.pageYOffset : M.scrollTop);
        return O
    }

    function J(M) {
        return M && typeof M.originalEvent !== "undefined" && typeof M.isDefaultPrevented !== "undefined" && !M.isSimulated
    }

    function k(M) {
        if (!M) {
            return null
        }
        if (M.type && M.type.indexOf("touch") === 0) {
            if (J(M)) {
                M = M.originalEvent
            }
            if (M.type === "touchstart") {
                M = M.touches[M.touches.length - 1]
            } else {
                if (M.type === "touchend") {
                    M = M.changedTouches[0]
                }
            }
        }
        return M
    }

    function t(P) {
        var S = P || window.event,
            R = document.documentElement,
            M = document.body,
            Q = false,
            O = null,
            N = 0;
        if (J(S)) {
            S = S.originalEvent
        }
        if (typeof P === "undefined" || typeof S.target === "undefined") {
            S.target = S.srcElement || window.window;
            S.timeStamp = Number(new Date());
            if (S.pageX === null || typeof S.pageX === "undefined") {
                S.pageX = S.clientX + ((R && R.scrollLeft) || (M && M.scrollLeft) || 0) - ((R && R.clientLeft) || (M && M.clientLeft) || 0);
                S.pageY = S.clientY + ((R && R.scrollTop) || (M && M.scrollTop) || 0) - ((R && R.clientTop) || (M && M.clientTop) || 0)
            }
            S.preventDefault = function() {
                this.returnValue = false
            };
            S.stopPropagation = function() {
                this.cancelBubble = true
            }
        }
        if (window.chrome && S.path !== undefined && S.type === "click") {
            if (S.path.length === undefined) {
                return S
            }
            for (N = 0; N < S.path.length; N++) {
                if (L.getTagName(S.path[N]) === "button") {
                    Q = true;
                    O = S.path[N];
                    N = S.path.length
                }
            }
            if (Q) {
                return {
                    originalEvent: S,
                    target: O,
                    srcElement: O,
                    type: S.type,
                    pageX: document.body.scrollLeft + O.getBoundingClientRect().left,
                    pageY: document.body.scrollTop + O.getBoundingClientRect().top
                }
            }
        }
        return S
    }

    function x(N) {
        var M = null;
        if (!N) {
            return null
        }
        if (N.srcElement) {
            M = N.srcElement
        } else {
            M = N.target;
            if (!M) {
                M = N.explicitOriginalTarget
            }
            if (!M) {
                M = N.originalTarget
            }
        }
        if (!M && N.type.indexOf("touch") === 0) {
            M = k(N).target
        }
        while (M && i[L.getTagName(M)]) {
            M = M.parentNode
        }
        if (!M && N.srcElement === null) {
            M = window.window
        }
        return M
    }

    function I(N) {
        var Q = 0,
            P = 0,
            O = document.documentElement,
            M = document.body;
        N = k(N);
        if (N) {
            if (N.pageX || N.pageY) {
                Q = N.pageX;
                P = N.pageY
            } else {
                if (N.clientX || N.clientY) {
                    Q = N.clientX + (O ? O.scrollLeft : (M ? M.scrollLeft : 0)) - (O ? O.clientLeft : (M ? M.clientLeft : 0));
                    P = N.clientY + (O ? O.scrollTop : (M ? M.scrollTop : 0)) - (O ? O.clientTop : (M ? M.clientTop : 0))
                }
            }
        }
        return {
            x: Q,
            y: P
        }
    }
    q.xpath = function(U, W) {
        var S = null,
            N, T = null,
            M, Q, P, O, R, V;
        if (!U) {
            return null
        }
        S = n.parse(U);
        W = W || document;
        N = W;
        if (!S) {
            return null
        }
        for (Q = 0, R = S.length; Q < R && N; Q += 1) {
            T = S[Q];
            if (T.length === 1) {
                if (W.getElementById) {
                    N = W.getElementById(T[0])
                } else {
                    if (W.querySelector) {
                        N = W.querySelector("#" + T[0])
                    } else {
                        N = null
                    }
                }
            } else {
                for (P = 0, O = -1, V = N.childNodes.length; P < V; P += 1) {
                    if (N.childNodes[P].nodeType === 1 && L.getTagName(N.childNodes[P]) === T[0].toLowerCase()) {
                        O += 1;
                        if (O === T[1]) {
                            N = N.childNodes[P];
                            break
                        }
                    }
                }
                if (O === -1) {
                    return null
                }
            }
            M = L.getTagName(N);
            if (M === "frame" || M === "iframe") {
                N = L.getIFrameWindow(N).document;
                W = N
            }
        }
        return (N === W || !N) ? null : N
    };

    function m(M, N) {
        this.x = M || 0;
        this.y = N || 0
    }

    function a(N, M) {
        this.width = Math.round(N || 0);
        this.height = Math.round(M || 0)
    }

    function d(N, O) {
        var Q, M, P;
        O = x(N);
        Q = this.examineID(O);
        M = y(O);
        P = this.examinePosition(N, O);
        this.element = O;
        this.id = Q.id;
        this.idType = Q.idType;
        this.type = M.type;
        this.subType = M.subType;
        this.state = this.examineState(O);
        this.position = new m(P.x, P.y);
        this.size = new a(P.width, P.height);
        this.xPath = Q.xPath;
        this.name = Q.name
    }
    d.HTML_ID = -1;
    d.XPATH_ID = -2;
    d.ATTRIBUTE_ID = -3;
    d.prototype.examineID = function(S) {
        var O, U, V, M, N, Q = g.length,
            P;
        try {
            V = u(S)
        } catch (R) {}
        N = S.name;
        try {
            if (!r.utils.getWindow(S) || !r.utils.isIFrameDescendant(S)) {
                if (v(S)) {
                    O = S.id;
                    U = d.HTML_ID
                } else {
                    if (g.length && S.attributes) {
                        while (Q) {
                            Q -= 1;
                            P = S.attributes[g[Q]];
                            if (typeof P !== "undefined") {
                                O = g[Q] + "=" + (P.value || P);
                                U = d.ATTRIBUTE_ID
                            }
                        }
                    }
                }
            }
        } catch (T) {}
        if (!O) {
            O = V;
            U = d.XPATH_ID
        }
        return {
            id: O,
            idType: U,
            xPath: V,
            name: N
        }
    };
    d.prototype.examineState = function(S) {
        var M = {
                a: ["innerText", "href"],
                input: {
                    range: ["maxValue:max", "value"],
                    checkbox: ["value", "checked"],
                    radio: ["value", "checked"],
                    image: ["src"]
                },
                select: ["value"],
                button: ["value", "innerText"],
                textarea: ["value"]
            },
            N = L.getTagName(S),
            T = M[N] || null,
            O = null,
            V = null,
            P = 0,
            R = 0,
            Q = null,
            U = "";
        if (T !== null) {
            if (Object.prototype.toString.call(T) === "[object Object]") {
                T = T[S.type] || ["value"]
            }
            V = {};
            for (U in T) {
                if (T.hasOwnProperty(U)) {
                    if (T[U].indexOf(":") !== -1) {
                        Q = T[U].split(":");
                        V[Q[0]] = S[Q[1]]
                    } else {
                        if (T[U] === "innerText") {
                            V[T[U]] = r.utils.trim(S.innerText || S.textContent)
                        } else {
                            V[T[U]] = S[T[U]]
                        }
                    }
                }
            }
        }
        if (N === "select" && S.options && !isNaN(S.selectedIndex)) {
            V.index = S.selectedIndex;
            if (V.index >= 0 && V.index < S.options.length) {
                O = S.options[S.selectedIndex];
                V.value = O.getAttribute("value") || O.getAttribute("label") || O.text || O.innerText;
                V.text = O.text || O.innerText
            }
        }
        return V
    };

    function E() {
        var N = 1,
            O, Q, M;
        if (document.body.getBoundingClientRect) {
            try {
                O = document.body.getBoundingClientRect()
            } catch (P) {
                r.utils.clog("getBoundingClientRect failed.", P);
                return N
            }
            Q = O.right - O.left;
            M = document.body.offsetWidth;
            N = Math.round((Q / M) * 100) / 100
        }
        return N
    }

    function o(N) {
        var P, M, O, R;
        if (!N || !N.getBoundingClientRect) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
        try {
            P = N.getBoundingClientRect();
            R = K(document)
        } catch (Q) {
            r.utils.clog("getBoundingClientRect failed.", Q);
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }
        }
        M = {
            x: P.left + R.left,
            y: P.top + R.top,
            width: P.right - P.left,
            height: P.bottom - P.top
        };
        if (r.utils.isIE) {
            M.x -= document.documentElement.clientLeft;
            M.y -= document.documentElement.clientTop;
            O = E();
            if (O !== 1) {
                M.x = Math.round(M.x / O);
                M.y = Math.round(M.y / O);
                M.width = Math.round(M.width / O);
                M.height = Math.round(M.height / O)
            }
        }
        return M
    }
    d.prototype.examinePosition = function(N, O) {
        var P = I(N),
            M = o(O);
        M.x = (P.x || P.y) ? Math.round(Math.abs(P.x - M.x)) : M.width / 2;
        M.y = (P.x || P.y) ? Math.round(Math.abs(P.y - M.y)) : M.height / 2;
        return M
    };

    function H() {
        var M = (typeof window.orientation === "number") ? window.orientation : 0;
        if (r.utils.isLandscapeZeroDegrees) {
            if (Math.abs(M) === 180 || Math.abs(M) === 0) {
                M = 90
            } else {
                if (Math.abs(M) === 90) {
                    M = 0
                }
            }
        }
        return M
    }

    function B(S) {
        var P, M, R, Q, O, N;
        if (S) {
            return S
        }
        R = r.getCoreConfig() || {};
        O = R.modules;
        S = {};
        for (N in O) {
            if (O.hasOwnProperty(N) && O[N].events) {
                for (P = 0, M = O[N].events.length; P < M; P += 1) {
                    Q = O[N].events[P];
                    if (Q.state) {
                        S[Q.name] = Q.state
                    }
                }
            }
        }
        return S
    }

    function j(M) {
        var N;
        h = B(h);
        if (h[M.type]) {
            N = L.getValue(M, h[M.type], null)
        }
        return N
    }

    function l(N) {
        var P, M, O;
        this.data = N.data || null;
        this.delegateTarget = N.delegateTarget || null;
        if (N.gesture || (N.originalEvent && N.originalEvent.gesture)) {
            this.gesture = N.gesture || N.originalEvent.gesture;
            this.gesture.idType = (new d(this.gesture, this.gesture.target)).idType
        }
        N = t(N);
        P = I(N);
        this.custom = false;
        this.nativeEvent = this.custom === true ? null : N;
        this.position = new m(P.x, P.y);
        this.target = new d(N, N.target);
        this.orientation = H();
        O = j(N);
        if (O) {
            this.target.state = O
        }
        this.timestamp = (new Date()).getTime();
        M = p(N, this.target);
        this.type = M.type;
        this.subType = M.subType
    }

    function D(M) {
        if (r.isInitialized()) {
            r._publishEvent(new l(M))
        } else {}
    }

    function f(Q, O) {
        var T, R, S = false,
            W = null,
            M = null,
            X = null,
            V = [],
            U = true,
            P = r._getLocalTop(),
            N = "";
        while (U) {
            U = false;
            if (L.isUndefOrNull(Q)) {
                break
            }
            N = L.getTagName(Q);
            if (!L.isUndefOrNull(N)) {
                if (f.specialChildNodes.hasOwnProperty(N)) {
                    Q = Q.parentNode;
                    U = true;
                    continue
                }
            }
            for (S = v(Q); Q !== document && (!S || O); S = v(Q)) {
                X = Q.parentNode;
                if (!X) {
                    M = r.utils.getWindow(Q);
                    if (!M || Q.nodeType !== 9) {
                        V.push([N, 0]);
                        break
                    }
                    X = (M !== P) ? M.frameElement : document
                }
                W = X.firstChild;
                if (typeof W === "undefined") {
                    break
                }
                for (R = 0; W; W = W.nextSibling) {
                    if (W.nodeType === 1 && L.getTagName(W) === N) {
                        if (W === Q) {
                            V[V.length] = [N, R];
                            break
                        }
                        R += 1
                    }
                }
                Q = X;
                N = L.getTagName(Q)
            }
            if (S && !O) {
                V[V.length] = [Q.id];
                if (r.utils.isIFrameDescendant(Q)) {
                    U = true;
                    Q = r.utils.getWindow(Q).frameElement
                }
            }
        }
        V.reverse();
        return V
    }
    f.specialChildNodes = {
        nobr: true,
        p: true
    };

    function C(M) {
        var N;
        if (!M || !M.length) {
            return null
        }
        N = n.serialize(M, "json");
        return N
    }

    function z(Q) {
        var P = "",
            N = [],
            M = "",
            O = [];
        if (!(this instanceof z)) {
            return null
        }
        if (typeof Q !== "object") {
            this.fullXpath = "";
            this.xpath = "";
            this.fullXpathList = [];
            this.xpathList = [];
            return
        }
        O = f(Q, false);
        if (O.length && O[0].length === 1) {
            N = f(Q, true)
        } else {
            N = L.clone(O)
        }
        this.xpath = C(O);
        this.xpathList = O;
        this.fullXpath = C(N);
        this.fullXpathList = N;
        this.applyPrefix = function(T) {
            var R, S;
            if (!(T instanceof z) || !T.fullXpathList.length) {
                return
            }
            S = T.fullXpathList[T.fullXpathList.length - 1];
            R = this.fullXpathList.shift();
            if (L.isEqual(R[0], S[0])) {
                this.fullXpathList = T.fullXpathList.concat(this.fullXpathList)
            } else {
                this.fullXpathList.unshift(R);
                return
            }
            this.fullXpath = C(this.fullXpathList);
            R = this.xpathList.shift();
            if (R.length === 1) {
                this.xpathList.unshift(R);
                return
            }
            this.xpathList = T.xpathList.concat(this.xpathList);
            this.xpath = C(this.xpathList)
        };
        this.compare = function(R) {
            if (!(R instanceof z)) {
                return 0
            }
            return (this.fullXpathList.length - R.fullXpathList.length)
        };
        this.isSame = function(R) {
            var S = false;
            if (!(R instanceof z)) {
                return S
            }
            if (this.compare(R) === 0) {
                S = (this.fullXpath === R.fullXpath)
            }
            return S
        };
        this.containedIn = function(S) {
            var T, R;
            if (!(S instanceof z)) {
                return false
            }
            if (S.fullXpathList.length > this.fullXpathList.length) {
                return false
            }
            for (T = 0, R = S.fullXpathList.length; T < R; T += 1) {
                if (!L.isEqual(S.fullXpathList[T], this.fullXpathList[T])) {
                    return false
                }
            }
            return true
        }
    }
    z.prototype = (function() {
        return {}
    }());
    return {
        init: function() {
            if (!F) {
                b()
            } else {}
        },
        destroy: function() {
            G()
        },
        WebEvent: l,
        ElementData: d,
        Xpath: z,
        processDOMEvent: D,
        getNormalizedOrientation: H,
        getXPathFromNode: function(N, O, M, P) {
            return u(O, M, P)
        },
        getNodeFromID: c,
        queryDom: q
    }
});
TLT.addService("browser", function(d) {
    var l = d.utils,
        h = d.getService("config"),
        f = d.getService("browserBase"),
        m = d.getService("ajax"),
        g = null,
        c = null,
        j = h ? h.getServiceConfig("browser") : {},
        b = l.getValue(j, "useCapture", true),
        k = false,
        e = {
            NO_QUERY_SELECTOR: "NOQUERYSELECTOR"
        },
        o = function(p) {
            return function(r) {
                var q = new f.WebEvent(r);
                if (r.type === "resize" || r.type === "hashchange") {
                    setTimeout(function() {
                        p(q)
                    }, 5)
                } else {
                    p(q)
                }
            }
        },
        a = {
            list2Array: function(r) {
                var q = r.length,
                    p = [],
                    s;
                if (typeof r.length === "undefined") {
                    return [r]
                }
                for (s = 0; s < q; s += 1) {
                    p[s] = r[s]
                }
                return p
            },
            find: function(r, q, p) {
                p = p || "css";
                return this.list2Array(this[p](r, q))
            },
            css: function(q, t) {
                var u = this,
                    x = null,
                    v = document.getElementsByTagName("body")[0],
                    w = j.jQueryObject ? l.access(j.jQueryObject) : window.jQuery,
                    s = j.sizzleObject ? l.access(j.sizzleObject) : window.Sizzle;
                if (typeof document.querySelectorAll === "undefined") {
                    u.css = function(z, y) {
                        y = y || document;
                        return u.Sizzle(z, y)
                    };
                    if (typeof u.Sizzle === "undefined") {
                        try {
                            if (v === s("html > body", document)[0]) {
                                u.Sizzle = s
                            }
                        } catch (r) {
                            try {
                                if (v === w(document).find("html > body").get()[0]) {
                                    u.Sizzle = function(z, y) {
                                        return w(y).find(z).get()
                                    }
                                }
                            } catch (p) {
                                d.fail("Sizzle was not found", e.NO_QUERY_SELECTOR)
                            }
                        }
                    }
                } else {
                    u.css = function(z, y) {
                        y = y || document;
                        return y.querySelectorAll(z)
                    }
                }
                return u.css(q, t)
            }
        },
        n = (function() {
            var p = new l.WeakMap();
            return {
                add: function(q) {
                    var r = p.get(q) || [o(q), 0];
                    r[1] += 1;
                    p.set(q, r);
                    return r[0]
                },
                find: function(q) {
                    var r = p.get(q);
                    return r ? r[0] : null
                },
                remove: function(q) {
                    var r = p.get(q);
                    if (r) {
                        r[1] -= 1;
                        if (r[1] <= 0) {
                            p.remove(q)
                        }
                    }
                }
            }
        }());

    function i() {
        a.xpath = f.queryDom.xpath;
        if (typeof document.addEventListener === "function") {
            g = function(r, p, q) {
                r.addEventListener(p, q, b)
            };
            c = function(r, p, q) {
                r.removeEventListener(p, q, b)
            }
        } else {
            if (typeof document.attachEvent !== "undefined") {
                g = function(r, p, q) {
                    r.attachEvent("on" + p, q)
                };
                c = function(r, p, q) {
                    r.detachEvent("on" + p, q)
                }
            } else {
                throw new Error("Unsupported browser")
            }
        }
        k = true
    }
    return {
        init: function() {
            if (!k) {
                i()
            } else {}
        },
        destroy: function() {
            k = false
        },
        getServiceName: function() {
            return "W3C"
        },
        query: function(s, q, p) {
            try {
                return a.find(s, q, p)[0] || null
            } catch (r) {
                return []
            }
        },
        queryAll: function(s, q, p) {
            try {
                return a.find(s, q, p)
            } catch (r) {
                return []
            }
        },
        subscribe: function(p, s, q) {
            var r = n.add(q);
            g(s, p, r)
        },
        unsubscribe: function(p, t, q) {
            var r = n.find(q);
            if (r) {
                try {
                    c(t, p, r)
                } catch (s) {}
                n.remove(q)
            }
        }
    }
});
TLT.addService("ajax", function(c) {
    var g, j = false,
        h = false;

    function e(m) {
        var l = "",
            k = [];
        for (l in m) {
            if (m.hasOwnProperty(l)) {
                k.push([l, m[l]])
            }
        }
        return k
    }

    function f(m) {
        var l = "",
            k = "?";
        for (l in m) {
            if (m.hasOwnProperty(l)) {
                k += encodeURIComponent(l) + "=" + encodeURIComponent(m[l]) + "&"
            }
        }
        return k.slice(0, -1)
    }

    function d(m) {
        m = m.split("\n");
        var o = {},
            l = 0,
            k = m.length,
            n = null;
        for (l = 0; l < k; l += 1) {
            n = m[l].split(": ");
            o[n[0]] = n[1]
        }
        return o
    }

    function i(k) {
        var m, n = false,
            l = f(k.headers);
        if (typeof k.data === "string") {
            m = k.data
        } else {
            m = k.data ? new Uint8Array(k.data) : ""
        }
        n = navigator.sendBeacon(k.url + l, m);
        return n
    }

    function b(s) {
        var r = g(),
            l = [
                ["X-Requested-With", "XMLHttpRequest"]
            ],
            q = 0,
            m = typeof s.async !== "boolean" ? true : s.async,
            o = "",
            p = null,
            n, k;
        if (s.headers) {
            l = l.concat(e(s.headers))
        }
        if (s.contentType) {
            l.push(["Content-Type", s.contentType])
        }
        r.open(s.type.toUpperCase(), s.url, m);
        for (n = 0, k = l.length; n < k; n += 1) {
            o = l[n];
            if (o[0] && o[1]) {
                r.setRequestHeader(o[0], o[1])
            }
        }
        r.onreadystatechange = p = function() {
            if (r.readyState === 4) {
                r.onreadystatechange = p = function() {};
                if (s.timeout) {
                    window.clearTimeout(q)
                }
                s.oncomplete({
                    id: s.id,
                    headers: d(r.getAllResponseHeaders()),
                    responseText: (r.responseText || null),
                    statusCode: r.status,
                    statusText: r.statusText,
                    success: (r.status >= 200 && r.status < 300)
                });
                r = null
            }
        };
        r.send(s.data || null);
        p();
        if (s.timeout) {
            q = window.setTimeout(function() {
                if (!r) {
                    return
                }
                r.onreadystatechange = function() {};
                if (r.readyState !== 4) {
                    r.abort();
                    if (typeof s.error === "function") {
                        s.error({
                            id: s.id,
                            statusCode: r.status,
                            statusText: "timeout",
                            success: false
                        })
                    }
                }
                s.oncomplete({
                    id: s.id,
                    headers: d(r.getAllResponseHeaders()),
                    responseText: (r.responseText || null),
                    statusCode: r.status,
                    statusText: "timeout",
                    success: false
                });
                r = null
            }, s.timeout)
        }
    }

    function a() {
        var k = c.getServiceConfig("queue");
        if (typeof window.XMLHttpRequest !== "undefined") {
            g = function() {
                return new XMLHttpRequest()
            }
        } else {
            g = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        j = !!k.useBeacon && (typeof navigator.sendBeacon === "function");
        h = true
    }
    return {
        init: function() {
            if (!h) {
                a()
            }
        },
        destroy: function() {
            h = false
        },
        sendRequest: function(k) {
            var m = c.getState() === "unloading",
                l;
            k.type = k.type || "POST";
            if ((m || !k.async) && j) {
                l = i(k);
                if (!l) {
                    b(k)
                }
            } else {
                b(k)
            }
        }
    }
});
TLT.addService("domCapture", function(x) {
    var h = x.getService("config"),
        i = x.getService("browserBase"),
        u, g, e = {
            captureFrames: false,
            removeScripts: true,
            removeComments: true
        },
        S = {
            childList: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            subtree: true
        },
        a = (typeof window.MutationObserver !== "undefined"),
        v, E = S,
        J = [],
        T = [],
        t = [],
        w = 0,
        C = 100,
        c = false,
        o = false,
        K = false,
        F = 1,
        q = function() {},
        r = function() {},
        z = function() {},
        W = x.utils;

    function D() {
        T = [];
        t = [];
        w = 0;
        c = false
    }

    function O(aa) {
        var Z, Y, X;
        if (!aa || !aa.length) {
            return
        }
        aa = aa.sort(function(ac, ab) {
            return ac.compare(ab)
        });
        for (Z = 0; Z < aa.length; Z += 1) {
            X = aa[Z];
            for (Y = Z + 1; Y < aa.length; Y += 0) {
                if (aa[Y].containedIn(X)) {
                    aa.splice(Y, 1)
                } else {
                    Y += 1
                }
            }
        }
    }

    function p(Z) {
        var Y, X;
        if (!Z) {
            return Z
        }
        for (Y = 0, X = Z.length; Y < X; Y += 1) {
            delete Z[Y].oldValue
        }
        return Z
    }

    function d(ab, Z) {
        var Y, X, aa = false;
        if (!ab || !Z) {
            return aa
        }
        for (Y = 0, X = ab.length; Y < X; Y += 1) {
            if (ab[Y].name === Z) {
                aa = true;
                break
            }
        }
        return aa
    }

    function y(aa, ac) {
        var Z, Y, X, ab;
        for (Z = 0, Y = aa.length, ab = false; Z < Y; Z += 1) {
            X = aa[Z];
            if (X.name === ac.name) {
                if (X.oldValue === ac.value) {
                    aa.splice(Z, 1)
                } else {
                    X.value = ac.value
                }
                ab = true;
                break
            }
        }
        if (!ab) {
            aa.push(ac)
        }
        return aa
    }

    function I(aa, Y) {
        var ac, ab, Z, X, ad, ae;
        aa.removedNodes = Y.removedNodes.length;
        aa.addedNodes = W.convertToArray(Y.addedNodes);
        for (ac = 0, X = T.length; ac < X; ac += 1) {
            ae = T[ac];
            if (aa.isSame(ae)) {
                if (aa.removedNodes) {
                    for (ab = 0; ab < Y.removedNodes.length; ab += 1) {
                        Z = ae.addedNodes.indexOf(Y.removedNodes[ab]);
                        if (Z !== -1) {
                            ae.addedNodes.splice(Z, 1);
                            aa.removedNodes -= 1
                        }
                    }
                }
                ae.removedNodes += aa.removedNodes;
                ae.addedNodes.concat(aa.addedNodes);
                if (!ae.removedNodes && !ae.addedNodes.length) {
                    T.splice(ac, 1)
                }
                ad = true;
                break
            }
        }
        if (!ad) {
            T.push(aa)
        }
    }

    function P(Y, ac) {
        var aa, Z, X, ad = false,
            ab, ae;
        for (aa = 0, X = T.length; !ad && aa < X; aa += 1) {
            ae = T[aa];
            if (Y.containedIn(ae)) {
                ab = ae.addedNodes;
                for (Z = 0; Z < ab.length; Z += 1) {
                    if (ab[Z].contains && ab[Z].contains(ac)) {
                        ad = true;
                        break
                    }
                }
            }
        }
        return ad
    }

    function B(Z, Y) {
        var ac, X, ab, aa, ad, ae = null;
        ab = Y.attributeName;
        if (ab === "checked" || ab === "selected") {
            ae = i.ElementData.prototype.examineID(Y.target);
            if (u.isPrivacyMatched(ae)) {
                return
            }
            ae = null
        }
        if (ab === "value") {
            ae = i.ElementData.prototype.examineID(Y.target);
            ae.currState = i.ElementData.prototype.examineState(Y.target) || {};
            if (ae.currState.value) {
                u.applyPrivacyToTarget(ae)
            } else {
                ae = null
            }
        }
        Z.attributes = [{
            name: ab,
            oldValue: Y.oldValue,
            value: ae ? ae.currState.value : Y.target.getAttribute(ab)
        }];
        aa = Z.attributes[0];
        if (aa.oldValue === aa.value) {
            return
        }
        for (ac = 0, X = t.length, ad = false; ac < X; ac += 1) {
            ae = t[ac];
            if (Z.isSame(ae)) {
                ae.attributes = y(ae.attributes, aa);
                if (!ae.attributes.length) {
                    t.splice(ac, 1)
                } else {
                    if (P(Z, Y.target)) {
                        t.splice(ac, 1)
                    }
                }
                ad = true;
                break
            }
        }
        if (!ad && !P(Z, Y.target)) {
            t.push(Z)
        }
    }

    function l(aa) {
        var ac, X, ab, Y, Z;
        if (!aa || !aa.length) {
            return
        }
        w += aa.length;
        if (w >= C) {
            if (!c) {
                c = true
            }
            return
        }
        for (ac = 0, X = aa.length; ac < X; ac += 1) {
            Y = aa[ac];
            Z = new i.Xpath(Y.target);
            if (Z) {
                ab = Z.fullXpathList;
                if (ab.length && ab[0][0] === "html") {
                    switch (Y.type) {
                        case "characterData":
                        case "childList":
                            I(Z, Y);
                            break;
                        case "attributes":
                            B(Z, Y);
                            break;
                        default:
                            W.clog("Unknown mutation type: " + Y.type);
                            break
                    }
                }
            }
        }
    }

    function s() {
        var X;
        X = new window.MutationObserver(function(Y) {
            if (Y) {
                l(Y);
                W.clog("Processed [" + Y.length + "] mutation records.")
            }
        });
        return X
    }

    function j(Y) {
        var Z, X;
        h.subscribe("configupdated", z);
        u = x.getService("message");
        g = Y;
        g.options = W.mixin({}, e, g.options);
        a = a && W.getValue(g, "diffEnabled", true);
        C = W.getValue(g.options, "maxMutations", 100);
        if (a) {
            E = W.getValue(g, "diffObserverConfig", S);
            v = s();
            J.push(window)
        }
        K = true
    }

    function N() {
        h.unsubscribe("configupdated", z);
        if (v) {
            v.disconnect()
        }
        K = false
    }

    function m() {
        var X;
        X = "tlt-" + W.getSerialNumber();
        return X
    }

    function f(aa, Z) {
        var Y, X;
        if (!aa || !aa.getElementsByTagName || !Z) {
            return
        }
        X = aa.getElementsByTagName(Z);
        if (X && X.length) {
            for (Y = X.length - 1; Y >= 0; Y -= 1) {
                X[Y].parentNode.removeChild(X[Y])
            }
        }
        return aa
    }

    function H(Z, X) {
        var Y, aa;
        for (Y = 0; Z.hasChildNodes() && Y < Z.childNodes.length; Y += 1) {
            aa = Z.childNodes[Y];
            if (aa.nodeType === X) {
                Z.removeChild(aa);
                Y -= 1
            } else {
                if (aa.hasChildNodes()) {
                    H(aa, X)
                }
            }
        }
        return Z
    }

    function R(Z) {
        var Y, X = null;
        if (!Z || !Z.doctype) {
            return null
        }
        Y = Z.doctype;
        if (Y) {
            X = "<!DOCTYPE " + Y.name + (Y.publicId ? ' PUBLIC "' + Y.publicId + '"' : "") + (!Y.publicId && Y.systemId ? " SYSTEM" : "") + (Y.systemId ? ' "' + Y.systemId + '"' : "") + ">"
        }
        return X
    }

    function Q(ad, ae) {
        var ac, Z, ab, aa, Y, X;
        if (!ae) {
            return
        }
        aa = ad.getElementsByTagName("input");
        Y = ae.getElementsByTagName("input");
        if (Y) {
            for (ac = 0, X = Y.length; ac < X; ac += 1) {
                Z = aa[ac];
                ab = Y[ac];
                switch (ab.type) {
                    case "checkbox":
                    case "radio":
                        if (W.isIE ? Z.checked : ab.checked) {
                            ab.setAttribute("checked", "checked")
                        } else {
                            ab.removeAttribute("checked")
                        }
                        break;
                    default:
                        ab.setAttribute("value", ab.value);
                        if (!ab.getAttribute("type")) {
                            ab.setAttribute("type", "text")
                        }
                        break
                }
            }
        }
    }

    function k(ad, ae) {
        var aa, X, ac, Y, Z, ab;
        if (!ad || !ad.getElementsByTagName || !ae || !ae.getElementsByTagName) {
            return
        }
        Y = ad.getElementsByTagName("textarea");
        ab = ae.getElementsByTagName("textarea");
        if (Y && ab) {
            for (aa = 0, X = Y.length; aa < X; aa += 1) {
                ac = Y[aa];
                Z = ab[aa];
                Z.setAttribute("value", ac.value);
                Z.value = Z.textContent = ac.value
            }
        }
    }

    function L(X, ac) {
        var Y, ae, ad, af, aa, Z, ab;
        if (!X || !X.getElementsByTagName || !ac || !ac.getElementsByTagName) {
            return
        }
        ae = X.getElementsByTagName("select");
        af = ac.getElementsByTagName("select");
        if (ae) {
            for (aa = 0, ab = ae.length; aa < ab; aa += 1) {
                Y = ae[aa];
                ad = af[aa];
                for (Z = 0; Z < Y.options.length; Z += 1) {
                    if (Z === Y.selectedIndex || Y.options[Z].selected) {
                        ad.options[Z].setAttribute("selected", "selected")
                    } else {
                        ad.options[Z].removeAttribute("selected")
                    }
                }
            }
        }
    }

    function A(Y) {
        var X, Z = null;
        if (Y) {
            X = Y.nodeType || -1;
            switch (X) {
                case 9:
                    Z = Y.documentElement ? Y.documentElement.outerHTML : "";
                    break;
                case 1:
                    Z = Y.outerHTML;
                    break;
                default:
                    Z = null;
                    break
            }
        }
        return Z
    }

    function V(Z) {
        var X, Y = false;
        if (Z && typeof Z === "object") {
            X = Z.nodeType || -1;
            switch (X) {
                case 9:
                case 1:
                    Y = true;
                    break;
                default:
                    Y = false;
                    break
            }
        }
        return Y
    }

    function b(ae, an, Y) {
        var ah, ag, ai, ao, af = ["iframe", "frame"],
            am, Z, ac, al, aa, ak, ab = {
                frames: []
            },
            ap, ad, X;
        for (ag = 0; ag < af.length; ag += 1) {
            ao = af[ag];
            ap = ae.getElementsByTagName(ao);
            ad = an.getElementsByTagName(ao);
            if (ap) {
                for (ah = 0, ai = ap.length; ah < ai; ah += 1) {
                    try {
                        am = ap[ah];
                        Z = W.getIFrameWindow(am);
                        if (Z && Z.document && Z.location.href !== "about:blank") {
                            ac = Z.document;
                            al = r(ac, ac, "", Y);
                            aa = m();
                            ad[ah].setAttribute("tltid", aa);
                            al.tltid = aa;
                            X = W.getOriginAndPath(ac.location);
                            al.host = X.origin;
                            al.url = X.path;
                            al.charset = ac.characterSet || ac.charset;
                            ak = ad[ah].getAttribute("src");
                            if (!ak) {
                                ak = Z.location.href;
                                ad[ah].setAttribute("src", ak)
                            }
                            ab.frames = ab.frames.concat(al.frames);
                            delete al.frames;
                            ab.frames.push(al)
                        }
                    } catch (aj) {}
                }
            }
        }
        return ab
    }

    function U(ad) {
        var ab, Z, X, aa, Y, ac, ae = 0;
        if (!ad) {
            return ae
        }
        if (ad.root) {
            ae += ad.root.length;
            if (ad.frames) {
                for (ab = 0, X = ad.frames.length; ab < X; ab += 1) {
                    if (ad.frames[ab].root) {
                        ae += ad.frames[ab].root.length
                    }
                }
            }
        } else {
            if (ad.diffs) {
                for (ab = 0, X = ad.diffs.length; ab < X; ab += 1) {
                    ac = ad.diffs[ab];
                    ae += ac.xpath.length;
                    if (ac.root) {
                        ae += ac.root.length
                    } else {
                        if (ac.attributes) {
                            for (Z = 0, aa = ac.attributes.length; Z < aa; Z += 1) {
                                Y = ac.attributes[Z];
                                ae += Y.name.length;
                                if (Y.value) {
                                    ae += Y.value.length
                                }
                            }
                        }
                    }
                }
            }
        }
        return ae
    }

    function M() {
        var aa, Z, X, Y;
        for (aa = 0, X = T.length; aa < X && t.length; aa += 1) {
            Y = T[aa];
            for (Z = 0; Z < t.length; Z += 1) {
                if (t[Z].containedIn(Y)) {
                    t.splice(Z, 1);
                    Z -= 1
                }
            }
        }
    }

    function n(Z, Y) {
        var aa, X;
        aa = r(Z, Z, null, Y);
        if (!aa) {
            aa = {}
        }
        aa.charset = Z.characterSet || Z.charset;
        X = W.getOriginAndPath(Z.location);
        aa.host = X.origin;
        aa.url = X.path;
        return aa
    }

    function G(Z) {
        var ab, X, aa = {
                fullDOM: false,
                diffs: [],
                attributeDiffs: {}
            },
            ae, ad, Y;
        O(T);
        M();
        for (ab = 0, X = T.length; ab < X; ab += 1) {
            Y = T[ab];
            ad = i.getNodeFromID(Y.xpath, -2);
            if (ad === window.document.body) {
                return n(window.document, Z)
            }
            ae = r(window.document, ad, Y, Z);
            ae.xpath = Y.xpath;
            aa.diffs.push(ae)
        }

        function ac(ag, af) {
            if (!ag || !ag.name) {
                return
            }
            aa.attributeDiffs[ae.xpath][ag.name] = {
                value: ag.value
            }
        }
        for (ab = 0, X = t.length; ab < X; ab += 1) {
            Y = t[ab];
            ae = {
                xpath: d(Y.attributes, "id") ? Y.fullXpath : Y.xpath,
                attributes: p(Y.attributes)
            };
            aa.diffs.push(ae);
            aa.attributeDiffs[ae.xpath] = {};
            W.forEach(ae.attributes, ac)
        }
        return aa
    }
    q = function(X) {
        var Y = null;
        if (V(X)) {
            Y = X.cloneNode(true);
            if (!Y && X.documentElement) {
                Y = X.documentElement.cloneNode(true)
            }
        }
        return Y
    };
    r = function(ae, ad, ab, af) {
        var X, Y, aa = {},
            ac, Z;
        if (!ae || !ad) {
            return aa
        }
        X = q(ad, ae);
        if (!X) {
            return aa
        }
        if (!!af.removeScripts) {
            f(X, "script");
            f(X, "noscript")
        }
        if (!!af.removeComments) {
            H(X, 8)
        }
        L(ad, X);
        Q(ad, X);
        k(ad, X);
        X = u.applyPrivacyToNode(X, ab, ae);
        if (!!af.captureFrames) {
            Y = b(ad, X, af)
        }
        if (Y) {
            aa = W.mixin(aa, Y)
        }
        ac = (R(ad) || "") + A(X);
        aa.root = u.applyPrivacyPatterns(ac);
        return aa
    };
    z = function() {
        h = x.getService("config");
        j(h.getServiceConfig("domCapture") || {})
    };
    return {
        init: function() {
            h = x.getService("config");
            if (!K) {
                j(h.getServiceConfig("domCapture") || {})
            } else {}
        },
        destroy: function() {
            N()
        },
        observeWindow: function(Z) {
            var Y, X;
            if (!Z) {
                return
            }
            if (!W.getValue(g, "options.captureFrames", false) && !(Z === window)) {
                return
            }
            if (W.indexOf(J, Z) === -1) {
                J.push(Z)
            }
        },
        captureDOM: function(Y, Z) {
            var aa, X, ad = null,
                ab, ae = 0;
            if (!K || W.isLegacyIE) {
                return ad
            }
            Z = W.mixin({}, g.options, Z);
            Y = Y || window.document;
            if (!o || !a || c || Z.forceFullDOM) {
                if (v) {
                    v.disconnect()
                }
                ad = n(Y, Z);
                ad.fullDOM = true;
                ad.forced = !!(c || Z.forceFullDOM);
                o = true;
                if (v) {
                    for (aa = 0, X = J.length; aa < X; aa += 1) {
                        ab = J[aa];
                        try {
                            v.observe(ab.document, E)
                        } catch (ac) {
                            J.splice(aa, 1);
                            X = J.length;
                            aa -= 1
                        }
                    }
                }
            } else {
                ad = G(Z);
                ad.fullDOM = ad.diffs ? false : true
            }
            if (a) {
                ad.mutationCount = w
            }
            D();
            if (Z.maxLength) {
                ae = U(ad);
                if (ae > Z.maxLength) {
                    ad = {
                        errorCode: 101,
                        error: "Captured length (" + ae + ") exceeded limit (" + Z.maxLength + ")."
                    }
                }
            }
            return ad
        }
    }
});
TLT.addService("encoder", function(a) {
    var f = {},
        g = null,
        b = null,
        d = false;

    function e(j) {
        var i = null;
        if (!j) {
            return i
        }
        i = f[j];
        if (i && typeof i.encode === "string") {
            i.encode = a.utils.access(i.encode)
        }
        return i
    }

    function h(i) {
        f = i;
        g.subscribe("configupdated", b);
        d = true
    }

    function c() {
        g.unsubscribe("configupdated", b);
        d = false
    }
    b = function() {
        g = a.getService("config");
        h(g.getServiceConfig("encoder") || {})
    };
    return {
        init: function() {
            g = a.getService("config");
            if (!d) {
                h(g.getServiceConfig("encoder") || {})
            } else {}
        },
        destroy: function() {
            c()
        },
        encode: function(m, l) {
            var k, i, j = {
                data: null,
                encoding: null,
                error: null
            };
            if ((typeof m !== "string" && !m) || !l) {
                j.error = "Invalid " + (!m ? "data" : "type") + " parameter.";
                return j
            }
            k = e(l);
            if (!k) {
                j.error = "Specified encoder (" + l + ") not found.";
                return j
            }
            if (typeof k.encode !== "function") {
                j.error = "Configured encoder (" + l + ") encode method is not a function.";
                return j
            }
            try {
                i = k.encode(m)
            } catch (n) {
                j.error = "Encoding failed: " + (n.name ? n.name + " - " : "") + n.message;
                return j
            }
            if (!i || a.utils.getValue(i, "buffer", null) === null) {
                j.error = "Encoder (" + l + ") returned an invalid result.";
                return j
            }
            j.data = i.buffer;
            j.encoding = k.defaultEncoding;
            return j
        }
    }
});
TLT.addService("message", function(x) {
    var Q = x.utils,
        q = 0,
        t = 0,
        I = 0,
        j = 0,
        r = new Date(),
        i = x.getService("browserBase"),
        b = x.getService("browser"),
        h = x.getService("config"),
        B = h.getServiceConfig("message") || {},
        m = window.location.href,
        N = window.location.hostname,
        R = B.hasOwnProperty("privacy") ? B.privacy : [],
        c, F = {},
        O = {
            lower: "x",
            upper: "X",
            numeric: "9",
            symbol: "@"
        },
        w = Q.isiOS,
        s = navigator.userAgent.indexOf("Chrome") > -1 && Q.isAndroid,
        f = window.devicePixelRatio || 1,
        g = window.screen || {},
        a = g.width || 0,
        z = g.height || 0,
        P = i.getNormalizedOrientation(),
        k = !w ? a : Math.abs(P) === 90 ? z : a,
        D = !w ? z : Math.abs(P) === 90 ? a : z,
        L = (window.screen ? window.screen.height - window.screen.availHeight : 0),
        K = window.innerWidth || document.documentElement.clientWidth,
        n = window.innerHeight || document.documentElement.clientHeight,
        H = false;

    function e(T) {
        var S = "",
            U = T.timestamp || (new Date()).getTime();
        delete T.timestamp;
        this.type = T.type;
        this.offset = U - r.getTime();
        this.screenviewOffset = 0;
        if (T.type === 2) {
            q = t;
            t = U;
            if (T.screenview.type === "UNLOAD") {
                this.screenviewOffset = U - (q || r.getTime())
            }
        } else {
            if (t) {
                this.screenviewOffset = U - t
            }
        }
        if (!this.type) {
            return
        }
        this.count = (j += 1);
        this.fromWeb = true;
        for (S in T) {
            if (T.hasOwnProperty(S)) {
                this[S] = T[S]
            }
        }
    }
    F.PVC_MASK_EMPTY = function(S) {
        return ""
    };
    F.PVC_MASK_BASIC = function(T) {
        var S = "XXXXX";
        if (typeof T !== "string") {
            return ""
        }
        return (T.length ? S : "")
    };
    F.PVC_MASK_TYPE = function(W) {
        var T, V = 0,
            S = 0,
            U = "";
        if (typeof W !== "string") {
            return U
        }
        T = W.split("");
        for (V = 0, S = T.length; V < S; V += 1) {
            if (Q.isNumeric(T[V])) {
                U += O.numeric
            } else {
                if (Q.isUpperCase(T[V])) {
                    U += O.upper
                } else {
                    if (Q.isLowerCase(T[V])) {
                        U += O.lower
                    } else {
                        U += O.symbol
                    }
                }
            }
        }
        return U
    };
    F.PVC_MASK_EMPTY.maskType = 1;
    F.PVC_MASK_BASIC.maskType = 2;
    F.PVC_MASK_TYPE.maskType = 3;
    F.PVC_MASK_CUSTOM = {
        maskType: 4
    };

    function d(S, U) {
        var T = F.PVC_MASK_BASIC;
        if (typeof U !== "string") {
            return U
        }
        if (!S) {
            T = F.PVC_MASK_BASIC
        } else {
            if (S.maskType === F.PVC_MASK_EMPTY.maskType) {
                T = F.PVC_MASK_EMPTY
            } else {
                if (S.maskType === F.PVC_MASK_BASIC.maskType) {
                    T = F.PVC_MASK_BASIC
                } else {
                    if (S.maskType === F.PVC_MASK_TYPE.maskType) {
                        T = F.PVC_MASK_TYPE
                    } else {
                        if (S.maskType === F.PVC_MASK_CUSTOM.maskType) {
                            if (typeof S.maskFunction === "string") {
                                T = Q.access(S.maskFunction)
                            } else {
                                T = S.maskFunction
                            }
                            if (typeof T !== "function") {
                                T = F.PVC_MASK_BASIC
                            }
                        }
                    }
                }
            }
        }
        return T(U)
    }

    function C(S, T) {
        var U;
        if (!S || !T) {
            return
        }
        for (U in T) {
            if (T.hasOwnProperty(U)) {
                if (U === "value") {
                    T[U] = d(S, T[U])
                } else {
                    delete T[U]
                }
            }
        }
    }

    function M(S, T) {
        return (Q.matchTarget(S, T) !== -1)
    }

    function G(X) {
        var T, S, U, W, V;
        if (!X) {
            return ""
        }
        for (T = 0, S = c.length; T < S; T += 1) {
            V = c[T];
            V.cRegex.lastIndex = 0;
            X = X.replace(V.cRegex, V.replacement)
        }
        return X
    }

    function E(Z) {
        var W, S, V, T, Y = false,
            X, U;
        if (!Z || (!Z.currState && !Z.prevState)) {
            return Z
        }
        X = Z.prevState;
        U = Z.currState;
        for (W = 0, S = R.length; W < S; W += 1) {
            T = R[W];
            V = Q.getValue(T, "exclude", false);
            if (M(T.targets, Z) !== V) {
                C(T, X);
                C(T, U);
                Y = true;
                break
            }
        }
        if (!Y) {
            if (X && X.value) {
                X.value = G(X.value)
            }
            if (U && U.value) {
                U.value = G(U.value)
            }
        }
        return Z
    }

    function o(S) {
        if (!S || !S.target) {
            return S
        }
        E(S.target);
        return S
    }

    function l(V, T) {
        var U, S, X, W;
        if (!T || !V) {
            return
        }
        if (V.value) {
            X = d(T, V.value);
            V.setAttribute("value", X);
            V.value = X
        }
        if (V.checked) {
            V.removeAttribute("checked")
        }
        if (Q.getTagName(V) === "select") {
            V.selectedIndex = -1;
            for (U = 0, S = V.options.length; U < S; U += 1) {
                W = V.options[U];
                W.removeAttribute("selected");
                W.selected = false
            }
        } else {
            if (Q.getTagName(V) === "textarea") {
                V.textContent = V.value
            }
        }
    }

    function v(ae, ab, af, ak, X, aa) {
        var ag, ad, ac, ah, U, V, Z = [],
            ai, S, Y, W, aj, T;
        if (!ae.length && !X.length && !aa) {
            return []
        }
        T = b.queryAll("input, select, textarea", ab);
        if (!T || !T.length) {
            return []
        }
        for (ag = 0, ah = X.length; ag < ah; ag += 1) {
            ad = T.indexOf(X[ag]);
            if (ad !== -1) {
                T.splice(ad, 1)
            }
        }
        if (ae.length) {
            for (ag = 0, ah = T.length, Z = []; ag < ah; ag += 1) {
                if (T[ag].value) {
                    V = i.ElementData.prototype.examineID(T[ag]);
                    if (V.idType === -2) {
                        ai = new i.Xpath(T[ag]);
                        ai.applyPrefix(af);
                        V.id = ai.xpath
                    }
                    Z.push({
                        id: V.id,
                        idType: V.idType,
                        element: T[ag]
                    })
                }
            }
        }
        for (ag = 0, ah = ae.length; ag < ah; ag += 1) {
            W = R[ae[ag].ruleIndex];
            S = Q.getValue(W, "exclude", false);
            aj = W.targets[ae[ag].targetIndex];
            if (typeof aj.id === "string" && aj.idType === -2) {
                for (ad = 0; ad < Z.length; ad += 1) {
                    if (Z[ad].idType === aj.idType && Z[ad].id === aj.id) {
                        if (!S) {
                            U = Z[ad].element;
                            l(U, W)
                        } else {
                            ac = T.indexOf(U);
                            T.splice(ac, 1)
                        }
                    }
                }
            } else {
                for (ad = 0; ad < Z.length; ad += 1) {
                    aj.cRegex.lastIndex = 0;
                    if (Z[ad].idType === aj.idType && aj.cRegex.test(Z[ad].id)) {
                        U = Z[ad].element;
                        if (!S) {
                            l(U, W)
                        } else {
                            ac = T.indexOf(U);
                            T.splice(ac, 1)
                        }
                    }
                }
            }
        }
        if (aa) {
            for (ag = 0, ah = T.length; ag < ah; ag += 1) {
                l(T[ag], aa)
            }
        }
    }

    function p(Z, ae, ak) {
        var af, ab, aa, U, S, V = [],
            Y, ag, ac, W, T, ah, ad = [],
            aj, ai, X;
        if (!Z || !ak) {
            return null
        }
        for (af = 0, ag = R.length; af < ag; af += 1) {
            ac = R[af];
            S = Q.getValue(ac, "exclude", false);
            if (S) {
                Y = ac
            }
            ai = ac.targets;
            for (ab = 0, X = ai.length; ab < X; ab += 1) {
                aj = ai[ab];
                if (typeof aj === "string") {
                    T = b.queryAll(aj, Z);
                    if (!S) {
                        for (aa = 0, ah = T.length; aa < ah; aa += 1) {
                            U = T[aa];
                            l(U, ac)
                        }
                    } else {
                        V = V.concat(T)
                    }
                } else {
                    if (typeof aj.id === "string") {
                        switch (aj.idType) {
                            case -1:
                            case -3:
                                U = i.getNodeFromID(aj.id, aj.idType, Z);
                                if (!S) {
                                    l(U, ac)
                                } else {
                                    V.push(U)
                                }
                                break;
                            case -2:
                                ad.push({
                                    ruleIndex: af,
                                    targetIndex: ab,
                                    exclude: S
                                });
                                break;
                            default:
                                break
                        }
                    } else {
                        ad.push({
                            ruleIndex: af,
                            targetIndex: ab,
                            exclude: S
                        })
                    }
                }
            }
        }
        v(ad, Z, ae, ak, V, Y);
        return Z
    }

    function u(W) {
        var U, S, T, V = false;
        if (!W) {
            return V
        }
        for (U = 0, S = R.length; U < S; U += 1) {
            T = R[U];
            if (M(T.targets, W)) {
                V = true;
                break
            }
        }
        return V
    }

    function y() {
        var V, U, S, Y, Z, X, T, W;
        h = x.getService("config");
        B = h.getServiceConfig("message") || {};
        R = B.privacy || [];
        c = B.privacyPatterns || [];
        for (V = 0, Z = R.length; V < Z; V += 1) {
            Y = R[V];
            T = Y.targets;
            for (U = 0, W = T.length; U < W; U += 1) {
                X = T[U];
                if (typeof X === "object") {
                    if (typeof X.idType === "string") {
                        X.idType = +X.idType
                    }
                    if (typeof X.id === "object") {
                        X.cRegex = new RegExp(X.id.regex, X.id.flags)
                    }
                }
            }
        }
        for (S = c.length, V = S - 1; V >= 0; V -= 1) {
            Y = c[V];
            if (typeof Y.pattern === "object") {
                Y.cRegex = new RegExp(Y.pattern.regex, Y.pattern.flags)
            } else {
                c.splice(V, 1)
            }
        }
    }

    function A() {
        if (h.subscribe) {
            h.subscribe("configupdated", y)
        }
        y();
        H = true
    }

    function J() {
        h.unsubscribe("configupdated", y);
        H = false
    }
    return {
        init: function() {
            if (!H) {
                A()
            } else {}
        },
        destroy: function() {
            J()
        },
        applyPrivacyToNode: p,
        applyPrivacyToMessage: o,
        applyPrivacyToTarget: E,
        applyPrivacyPatterns: G,
        isPrivacyMatched: u,
        createMessage: function(S) {
            if (typeof S.type === "undefined") {
                throw new TypeError("Invalid queueEvent given!")
            }
            return o(new e(S))
        },
        wrapMessages: function(T) {
            var S = {
                    messageVersion: "9.0.0.0",
                    serialNumber: (I += 1),
                    sessions: [{
                        id: x.getPageId(),
                        startTime: r.getTime(),
                        timezoneOffset: r.getTimezoneOffset(),
                        messages: T,
                        clientEnvironment: {
                            webEnvironment: {
                                libVersion: "5.4.0.1805",
                                domain: N,
                                page: m,
                                referrer: document.referrer,
                                screen: {
                                    devicePixelRatio: f,
                                    deviceWidth: k,
                                    deviceHeight: D,
                                    deviceToolbarHeight: L,
                                    width: K,
                                    height: n,
                                    orientation: P
                                }
                            }
                        }
                    }]
                },
                U = S.sessions[0].clientEnvironment.webEnvironment.screen;
            U.orientationMode = Q.getOrientationMode(U.orientation);
            return S
        }
    }
});
TLT.addService("serializer", function(core) {
    function serializeToJSON(obj) {
        var str, key, len = 0;
        if (typeof obj !== "object" || obj === null) {
            switch (typeof obj) {
                case "function":
                case "undefined":
                    return "null";
                case "string":
                    return '"' + obj.replace(/\"/g, '\\"') + '"';
                default:
                    return String(obj)
            }
        } else {
            if (Object.prototype.toString.call(obj) === "[object Array]") {
                str = "[";
                for (key = 0, len = obj.length; key < len; key += 1) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        str += serializeToJSON(obj[key]) + ","
                    }
                }
            } else {
                str = "{";
                for (key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        str = str.concat('"', key, '":', serializeToJSON(obj[key]), ",");
                        len += 1
                    }
                }
            }
        }
        if (len > 0) {
            str = str.substring(0, str.length - 1)
        }
        str += String.fromCharCode(str.charCodeAt(0) + 2);
        return str
    }
    var configService = core.getService("config"),
        serialize = {},
        parse = {},
        defaultSerializers = {
            json: (function() {
                if (typeof window.JSON !== "undefined") {
                    return {
                        serialize: window.JSON.stringify,
                        parse: window.JSON.parse
                    }
                }
                return {
                    serialize: serializeToJSON,
                    parse: function(data) {
                        return eval("(" + data + ")")
                    }
                }
            }())
        },
        updateConfig = null,
        isInitialized = false;

    function addObjectIfExist(paths, rootObj, propertyName) {
        var i, len, obj;
        paths = paths || [];
        for (i = 0, len = paths.length; i < len; i += 1) {
            obj = paths[i];
            if (typeof obj === "string") {
                obj = core.utils.access(obj)
            }
            if (typeof obj === "function") {
                rootObj[propertyName] = obj;
                break
            }
        }
    }

    function checkParserAndSerializer() {
        var isParserAndSerializerInvalid;
        if (typeof serialize.json !== "function" || typeof parse.json !== "function") {
            isParserAndSerializerInvalid = true
        } else {
            if (typeof parse.json('{"foo": "bar"}') === "undefined") {
                isParserAndSerializerInvalid = true
            } else {
                isParserAndSerializerInvalid = parse.json('{"foo": "bar"}').foo !== "bar"
            }
            if (typeof parse.json("[1, 2]") === "undefined") {
                isParserAndSerializerInvalid = true
            } else {
                isParserAndSerializerInvalid = isParserAndSerializerInvalid || parse.json("[1, 2]")[0] !== 1;
                isParserAndSerializerInvalid = isParserAndSerializerInvalid || parse.json("[1,2]")[1] !== 2
            }
            isParserAndSerializerInvalid = isParserAndSerializerInvalid || serialize.json({
                foo: "bar"
            }) !== '{"foo":"bar"}';
            isParserAndSerializerInvalid = isParserAndSerializerInvalid || serialize.json([1, 2]) !== "[1,2]"
        }
        return isParserAndSerializerInvalid
    }

    function initSerializerService(config) {
        var format;
        for (format in config) {
            if (config.hasOwnProperty(format)) {
                addObjectIfExist(config[format].stringifiers, serialize, format);
                addObjectIfExist(config[format].parsers, parse, format)
            }
        }
        if (!(config.json && config.json.hasOwnProperty("defaultToBuiltin")) || config.json.defaultToBuiltin === true) {
            serialize.json = serialize.json || defaultSerializers.json.serialize;
            parse.json = parse.json || defaultSerializers.json.parse
        }
        if (typeof serialize.json !== "function" || typeof parse.json !== "function") {
            core.fail("JSON parser and/or serializer not provided in the UIC config. Can't continue.")
        }
        if (checkParserAndSerializer()) {
            core.fail("JSON stringification and parsing are not working as expected")
        }
        if (configService) {
            configService.subscribe("configupdated", updateConfig)
        }
        isInitialized = true
    }

    function destroy() {
        serialize = {};
        parse = {};
        if (configService) {
            configService.unsubscribe("configupdated", updateConfig)
        }
        isInitialized = false
    }
    updateConfig = function() {
        configService = core.getService("config");
        initSerializerService(configService.getServiceConfig("serializer"))
    };
    return {
        init: function() {
            var ssConfig;
            if (!isInitialized) {
                ssConfig = configService ? configService.getServiceConfig("serializer") : {};
                initSerializerService(ssConfig)
            } else {}
        },
        destroy: function() {
            destroy()
        },
        parse: function(data, type) {
            type = type || "json";
            return parse[type](data)
        },
        serialize: function(data, type) {
            var serializedData;
            type = type || "json";
            serializedData = serialize[type](data);
            return serializedData
        }
    }
});
TLT.addModule("TLCookie", function(d) {
    var i = {},
        g = "WCXSID",
        k = "TLTSID",
        a = "CoreID6",
        o, m, c = null,
        h = 1800,
        n, f, p = d.utils;

    function l() {
        var s = "123456789",
            t = o || (p.getRandomString(1, s) + p.getRandomString(27, s + "0"));
        p.setCookie(k, "0000" + t);
        return p.getCookieValue(k)
    }

    function b() {
        var s = "123456789",
            t = o || (p.getRandomString(1, s) + p.getRandomString(27, s + "0"));
        p.setCookie(g, t, h);
        return p.getCookieValue(g)
    }

    function j() {
        if (!window.cmRetrieveUserID) {
            return
        }
        window.cmRetrieveUserID(function(s) {
            c = s
        })
    }

    function e(s) {
        var t = [];
        if (s.tlAppKey) {
            n = s.tlAppKey;
            t.push({
                name: "X-Tealeaf-SaaS-AppKey",
                value: n
            })
        }
        if (s.wcxCookieName) {
            g = s.wcxCookieName
        }
        if (s.wcxCookieAge) {
            h = s.wcxCookieAge
        }
        o = p.getCookieValue(g);
        if (!o) {
            o = b()
        }
        t.push({
            name: "X-WCXSID",
            value: o
        });
        if (s.sessionizationCookieName) {
            k = s.sessionizationCookieName
        }
        m = p.getCookieValue(k);
        if (!m) {
            m = l()
        }
        t.push({
            name: "X-Tealeaf-SaaS-TLTSID",
            value: m
        });
        if (t.length) {
            TLT.registerBridgeCallbacks([{
                enabled: true,
                cbType: "addRequestHeaders",
                cbFunction: function() {
                    return t
                }
            }])
        }
    }

    function q(x) {
        var u, t, s = false,
            w, v = i.appCookieWhitelist;
        if (!v || !v.length) {
            return s
        }
        for (u = 0, t = v.length; u < t && !s; u += 1) {
            w = v[u];
            if (w.regex) {
                if (!w.cRegex) {
                    w.cRegex = new RegExp(w.regex, w.flags)
                }
                w.cRegex.lastIndex = 0;
                s = w.cRegex.test(x)
            } else {
                s = (w === x)
            }
        }
        return s
    }

    function r() {
        var w, v, x, y = {},
            t, A = document.cookie,
            u = [],
            z = "",
            s = "";
        if (!A) {
            return
        }
        u = A.split("; ");
        for (w = 0, x = u.length; w < x; w += 1) {
            t = u[w];
            v = t.indexOf("=");
            if (v >= 0) {
                z = decodeURIComponent(t.substr(0, v))
            }
            s = t.substr(v + 1);
            if (q(z)) {
                y[z] = decodeURIComponent(s)
            }
        }
        if (c && !y[a]) {
            y[a] = c
        }
        d.post({
            type: 14,
            cookies: y
        })
    }
    return {
        init: function() {
            i = d.getConfig() || {};
            e(i);
            j()
        },
        destroy: function() {},
        onevent: function(s) {
            switch (s.type) {
                case "screenview_load":
                    if (p.getValue(i, "appCookieWhitelist.length", 0)) {
                        j();
                        r()
                    }
                    break;
                case "screenview_unload":
                    b();
                    break;
                default:
                    break
            }
        }
    }
});
if (TLT && typeof TLT.addModule === "function") {
    TLT.addModule("overstat", function(e) {
        var A = e.utils,
            p = {},
            C = {
                updateInterval: 250,
                hoverThresholdMin: 1000,
                hoverThresholdMax: 2 * 60 * 1000,
                gridCellMaxX: 10,
                gridCellMaxY: 10,
                gridCellMinWidth: 20,
                gridCellMinHeight: 20
            },
            d = 50;

        function y(H) {
            var I = e.getConfig() || {},
                J = I[H];
            return typeof J === "number" ? J : C[H]
        }

        function G(N, H) {
            var M = A.getValue(N, "webEvent.target", {}),
                I = A.getValue(M, "element.tagName") || "",
                J = I.toLowerCase() === "input" ? A.getValue(M, "element.type") : "",
                L = A.getTlType(M),
                K = {
                    type: 9,
                    event: {
                        hoverDuration: N.hoverDuration,
                        hoverToClick: A.getValue(H, "hoverToClick")
                    },
                    target: {
                        id: M.id || "",
                        idType: M.idType || "",
                        name: M.name || "",
                        tlType: L,
                        type: I,
                        subType: J,
                        position: {
                            width: A.getValue(M, "element.offsetWidth", 0),
                            height: A.getValue(M, "element.offsetHeight", 0),
                            relXY: N.relXY
                        }
                    }
                };
            if ((typeof K.target.id) === undefined || K.target.id === "") {
                return
            }
            e.post(K)
        }

        function i(H) {
            if (H && !H.nodeType && H.element) {
                H = H.element
            }
            return H
        }

        function s(H) {
            H = i(H);
            return !H || H === document.body || H === document.html || H === document
        }

        function j(H) {
            H = i(H);
            if (!H) {
                return null
            }
            return H.parentNode
        }

        function n(H) {
            H = i(H);
            if (!H) {
                return null
            }
            return H.offsetParent || H.parentElement || j(H)
        }

        function w(I, J) {
            var H = 0;
            if (!J || J === I) {
                return false
            }
            J = j(J);
            while (!s(J) && H++ < d) {
                if (J === I) {
                    return true
                }
                J = j(J)
            }
            if (H >= d) {
                A.clog("Overstat isChildOf() hit iterations limit")
            }
            return false
        }

        function E(H) {
            if (H.nativeEvent) {
                H = H.nativeEvent
            }
            return H
        }

        function z(H) {
            return E(H).target
        }

        function h(H) {
            H = i(H);
            if (!H) {
                return -1
            }
            return H.nodeType || -1
        }

        function D(H) {
            H = i(H);
            if (!H) {
                return ""
            }
            return H.tagName ? H.tagName.toUpperCase() : ""
        }

        function t(H) {
            if (!H) {
                return
            }
            if (H.nativeEvent) {
                H = H.nativeEvent
            }
            if (H.stopPropagation) {
                H.stopPropagation()
            } else {
                if (H.cancelBubble) {
                    H.cancelBubble()
                }
            }
        }

        function m(I) {
            var H = D(I);
            return h(I) !== 1 || H === "TR" || H === "TBODY" || H === "THEAD"
        }

        function g(H) {
            if (!H) {
                return ""
            }
            if (H.xPath) {
                return H.xPath
            }
            H = i(H);
            return e.getXPathFromNode(H)
        }

        function B(I, H) {
            var J = p[I];
            if (J && J[H]) {
                return J[H]()
            }
        }

        function v(I, K, J, H) {
            this.xPath = I !== null ? g(I) : "";
            this.domNode = I;
            this.hoverDuration = 0;
            this.hoverUpdateTime = 0;
            this.gridX = Math.max(K, 0);
            this.gridY = Math.max(J, 0);
            this.parentKey = "";
            this.updateTimer = -1;
            this.disposed = false;
            this.childKeys = {};
            this.webEvent = H;
            this.getKey = function() {
                return this.xPath + ":" + this.gridX + "," + this.gridY
            };
            this.update = function() {
                var M = new Date().getTime(),
                    L = this.getKey();
                if (this.hoverUpdateTime !== 0) {
                    this.hoverDuration += M - this.hoverUpdateTime
                }
                this.hoverUpdateTime = M;
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(function() {
                    B(L, "update")
                }, y("updateInterval"))
            };
            this.dispose = function(L) {
                clearTimeout(this.updateTimer);
                delete p[this.getKey()];
                this.disposed = true;
                if (L) {
                    var M = this.clone();
                    p[M.getKey()] = M;
                    M.update()
                }
            };
            this.process = function(P) {
                clearTimeout(this.updateTimer);
                if (this.disposed) {
                    return false
                }
                var N = false,
                    O = this,
                    M = null,
                    L = 0;
                if (this.hoverDuration >= y("hoverThresholdMin")) {
                    this.hoverDuration = Math.min(this.hoverDuration, y("hoverThresholdMax"));
                    N = true;
                    G(this, {
                        hoverToClick: !!P
                    });
                    while (typeof O !== "undefined" && L++ < d) {
                        O.dispose(P);
                        O = p[O.parentKey]
                    }
                    if (L >= d) {
                        A.clog("Overstat process() hit iterations limit")
                    }
                } else {
                    this.dispose(P)
                }
                return N
            };
            this.clone = function() {
                var L = new v(this.domNode, this.gridX, this.gridY);
                L.parentKey = this.parentKey;
                return L
            }
        }

        function F(J, H, K, I) {
            return new v(J, H, K, I)
        }

        function r(J) {
            if (J && J.position) {
                return {
                    x: J.position.x,
                    y: J.position.y
                }
            }
            J = i(J);
            var H = J && J.getBoundingClientRect ? J.getBoundingClientRect() : null,
                N = H ? H.left : (J ? J.offsetLeft : 0),
                M = H ? H.top : (J ? J.offsetHeight : 0),
                P = N,
                O = M,
                K = 0,
                I = 0,
                L = n(J),
                Q = 0;
            while (L && Q++ < d) {
                if (s(L)) {
                    break
                }
                K = L.offsetLeft - (L.scrollLeft || 0);
                I = L.offsetTop - (L.scrollTop || 0);
                if (K !== P || I !== O) {
                    N += K;
                    M += I;
                    P = K;
                    O = I
                }
                L = n(L)
            }
            if (Q >= d) {
                A.clog("Overstat calculateNodeOffset() hit iterations limit")
            }
            if (isNaN(N)) {
                N = 0
            }
            if (isNaN(M)) {
                M = 0
            }
            return {
                x: N,
                y: M
            }
        }

        function a(L, J, I) {
            L = i(L);
            var K = r(L),
                H = J - K.x,
                M = I - K.y;
            if (!isFinite(H)) {
                H = 0
            }
            if (!isFinite(M)) {
                M = 0
            }
            return {
                x: H,
                y: M
            }
        }

        function f(L, O, N) {
            L = i(L);
            var J = L.getBoundingClientRect ? L.getBoundingClientRect() : null,
                T = J ? J.width : L.offsetWidth,
                K = J ? J.height : L.offsetHeight,
                M = T && T > 0 ? Math.max(T / y("gridCellMaxX"), y("gridCellMinWidth")) : y("gridCellMinWidth"),
                Q = K && K > 0 ? Math.max(K / y("gridCellMaxY"), y("gridCellMinHeight")) : y("gridCellMinHeight"),
                I = Math.floor(O / M),
                H = Math.floor(N / Q),
                S = T > 0 ? O / T : 0,
                P = K > 0 ? N / K : 0,
                R = "";
            if (!isFinite(I)) {
                I = 0
            }
            if (!isFinite(H)) {
                H = 0
            }
            R = x(S, P);
            return {
                x: I,
                y: H,
                relXY: R
            }
        }

        function x(H, I) {
            H = Math.floor(Math.min(Math.max(H, 0), 1) * 100) / 100;
            I = Math.floor(Math.min(Math.max(I, 0), 1) * 100) / 100;
            return H + "," + I
        }

        function c(M) {
            var N = M,
                O = M.getKey(),
                I = {},
                J = null,
                L = null,
                K = false,
                H = 0;
            I[O] = true;
            while (typeof N !== "undefined" && H++ < d) {
                I[N.parentKey] = true;
                if (N.parentKey === "" || N.parentKey === N.getKey()) {
                    break
                }
                if (H >= d) {
                    A.clog("Overstat cleanupHoverEvents() hit iterations limit")
                }
                N = p[N.parentKey]
            }
            for (J in p) {
                if (p.hasOwnProperty(J) && !I[J]) {
                    N = p[J];
                    if (N) {
                        if (!K) {
                            K = N.process()
                        } else {
                            N.dispose()
                        }
                    }
                }
            }
        }

        function u(I, K) {
            var L = null,
                H = null,
                J = false;
            for (H in p) {
                if (p.hasOwnProperty(H)) {
                    L = p[H];
                    if (L && L.domNode === I && L.getKey() !== K) {
                        if (!J) {
                            J = L.process()
                        } else {
                            L.dispose()
                        }
                    }
                }
            }
        }

        function b(L, J, K) {
            if (!J) {
                J = L.target
            }
            if (s(J)) {
                return null
            }
            if (A.isiOS || A.isAndroid) {
                return null
            }
            var H, Q, M, P, N, O, I;
            if (!m(J)) {
                H = a(J, L.position.x, L.position.y);
                Q = f(J, H.x, H.y);
                M = new v(J, Q.x, Q.y, L);
                M.relXY = Q.relXY;
                P = M.getKey();
                if (p[P]) {
                    M = p[P]
                } else {
                    p[P] = M
                }
                M.update();
                if (!K) {
                    I = n(J);
                    if (I) {
                        O = b(L, I, true);
                        if (O !== null) {
                            N = O.getKey();
                            P = M.getKey();
                            if (P !== N) {
                                M.parentKey = N
                            }
                        }
                    }
                    c(M)
                }
            } else {
                M = b(L, n(J), K)
            }
            return M
        }

        function q(H) {
            H = E(H);
            if (w(H.target, H.relatedTarget)) {
                return
            }
            u(H.target)
        }

        function l(J) {
            var K = null,
                H = null,
                I = false;
            for (H in p) {
                if (p.hasOwnProperty(H)) {
                    K = p[H];
                    if (K) {
                        if (!I) {
                            I = K.process(true)
                        } else {
                            K.dispose()
                        }
                    }
                }
            }
        }

        function o(H) {
            e.performFormCompletion(true)
        }

        function k(I) {
            var H = A.getValue(I, "target.id");
            if (!H) {
                return
            }
            switch (I.type) {
                case "mousemove":
                    b(I);
                    break;
                case "mouseout":
                    q(I);
                    break;
                case "click":
                    l(I);
                    break;
                case "submit":
                    o(I);
                    break;
                default:
                    break
            }
        }
        return {
            init: function() {},
            destroy: function() {
                var I, H;
                for (I in p) {
                    if (p.hasOwnProperty(I)) {
                        p[I].dispose();
                        delete p[I]
                    }
                }
            },
            onevent: function(H) {
                if (typeof H !== "object" || !H.type) {
                    return
                }
                k(H)
            },
            onmessage: function(H) {},
            createHoverEvent: F,
            cleanupHoverEvents: c,
            eventMap: p
        }
    })
} else {}
if (TLT && typeof TLT.addModule === "function") {
    TLT.addModule("performance", function(a) {
        var g = {
                loadReceived: false,
                unloadReceived: false,
                perfEventSent: false
            },
            e = 0,
            c, h = a.utils;

        function f(l, k) {
            if (typeof l !== "string") {
                return false
            }
            if (!k || typeof k !== "object") {
                return false
            }
            return (k[l] === true)
        }

        function b(m, k) {
            var o = 0,
                l = {},
                p = "",
                n = 0;
            if (!m || typeof m !== "object" || !m.navigationStart) {
                return {}
            }
            o = m.navigationStart;
            for (p in m) {
                if (Object.prototype.hasOwnProperty.call(m, p) || typeof m[p] === "number") {
                    if (!f(p, k)) {
                        n = m[p];
                        if (typeof n === "number" && n && p !== "navigationStart") {
                            l[p] = n - o
                        } else {
                            l[p] = n
                        }
                    }
                }
            }
            return l
        }

        function d(m) {
            var n = 0,
                l, k;
            if (m) {
                l = (m.responseEnd > 0 && m.responseEnd < m.domLoading) ? m.responseEnd : m.domLoading;
                k = m.loadEventStart;
                if (h.isNumeric(l) && h.isNumeric(k) && k > l) {
                    n = k - l
                }
            }
            return n
        }

        function i(l) {
            var k = a.getStartTime();
            if (l.timestamp > k && !e) {
                e = l.timestamp - k
            }
        }

        function j(n) {
            var l = "UNKNOWN",
                o = {
                    type: 7,
                    performance: {}
                },
                k, p, m;
            if (!n || g.perfEventSent) {
                return
            }
            p = n.performance || {};
            m = p.timing;
            k = p.navigation;
            if (m) {
                o.performance.timing = b(m, c.filter);
                o.performance.timing.renderTime = d(m)
            } else {
                if (c.calculateRenderTime) {
                    o.performance.timing = {
                        renderTime: e,
                        calculated: true
                    }
                } else {
                    return
                }
            }
            if (c.renderTimeThreshold && o.performance.timing.renderTime > c.renderTimeThreshold) {
                o.performance.timing.invalidRenderTime = o.performance.timing.renderTime;
                delete o.performance.timing.renderTime
            }
            if (k) {
                switch (k.type) {
                    case 0:
                        l = "NAVIGATE";
                        break;
                    case 1:
                        l = "RELOAD";
                        break;
                    case 2:
                        l = "BACKFORWARD";
                        break;
                    default:
                        l = "UNKNOWN";
                        break
                }
                o.performance.navigation = {
                    type: l,
                    redirectCount: k.redirectCount
                }
            }
            a.post(o);
            g.perfEventSent = true
        }
        return {
            init: function() {
                c = a.getConfig()
            },
            destroy: function() {
                c = null
            },
            onevent: function(k) {
                if (typeof k !== "object" || !k.type) {
                    return
                }
                switch (k.type) {
                    case "load":
                        g.loadReceived = true;
                        i(k);
                        setTimeout(function() {
                            if (a.isInitialized()) {
                                j(window)
                            }
                        }, h.getValue(c, "delay", 2000));
                        break;
                    case "unload":
                        g.unloadReceived = true;
                        if (!g.perfEventSent) {
                            j(window)
                        }
                        break;
                    default:
                        break
                }
            },
            onmessage: function(k) {}
        }
    })
} else {}
TLT.addModule("replay", function(an) {
    var ao = an.utils,
        L = 0,
        ai = {
            scale: 0,
            timestamp: 0
        },
        ab = {},
        I = null,
        e = [],
        ac = 0,
        G = true,
        ad = null,
        D = null,
        X = false,
        l = 0,
        U = "",
        A = "",
        O = (new Date()).getTime(),
        k = 0,
        R = null,
        al = null,
        P = null,
        E = null,
        aj = null,
        V = null,
        Z = 0,
        w = 0,
        ag = null,
        v = {
            inFocus: false
        },
        M = null,
        B = ao.isiOS,
        y = navigator.userAgent.indexOf("Chrome") > -1 && ao.isAndroid,
        q = window.devicePixelRatio || 1,
        W = (window.screen ? window.screen.height - window.screen.availHeight : 0),
        ae = an.getConfig() || {},
        z = ao.getValue(ae, "viewPortWidthHeightLimit", 10000),
        ah = 1,
        F = 1,
        Q, af = {
            cellMaxX: 10,
            cellMaxY: 10,
            cellMinWidth: 20,
            cellMinHeight: 20
        };

    function t() {
        var ap;
        for (ap in ab) {
            if (ab.hasOwnProperty(ap)) {
                ab[ap].visitedCount = 0
            }
        }
    }

    function s(ar) {
        var ap = false,
            aq = "|button|image|submit|reset|",
            at = null;
        if (typeof ar !== "object" || !ar.type) {
            return ap
        }
        switch (ar.type.toLowerCase()) {
            case "input":
                at = "|" + (ar.subType || "") + "|";
                if (aq.indexOf(at.toLowerCase()) === -1) {
                    ap = false
                } else {
                    ap = true
                }
                break;
            case "select":
            case "textarea":
                ap = false;
                break;
            default:
                ap = true;
                break
        }
        return ap
    }

    function h(aq) {
        var ap = [];
        aq = aq.parentNode;
        while (aq) {
            ap.push(aq);
            aq = aq.parentNode
        }
        return ap
    }

    function x(ap) {
        return ao.some(ap, function(ar) {
            var aq = ao.getTagName(ar);
            if (aq === "a" || aq === "button") {
                return ar
            }
            return null
        })
    }

    function n(ap) {
        var aq = ap.type,
            ar = ap.target;
        if (typeof aq === "string") {
            aq = aq.toLowerCase()
        } else {
            aq = "unknown"
        }
        if (aq === "blur") {
            aq = "focusout"
        }
        if (aq === "change") {
            if (ar.type === "INPUT") {
                switch (ar.subType) {
                    case "text":
                    case "date":
                    case "time":
                        aq = ar.subType + "Change";
                        break;
                    default:
                        aq = "valueChange";
                        break
                }
            } else {
                if (ar.type === "TEXTAREA") {
                    aq = "textChange"
                } else {
                    aq = "valueChange"
                }
            }
        }
        return aq
    }

    function C(ap, ar, aq) {
        var at = null;
        if (!ap) {
            return at
        }
        ar = ar || {};
        ar.eventOn = G;
        G = false;
        if (aq) {
            at = "dcid-" + ao.getSerialNumber() + "." + (new Date()).getTime() + "s";
            window.setTimeout(function() {
                ar.dcid = at;
                an.performDOMCapture(ap, ar)
            }, aq)
        } else {
            delete ar.dcid;
            at = an.performDOMCapture(ap, ar)
        }
        return at
    }

    function K(aq, aD, ar) {
        var ay, aw, aF = false,
            at = {},
            aE = false,
            av, aA, aC = null,
            ax = 0,
            aB, az, ap, au;
        if (!aq || (!aD && !ar)) {
            return aC
        }
        if (!aD && !(aq === "load" || aq === "unload")) {
            return aC
        }
        ae = an.getConfig() || {};
        aE = ao.getValue(ae, "domCapture.enabled", false);
        if (!aE || ao.isLegacyIE) {
            return aC
        }
        aA = ao.getValue(ae, "domCapture.triggers") || [];
        for (ay = 0, aB = aA.length; !aF && ay < aB; ay += 1) {
            av = aA[ay];
            if (av.event === aq) {
                if (aq === "load" || aq === "unload") {
                    if (av.screenviews) {
                        ap = av.screenviews;
                        for (aw = 0, au = ap.length; !aF && aw < au; aw += 1) {
                            az = ap[aw];
                            switch (typeof az) {
                                case "object":
                                    if (!az.cRegex) {
                                        az.cRegex = new RegExp(az.regex, az.flags)
                                    }
                                    az.cRegex.lastIndex = 0;
                                    aF = az.cRegex.test(ar);
                                    break;
                                case "string":
                                    aF = (az === ar);
                                    break;
                                default:
                                    break
                            }
                        }
                    } else {
                        aF = true
                    }
                } else {
                    if (av.targets) {
                        aF = (-1 !== ao.matchTarget(av.targets, aD))
                    } else {
                        aF = true
                    }
                }
            }
        }
        if (aF) {
            ax = av.delay || (av.event === "load" ? 7 : 0);
            at.forceFullDOM = !!av.fullDOMCapture;
            aC = C(window.document, at, ax)
        }
        return aC
    }

    function aa(aA) {
        var ar, at, au = ao.getValue(aA, "webEvent.target", {}),
            ap = au.type,
            aw = au.subType || "",
            aq = ao.getTlType(au),
            ax = h(ao.getValue(au, "element")),
            az = null,
            av = ao.getValue(au, "position.relXY"),
            ay = ao.getValue(aA, "webEvent.subType", null);
        ar = {
            timestamp: ao.getValue(aA, "webEvent.timestamp", 0),
            type: 4,
            target: {
                id: au.id || "",
                idType: au.idType,
                name: au.name,
                tlType: aq,
                type: ap,
                position: {
                    width: ao.getValue(au, "size.width"),
                    height: ao.getValue(au, "size.height")
                },
                currState: aA.currState || null
            },
            event: {
                tlEvent: n(ao.getValue(aA, "webEvent")),
                type: ao.getValue(aA, "webEvent.type", "UNKNOWN")
            }
        };
        if (aw) {
            ar.target.subType = aw
        }
        if (av) {
            ar.target.position.relXY = av
        }
        if (typeof aA.dwell === "number" && aA.dwell > 0) {
            ar.target.dwell = aA.dwell
        }
        if (typeof aA.visitedCount === "number") {
            ar.target.visitedCount = aA.visitedCount
        }
        if (typeof aA.prevState !== "undefined") {
            ar.prevState = aA.prevState
        }
        if (ay) {
            ar.event.subType = ay
        }
        az = x(ax);
        ar.target.isParentLink = !!az;
        if (az) {
            if (az.href) {
                ar.target.currState = ar.target.currState || {};
                ar.target.currState.href = ar.target.currState.href || az.href
            }
            if (az.value) {
                ar.target.currState = ar.target.currState || {};
                ar.target.currState.value = ar.target.currState.value || az.value
            }
            if (az.innerText || az.textContent) {
                ar.target.currState = ar.target.currState || {};
                ar.target.currState.innerText = ao.trim(ar.target.currState.innerText || az.innerText || az.textContent)
            }
        }
        if (ao.isUndefOrNull(ar.target.currState)) {
            delete ar.target.currState
        }
        if (ao.isUndefOrNull(ar.target.name)) {
            delete ar.target.name
        }
        if (ar.event.type !== "click" || s(au)) {
            at = K(ar.event.type, au);
            if (at) {
                ar.dcid = at
            }
        }
        return ar
    }

    function H(ap) {
        an.post(ap)
    }

    function J(au) {
        var ar = 0,
            ap, av = au.length,
            ax, aw, at, ay = {
                mouseout: true,
                mouseover: true
            },
            aq = [];
        for (ar = 0; ar < av; ar += 1) {
            ax = au[ar];
            if (!ax) {
                continue
            }
            if (ay[ax.event.type]) {
                aq.push(ax)
            } else {
                for (ap = ar + 1; ap < av && au[ap]; ap += 1) {
                    if (!ay[au[ap].event.type]) {
                        break
                    }
                }
                if (ap < av) {
                    aw = au[ap];
                    if (aw && ax.target.id === aw.target.id && ax.event.type !== aw.event.type) {
                        if (ax.event.type === "click") {
                            at = ax;
                            ax = aw;
                            aw = at
                        }
                        if (aw.event.type === "click") {
                            ax.target.position = aw.target.position;
                            ar += 1
                        } else {
                            if (aw.event.type === "blur") {
                                ax.target.dwell = aw.target.dwell;
                                ax.target.visitedCount = aw.target.visitedCount;
                                ax.focusInOffset = aw.focusInOffset;
                                ax.target.position = aw.target.position;
                                ar += 1
                            }
                        }
                        au[ap] = null;
                        au[ar] = ax
                    }
                }
                aq.push(au[ar])
            }
        }
        for (ax = aq.shift(); ax; ax = aq.shift()) {
            an.post(ax)
        }
        au.splice(0, au.length)
    }
    if (typeof window.onerror !== "function") {
        window.onerror = function(at, ar, ap) {
            var aq = null;
            if (typeof at !== "string") {
                return
            }
            ap = ap || -1;
            aq = {
                type: 6,
                exception: {
                    description: at,
                    url: ar,
                    line: ap
                }
            };
            l += 1;
            an.post(aq)
        };
        X = true
    }

    function o(aq, ap) {
        v = ap;
        v.inFocus = true;
        if (typeof ab[aq] === "undefined") {
            ab[aq] = {}
        }
        ab[aq].focus = v.dwellStart = Number(new Date());
        ab[aq].focusInOffset = P ? v.dwellStart - Number(P) : -1;
        ab[aq].prevState = ao.getValue(ap, "target.state");
        ab[aq].visitedCount = ab[aq].visitedCount + 1 || 1
    }

    function Y(ap, aq) {
        e.push(aa({
            webEvent: ap,
            id: aq,
            currState: ao.getValue(ap, "target.state")
        }))
    }

    function d(av, aq) {
        var ar = false,
            au, ap, at = 0;
        if (typeof av === "undefined" || av === null || typeof aq === "undefined" || aq === null) {
            return
        }
        if (typeof ab[av] !== "undefined" && ab[av].hasOwnProperty("focus")) {
            ab[av].dwell = Number(new Date()) - ab[av].focus
        } else {
            ab[av] = {};
            ab[av].dwell = 0
        }
        if (e.length === 0) {
            if (!v.inFocus) {
                return
            }
            Y(aq, av)
        }
        v.inFocus = false;
        if (e[e.length - 1]) {
            for (at = e.length - 1; at >= 0; at--) {
                e[at].target.visitedCount = ab[av].visitedCount
            }
        }
        ap = e[e.length - 1];
        if (ap) {
            ap.target.dwell = ab[av].dwell;
            ap.focusInOffset = ab[av].focusInOffset;
            ap.target.visitedCount = ab[av].visitedCount;
            if (ap.event.type === "click") {
                if (!s(ap.target)) {
                    ap.target.currState = ao.getValue(aq, "target.state") || ao.getValue(aq, "target.currState");
                    ar = true
                }
            } else {
                if (ap.event.type === "focus") {
                    ar = true
                }
            }
            if (ar) {
                ap.event.type = "blur";
                ap.event.tlEvent = "focusout";
                au = K(ap.event.type, aq.target);
                if (au) {
                    ap.dcid = au
                }
            }
        }
        J(e)
    }

    function m(au, ar) {
        var aq = false,
            at = e.length,
            ap = at > 0 ? e[at - 1] : null;
        if (!ap) {
            return aq
        }
        if (ap.target.id !== au && ap.target.tltype !== "selectList") {
            if (ar.type === "focus" || ar.type === "click" || ar.type === "change") {
                d(ap.target.id, ap);
                aq = true
            }
        }
        return aq
    }

    function c(aq, ap) {
        if (typeof ab[aq] !== "undefined" && !ab[aq].hasOwnProperty("focus")) {
            o(aq, ap)
        }
        Y(ap, aq);
        if (typeof ab[aq] !== "undefined" && typeof ab[aq].prevState !== "undefined") {
            if (e[e.length - 1].target.tlType === "textBox" || e[e.length - 1].target.tlType === "selectList") {
                e[e.length - 1].target.prevState = ab[aq].prevState
            }
        }
    }

    function r(av) {
        var au, ay, aq, ap, at = ao.getValue(av, "target.element", {}),
            az = ao.getValue(av, "target.size.width", at.offsetWidth),
            ar = ao.getValue(av, "target.size.height", at.offsetHeight),
            ax = ao.getValue(av, "target.position.x", 0),
            aw = ao.getValue(av, "target.position.y", 0);
        au = az ? Math.max(az / af.cellMaxX, af.cellMinWidth) : af.cellMinWidth;
        ay = ar ? Math.max(ar / af.cellMaxY, af.cellMinHeight) : af.cellMinHeight;
        aq = Math.floor(ax / au);
        ap = Math.floor(aw / ay);
        if (!isFinite(aq)) {
            aq = 0
        }
        if (!isFinite(ap)) {
            ap = 0
        }
        return aq + "," + ap
    }

    function b(au, ar) {
        var aq, ap = true,
            at = 0;
        if (ar.target.type === "select" && M && M.target.id === au) {
            M = null;
            return
        }
        if (!v.inFocus) {
            o(au, ar)
        }
        at = e.length;
        if (at && ao.getValue(e[at - 1], "event.type") !== "change") {
            c(au, ar)
        }
        aq = r(ar);
        at = e.length;
        if (ar.position.x === 0 && ar.position.y === 0 && at && ao.getValue(e[at - 1], "target.tlType") === "radioButton") {
            ap = false
        } else {
            ar.target.position.relXY = aq
        }
        if (at && ao.getValue(e[at - 1], "target.id") === au) {
            if (ap) {
                e[at - 1].target.position.relXY = aq
            }
        } else {
            Y(ar, au);
            if (s(ar.target)) {
                d(au, ar)
            }
        }
        M = ar
    }

    function a(aq) {
        var ap = aq.orientation,
            ar = {
                type: 4,
                event: {
                    type: "orientationchange"
                },
                target: {
                    prevState: {
                        orientation: L,
                        orientationMode: ao.getOrientationMode(L)
                    },
                    currState: {
                        orientation: ap,
                        orientationMode: ao.getOrientationMode(ap)
                    }
                }
            };
        H(ar);
        L = ap
    }

    function am(aq) {
        var ap = false;
        if (!aq) {
            return ap
        }
        ap = (ai.scale === aq.scale && Math.abs((new Date()).getTime() - ai.timestamp) < 500);
        return ap
    }

    function j(ap) {
        ai.scale = ap.scale;
        ai.rotation = ap.rotation;
        ai.timestamp = (new Date()).getTime()
    }

    function N() {
        var ap, aq;
        ap = ah - F;
        if (isNaN(ap)) {
            aq = "INVALID"
        } else {
            if (ap < 0) {
                aq = "CLOSE"
            } else {
                if (ap > 0) {
                    aq = "OPEN"
                } else {
                    aq = "NONE"
                }
            }
        }
        return aq
    }

    function g(au) {
        var az = document.documentElement,
            aw = document.body,
            aA = window.screen,
            aq = aA.width,
            ar = aA.height,
            av = ao.getValue(au, "orientation", 0),
            ax = !B ? aq : Math.abs(av) === 90 ? ar : aq,
            at = {
                type: 1,
                clientState: {
                    pageWidth: document.width || (!az ? 0 : az.offsetWidth),
                    pageHeight: Math.max((!document.height ? 0 : document.height), (!az ? 0 : az.offsetHeight), (!az ? 0 : az.scrollHeight)),
                    viewPortWidth: window.innerWidth || az.clientWidth,
                    viewPortHeight: window.innerHeight || az.clientHeight,
                    viewPortX: Math.round(window.pageXOffset || (!az ? (!aw ? 0 : aw.scrollLeft) : az.scrollLeft || 0)),
                    viewPortY: Math.round(window.pageYOffset || (!az ? (!aw ? 0 : aw.scrollTop) : az.scrollTop || 0)),
                    deviceOrientation: av,
                    event: ao.getValue(au, "type")
                }
            },
            ay = at.clientState,
            ap;
        D = D || at;
        if (ay.event === "unload" && ay.viewPortHeight === ay.pageHeight && ay.viewPortWidth === ay.pageWidth) {
            if (D.clientState.viewPortHeight < ay.viewPortHeight) {
                ay.viewPortHeight = D.clientState.viewPortHeight;
                ay.viewPortWidth = D.clientState.viewPortWidth
            }
        }
        if ((ay.viewPortY + ay.viewPortHeight) > ay.pageHeight) {
            ay.viewPortY = ay.pageHeight - ay.viewPortHeight
        }
        if (ay.viewPortY < 0) {
            ay.viewPortY = 0
        }
        ap = !ay.viewPortWidth ? 1 : (ax / ay.viewPortWidth);
        ay.deviceScale = ap.toFixed(3);
        ay.viewTime = 0;
        if (E && aj) {
            ay.viewTime = aj.getTime() - E.getTime()
        }
        if (au.type === "scroll") {
            ay.viewPortXStart = D.clientState.viewPortX;
            ay.viewPortYStart = D.clientState.viewPortY
        }
        return at
    }

    function p() {
        var ap;
        if (ad) {
            ap = ad.clientState;
            if (ap.viewPortHeight > 0 && ap.viewPortHeight < z && ap.viewPortWidth > 0 && ap.viewPortWidth < z) {
                H(ad)
            }
            D = ad;
            ad = null;
            E = V || E;
            aj = null
        }
        p.timeoutId = 0
    }

    function S(ap) {
        var aq = null;
        if (ao.isOperaMini) {
            return
        }
        ad = g(ap);
        if (ap.type === "scroll" || ap.type === "resize") {
            if (p.timeoutId) {
                window.clearTimeout(p.timeoutId)
            }
            p.timeoutId = window.setTimeout(p, ao.getValue(ae, "scrollTimeout", 2000))
        } else {
            if (ap.type === "touchstart" || ap.type === "load") {
                if (ad) {
                    F = parseFloat(ad.clientState.deviceScale)
                }
            } else {
                if (ap.type === "touchend") {
                    if (ad) {
                        ah = parseFloat(ad.clientState.deviceScale);
                        p()
                    }
                }
            }
        }
        if (ap.type === "load" || ap.type === "unload") {
            if (ap.type === "unload" && O) {
                aq = ao.clone(ad);
                aq.clientState.event = "attention";
                aq.clientState.viewTime = (new Date()).getTime() - O
            }
            p();
            if (aq) {
                ad = aq;
                p()
            }
        }
        return ad
    }

    function ak(aq) {
        var ap = ao.getValue(aq, "nativeEvent.touches.length", 0);
        if (ap === 2) {
            S(aq)
        }
    }

    function i(at) {
        var ar, aq = {},
            au = ao.getValue(at, "nativeEvent.rotation", 0) || ao.getValue(at, "nativeEvent.touches[0].webkitRotationAngle", 0),
            av = ao.getValue(at, "nativeEvent.scale", 1),
            ap = null,
            aw = {
                type: 4,
                event: {
                    type: "touchend"
                },
                target: {
                    id: ao.getValue(at, "target.id"),
                    idType: ao.getValue(at, "target.idType")
                }
            };
        ar = ao.getValue(at, "nativeEvent.changedTouches.length", 0) + ao.getValue(at, "nativeEvent.touches.length", 0);
        if (ar !== 2) {
            return
        }
        S(at);
        ap = {
            rotation: au ? au.toFixed(2) : 0,
            scale: ah ? ah.toFixed(2) : 1
        };
        ap.pinch = N();
        aq.scale = F ? F.toFixed(2) : 1;
        aw.target.prevState = aq;
        aw.target.currState = ap;
        H(aw)
    }

    function f(aA, at) {
        var ax = ["type", "name", "target.id"],
            ar = null,
            au, aw, av = true,
            ay = 10,
            aq = 0,
            az = 0,
            ap = 0;
        if (!aA || !at || typeof aA !== "object" || typeof at !== "object") {
            return false
        }
        for (au = 0, aw = ax.length; av && au < aw; au += 1) {
            ar = ax[au];
            if (ao.getValue(aA, ar) !== ao.getValue(at, ar)) {
                av = false;
                break
            }
        }
        if (av) {
            az = ao.getValue(aA, "timestamp");
            ap = ao.getValue(at, "timestamp");
            if (!(isNaN(az) && isNaN(ap))) {
                aq = Math.abs(ao.getValue(aA, "timestamp") - ao.getValue(at, "timestamp"));
                if (isNaN(aq) || aq > ay) {
                    av = false
                }
            }
        }
        return av
    }

    function u(ap) {
        var ar = {
                type: 4,
                event: {
                    type: ap.type
                },
                target: {
                    id: ao.getValue(ap, "target.id"),
                    idType: ao.getValue(ap, "target.idType"),
                    currState: ao.getValue(ap, "target.state")
                }
            },
            aq;
        aq = K(ap.type, ap.target);
        if (aq) {
            ar.dcid = aq
        }
        H(ar)
    }

    function T(aq) {
        var ap = ao.getValue(ae, "geolocation"),
            ar;
        if (!ap || !ap.enabled) {
            return
        }
        ar = ap.triggers || [];
        if (!ar.length) {
            return
        }
        if (ar[0].event === aq) {
            TLT.logGeolocation()
        }
    }
    return {
        init: function() {
            e = []
        },
        destroy: function() {
            d(I);
            e = [];
            if (p.timeoutId) {
                window.clearTimeout(p.timeoutId);
                p.timeoutId = 0
            }
            if (X) {
                window.onerror = null;
                X = false
            }
        },
        onevent: function(aq) {
            var au = null,
                ar = null,
                ap, at;
            if (typeof aq !== "object" || !aq.type) {
                return
            }
            if (f(aq, R)) {
                R = aq;
                return
            }
            R = aq;
            au = ao.getValue(aq, "target.id");
            if (Object.prototype.toString.call(ab[au]) !== "[object Object]") {
                ab[au] = {}
            }
            m(au, aq);
            ag = new Date();
            switch (aq.type) {
                case "hashchange":
                    break;
                case "focus":
                    ar = o(au, aq);
                    break;
                case "blur":
                    ar = d(au, aq);
                    break;
                case "click":
                    ar = b(au, aq);
                    break;
                case "change":
                    ar = c(au, aq);
                    break;
                case "orientationchange":
                    ar = a(aq);
                    break;
                case "touchstart":
                    ak(aq);
                    break;
                case "touchend":
                    ar = i(aq);
                    break;
                case "loadWithFrames":
                    TLT.logScreenviewLoad("rootWithFrames");
                    break;
                case "load":
                    L = aq.orientation;
                    E = new Date();
                    if (typeof window.orientation !== "number" || ao.isAndroid) {
                        at = (window.screen.width > window.screen.height ? 90 : 0);
                        ap = window.orientation;
                        if (Math.abs(ap) !== at && !(ap === 180 && at === 0)) {
                            ao.isLandscapeZeroDegrees = true;
                            if (Math.abs(ap) === 180 || Math.abs(ap) === 0) {
                                L = 90
                            } else {
                                if (Math.abs(ap) === 90) {
                                    L = 0
                                }
                            }
                        }
                    }
                    setTimeout(function() {
                        if (an.isInitialized()) {
                            S(aq)
                        }
                    }, 100);
                    T(aq.type);
                    TLT.logScreenviewLoad("root");
                    break;
                case "screenview_load":
                    P = new Date();
                    t();
                    ar = K("load", null, aq.name);
                    break;
                case "screenview_unload":
                    ar = K("unload", null, aq.name);
                    break;
                case "resize":
                case "scroll":
                    if (!aj) {
                        aj = new Date()
                    }
                    V = new Date();
                    S(aq);
                    break;
                case "unload":
                    if (e !== null) {
                        J(e)
                    }
                    aj = new Date();
                    S(aq);
                    TLT.logScreenviewUnload("root");
                    break;
                default:
                    u(aq);
                    break
            }
            I = au;
            return ar
        },
        onmessage: function() {}
    }
});
(function() {
    var changeTarget;
    if (TLT.getFlavor() === "w3c" && TLT.utils.isLegacyIE) {
        changeTarget = "input, select, textarea, button";
    }
    TLT.init({
        "services": {
            "browser": {
                "useCapture": true,
                "sizzleObject": "window.Sizzle"
            },
            "queue": {
                "queues": [{
                    "qid": "DEFAULT",
                    "endpoint": "//uscollector.tealeaf.ibmcloud.com/collector/collectorPost",
                    "maxEvents": 50,
                    "maxSize": "30000",
                    "timerinterval": 30000,
                    "checkEndpoint": true,
                    "endpointCheckTimeout": 3000
                }],
                "asyncReqOnUnload": false,
                "useBeacon": true,
                "xhrLogging": true
            },
            "serializer": {
                "json": {
                    "defaultToBuiltin": true,
                    "parsers": ["JSON.parse"],
                    "stringifiers": ["JSON.stringify"]
                }
            },
            "domCapture": {
                "options": {
                    "captureFrames": true,
                    "removeScripts": true,
                    "removeComments": true,
                    "maxLength": 2000000,
                    "maxMutations": 100
                },
                "diffEnabled": true
            },
            "message": {
                "privacy": [{
                    "targets": [{
                        "id": "newUserName",
                        "idType": -1
                    }, {
                        "id": "ts_ddlAccount",
                        "idType": -1
                    }, {
                        "id": "Username",
                        "idType": -1
                    }, {
                        "id": "Password",
                        "idType": -1
                    }, {
                        "id": "EmailAddress",
                        "idType": -1
                    }, {
                        "id": "Questions_0__Answer",
                        "idType": -1
                    }, {
                        "id": "Questions_1__Answer",
                        "idType": -1
                    }, {
                        "id": "lblTotalPortfolioValue",
                        "idType": -1
                    }, {
                        "id": "mymdlimited-total-6ca59dda-73f3-432e-8542-36e3f1e2b5ab",
                        "idType": -1
                    }, {
                        "id": "mdm--header__accountName",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cDraftMessages_gvMessageList",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cDraftMessages_gvMessageList_lbtnTimeSaved_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cInboxMessages_gvMessageList_lbtnFrom_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cInboxMessages_gvMessageList_lbtnTimeSaved_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cSentMessages_gvMessageList_lbtnTo_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cSentMessages_gvMessageList_lbtnTimeSaved_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cSentMessages_gvMessageList_lbtnSubject_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cArchivedMessages_gvMessageList_lblToAndFrom_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cArchivedMessages_gvMessageList_lbtnSubject_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cDeletedMessages_gvMessageList_lblToAndFrom_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cDeletedMessages_gvMessageList_lbtnSubject_0",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cComposeMessage_ddlTo",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cComposeMessage_txtSubject",
                        "idType": -1
                    }, {
                        "id": "ts_UCSecureMessagesCtrl_UCC2C_c2cComposeMessage_txtMessage",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_acFa_wiz_dtl_AccountSummary1_viewEditDropDownListAccount",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_acFa_wiz_dtl_AccountSummary1_lblAccountOwnerValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_acFa_wiz_dtl_AccountSummary1_lblAvailableCashBalanceValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_acFa_wiz_dtl_MutualFundFamily1_upnlInvestments",
                        "idType": -1
                    }, {
                        "id": "ts_pnlContent",
                        "idType": -1
                    }, {
                        "id": "transactionHistory",
                        "idType": -1
                    }, {
                        "id": "ts_updContent",
                        "idType": -1
                    }, {
                        "id": "ts_ddlAccount",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_AccountSummary_viewEditDropDownListAccount",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_AccountSummary_lblAvailableCashBalanceValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_AccountSummary_lblAccountOwnerValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_BuySettlement_ddlSettlementOption",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_AdditionalInformation_ddlPhoneNumbers",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_dtl_BuySettlement_lblNoEft",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_vfy_AccountSummary_upnlAccountChange",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_vfy_AccountSummary_lblAccountOwnerValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_vfy_AdditionalInformationVerify_lblPhoneValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_fa_wiz_cfm_AdditionalInformationVerify_lblPhoneValue",
                        "idType": -1
                    }, {
                        "id": "ctl00_ts_acFa_WizardSellEquity_dtl_AccountSummary_viewEditDropDownListAccount",
                        "idType": -1
                    }],
                    "maskType": 2,
                    "exclude": false
                }],
                "privacyPatterns": []
            },
            "encoder": {
                "gzip": {
                    "encode": "window.pako.gzip",
                    "defaultEncoding": "gzip"
                }
            }
        },
        "core": {
            "blockedElements": [],
            "modules": {
                "performance": {
                    "enabled": true,
                    "events": [{
                        "name": "load",
                        "target": "window"
                    }, {
                        "name": "unload",
                        "target": "window"
                    }]
                },
                "replay": {
                    "enabled": true,
                    "events": [{
                        "name": "change",
                        "target": changeTarget,
                        "recurseFrames": true
                    }, {
                        "name": "click",
                        "recurseFrames": true
                    }, {
                        "name": "hashchange",
                        "target": "window"
                    }, {
                        "name": "focus",
                        "target": "input, select, textarea, button",
                        "recurseFrames": true
                    }, {
                        "name": "blur",
                        "target": "input, select, textarea, button",
                        "recurseFrames": true
                    }, {
                        "name": "load",
                        "target": "window"
                    }, {
                        "name": "unload",
                        "target": "window"
                    }, {
                        "name": "resize",
                        "target": "window"
                    }, {
                        "name": "scroll",
                        "target": "window"
                    }, {
                        "name": "orientationchange",
                        "target": "window"
                    }, {
                        "name": "touchend"
                    }, {
                        "name": "touchstart"
                    }]
                },
                "TLCookie": {
                    "enabled": true
                }
            },
            "screenviewAutoDetect": true,
            "framesBlacklist": []
        },
        "modules": {
            "performance": {
                "calculateRenderTime": true,
                "renderTimeThreshold": 600000,
                "filter": {
                    "navigationStart": true,
                    "unloadEventStart": true,
                    "unloadEventEnd": true,
                    "redirectStart": true,
                    "redirectEnd": true,
                    "fetchStart": true,
                    "domainLookupStart": true,
                    "domainLookupEnd": true,
                    "connectStart": true,
                    "connectEnd": true,
                    "secureConnectionStart": true,
                    "requestStart": true,
                    "responseStart": true,
                    "responseEnd": true,
                    "domLoading": true,
                    "domInteractive": true,
                    "domContentLoadedEventStart": true,
                    "domContentLoadedEventEnd": true,
                    "domComplete": true,
                    "loadEventStart": true,
                    "loadEventEnd": true
                }
            },
            "geolocation": {
                "enabled": false,
                "triggers": [{
                    "event": "load"
                }]
            },
            "replay": {
                "domCapture": {
                    "enabled": true,
                    "triggers": [{
                        "event": "click"
                    }, {
                        "event": "change"
                    }, {
                        "event": "load"
                    }, {
                        "event": "unload"
                    }]
                }
            },
            "TLCookie": {
                "appCookieWhitelist": [{
                    "regex": ".*"
                }],
                "tlAppKey": "14cdd986d6524ba4ab6e4b2ec573042b"
            }
        }
    });
}());