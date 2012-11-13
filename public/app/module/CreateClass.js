define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.CreateClass', {

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