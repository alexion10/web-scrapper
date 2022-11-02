const puppeteer = require('puppeteer')
const nodemailer = require("nodemailer");


const sendEmail = async (product) => {
   let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'email', // generated ethereal user
        pass: 'email password', // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Your name " <your@email.ro>', // sender address
      to: "email, email", // list of receivers
      subject: `Product ${product.getTitle} is under ${product.getPrice}`, // Subject line
      html: `<table>
      <tr>
        <th>Title</th>
        <th>Price</th>
        <th>Product Link</th>
      </tr>
      <tr>
        <td>${product.getTitle}</td>
        <td>${product.getPrice}</td>
        <td>${product.getLink}</td>
      </tr>
    </table>`, // html body
    });
}

const url = ''; //base url
const selectorTitle = ''; //selector for title
const selectorPrice = ''; //selector for price
const selectorLink = ''; //selector for price
const priceTarget = ''; //your desired price limit

//one page
const scrape = async (selectorTitle, selectorPrice, selectorLink, url) => {
   const browser = await puppeteer.launch({})
   const page = await browser.newPage()

   await page.goto(url)

   const productTitle = await page.waitForSelector(selectorTitle);
   const getTitle = await page.evaluate(el => el.textContent, productTitle);
   
   const productPrice = await page.waitForSelector(selectorPrice);
   const getPrice = await page.evaluate(el => el.textContent, productPrice);

   const productLink = await page.waitForSelector(selectorLink);
   const getLink = await page.evaluate(el => el.textContent, productLink);


   const product = {
      title: getTitle,
      price: getPrice,
      link: getLink
   }

   if(Number(product.getPrice) < Number(priceTarget)) 
      sendEmail(product)
   browser.close()

}

scrape(selectorTitle, selectorPrice, selectorLink, url);
