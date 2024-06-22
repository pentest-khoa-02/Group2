import libxmljs from "libxmljs"

// [GET] shop-cart
const getShopCart = (req, res) => {
  return res.render("shop-cart");
};

// [POST] shop-cart
const addCart = async (req, res) => {
  try {
    // Parse the XML with external entity loading enabled
    console.log(req.body)

    const test = `<productId>22</productId>`
    const doc = libxmljs.parseXmlString(test.toString(), {noent: true})
    // const data = xmlDoc.root().text();
    // console.log(data);
    console.log(doc)
  } catch (error) {
      console.error("Error parsing XML:", error);
  }
  res.json({ redirectUrl: '/shop-cart' })
}

export default { getShopCart, addCart };
