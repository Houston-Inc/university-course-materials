var shop = shop || {}
var items
var products
var discounts

var excl

function _getDiscountPrice(item, discount, perc){
    // Begin function

    var totalDiscount = perc;

    excl = item.quantity % discount.quantityLimit;

    if ((discount.fixedPrice > 0) && discount.discountPercent != true && (discount.freeItems != true))
        return (discount.fixedPrice+(excl*item.price))
else if (discount.discountPercent)
{
    if(discount.freeItems != true) {
        
        return ((item.price*(item.quantity-excl))*discount.discountPercent+(item.price*excl))
        
    } else {
        // TODO: what should we do?
    }
} 
    else if (discount.freeItems)
        return item.price*item.quantity-Math.floor(item.quantity/discount.quantityLimit)*item.price

    return totalDiscount
    // End function
}


function totalPrice(){             
    var totalPrice = 0;
    for (var id in items) {
        if (items.hasOwnProperty(id)) {

            var item = items[id];
            var discount = shop.discountManager.getDiscount(id);

            if (discount!==undefined && item.quantity >= discount.quantityLimit) {
                totalPrice += _getDiscountPrice(item, discount, null);
            } else {
                totalPrice+=item.price*item.quantity;
            }

        }
    }

    return totalPrice;
}

function _reset() {
    items = {}
    products = {}
    discounts = {}
}

shop.basket = (function(){

    // Private properties
    //var items = {};

    // Private methods
    /*
    var _reset = function()
    {
        items = {}
    }
    */
/*
    var _getDiscountPrice = function(item, discount){
        itemCountExcludedFromDiscount = item.quantity % discount.quantityLimit;

        if (discount.fixedPrice)
            return discount.fixedPrice+itemCountExcludedFromDiscount*item.price
        else if (discount.discountPercent)
            return item.price*(item.quantity-itemCountExcludedFromDiscount)*discount.discountPercent+
                item.price*itemCountExcludedFromDiscount
        else if (discount.freeItems)
            return item.price*item.quantity-Math.floor(item.quantity/discount.quantityLimit)*item.price
    }
*/
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

            items[itemId] = item;
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
            _reset();
        },

        getTotalPrice: totalPrice
        
        /*getTotalPrice: function(){             

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
        */
    };
}());


shop.productManager = (function(){

    // Private properties
    //var products = {};

    // Private methods
    /*
    var _reset = function(){
        products = {};
    };
*/
    // Public api
    return {
        init: function(){
            _reset();
        },
        addProduct: function(product){
            products[product.id] = product;
        },
        getProduct: function(id){
            return products[id];
        }
    };
}());


shop.discountManager = (function(){

    // Private properties
    //var discounts = {};

    // Private methods
    /*
    var _reset = function(){
        discounts = {};
    };
*/
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
}());
