define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product", "flow"], function(ModuleBase, DataSource, Product, flow) {
    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            // the product
            product: null
        },

        inject: {
            api: DataSource
        },

        _onProductTypeChange: function (e) {
            if (e && e.$) {
                var productType = e.$;
                productType.fetch();
            }
        },

        start: function(parameter, callback) {
            var self = this,
                user = this.$.user,
                product = user.getCollection('products').createItem(),
                productType;

            this.set('product', product);

            flow()
                .seq(function(cb) {
                    if (!(product && product.$.productType)) {
                        user.$.productTypes.fetchPage(0, null, function () {
                            productType = user.get('productTypes[1]');
                            product.set('productType', productType);
                            cb();
                        });
                    } else {
                        cb();
                    }
                })
                .seq(function(cb) {
                    if (productType) {
                        productType.fetch(null, cb);
                    } else {
                        cb();
                    }
                })
                .seq(function(){
                    if (productType) {
                        product.set('view', productType.getDefaultView());
                        product.set('appearance', productType.getDefaultAppearance());
                    }
                })
                .exec(function() {
                    self.start.baseImplementation.call(self, parameter, callback);
                });

        },

        rotateView: function() {
            var product = this.$.product;
            if (product && product.$.view && product.$.productType && product.$.productType.$.views) {

                var productType = product.$.productType;
                var index = productType.$.views.indexOf(product.$.view);

                if (index !== -1) {
                    // view found
                    var size = productType.$.views.size();
                    index = index - 1 + size;
                    index = index % size;

                    product.set('view', productType.$.views.at(index));
                }

            }
        }

    });
});