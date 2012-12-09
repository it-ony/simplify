define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product"], function(ModuleBase, DataSource, Product) {
    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            designs: "{user.designs}",

            // the product
            product: Product,
            currentView: null
        },

        inject: {
            api: DataSource
        },

        designs: function () {

            if (this.$.designs) {
                return this.$.designs.createQueryCollection({
                });
            }

        }.onChange('designs'),

        initialize: function () {
            this.bind('product', 'change:productType', this._onProductTypeChange, this);

            this.callBase();
        },

        _onProductTypeChange: function (e) {
            if (e && e.$) {
                var productType = e.$;
                productType.fetch();
            }
        },

        start: function() {
            var user = this.$.user,
                product = this.$.product;

            if (!(product && product.$.productType)) {
                user.$.productTypes.fetchPage(0, {
                    fullData: true
                }, function() {
                    var productType = user.get('productTypes[1]');

                    product.set('productType', productType);
                    if (productType) {
                        product.set('appearance', productType.getDefaultAppearance());
                    }
                });
            }

            this.callBase();

        }

    });
});