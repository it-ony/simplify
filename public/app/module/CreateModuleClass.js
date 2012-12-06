define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            designs: "{user.designs}",

            // focused collection
            collection: null,

            // the product
            product: null,


            gap: 40,
            minWidth: 170,
            maxWidth: 300,
            pageSize: 40,
            cols: 2,
            itemSize: 80
        },

        inject: {
            api: DataSource
        },

        designs: function () {

            if (this.$.designs) {
                return this.$.designs.createQueryCollection({
                });
            }

        }.onChange('designs')

    });
});