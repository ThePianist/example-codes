const get_number_of_products_of_ingredient = function (ingredientId) {
    return new Promise(function (resolve, reject) {
        Product.find({
            ingredients: {
                $in: {
                    _id: ingredientId
                }
            }
        }, function (err, products) {
            if (err)
                reject(err);

            resolve(products.length);
        });
    })
}

exports.list_all_ingredients = function (req, res) {
    Ingredient.find()
        .lean()
        .exec(function (err, ingredients) {
            if (err)
                res.send(err);

            let calculatedProductCounts = [];
            // let's ask the number of products that an ingredient uses
            for (let i = 0; i < ingredients.length; i++) {
                calculatedProductCounts.push(get_number_of_products_of_ingredient(ingredients[i]._id))
            }

            Promise.all(calculatedProductCounts).then(function (values) {
                // after all the product number came, attach it to each ingredient objects
                for (let i = 0; i < values.length; i++) {
                    ingredients[i].products = values[i];
                }

                res.json(ingredients);
            });
        });
};
