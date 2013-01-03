define(['app/module/ModuleBase', "js/data/DataSource", "sprd/model/Product", "flow", "js/core/List", "sprd/model/ProductType"], function (ModuleBase, DataSource, Product, flow, List, ProductType) {

    var productTypeIds = [6, 20, 560, 31],
        designId = "g309197";

    return ModuleBase.inherit('app.module.Create3ModuleClass', {

        defaults: {
            title: "I heart",
            description: "",
            product: Product,
            editMode: true,
            descriptionFocused: false,

            productTypes: List
        },


        inject: {
            api: DataSource
        },

        ctor: function() {
            this.callBase();


            this.bind("product", "change:productType", function() {
                this.trigger("productTypeChanged")
            }, this);
        },

        start: function(callback) {

            var self = this,
                user = this.$.user,
                design;

            flow()
                .seq(function(cb) {
                    user.fetch(null, cb);
                })
                .seq(function() {
                    for (var i = 0; i < productTypeIds.length; i++) {
                        self.$.productTypes.add(self.$.user.$.productTypes.createItem(productTypeIds[i]));
                    }
                })
                .seq(function(cb) {
                    design = user.$.designs.createItem(designId);
                    design.fetch(null, cb);
                })
                .parEach(this.$.productTypes.$items, function(productType, cb) {
                    productType.fetch(null, cb);
                })
                .seq(function(cb) {
                    self.$.product.setProductType(self.$.productTypes.at(0), cb);
                })
                .seq(function(cb) {
                    self.$.product.addDesign({
                        design: design
                    }, function(err, designConfiguration) {
                        if (err) {
                            cb(err);
                        } else {

                            designConfiguration.isRotatable = function() {
                                return false;
                            };

                            designConfiguration.isRemovable = function() {
                                return false;
                            };

                            cb();
                        }
                    });
                })
                .exec(function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        self.start.baseImplementation.call(self, callback);
                    }
                });
        },

        checkInput: function(e) {
            if (e.$.keyCode == 13) {
                e.$.preventDefault();
            }
        },

        saveTitle: function(e) {
            this.set('title', e.$.target.innerText);
        },

        saveDescription: function(e) {
            this.set('description', e.$.target.innerText);
            this.set('descriptionFocused', false);
        },

        focusDescription: function() {
            this.set('descriptionFocused', true);
        },

        description: function(value) {

            if (this.$.descriptionFocused && !this.$.description) {
                return ">";
            }

            return this.$.description || ("This " + this.$.title + " " + this.get('product.productType.name') + " is ...");
        }.onChange("title", "descriptionFocused").on("productTypeChanged")

    });
});