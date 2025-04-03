const { Salle } = require('../models/salle');

const getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.find();
        res.json(salles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSalle = async (req, res) => {
    try {
        const nouvelleSalle = new Salle(req.body);
        await nouvelleSalle.save();
        res.status(201).json(nouvelleSalle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSalle = async (req, res) => {
    try {
        const salle = await Salle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(salle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSalle = async (req, res) => {
    try {
        await Salle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Salle supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllSalles, createSalle, updateSalle, deleteSalle };