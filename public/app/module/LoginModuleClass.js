define(['js/core/Module', "js/core/I18n", "sprd/model/Session", "js/data/LocalStorage", "flow", "js/core/History"], function(Module, I18n, Session, LocalStorage, flow, History) {
    return Module.inherit('app.module.LoginModuleClass', {

        defaults: {
            rememberSession: true
        },

        inject: {
            i18n: I18n,
            session: Session,
            localStorage: LocalStorage,
            history: History
        },

        start: function(callback, routeContext) {

            if (!this.$.session.isNew()) {
                this._fetchUserAndAddForInjection(function() {
                    routeContext.router.navigate("m", function () {
                        routeContext.callback();
                        callback();
                    });
                });

            } else {
                this.callBase();
            }
        },

        _fetchUserAndAddForInjection: function(callback) {


            var self = this,
                session = this.$.session;

            flow()
                .seq(function(cb) {
                    session.$.user.fetch(null, cb);
                })
                .seq(function() {
                    self.$.injection.addInstance("user", session.$.user);
                })
                .exec(callback)

        },

        login: function(e) {
            e.preventDefault();

            var self = this,
                session = this.$.session;

            flow()
                .seq(function(cb) {
                    session.login(cb);
                })
                .seq(function(cb) {
                    self._fetchUserAndAddForInjection(cb);
                })
                .seq(function() {
                    if (self.$.rememberSession) {
                        self.$.localStorage.setItem("sessionId", session.$.id);
                    } else {
                        self.$.localStorage.removeItem("sessionId");
                    }
                })
                .exec(function (err) {
                    if (err) {
                        // TODO: show error visible for user
                        console.err(err);
                    } else {

                        var to = self.$redirectUrl || "m";
                        if (to === "login") {
                            to = "m";
                        }

                        self.$.history.navigate(to);
                    }
                });
        },

        bus_LoginRedirectUrl: function(e) {
            this.$redirectUrl = e.$;
        }.bus("Login.RedirectUrl")
    });
});