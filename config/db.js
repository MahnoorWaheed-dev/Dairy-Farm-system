const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Path verify kar lein

// 2 Default Users (Admin aur Manager) Banane Ka Seed Function
const seedInitialUsers = async () => {
    try {
        console.log('🔄 Checking initial users in DB...');

        // 1. Owner / Admin Check
        const ownerExists = await User.findOne({ username: 'admin' });
        if (!ownerExists) {
            const hashedOwnerPass = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedOwnerPass,
                role: 'Owner'
            });
            console.log('✅ Default Owner Created: (User: admin | Pass: admin123)');
        } else {
            console.log('ℹ️ Owner account (admin) pehle se DB mein majood hai.');
        }

        // 2. Manager Check
        const managerExists = await User.findOne({ username: 'manager' });
        if (!managerExists) {
            const hashedManagerPass = await bcrypt.hash('manager123', 10);
            await User.create({
                username: 'manager',
                password: hashedManagerPass,
                role: 'Manager'
            });
            console.log('✅ Default Manager Created: (User: manager | Pass: manager123)');
        } else {
            console.log('ℹ️ Manager account (manager) pehle se DB mein majood hai.');
        }

    } catch (err) {
        console.error('❌ Error seeding initial users:', err);
    }
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');
        
        // Connection success hote hi dono users seed honge
        await seedInitialUsers();

    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;