define(["js/core/Application", "sprd/model/Session", "flow", "js/data/LocalStorage", "js/core/History", "underscore"], function (Application, Session, flow, LocalStorage, History, _) {

        var config = {
            EU: {
                endPoint: "http://api.spreadshirt.net/api/v1",
                gateWay: "/api/v1",
                imageServerEndPoint: "http://image.spreadshirt.net/image-server/v1",
                apiKey: "2b065dd3-88b7-44a8-87fe-e564ed27f904",
                secret: "51616615-0bb1-471e-93f5-fe19022049ef"
            },
            NA: {
                endPoint: "http://api.spreadshirt.net/api/v1",
                gateWay: "/api/v1",
                imageServerEndPoint: "http://image.spreadshirt.net/image-server/v1",
                apiKey: "2b065dd3-88b7-44a8-87fe-e564ed27f904",
                secret: "51616615-0bb1-471e-93f5-fe19022049ef"
            }
        };

        return Application.inherit({

            defaults: {
                user: null,
                session: null
            },

            inject: {
                localStorage: LocalStorage,
                history: History
            },

            /***
             * Starts the application
             * @param parameter
             * @param callback
             */
            start: function (parameter, callback) {

                parameter = parameter || {};

                var self = this,
                    api = this.$.api,
                    localStorage = this.$.localStorage,
                    injection = this.$.injection,
                    session,
                    endPoint;

                parameter.platform = parameter.platform || this.getPlatformFromDomain() || "EU";

                _.defaults(parameter, config[parameter.platform]);

                endPoint = parameter.endPoint;

                if (this.runsInBrowser()) {
                    var location = this.$stage.$window.location;
                    if (!/\.js$/.test(location.host)) {
                        endPoint = location.protocol + "//" + location.host + "/api/v1";
                    }
                }

                api.set({
                    apiKey: parameter.apiKey,
                    secret: parameter.secret,
                    endPoint: endPoint,
                    gateWay: parameter.gateWay
                });

                flow()
                    .seq(function (cb) {
                        // create or load session
                        var sessionId = localStorage.getItem("sessionId");

                        if (sessionId) {
                            session = api.createEntity(Session, sessionId);
                            session.fetch({
                                fetchSubModels: ["user"],
                                noCache: true
                            }, function (err) {
                                if (err) {
                                    session = api.createEntity(Session);
                                    cb();
                                } else {
                                    cb();
                                }
                            });
                        } else {
                            session = api.createEntity(Session);
                            cb();
                        }
                    })
                    .exec(function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            self.set('session', session);

                            // and add it for injection
                            injection.addInstance(session);

                            var fragment;

                            if (!session.isNew()) {
                                // add the user for injection
                                injection.addInstance("user", session.$.user);
                            } else {
                                fragment = self.$.history._getFragment();
                                self.$.history.navigate("login");
                            }

                            // call start from super
                            self.start.baseImplementation.call(self, parameter, function () {
                                var args = Array.prototype.slice.call(arguments);
                                fragment && self.$stage.$bus.trigger("Login.RedirectUrl", fragment);
                                callback.apply(this, args);
                            });
                        }
                    })
            },

            getPlatformFromDomain: function() {

                if (this.runsInBrowser()) {
                    return /\.v?com$/.test(this.$stage.$window.location.host) ? "NA" : "EU";
                }

                return null;

            },

            defaultRoute: function (routeContext) {

                var session = this.$.session;
                if (session.isNew()) {
                    // user not logged in
                    routeContext.router.navigate("login", routeContext.callback);
                } else {
                    routeContext.router.navigate("m", routeContext.callback);
                }

            }.async()
        });
    }
);