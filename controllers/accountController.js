const getAccount = async (req, res) =>  {
    try {
      res.render("shop-product-right");
    } catch (err) {
      console.log(err);
      res.render("page-404");
    }
}

export default { getAccount };
