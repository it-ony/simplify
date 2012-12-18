define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product", "flow", "sprd/model/ProductTypeGroup", "js/core/List"], function(ModuleBase, DataSource, Product, flow, ProductTypeGroup, List) {

    var typeGroups = [
        {
            name: "T-Shirts",
            ids: [6]
        },
        {
            name: "Slimfits",
            ids: [84]
        },
        {
            name: "Polos",
            ids: [281]
        },
        {
            name: "Hoodies",
            ids: [20]
        },
        {
            name: "Longsleeves",
            ids: [175]
        },
        {
            name: "Jackets",
            ids: [778]
        },
        {
            name : "Bags",
            ids: [638]
        },
        {
            name: "Mugs",
            ids: [31]
        }
    ];

    var productTypeGroups = new List();
    for(var i = 0; i < typeGroups.length; i++){
        var typeGroup = typeGroups[i];
        productTypeGroups.add(new ProductTypeGroup({name: typeGroup.name, ids: typeGroup.ids}));
    }


    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            // the product
            product: null,
            productTypeGroups: null
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
            this.set('productTypeGroups', productTypeGroups);
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
        getRepresentativ: function(productTypeGroup){

            var product = this.$.product.clone(),
                productType = this.$.user.$.productTypes.createItem(productTypeGroup.$.ids[0]);

//            productType.fetch();

            product.setProductType(productType);

            return product;
        }
    });
});