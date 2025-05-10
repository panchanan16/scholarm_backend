const db = require('../db');

// Create a new article-author relationship
exports.createArticleAuthor = (req, res) => {
    const { article_id, author_id, status } = req.body;

    const sql = `
        INSERT INTO article_authors (article_id, author_id, status)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [article_id, author_id, status || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Article Author relationship created', result });
    });
};

// Get all article-author relationships
exports.getAllArticleAuthors = (req, res) => {
    db.query('SELECT * FROM article_authors', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get one relationship by article_id and author_id
exports.getArticleAuthor = (req, res) => {
    const { article_id, author_id } = req.params;

    const sql = 'SELECT * FROM article_authors WHERE article_id = ? AND author_id = ?';

    db.query(sql, [article_id, author_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Not found' });
        res.json(results[0]);
    });
};

// Update the status field of an existing relationship
exports.updateArticleAuthor = (req, res) => {
    const { article_id, author_id } = req.params;
    const { status } = req.body;

    const sql = `
        UPDATE article_authors
        SET status = ?
        WHERE article_id = ? AND author_id = ?
    `;

    db.query(sql, [status, article_id, author_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Article Author relationship updated', result });
    });
};

// Delete a relationship
exports.deleteArticleAuthor = (req, res) => {
    const { article_id, author_id } = req.params;

    const sql = 'DELETE FROM article_authors WHERE article_id = ? AND author_id = ?';

    db.query(sql, [article_id, author_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Article Author relationship deleted', result });
    });
};
