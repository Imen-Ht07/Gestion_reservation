const Salle = require('./salle');

// Récupérer toutes les salles
const getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.find();
        if (salles.length === 0) {
            return res.status(404).json({ message: 'Aucune salle trouvée' });
        }
        res.status(200).json(salles);
    } catch (error) {
        console.error('Erreur lors de la récupération des salles:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des salles' });
    }
};

// Créer une nouvelle salle
const createSalle = async (req, res) => {
    const { nom, capacite, equipements, disponibilite } = req.body;

    // Validation des données
    if (!nom || !capacite || !Array.isArray(equipements) || !Array.isArray(disponibilite)) {
        return res.status(400).json({ message: 'Les champs nom, capacité, équipements et disponibilité sont requis' });
    }

    try {
        const nouvelleSalle = new Salle({
            nom,
            capacite,
            equipements,
            disponibilite,
        });

        await nouvelleSalle.save();
        res.status(201).json(nouvelleSalle);
    } catch (error) {
        console.error('Erreur lors de la création de la salle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la création de la salle' });
    }
};

// Mettre à jour une salle
const updateSalle = async (req, res) => {
    try {
        const salle = await Salle.findById(req.params.id);
        if (!salle) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }

        // Mise à jour des données
        const updatedSalle = await Salle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedSalle);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la salle' });
    }
};

// Supprimer une salle
const deleteSalle = async (req, res) => {
    try {
        const salle = await Salle.findById(req.params.id);
        if (!salle) {
            return res.status(404).json({ message: 'Salle non trouvée' });
        }

        await Salle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Salle supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la salle:', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de la salle' });
    }
};

module.exports = { getAllSalles, createSalle, updateSalle, deleteSalle };
