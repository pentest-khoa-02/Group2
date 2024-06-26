import productService from "../services/productService";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()


const getProduct = async (req, res) => {
  const query = req.query;
  if (query.id) {
    try {
      const productId = parseInt(query.id)
      let product = await productService.getProductById(productId);
      
      res.render("shop-product-right", {
        product,
      })
    } catch (err) {
      console.log(err);
      res.render("page-404");
    }
  } else {
    res.render("page-404");
  }
};

const addCartProduct = async (req, res) => {

}

const searchProduct = async (req, res) => {
  const query = req.query
  const name = query.name
  let product

  const SQLIstatus = await prisma.vulnSetting.findUnique({
    where: {
      name: "SQLI"
    }
  })
  try{
    if(SQLIstatus.status === "No" || SQLIstatus.status === "Login"){
      const regex = /^[a-zA-Z0-9]+$/

      for (const key in query) {
        if (!regex.test(query[key])) {
            return res.status(400).send('Invalid characters in query parameters');
        }
      }
      product = await productService.getProductByName(name);
    }
    else if(SQLIstatus.status === "Blind SQLI"){
      product = await prisma.$queryRawUnsafe(`SELECT title, picture, summary, description from public."Product" where title = '${name}'`)
    }
    if(Object.keys(product).length === 0){
      return res.send("No product found!")
    }
    else{
      return res.send("Found product!")
    }
  }
  catch(err){
    res.send("No product found!")
  }
}

export default { getProduct, searchProduct, addCartProduct };

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