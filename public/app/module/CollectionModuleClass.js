define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Shop", "flow"], function(ModuleBase, DataSource, Shop, flow) {
    return ModuleBase.inherit('app.module.CollectionClass', {

        defaults: {
            collection: null
        },

        inject: {
            api: DataSource
        },

        showCollection: function(routeContext, collectionId) {

            var api = this.$.api,
                collection = api.createEntity(Shop, collectionId);

            this.set("collection", collection);

            flow()
                .seq(function(cb) {
                    collection.fetch(null, cb);
                })
                .exec(routeContext.callback);

        }.async()
    });
});