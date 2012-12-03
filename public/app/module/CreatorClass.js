define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.CreatorClass', {

        defaults: {
            // focused collection
            collection: null,

            // the product
            product: null
        },

        inject: {
            api: DataSource
        }

    });
});