const express = require("express")
const server = express()
const mongoose = require("mongoose");
const cors = require("cors");
server.use(express.json())  // to parse req.body
server.use(cors({
  exposedHeaders: ['X-Total-Count']
}))
const productsRouter = require("./routes/Products")
const categoriesRouter = require("./routes/Categories")
const brandsRouter = require("./routes/Brands")
// middleware
server.use('/products', productsRouter.router)
server.use('/categories', categoriesRouter.router)
server.use('/brands', brandsRouter.router)
//connection for database
main().catch(err => console.error(err))
async function main() {
  await mongoose.connect("mongodb://localhost:27017/ecommerce");
  console.log("Connected to the database");
}

server.get("/", (req, res) => {
    res.json({status: "success"})
})



server.listen(8080, () => {
    console.log("server stated on port 8080")
})