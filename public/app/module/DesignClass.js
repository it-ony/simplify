define(['app/module/ModuleBase', "js/data/DataSource", "flow", 'sprd/model/Shop'], function(ModuleBase, DataSource, flow, Shop) {
    return ModuleBase.inherit('app.module.DesignClass', {

        defaults: {
            designs: null,
            searchTerm: "",
            progress: 0
        },

        inject: {
            api: DataSource
        },

        start: function(){

            var api = this.$.api,
                shop = api.createEntity(Shop, 205909);

            var self = this;

            flow()
                .seq(function (cb) {
                    shop.fetch(null, cb);
                })
                .seq(function (cb){
                    self.set('designs', shop.getCollection('designs'));
                })
                .exec();

            this.callBase();
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