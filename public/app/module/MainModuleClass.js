define(['app/module/ModuleBase', "flow", "js/core/List", "js/data/DataSource", "sprd/model/Shop", "sprd/model/Session", "js/data/LocalStorage", "js/core/History"],
    function(ModuleBase, flow, List, DataSource, Shop, Session, LocalStorage, History) {

    return ModuleBase.inherit('app.module.MainModuleClass', {

        inject: {
            api: DataSource,
            session: Session,
            localStorage: LocalStorage,
            history: History
        },

        defaultRoute: function(routeContext) {
            routeContext.router.navigate("m/home");
        },

        logout: function() {

            var self = this,
                localStorage = this.$.localStorage,
                history = this.$.history;

            this.$.session.remove(null, function(err) {

                err && self.log(err, "error");

                localStorage.removeItem("sessionId");
                history.navigate("login");
            });

        }
    });
});