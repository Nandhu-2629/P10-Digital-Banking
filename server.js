require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { calculateInterest } = require("./controllers/jobController");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.json({
  success: true,
  message: "Digital Banking Account & Transaction Management System API",
  version: "1.0.0"
}));
app.get("/api/health", (req, res) => res.json({ success: true, message: "API is healthy" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/accounts", require("./routes/accountRoutes"));
app.use("/api/beneficiaries", require("./routes/beneficiaryRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  cron.schedule("59 23 * * *", async () => {
    try {
      const result = await calculateInterest();
      console.log("Daily interest job:", result);
    } catch (err) {
      console.error("Interest job failed:", err.message);
    }
  });
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch(err => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
}

module.exports = app;
