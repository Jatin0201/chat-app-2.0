import mongoose from "mongoose";

export const connectDB = async () => {
   try {
      const { MONGO_URI } = process.env;
      if (!MONGO_URI) throw new Error("MONGO_URI is not set") 
      const cons = await mongoose.connect(process.env.MONGO_URI);
      console.log("MONGODB CONNECTED:",cons.connection.host);
   } catch (error) {
      console.log("ma chuda le ", error);
      process.exit(1);
   }
};
