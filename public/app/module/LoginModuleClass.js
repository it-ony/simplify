define(['js/core/Module', "js/core/I18n", "sprd/model/Session", "js/data/LocalStorage", "flow"], function(Module, I18n, Session, LocalStorage, flow) {
    return Module.inherit('app.module.LoginModuleClass', {

        defaults: {
            rememberSession: true
        },

        inject: {
            i18n: I18n,
            session: Session,
            localStorage: LocalStorage
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
                    self.$.injection.addInstance(session.$.user);
                })
                .exec(callback)

        },

        login: function(e) {
            e.preventDefault();

            var self = this,
                session = this.$.session;

            session.login(function(err) {
                if (err) {
                    // TODO: show error
                    console.log(err);
                } else {

                    if (self.$.rememberSession) {
                        self.$.localStorage.setItem("sessionId", session.$.id);
                    }

                    self._fetchUserAndAddForInjection();
                }
            });
        }
    });
});