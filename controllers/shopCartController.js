import libxmljs from "libxmljs"
import xml2js from "xml2js"
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import {DOMParser} from 'xmldom';

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
    if(xxeStatus.status === "No") {
      const blacklists = ['<!ENTITY', '<!DOCTYPE', '%', '&', ';', 'SYSTEM']
      for(let i = 0; i < blacklists.length; i++) {
        if(req.body.includes(blacklists[i])) {
          console.log('Blacklist!')
          return res.json({ message: 'Error input!', redirectUrl: '/shop-cart' })
        }
      }

      const result = await xml2js.parseStringPromise(req.body, {explicitArray: false, trim: true, preserveWhitespace: true})
      const productId = result.product.productId;
      const quantity = result.product.quantity;

      const data = {
        message: "success",
        productId: productId,  
        quantity: quantity,                
        redirectUrl: '/shop-cart'      
      };
      return res.json(data);
    }
    else {
      xmlDoc = libxmljs.parseXml(req.body, { replaceEntities: true, preserveWhitespace: true })
      const productIdNode = xmlDoc.get('//productId')
      const quantityNode = xmlDoc.get('//quantity')
      const productId = productIdNode ? productIdNode.text() : undefined
      const quantity = quantityNode ? quantityNode.text() : undefined
      console.log(xmlDoc)

      if(xxeStatus.status === "Retrieve file") {
        console.log('Retrieve file!')
        const data = {
          message: "success",
          productId: productId,  
          quantity: quantity,                
          redirectUrl: '/shop-cart'      
        };
        return res.json(data);
      }
      else if(xxeStatus.status === "Blind") {
        console.log('Blind!')
        // if(req.body.includes('&')) {
        //   const data = {    
        //     message: 'Input have not allowed character!',     
        //     redirectUrl: '/shop-cart'      
        //   };
        //   return res.json(data);
        // }
        const data = {   
          message: "success",          
          redirectUrl: '/shop-cart'      
        };
        return res.json(data);
      }
    }
  } catch (error) {
    console.error("Error parsing XML:", error)
    return res.json({ message: error, redirectUrl: '/shop-cart' })
  }
}

export default { getShopCart, addCart };
