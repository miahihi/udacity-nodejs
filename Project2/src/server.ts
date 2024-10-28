import express from "express";
// import routes from "./api/index";
import categoryRoutes from "./handlers/category";
import productRoutes from "./handlers/product";
import userRoutes from "./handlers/user";

const cors = require('cors');
const app = express();
const port = 3000;

// app.use("", routes);
categoryRoutes(app)
productRoutes(app)
userRoutes(app)

const corsOptions = {
    origin: 'http://purchasedomain.com',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
