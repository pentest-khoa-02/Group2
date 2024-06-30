import libxmljs from "libxmljs"
import xml2js from "xml2js"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// [GET] shop-cart
const getShopCart = (req, res) => {
  return res.render("shop-cart");
};

// [POST] shop-cart
const addCart = async (req, res) => {
  // const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
  // <!DOCTYPE data [
  // <!ENTITY example SYSTEM "file:///etc/passwd">
  // ]>
  // <data>&example;</data>`;

  try {
    let xmlDoc
    const xxeStatus = await prisma.vulnSetting.findUnique({
      where: {
        name: "XXE"
      }
    })
    console.log(xxeStatus.status)
    if(xxeStatus.status === "No") {
      const blacklists = ['<!ENTITY', '<!DOCTYPE', '%', '&', ';', 'SYSTEM']
      for(let i = 0; i < blacklists.length; i++) {
        if(req.body.includes(blacklists[i])) {
          console.log('Blacklist!')
          return res.json({ message: 'Error input!', redirectUrl: '/shop-cart' })
        }
      }

      const result = await xml2js.parseStringPromise(req.body, {explicitArray: false, trim: true, preserveWhitespace: true})
      console.log(result)
      const productId = result.product.productId;
      const quantity = result.product.quantity;

      console.log('Product ID:', productId);
      console.log('Quantity:', quantity);

      const data = {
        productId: productId,  
        quantity: quantity,                
        redirectUrl: '/shop-cart'      
      };
      return res.json(data);
    }
    else {
      xmlDoc = libxmljs.parseXml(req.body, { replaceEntities: true, preserveWhitespace: true })
      console.log(xmlDoc.toString())
      const productIdNode = xmlDoc.get('//productId')
      const quantityNode = xmlDoc.get('//quantity')
      const productId = productIdNode ? productIdNode.text() : undefined
      const quantity = quantityNode ? quantityNode.text() : undefined
      console.log(productId)
      if(xxeStatus.status === "Retrieve file") {
        console.log('Retrieve file!')
        const data = {
          productId: productId,  
          quantity: quantity,                
          redirectUrl: '/shop-cart'      
        };
        return res.json(data);
      }
      else if(xxeStatus.status === "Blind") {
        console.log('Blind!')
        console.log(productId)
        if(req.body.includes('&')) {
          const data = {    
            message: 'Input have invalid character!',     
            redirectUrl: '/shop-cart'      
          };
          return res.json(data);
        }
        const data = {             
          redirectUrl: '/shop-cart'      
        };
        return res.json(data);
      }
    }
  } catch (error) {
    console.error("Error parsing XML:", error)
    return res.json({ message: 'Error input!', redirectUrl: '/shop-cart' })
  }
}

export default { getShopCart, addCart };
