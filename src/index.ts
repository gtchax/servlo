import mongoose from 'mongoose'
import app from "./app";

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('Connect to DB')
  } catch (error) {
    console.error(error);
  }

  app.listen(8000, () => {
    console.log("Listening on port 3000");
  });
};

start();
