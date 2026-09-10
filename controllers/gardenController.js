const Garden = require('../models/Garden');

// GET: Display all gardens and summaries
const getGardens = async (req, res) => {
    try {
        const gardens = await Garden.find().sort({ createdAt: -1 });

        const updatedGardens = gardens.map(garden => {
            let totalIncome = 0;
            let totalExpense = 0;

            garden.transactions.forEach(t => {
                if (t.category === 'INCOME') totalIncome += t.amount;
                if (t.category === 'EXPENSE') totalExpense += t.amount;
            });

            return {
                ...garden.toObject(),
                totalIncome,
                totalExpense,
                netProfit: totalIncome - totalExpense
            };
        });

        res.render('gardens', {
            title: 'Agriculture & Baghaat Management',
            user: req.session.user,
            gardens: updatedGardens
        });
    } catch (error) {
        console.error('Error fetching gardens:', error);
        res.status(500).send('Server Error');
    }
};

// POST: Add New Garden
const addGarden = async (req, res) => {
    try {
        const { name, cropType, areaSize } = req.body;
        await Garden.create({ name, cropType, areaSize });
        res.redirect('/gardens');
    } catch (error) {
        console.error('Error adding garden:', error);
        res.status(500).send('Error adding garden');
    }
};

// POST: Add Income or Expense Entry
const addGardenTransaction = async (req, res) => {
    try {
        const { gardenId, title, category, amount, notes } = req.body;

        const garden = await Garden.findById(gardenId);
        if (!garden) return res.status(404).send('Garden record not found');

        garden.transactions.push({
            title,
            category,
            amount: Number(amount),
            notes
        });

        await garden.save();
        res.redirect('/gardens');
    } catch (error) {
        console.error('Error adding garden transaction:', error);
        res.status(500).send('Error adding transaction');
    }
};

module.exports = {
    getGardens,
    addGarden,
    addGardenTransaction
};