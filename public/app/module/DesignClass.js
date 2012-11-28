define(['app/module/ModuleBase', "js/data/DataSource", "flow", 'sprd/model/Shop'], function(ModuleBase, DataSource, flow, Shop) {
    return ModuleBase.inherit('app.module.DesignClass', {

        defaults: {
            designs: "{user.designs}",
            searchTerm: "",
            progress: 0
        },

        inject: {
            user: "user"
        },

        designs: function(){

            if(this.$.designs){
                return this.$.designs.createQueryCollection({
                });
            }

        }.onChange('designs'),

        _handleDesignSearch: function(e){

        },

        _onSearchKey: function(e){

        }

    });
});