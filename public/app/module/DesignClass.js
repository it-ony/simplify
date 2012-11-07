define(['app/module/ModuleBase', "js/data/DataSource", "flow"], function(ModuleBase, DataSource, flow) {
    return ModuleBase.inherit('app.module.DesignClass', {

        defaults: {
            collection: null
        },

        inject: {
            api: DataSource
        }

    });
});