define(["js/core/Application", "sprd/model/Session", "flow", "js/data/LocalStorage"], function (Application, Session, flow, LocalStorage) {

        return Application.inherit({

            defaults: {
                user: null
            },

            inject: {
                localStorage: LocalStorage
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
                            session.fetch({noCache: true}, function (err) {
                                if (err) {
                                    createNewSession();
                                } else {
                                    cb();
                                }
                            });
                        } else {
                            createNewSession();
                        }

                        function createNewSession() {
                            session = api.createEntity(Session);
                            session.login(parameter.username, parameter.password, cb);
                        }
                    })
                    .par(function (cb) {
                        self.set("user", session.$.user);
                        session.$.user.$.shops.fetch({
                            fullData: true
                        }, cb);
                    }, function(cb) {
                        session.$.user.fetch(null, cb);
                    })
                    .exec(function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            injection.addInstance("user", session.$.user);
                            localStorage.setItem("sessionId", session.$.id);

                            // call start from super
                            self.start.baseImplementation.call(self, parameter, callback);
                        }
                    });

            },

            defaultRoute: function (routeContext) {
                routeContext.router.navigate("home", routeContext.callback);
            }.async()
        });
    }
);