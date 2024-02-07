//imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const sequelize = require("./utilities/database");
//importing models
const User = require("./models/userModel");
const Expense = require("./models/expenseModel");
const Order = require("./models/ordersModel");
const ReportFiles = require("./models/fileReportsModel");
const ForogotPassword = require("./models/passwordResetModel");

//importing routes
const loginRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const resetRoutes = require("./routes/passwordResetRoutes");

//table relations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForogotPassword);
ForogotPassword.belongsTo(User);

User.hasMany(ReportFiles);
ReportFiles.belongsTo(User);

const app = express();

app.use(cors({
  origin: ["http://43.205.233.208:3000"]
}));

app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

//middleware
app.use("/user", loginRoutes);
app.use("/expense", expenseRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", resetRoutes);
app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `/public/${req.url}`));
});

sequelize.sync().then(() => {
  const port = process.env.PORT;
  console.log(`Server started at ${port}`);
  app.listen(port);
});