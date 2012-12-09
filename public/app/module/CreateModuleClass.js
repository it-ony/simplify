define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            designs: "{user.designs}",

            // the product
            product: null

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