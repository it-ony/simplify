define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product", "flow", "sprd/manager/ProductManager"], function(ModuleBase, DataSource, Product, flow, ProductManager) {
    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            designs: "{user.designs}",
            // the product
            product: null
        },

        inject: {
            api: DataSource,
            productManager: ProductManager
        },

        designs: function () {

            return this.$.designs;

        }.onChange('designs'),

        initialize: function () {
            this.bind('product', 'change:productType', this._onProductTypeChange, this);
            this.bind('productTypeList.selectedItems','all', this._onSelectionChange, this);
            this.callBase();
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
                        product.set('appearance', productType.getDefaultAppearance());
                    }
                })
                .exec(function() {
                    self.start.baseImplementation.call(self, parameter, callback);
                });

        },

        onDesignClick: function(e) {

            var product = this.$.product;

            if (e && product) {
                var dataItem = e.target.find('$dataItem');
                if (dataItem) {
                    var design = dataItem.$.data;

                    design && this.$.productManager.addDesign(product, {
                        design: design
                    }, function (err) {
                        if (err) {
                            // TODO: notify user
                            console.log(err + err.stack);
                        }
                    });
                }
            }

        },

        onProductTypeClick: function(e) {
            var product = this.$.product;

            if (e && product) {
                var dataItem = e.target.find('$dataItem');
                if (dataItem) {
                    var productType = dataItem.$.data;

                    product.setProductType(productType, function(err) {
                        if (err) {
                            console.log(err + err.stack);
                        }
                    });
                }
            }
        },

        _createProduct: function(){
            if(this.$.product){
                this.$.product.save(null, function(err){
                     console.log(err);
                });
            }
        }

    });
});