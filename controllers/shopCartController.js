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
      xmlDoc = libxmljs.parseXml(req.body, { replaceEntities: false, preserveWhitespace: true })
      const productIdNode = xmlDoc.get('//productId')
      const quantityNode = xmlDoc.get('//quantity')
      const productId = productIdNode ? productIdNode.text() : undefined
      const quantity = quantityNode ? quantityNode.text() : undefined
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
