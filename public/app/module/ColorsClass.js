define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.CreatorClass', {

        defaults: {
            // focused collection
            collection: null,
            designs: "{user.designs}",
            productTypes: "{user.productTypes}",

            // the product
            product: null
        },

        inject: {
            api: DataSource,
            user: 'user'
        }

    });
});