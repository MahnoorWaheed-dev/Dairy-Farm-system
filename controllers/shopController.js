const Shop = require('../models/Shop');
const RentTransaction = require('../models/RentTransaction');

// const getShops = async (req, res) => {
//     try {
//         const shops = await Shop.find().sort({ shopNumber: 1 });
//         const transactions = await RentTransaction.find().populate('shopId').sort({ createdAt: -1 });
        
//         res.render('shops', {
//             title: 'Shops & Rent Management',
//             user: req.session.user,
//             shops,
//             transactions
//         });
//     } catch (error) {
//         console.error('Error fetching shops:', error);
//         res.status(500).send('Server Error');
//     }
// };

const addShop = async (req, res) => {
    try {
        const { shopNumber, personName, contactNumber, monthlyRent, rentDueDate } = req.body;
        
        await Shop.create({
            shopNumber,
            personName,
            contactNumber,
            monthlyRent,
            rentDueDate: rentDueDate || 5,
            status: 'Pending'
        });

        res.redirect('/shops');
    } catch (error) {
        console.error('Error adding shop:', error);
        res.status(500).send('Error adding shop record');
    }
};

const editShop = async (req, res) => {
    try {
        const { id } = req.params;
        const { shopNumber, personName, contactNumber, monthlyRent, rentDueDate, status } = req.body;

        await Shop.findByIdAndUpdate(id, {
            shopNumber,
            personName,
            contactNumber,
            monthlyRent,
            rentDueDate,
            status
        });

        res.redirect('/shops');
    } catch (error) {
        console.error('Error updating shop:', error);
        res.status(500).send('Error updating shop record');
    }
};

const deleteShop = async (req, res) => {
    try {
        const { id } = req.params;
        await Shop.findByIdAndDelete(id);
        res.redirect('/shops');
    } catch (error) {
        console.error('Error deleting shop:', error);
        res.status(500).send('Error deleting shop record');
    }
};
const getShops = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Current Month String (e.g. "September 2026")
        const currentMonthName = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

        const totalShops = await Shop.countDocuments();

        // Database se current month ki transactions find karein
        const paidTransactions = await RentTransaction.distinct('shopId', {
            rentMonth: { $regex: new RegExp(currentMonthName, 'i') }
        });

        // Agar aapke Shop model mein status field direct save hai (e.g., status: 'Paid')
        // to aap direct shop model se bhi count kar sakte hain:
        const paidShopsCount = await Shop.countDocuments({ status: 'Paid' });
        const pendingShopsCount = await Shop.countDocuments({ status: { $ne: 'Paid' } });

        const shops = await Shop.find()
            .skip(skip)
            .limit(limit)
            .sort({ shopNumber: 1 });

        const totalPages = Math.ceil(totalShops / limit);

        res.render('shops', {
            title: 'Shops Management',
            shops,
            currentPage: page,
            totalPages,
            totalShops,
            paidShopsCount,       // Header count variable
            pendingShopsCount     // Header count variable
        });
    } catch (error) {
        console.error("Error fetching shops:", error);
        res.status(500).send("Server Error");
    }
};

// POST: Collect Rent & Generate Receipt Number
// POST: Collect Rent & Generate Receipt Number
const collectRent = async (req, res) => {
    try {
        const { shopId, month, year, rentMonth, status, receivedBy, amountPaid } = req.body;

        // Form status fallback to 'Paid' if not provided
        const paymentStatus = status || 'Paid';

        // Auto-generate Unique Receipt Number (e.g. REC-1001)
        const totalCount = await RentTransaction.countDocuments();
        const receiptNumber = `REC-${1001 + totalCount}`;

        // Formatted month string
        const formattedRentMonth = month && year 
            ? `${month} ${year}` 
            : (rentMonth || `${new Date().toLocaleString('en-US', { month: 'short' })} ${new Date().getFullYear()}`);

        // Create transaction record
        const transaction = await RentTransaction.create({
            shopId,
            receiptNumber,
            month: month || new Date().toLocaleString('en-US', { month: 'short' }),
            year: year ? parseInt(year) : new Date().getFullYear(),
            rentMonth: formattedRentMonth,
            status: paymentStatus,
            receivedBy,
            amountPaid: parseFloat(amountPaid)
        });

        // Update Shop Rent Status dynamically based on selected status
        await Shop.findByIdAndUpdate(shopId, { status: paymentStatus });

        // Redirect directly to printable receipt view
        res.redirect(`/shops/receipt/${transaction._id}`);
    } catch (error) {
        console.error('Error recording rent:', error);
        res.status(500).send('Error recording rent payment');
    }
};

// GET: Display Printable Receipt
const viewReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await RentTransaction.findById(id).populate('shopId');

        if (!transaction) {
            return res.status(404).send('Receipt not found');
        }

        res.render('receipt', {
            title: `Receipt #${transaction.receiptNumber}`,
            transaction
        });
    } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).send('Server Error');
    }
};

const getOtherIncome = async (req, res) => {
    try {
        const selectedYear = parseInt(req.query.year) || new Date().getFullYear();
        
        // 1. Pagination Parameters
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        // Total shops count for pagination calculation
        const totalRecords = await Shop.countDocuments();
        const totalPages = Math.ceil(totalRecords / limit) || 1;
        
        // 2. Fetch Paginated Shops and Transactions
        const shops = await Shop.find().skip(skip).limit(limit).lean();
        const transactions = await RentTransaction.find().lean();

        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const yearlyData = shops.map(shop => {
            // Iss shop ki woh transactions filter karein jo selected year ki hon
            const shopTxns = transactions.filter(t => {
                const isSameShop = t.shopId && t.shopId.toString() === shop._id.toString();
                if (!isSameShop) return false;

                // Priority 1: Direct year field check
                if (t.year) return parseInt(t.year) === selectedYear;

                // Priority 2: Fallback to paymentDate / createdAt
                const txnDate = new Date(t.paymentDate || t.createdAt);
                return !isNaN(txnDate) && txnDate.getFullYear() === selectedYear;
            });

            // Paid months list create karein
            const paidMonths = shopTxns.map(t => {
                if (t.month) return t.month;
                
                // Fallback: Agar month field na ho toh date se short month name banayein
                const txnDate = new Date(t.paymentDate || t.createdAt);
                return !isNaN(txnDate) ? txnDate.toLocaleString('en-US', { month: 'short' }) : null;
            }).filter(Boolean);

            // 12-Month Matrix
            const monthStatus = allMonths.map(m => ({
                month: m,
                isPaid: paidMonths.includes(m)
            }));

            const totalPaidMonths = monthStatus.filter(m => m.isPaid).length;
            const totalCollected = shopTxns.reduce((sum, t) => sum + (Number(t.amountPaid) || 0), 0);

            return {
                ...shop,
                monthStatus,
                totalPaidMonths,
                totalCollected
            };
        });

        // 3. Render View with Pagination Props
        res.render('other-income', {
            yearlyData,
            selectedYear,
            allMonths,
            currentPage: page,
            totalPages,
            totalRecords
        });
    } catch (err) {
        console.error("Error loading other income page:", err);
        res.status(500).send("Error loading other income page: " + err.message);
    }
};

module.exports = {
    getShops,
    addShop,
    editShop,
    deleteShop,
    collectRent,
    viewReceipt,
    getOtherIncome
};