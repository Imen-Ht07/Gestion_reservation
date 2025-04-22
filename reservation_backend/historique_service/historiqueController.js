const Historique = require('./historique');

const getAllHistorique = async (req, res) => {
    try {
        const historique = await Historique.find().populate('utilisateur_id action');
        res.json(historique);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createHistorique = async (action, utilisateur_id) => {
    try {
        const nouvelleAction = new Historique({ action, utilisateur_id, date: new Date() });
        await nouvelleAction.save();
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'historique', error);
    }
};

module.exports = { getAllHistorique, createHistorique };
