define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product", "flow", "sprd/model/ProductTypeGroup", "js/core/List"], function (ModuleBase, DataSource, Product, flow, ProductTypeGroup, List) {

    var typeGroups = [
        {   name: "Shirts",
            subGroups: [
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
                    name: "Jackets",
                    ids: [778]
                }
            ]
        },
        {
            name: "Hoodies",
            subGroups: [
                {
                    name: "Hoodies",
                    ids: [20]
                },
                {
                    name: "Jackets",
                    ids: [778]
                },
                {
                    name: "Longsleeves",
                    ids: [175]
                },
                {
                    name: "Workweak",
                    ids: [721]
                }
            ]

        },
        {
            name: "Trousers",
            subGroups: [
                {
                    name: "Trousers",
                    ids: [776]
                },
                {
                    name: "Shorts",
                    ids: [743]
                },
                {
                    name: "Underwear",
                    ids: [160]
                }
            ]

        },
        {
            name: "Accessorises",
            subGroups: [
                {
                    name: "Phone Cases",
                    ids: [776]
                },
                {
                    name: "Caps",
                    ids: [428]
                },
                {
                    name: "Mugs",
                    ids: [31]
                },
                {
                    name: "Bags",
                    ids: [638]
                },
                {
                    name: "Special Products",
                    ids: [55]
                }
            ]

        }

    ];

    var productTypeGroups = new List();
    for(var j = 0; j < typeGroups.length; j++){
        var typeGroup = typeGroups[j],
            productTypeGroup = new ProductTypeGroup({name: typeGroup.name, subGroups: new List()});
        for (var i = 0; i < typeGroup.subGroups.length; i++) {
            var subGroup = typeGroup.subGroups[i];
            productTypeGroup.$.subGroups.add(new ProductTypeGroup({name: subGroup.name, ids: subGroup.ids}));
        }
        productTypeGroups.add(productTypeGroup);
    }


    return ModuleBase.inherit('app.module.CreateClass', {

        defaults: {
            // the product
            product: null,
            productTypeGroups: null,
            selectedGroup: null
        },

        inject: {
            api: DataSource
        },

        ctor: function() {
            this.callBase();

            this.bind("product.configurations", "add", function () {
                // this.trigger("masterProductChanged");
            }, this);
        },

        _onProductTypeChange: function (e) {
            if (e && e.$) {
                var productType = e.$;
                productType.fetch();
            }
        },

        refresh: function() {
            this.trigger("masterProductChanged");
        },

        start: function(callback) {
            var self = this,
                user = this.$.user,
                product = user.getCollection('products').createItem(),
                productType;

            this.set('product', product);
            this.set('productTypeGroups', productTypeGroups);
            this.set('selectedGroup', productTypeGroups.at(0).$.subGroups.at(0));
            flow()
                .seq(function (cb) {
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
                .seq(function (cb) {
                    if (productType) {
                        productType.fetch(null, cb);
                    } else {
                        cb();
                    }
                })
                .seq(function () {
                    if (productType) {
                        product.set('view', productType.getDefaultView());
                        product.set('appearance', productType.getDefaultAppearance());
                    }
                })
                .exec(function() {
                    self.start.baseImplementation.call(self, callback);
                });
        },

        bus_applicationRendered: function() {

            var product = this.$.product,
                user = this.$.user;

            if (product) {
                user.$.designs.fetchPage(0, null, function () {
                    var iHeart = user.get('designs[1]');

                    product.addDesign({
                        design: iHeart
                    });
                });
            }

        }.bus("Stage.Rendered"),

        bus_configurationModified: function() {
            this.trigger("masterProductChanged");
        }.bus("ConfigurationModified"),

        getRepresentativ: function (productTypeGroup) {
            var product = this.$.product.clone(),
                productType = this.$.user.$.productTypes.createItem(productTypeGroup.$.ids[0]);

            product.setProductType(productType);

            return product;
        }.on("masterProductChanged"),

        rotateView: function () {
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
        },
        _selectGroup: function(e){
            var selectedGroup = e.target.find('group');
            this.set('selectedGroup', selectedGroup);

            var product = this.getRepresentativ(selectedGroup);
            if (product && this.$.product) {
                this.$.product.setProductType(product.$.productType);
            }

        },

        isGroupSelected: function(group){
            return this.$.selectedGroup === group;
        }.onChange("selectedGroup")
    });
});