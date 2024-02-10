const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const validateCreate = [
    check("question").not().isEmpty(),
    check("answer").not().isEmpty(),
];

const validateUpdate = [
    check("question").optional(),
    check("answer").optional(),
];

// Create faq (POST)
router.post("/", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO faqs (question, answer) VALUES (?, ?)",
            [req.body.question, req.body.answer]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating faq: ${error.message}`);
    }
});

//get all faqs (GET)
router.get("/", async (req, res) => {
    try {
        const [faqs] = await db.query("SELECT * FROM faqs");
        res.send(faqs);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting faqs");
    }
});

//update faq (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "UPDATE faqs SET question = ?, answer = ? WHERE id = ?",
            [req.body.question, req.body.answer, req.params.id]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating faq: ${error.message}`);
    }
});

///delete faq (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM faqs WHERE id = ?", [req.params.id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting faq: ${error.message}`);
    }
});

module.exports = router;
