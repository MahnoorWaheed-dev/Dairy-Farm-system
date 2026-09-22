const Shop = require('../models/Shop');
const Garden = require('../models/Garden');
const Person = require('../models/Person');
const RentTransaction = require('../models/RentTransaction');

exports.getFinancialReport = async (req, res) => {
    try {
        const selectedMonth = req.query.month || new Date().toLocaleString('en-US', { month: 'short' });
        const selectedYear = req.query.year || new Date().getFullYear().toString();

        // 1. Fetch Shop Rent Data
        const rentTxList = await RentTransaction.find().populate('shopId').sort({ createdAt: -1 });
        let totalRentIncome = 0;
        rentTxList.forEach(tx => {
            totalRentIncome += Number(tx.amountPaid || tx.amount || 0);
        });

        // 2. Fetch Agriculture / Garden Data (From currentLease object)
        const gardens = await Garden.find();
        let totalGardenIncome = 0;

        gardens.forEach(g => {
            if (g.currentLease) {
                // Total Income ya Advance Amount from nested currentLease
                const leaseVal = Number(g.currentLease.totalAmount || g.currentLease.advanceAmount || 0);
                totalGardenIncome += leaseVal;
            }
        });

        // 3. Fetch Staff / Person Data (From transactions & currentBalance)
        const persons = await Person.find().sort({ createdAt: -1 });
        let totalStaffAdvances = 0; // Total Debit
        let totalStaffPending = 0;  // Total Credit

        persons.forEach(p => {
            let personDebit = 0;
            let personCredit = 0;

            // Calculate from transactions array
            if (p.transactions && p.transactions.length > 0) {
                p.transactions.forEach(t => {
                    if (t.type === 'Debit') {
                        personDebit += Number(t.amount || 0);
                    } else if (t.type === 'Credit') {
                        personCredit += Number(t.amount || 0);
                    }
                });
            } else {
                // If transactions empty, check currentBalance
                if (p.currentBalance < 0) {
                    personDebit = Math.abs(p.currentBalance);
                } else {
                    personCredit = p.currentBalance;
                }
            }

            // Attach calculated amounts to person object for EJS view rendering
            p.calculatedDebit = personDebit;
            p.calculatedCredit = personCredit;

            totalStaffAdvances += personDebit;
            totalStaffPending += personCredit;
        });

        // Grand Total Income
        const grandTotalIncome = totalRentIncome + totalGardenIncome;

        res.render('report', {
            title: 'Financial Reports | Management System',
            user: req.session ? req.session.user : { username: 'Admin', role: 'Owner' },
            selectedMonth,
            selectedYear,
            rentTxList,
            totalRentIncome,
            gardens,
            totalGardenIncome,
            persons,
            totalStaffAdvances,
            totalStaffPending,
            grandTotalIncome
        });

    } catch (error) {
        console.error('Error loading report page:', error);
        res.status(500).send('Error generating financial report');
    }
};