define(["js/core/Application", "sprd/model/Session", "flow", "js/data/LocalStorage", "js/core/History"], function (Application, Session, flow, LocalStorage, History) {

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
            start:function (parameter, callback) {

                var self = this,
                    api = this.$.api,
                    localStorage = this.$.localStorage,
                    injection = this.$.injection,
                    session;

                flow()
                    .seq(function(cb) {
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
                    .exec(function(err) {
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
                            self.start.baseImplementation.call(self, parameter, function() {
                                var args = Array.prototype.slice.call(arguments);
                                fragment && self.$stage.$bus.trigger("Login.RedirectUrl", fragment);
                                callback.apply(this, args);
                            });
                        }
                    })
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