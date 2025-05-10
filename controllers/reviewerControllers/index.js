const db = require('../db'); // this assumes you have a db.js that exports a MySQL pool or connection

// Create a new revision_editor entry
exports.createRevisionEditor = (req, res) => {
    const { rev_id, editor_id, article_id, is_accepted, is_completed } = req.body;

    const sql = `
        INSERT INTO revision_editor (rev_id, editor_id, article_id, is_accepted, is_completed)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [rev_id, editor_id, article_id, is_accepted || false, is_completed || false], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Revision Editor created', result });
    });
};

// Get all entries
exports.getAllRevisionEditors = (req, res) => {
    db.query('SELECT * FROM revision_editor', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get one by rev_id and editor_id
exports.getRevisionEditor = (req, res) => {
    const { rev_id, editor_id } = req.params;
    const sql = 'SELECT * FROM revision_editor WHERE rev_id = ? AND editor_id = ?';

    db.query(sql, [rev_id, editor_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(results[0]);
    });
};

// Update one entry
exports.updateRevisionEditor = (req, res) => {
    const { rev_id, editor_id } = req.params;
    const { is_accepted, is_completed } = req.body;

    const sql = `
        UPDATE revision_editor
        SET is_accepted = ?, is_completed = ?
        WHERE rev_id = ? AND editor_id = ?
    `;

    db.query(sql, [is_accepted, is_completed, rev_id, editor_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Revision Editor updated', result });
    });
};

// Delete one entry
exports.deleteRevisionEditor = (req, res) => {
    const { rev_id, editor_id } = req.params;
    const sql = 'DELETE FROM revision_editor WHERE rev_id = ? AND editor_id = ?';

    db.query(sql, [rev_id, editor_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Revision Editor deleted', result });
    });
};
