import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected ✅ : ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};


// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { Pool } = pg;

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// export const connectDB = async () => {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("PostgreSQL Connected");
//   } catch (err) {
//     console.log("DB Connection Error:", err.message);
//   }
// };

// export default pool;