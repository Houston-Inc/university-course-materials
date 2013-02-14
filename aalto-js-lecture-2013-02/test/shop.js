var shop = shop || {};

describe('Basket', function(){

    beforeEach(function(done){
        shop.basket.init();
        shop.productManager.init();
        shop.discountManager.init();

        shop.productManager.addProduct({
            id: "1",
            description: "HDMI cable",
            price: 11.0
        });
        shop.productManager.addProduct({
            id: "2",
            description: "Android phone",
            price: 100.10
        });
        shop.productManager.addProduct({
            id: "3",
            description: "iPad",
            price: 399.95
        });

        done();
    });

    describe('#addItem()', function(){

        it('should add a single item', function(){
            shop.basket.addItem(1);
            expect(shop.basket.getItemCount()).to.be(1);
        });

        it('should add two separate items', function(){
            shop.basket.addItem(1);
            shop.basket.addItem(2);
            expect(shop.basket.getItemCount()).to.be(2);
        });

        it('should add items with multiple quantities', function(){
            shop.basket.addItem(1, 100);
            shop.basket.addItem(2, 5);
            expect(shop.basket.getItemCount()).to.be(105);
        });

    });

    describe('#removeItem()', function(){

        it('should remove correct item', function(){
            shop.basket.addItem(1);
            shop.basket.addItem(2);
            expect(shop.basket.getItemCount()).to.be(2);
            shop.basket.removeItem("1");
            expect(shop.basket.getItemCount()).to.be(1);
            expect(shop.basket.getItem("1")).to.be(undefined);
            expect(shop.basket.getItem("2")).not.to.be(undefined);
        });

    });

    describe('#emptyBasket()', function(){

        it('should remove all items', function(){
            shop.basket.addItem(1);
            shop.basket.addItem(2);
            expect(shop.basket.getItemCount()).to.be(2);
            shop.basket.emptyBasket();
            expect(shop.basket.getItemCount()).to.be(0);
        });

    });

    describe('#getTotalPrice()', function(){

        it('should return 0 for total price when cart is initialized', function(){
            expect(shop.basket.getTotalPrice()).to.be(0);
        });

        it('should return correct price when one item in basket', function(){
            shop.basket.addItem(3);
            expect(shop.basket.getTotalPrice()).to.be(399.95);
        });

        it('should return correct price when two items in basket', function(){
            shop.basket.addItem(1);
            shop.basket.addItem(2);
            expect(shop.basket.getTotalPrice()).to.be(111.10);
        });

        it('should return correct price when two items added at once', function(){
            shop.basket.addItem(1,2);
            expect(shop.basket.getTotalPrice()).to.be(22);
        });

        it('should return correct price when 100 items added at once', function(){
            shop.basket.addItem(1,100);
            expect(shop.basket.getTotalPrice()).to.be(11*100);
        });

        it('should return correct price when multiple items added to basket" ', function(){
            shop.basket.addItem(1,8);
            shop.basket.addItem(2,3);
            shop.basket.addItem(3,2);
            expect(shop.basket.getTotalPrice()).to.be(11*8+100.10*3+399.95*2);
        });

        it('should return correct price when basket contains 1 item with discount percent -50% for 1 item', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 1,
                discountPercent: 0.5
            });

            shop.basket.addItem(1);
            expect(shop.basket.getTotalPrice()).to.be(11*0.5);
        });

        it('should return correct price when basket contains 3 item with discount percent -50% for 2 item', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 2,
                discountPercent: 0.5
            });

            shop.basket.addItem(1,3);
            expect(shop.basket.getTotalPrice()).to.be(11*2*0.5+11);
        });

        it('should return correct price when basket contains 5 items with fixed discount price for 5 items', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 5,
                fixedPrice: 50
            });

            shop.basket.addItem(1,5);
            expect(shop.basket.getTotalPrice()).to.be(50);
        });

        it('should return correct price when basket contains 9 items with fixed discount price for 5 items', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 5,
                fixedPrice: 50
            });

            shop.basket.addItem(1,9);
            expect(shop.basket.getTotalPrice()).to.be(50+11*4);
        });

        it('should return correct price when basket contains 3 items with discount "take 3 buy 2" ', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 3,
                freeItems: 1
            });

            shop.basket.addItem(1,3);
            expect(shop.basket.getTotalPrice()).to.be(11*3-11);
        });

        it('should return correct price when basket contains 8 items with discount "take 3 buy 2" ', function(){

            shop.discountManager.addDiscount({
                productId: "1",
                quantityLimit: 3,
                freeItems: 1
            });

            shop.basket.addItem(1,8);
            expect(shop.basket.getTotalPrice()).to.be(11*8-11*2);
        });

        it('should return correct price when multiple items added to basket (some containing discounts)', function(){

            shop.discountManager.addDiscount({
                productId: "2",
                quantityLimit: 2,
                fixedPrice: 150
            });

            shop.basket.addItem(1,8);
            shop.basket.addItem(2,3);
            shop.basket.addItem(3,2);
            expect(shop.basket.getTotalPrice()).to.be(11*8+150+100.10+399.95*2);
        });

    });

});
