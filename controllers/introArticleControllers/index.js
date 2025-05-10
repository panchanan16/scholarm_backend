const db = require('../db');

// Create a new article
exports.createArticle = (req, res) => {
    const {
        title,
        abstract,
        keywords,
        sub_class,
        pages,
        belong_to,
        main_author,
        article_status
    } = req.body;

    const sql = `
        INSERT INTO into_article (
            title, abstract, keywords, sub_class, pages, belong_to, main_author, article_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        title,
        abstract,
        keywords,
        sub_class,
        pages || null,
        belong_to,
        main_author,
        article_status || 'Incomplete'
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Article created', article_id: result.insertId });
    });
};

// Get all articles
exports.getAllArticles = (req, res) => {
    db.query('SELECT * FROM into_article', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Get article by ID
exports.getArticleById = (req, res) => {
    const { intro_id } = req.params;

    db.query('SELECT * FROM into_article WHERE intro_id = ?', [intro_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Article not found' });
        res.json(results[0]);
    });
};

// Update article by ID
exports.updateArticle = (req, res) => {
    const { intro_id } = req.params;
    const {
        title,
        abstract,
        keywords,
        sub_class,
        pages,
        belong_to,
        main_author,
        article_status
    } = req.body;

    const sql = `
        UPDATE into_article
        SET title = ?, abstract = ?, keywords = ?, sub_class = ?, pages = ?, belong_to = ?, main_author = ?, article_status = ?
        WHERE intro_id = ?
    `;

    db.query(sql, [
        title,
        abstract,
        keywords,
        sub_class,
        pages,
        belong_to,
        main_author,
        article_status,
        intro_id
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Article updated', result });
    });
};

// Delete article by ID
exports.deleteArticle = (req, res) => {
    const { intro_id } = req.params;

    db.query('DELETE FROM into_article WHERE intro_id = ?', [intro_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Article deleted', result });
    });
};
