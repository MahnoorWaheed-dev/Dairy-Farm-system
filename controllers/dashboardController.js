const Shop = require('../models/Shop');
const Garden = require('../models/Garden');
const Person = require('../models/Person');
const RentTransaction = require('../models/RentTransaction');

exports.getDashboard = async (req, res) => {
    try {
        // 1. Fetch Shops Data
        const totalShops = await Shop.countDocuments();
        const shops = await Shop.find();
        
        let totalMonthlyRent = 0;
        let pendingThisMonth = 0;

        shops.forEach(shop => {
            const rent = Number(shop.rentAmount || shop.rent || shop.monthlyRent || 0);
            totalMonthlyRent += rent;

            if (shop.pendingAmount && Number(shop.pendingAmount) > 0) {
                pendingThisMonth += Number(shop.pendingAmount);
            } else if (shop.status && (shop.status.toLowerCase() === 'pending' || shop.status.toLowerCase() === 'unpaid')) {
                pendingThisMonth += rent;
            }
        });

        // 2. Fetch Rent Transactions (This Month Income)
        const rentTransactions = await RentTransaction.find();
        let receivedThisMonth = 0;
        rentTransactions.forEach(tx => {
            receivedThisMonth += Number(tx.amountPaid || tx.amount || 0);
        });

        // 3. Fetch Agriculture / Gardens Data
        const totalGardens = await Garden.countDocuments();
        const gardens = await Garden.find();
        let agricultureIncome = 0;
        gardens.forEach(g => {
            agricultureIncome += Number(g.advanceAmount || g.totalIncome || 0);
        });

        // 4. Fetch Staff Data
        const totalStaff = await Person.countDocuments();

        // 5. Overall Financial Calculations
        const totalIncomeThisMonth = receivedThisMonth + agricultureIncome;
        const totalExpensesThisMonth = 0; // Add expense aggregation if needed
        const netThisMonth = totalIncomeThisMonth - totalExpensesThisMonth;

        res.render('dashboard', {
            title: 'Dashboard | Management System',
            user: req.session ? req.session.user : { username: 'Admin', role: 'Owner' },
            totalShops,
            totalGardens,
            totalStaff,
            totalMonthlyRent,
            receivedThisMonth,
            pendingThisMonth,
            agricultureIncome,
            totalIncomeThisMonth,
            totalExpensesThisMonth,
            netThisMonth
        });

    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.status(500).send('Server Error loading dashboard data');
    }
};