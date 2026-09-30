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
        const {
            gardenId,
            contractorName,
            startDate,
            endDate,
            totalAmount,
            advanceAmount,
            notes
        } = req.body;

        const finalContractorName =
            contractorName && contractorName.trim() !== ''
                ? contractorName.trim()
                : 'Unknown Thekedar';

        await Garden.findByIdAndUpdate(gardenId, {
            status: 'On Lease',
            currentLease: {
                contractor: null,
                contractorName: finalContractorName,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalAmount: Number(totalAmount) || 0,
                advanceAmount: Number(advanceAmount) || 0,
                notes
            }
        });

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