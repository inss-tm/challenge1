
import "dotenv/config"
import connectDB from "./config/database.js";
import { connectRedis } from "./config/redis.js";


import dotenv from "dotenv";
import app from "./app.js"
dotenv.config({
path: './.env'
});
const startServer= async () => {
try{
await connectDB();

await connectRedis();
app.on("error", (error) =>{
console.log("ERROR", error);
throw error;
});
app.listen(process.env.PORT || 8000, () => {
console.log(`server is running on port : ${process.env.PORT}`);

}
);

} catch (error){

console.log ("mongoDB connection failed ",error);

}
}
startServer();