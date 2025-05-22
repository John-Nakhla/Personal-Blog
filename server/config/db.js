const mongoose = require('mongoose');
const connectDB = async()=>{
    try {
        console.log("heree1");
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("heree2");
        console.log(error);
    }
}

module.exports = connectDB;