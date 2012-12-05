define(['app/module/ModuleBase', "js/data/DataSource", "flow", 'sprd/model/Shop'], function(ModuleBase, DataSource, flow, Shop) {
    return ModuleBase.inherit('app.module.DesignClass', {

        defaults: {
            designs: "{user.designs}",
            selectedDesign: null,
            searchTerm: "",
            progress: 0,

            gap: 40,
            minWidth: 170,
            maxWidth: 300,
            pageSize: 40,
            cols: 3,
            itemSize: 170
        },

        inject: {
            user: "user"
        },

        initialize: function () {
            this.callBase();
            this.bind('designList', 'change:width', this.calculateCols, this);
        },

        designs: function(){

            if(this.$.designs){
                return this.$.designs.createQueryCollection({
                });
            }

        }.onChange('designs'),


        calculateCols: function (e) {
            var width = e.$;
            var minCols = (width + this.$.gap ) / (this.$.minWidth + this.$.gap);
            var maxCols = (width + this.$.gap ) / (this.$.maxWidth + this.$.gap);
            var cols = Math.round((minCols + maxCols) / 2);
            if (cols > 0) {
                var itemWidth = Math.ceil((width - (cols) * this.$.gap) / cols);
                this.set({
                    itemSize: itemWidth,
                    cols: cols
                });
            }
        },

        showDesign: function(routeContext, designId){
            var design = this.$.designs.createItem(designId);
            this.set('selectedDesign', design);

            var self = this;
            this.$.designDialog.showModal(function(){
                self.$stage.$history.navigate('m/design');
            });

            design.fetch(null, routeContext.callback);
        }.async(),

        _handleDesignSearch: function(e){

        },

        _onSearchKey: function(e){

        }

    });
});