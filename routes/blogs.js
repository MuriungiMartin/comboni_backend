const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const validateCreate = [
    check("title").not().isEmpty(),
    check("content").not().isEmpty(),
    check("date").not().isEmpty(),
    check("image").not().isEmpty()
];

const validateUpdate = [
    check("title").optional(),
    check("content").optional(),
    check("date").optional(),
    check("image").optional()
];

// Create blog (POST)
router.post("/", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO articles (title, content, Date_published, image) VALUES (?, ?, ?, ?)",
            [req.body.title, req.body.content, req.body.date, req.body.image]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating blog: ${error.message}`);
    }
});

//get all blogs (GET)
router.get("/", async (req, res) => {
    try {
        const [blogs] = await db.query("SELECT * FROM articles order by Date_published desc");
        res.send(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting blogs");
    }
});

//update blog (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "UPDATE articles SET title = ?, content = ?, Date_published = ?, image = ? WHERE id = ?",
            [req.body.title, req.body.content, req.body.date, req.body.image, req.params.id]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating blog: ${error.message}`);
    }
});

//delete blog (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM articles WHERE id = ?", [req.params.id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting blog: ${error.message}`);
    }
});

module.exports = router;
