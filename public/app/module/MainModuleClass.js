define(['app/module/ModuleBase', "flow", "js/core/List", "js/data/DataSource", "sprd/model/Shop", "sprd/model/Session"], function(ModuleBase, flow, List, DataSource, Shop, Session) {
    return ModuleBase.inherit('app.module.MainModuleClass', {

        defaults: {
            collections: List
        },

        inject: {
            api: DataSource,
            session: Session
        },

        defaultRoute: function(routeContext) {
            routeContext.router.navigate("m/home");
        },

        start: function() {

            var shops = this.$.user.$.shops,
                collections = this.$.collections,
                api = this.$.api;

            // TODO: use UserShops
            flow()
                .seq(function(cb) {
                    // fetch list of collection of the user
                    shops.fetch(null, cb);
                })
                .seq(function(cb) {
                    flow()
                        .parEach(shops.$items, function(shop, cb) {
                            var collection = api.createEntity(Shop, shop.$.id);
                            collections.add(collection);
                            collection.fetch(null, cb);
                        })
                        .exec(cb);
                })
                .exec();

            this.callBase();
        },

        logout: function() {

        }
    });
});