const StaffIncome = require('../models/StaffIncome');

// 1. Get All Staff Other Income Page
exports.getStaffIncomePage = async (req, res) => {
    try {
        const selectedYear = req.query.year || new Date().getFullYear().toString();
        const selectedMonth = req.query.month || 'All';

        let query = { year: selectedYear };
        if (selectedMonth !== 'All') {
            query.month = selectedMonth;
        }

        const incomes = await StaffIncome.find(query).sort({ date: -1 });

        // Calculate Total
        let totalStaffIncomeAmount = 0;
        incomes.forEach(item => {
            totalStaffIncomeAmount += Number(item.amount || 0);
        });

        res.render('staffIncome', {
            title: 'Other Income Management',
            user: req.session ? req.session.user : { username: 'Admin', role: 'Owner' },
            incomes,
            selectedYear,
            selectedMonth,
            totalStaffIncomeAmount
        });
    } catch (error) {
        console.error('Error fetching staff income:', error);
        res.status(500).send('Error loading Other Income page');
    }
};

// 2. Add New General Income Entry
exports.addStaffIncome = async (req, res) => {
    try {
        const { sourceTitle, amount, category, year, month, date, notes } = req.body;

        const newEntry = new StaffIncome({
            sourceTitle,
            amount: Number(amount),
            category: category || 'General',
            year: year || new Date().getFullYear().toString(),
            month: month || new Date().toLocaleString('en-US', { month: 'short' }),
            date: date ? new Date(date) : new Date(),
            notes
        });

        await newEntry.save();
        res.redirect(`/staff-income?year=${year}&month=${month}`);
    } catch (error) {
        console.error('Error adding staff income:', error);
        res.status(500).send('Error saving income entry');
    }
};

// 3. Delete Entry
exports.deleteStaffIncome = async (req, res) => {
    try {
        await StaffIncome.findByIdAndDelete(req.params.id);
        res.redirect('/staff-income');
    } catch (error) {
        res.status(500).send('Error deleting record');
    }
};