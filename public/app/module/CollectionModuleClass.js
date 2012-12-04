define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Shop", "flow","js/core/List"], function(ModuleBase, DataSource, Shop, flow, List) {
    return ModuleBase.inherit('app.module.CollectionClass', {

        defaults: {
            showTileList: true,
            collection: null,
            showProducts: true,
            selectedCollection: '{collectionList.selectedItems.at(0)}',
            selectedArticle: '{articleList.selectedItems.at(0)}'
        },

        inject: {
            api: DataSource
        },

        start: function(){
            // TODO: add name to index data
            this.$.user.$.shops.fetch({fullData:true});

            this.callBase();
        },

        _commitSelectedCollection: function(collection){
            if(collection){
                this.set('showProducts',false);
                this.$stage.$history.navigate('m/collections/'+collection.$.id);
            }
        },

        defaultRoute: function (routeContext) {
            if(this.$.selectedCollection){
                this.$stage.$history.navigate('m/collections/'+this.$.selectedCollection.$.id);
            } else {
                this.$stage.$history.navigate('m/collections/products');
            }
            routeContext.callback();
        }.async(),
        showProducts: function(){
            this.set('showProducts', true);
            this.$.collectionList.$.selectedItems.clear();
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
        }.async(),

        _showTileList: function(){
            this.set('showTileList',true);
        },
        _showDataGrid: function(){
            this.set('showTileList',false);
        },
        _startEdit: function(e){
            e.target.addClass('edit');
        },
        _endEdit: function(e){
            if(e.domEvent.keyCode === 13){
                e.target.removeClass('edit');
            }
        }
    });
});