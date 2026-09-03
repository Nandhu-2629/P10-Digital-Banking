require("dotenv").config();
const connectDB = require("../config/db");
const seedStaff = require("../utils/seedStaff");

(async () => {
  try {
    await connectDB();
    const user = await seedStaff();
    console.log(`Staff ready: ${user.email}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
