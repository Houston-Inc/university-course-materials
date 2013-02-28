var shop = shop || {};

shop.basket = (function(){

    // Private properties
    var items = {};

    // Private methods
    var _reset = function(){
        items = {};
    };

    var _getDiscountPrice = function(i, d){
        var q = 'quantity';var ql = 'quantityLimit';var p = 'price';var fp = 'fixedPrice';var dp = 'discountPercent';var fi = 'freeItems';var c = i[q] % d[ql];if (d[fp]) {return d[fp]+c*i[q];} else if (d[dp]) {return i[p]*(i[q]-c)*d[dp]+i[p]*c;} else if (d[fi]) {return i[p]*i[q]-Math.floor(i[q]/d[ql])*i[p];}
    };

    // Public api
    return {
        init: function(){
            _reset();
        },
        addItem: function(itemId, quantity){

            quantity = (typeof quantity === "undefined") ? 1 : quantity;

            var item = shop.productManager.getProduct(itemId);
            item.quantity = quantity;

            if (items[itemId]) {
                item.quantity += items[itemId].quantity;
            }

            items[item] = item;
        },
        getItem: function(id){
            return items[id];
        },
        getItemCount: function(){

            var totalItems = 0;
            for (var id in items) {
                if (items.hasOwnProperty(id)) {
                    totalItems+=items[id].quantity;
                }
            }

            return totalItems;

        },
        removeItem: function(id){
            if (id in items) {
                delete items[id];
            }
        },
        emptyBasket: function(){
            reset();
        },
        getTotalPrice: function(){

            var totalPrice = 0;
            for (var id in items) {
                if (items.hasOwnProperty(id)) {

                    var item = items[id];
                    var discount = shop.discountManager.getDiscount(id);

                    if (discount!==undefined && item.quantity >= discount.quantityLimit) {
                        totalPrice += _getDiscountPrice(item, discount);
                    } else {
                        totalPrice+=item.price*item.quantity;
                    }

                }
            }

            return totalPrice;

        }
    };
})();


shop.productManager = (function(){

    // Private properties
    var products = {};

    // Private methods
    var _reset = function(){
        products = {};
    };

    // Public api
    return {
        init: function(){
            _reset();
        },
        addProduct: function(product){
            products[product.id] = product;
        },
        getProduct: function(id){
            return products[product.id];
        }
    };
})();


shop.discountManager = (function(){

    // Private properties
    var discounts = {};

    // Private methods
    var _reset = function(){
        discounts = {};
    };

    // Public api
    return {
        init: function(){
            _reset();
        },
        addDiscount: function(discount){
            discounts[discount.productId] = discount;
        },
        getDiscount: function(productId){
            return discounts[productId];
        }
    };
})();
