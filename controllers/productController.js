import productService from "../services/productService";

const getProduct = async (req, res) => {
  const query = req.query;
  if (query.id) {
    try {
      const product = await productService.getProductById(parseInt(query.id));
      res.render("shop-product-right", {
        product,
      });
    } catch (err) {
      console.log(err);
      res.render("page-404");
    }
  } else {
    res.render("page-404");
  }
};

export default { getProduct };

// import productService from "../services/productService";

// const getProduct = async (req, res) => {
//   const query = req.query;
//   const checkFilter = Object.keys(query).length
//   if (query.id && checkFilter === 1) {
//     try {
//       const product = await productService.getProductById(parseInt(query.id));
//       res.render("shop-product-right", {
//         product,
//       });
//     } catch (err) {
//       console.log(err);
//       res.render("page-404");
//     }
//   } else {
//     res.render("page-404");
//   }
// };

// export default { getProduct };