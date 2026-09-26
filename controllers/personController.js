const Person = require('../models/Person');

// 1. Get Person List (Index View)
exports.getPersonList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalPerson = await Person.countDocuments();
        const personList = await Person.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalPerson / limit);

        // Renders views/person/index.ejs
        res.render('personIndex', {
            personList,
            totalPerson,
            currentPage: page,
            totalPages
        });
    } catch (error) {
        console.error("Error in getPersonList:", error);
        res.status(500).send("Server Error");
    }
};

// 2. Add Person
exports.addPerson = async (req, res) => {
    try {
        const { name, cnic, mobile } = req.body;
        await Person.create({ name, cnic, mobile, currentBalance: 0, transactions: [] });
        res.redirect('/person');
    } catch (error) {
        console.error("Error in addPerson:", error);
        res.status(500).send("Server Error");
    }
};

// 3. Add Transaction (Debit / Credit)
exports.addTransaction = async (req, res) => {
    try {
        const { personId, type, amount, description } = req.body;
        const parsedAmount = parseFloat(amount);

        const person = await Person.findById(personId);
        if (!person) return res.status(404).send("Person not found");

        if (type === 'Debit') {
            person.currentBalance -= parsedAmount;
        } else if (type === 'Credit') {
            person.currentBalance += parsedAmount;
        }

        person.transactions.push({
            type,
            amount: parsedAmount,
            description,
            date: new Date()
        });

        await person.save();
        res.redirect('/person');
    } catch (error) {
        console.error("Error in addTransaction:", error);
        res.status(500).send("Server Error");
    }
};

// 4. Get Statement View
exports.getPersonStatement = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).send("Person not found");

        res.render('personStatement', { person });
    } catch (error) {
        console.error("Error in getPersonStatement:", error);
        res.status(500).send("Server Error");
    }
};

// 5. Get Person for Edit
exports.getEditPerson = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person) {
            return res.status(404).send("Person not found");
        }

        res.render('editPerson', { person });
    } catch (error) {
        console.error("Error in getEditPerson:", error);
        res.status(500).send("Server Error");
    }
};

// 5. Update Person
exports.updatePerson = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, cnic, mobile } = req.body;

        const person = await Person.findById(id);

        if (!person) {
            return res.status(404).send("Person not found");
        }

        person.name = name;
        person.cnic = cnic;
        person.mobile = mobile;

        await person.save();

        res.redirect('/person');
    } catch (error) {
        console.error("Update Person Error:", error);
        res.status(500).send("Server Error");
    }
};


// DELETE /person/:id
exports.deletePerson = async (req, res) => {
    try {
        const { id } = req.params;

        // Person Delete Karein
        await Person.findByIdAndDelete(id);

        // Delete ke baad Person List page par redirect
        res.redirect('/person');
    } catch (error) {
        console.error("Delete Error:", error);
        res.redirect('/person');
    }
};