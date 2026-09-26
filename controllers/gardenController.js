const Garden = require('../models/Garden');
const Person = require('../models/Person');

// Get All Gardens Page
const getGardens = async (req, res) => {
    try {
        const gardens = await Garden.find().populate('currentLease.contractor').sort({ createdAt: -1 });
        const persons = await Person.find().sort({ name: 1 }); // For dropdown selection

        res.render('garden', {
            title: 'Baghat / Garden Management',
            gardens,
            persons
        });
    } catch (err) {
        console.error('Error fetching gardens:', err);
        res.status(500).send('Server Error');
    }
};

// Add New Garden
const addGarden = async (req, res) => {
    try {
        const { gardenName, location, areaSize, cropType } = req.body;
        await Garden.create({ gardenName, location, areaSize, cropType });
        res.redirect('/garden');
    } catch (err) {
        console.error('Error adding garden:', err);
        res.redirect('/garden');
    }
};

// Assign Lease (Theka) to Garden
const assignLease = async (req, res) => {
    try {
        const { gardenId, contractorId, contractorName, startDate, endDate, totalAmount, advanceAmount, notes } = req.body;

        const person = await Person.findById(contractorId);
        if (!person) return res.redirect('/garden');

        // Agar user ne direct custom thekedar name enter kiya hai toh wo, warna Person account ka default name
        const finalContractorName = contractorName && contractorName.trim() !== '' ? contractorName : person.name;

        await Garden.findByIdAndUpdate(gardenId, {
            status: 'On Lease',
            currentLease: {
                contractor: contractorId,
                contractorName: finalContractorName,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalAmount: Number(totalAmount) || 0,
                advanceAmount: Number(advanceAmount) || 0,
                notes
            }
        });

        // Person account ledger entry (Khata person account)
        if (person.transactions) {
            person.transactions.push({
                date: new Date(),
                description: `Annual Garden Lease - ${finalContractorName}`,
                debit: Number(totalAmount) || 0,
                credit: Number(advanceAmount) || 0,
                balance: (person.currentBalance || 0) + ((Number(totalAmount) || 0) - (Number(advanceAmount) || 0))
            });
            person.currentBalance = (person.currentBalance || 0) + ((Number(totalAmount) || 0) - (Number(advanceAmount) || 0));
            await person.save();
        }

        res.redirect('/garden');
    } catch (err) {
        console.error('Error assigning lease:', err);
        res.redirect('/garden');
    }
};

// Release / End Lease
const releaseLease = async (req, res) => {
    try {
        const { id } = req.params;
        await Garden.findByIdAndUpdate(id, {
            status: 'Available',
            $unset: { currentLease: 1 }
        });
        res.redirect('/garden');
    } catch (err) {
        console.error('Error releasing lease:', err);
        res.redirect('/garden');
    }
};

// Edit Garden
const editGarden = async (req, res) => {
    try {
        const { id } = req.params;
        const { gardenName, location, areaSize, cropType } = req.body;

        await Garden.findByIdAndUpdate(id, {
            gardenName,
            location,
            areaSize,
            cropType
        });

        res.redirect('/garden');
    } catch (err) {
        console.error('Error editing garden:', err);
        res.redirect('/garden');
    }
};

// Delete Garden
const deleteGarden = async (req, res) => {
    try {
        const { id } = req.params;

        await Garden.findByIdAndDelete(id);

        res.redirect('/garden');
    } catch (err) {
        console.error('Error deleting garden:', err);
        res.redirect('/garden');
    }
};

module.exports = {
    getGardens,
    addGarden,
    assignLease,
    releaseLease,
    editGarden,
    deleteGarden
};