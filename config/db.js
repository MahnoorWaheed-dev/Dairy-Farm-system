const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Model ka path check kar lein

// Auto-seed function
const seedDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'Owner'
            });
            console.log('✅ Default Admin created in Online DB: (User: admin | Pass: admin123)');
        } else {
            console.log('ℹ️ Admin account already exists in Online DB.');
        }
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to Online MongoDB Atlas');
        
        // Connection successfully open hote hi admin check/seed hoga
        await seedDefaultAdmin();

    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;