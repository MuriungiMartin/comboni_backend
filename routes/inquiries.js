const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const validateCreate = [
    check("topic").not().isEmpty(),
    check("church_group").not().isEmpty(),
    check("name").not().isEmpty(),
    check("phone").not().isEmpty(),
    check("question").not().isEmpty(),
];

const validateUpdate = [
    check("topic").optional(),
    check("church_group").optional(),
    check("name").optional(),
    check("phone").optional(),
    check("question").optional(),
];

// Create inquiry (POST)
router.post("/", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO inquiries (topic, church_group, name, phone, question) VALUES (?, ?, ?, ?, ?)",
            [req.body.topic, req.body.church_group, req.body.name, req.body.phone, req.body.question]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating inquiry: ${error.message}`);
    }
});

//get all inquiries (GET)
router.get("/", async (req, res) => {
    try {
        const [inquiries] = await db.query("SELECT * FROM inquiries order by id desc");
        res.send(inquiries);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting inquiries");
    }
});

//update inquiry (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "UPDATE inquiries SET topic = ?, church_group = ?, name = ?, phone = ?, question = ? WHERE id = ?",
            [req.body.topic, req.body.church_group, req.body.name, req.body.phone, req.body.question, req.params.id]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating inquiry: ${error.message}`);
    }
});

//delete inquiry (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM inquiries WHERE id = ?", [req.params.id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting inquiry: ${error.message}`);
    }
});

module.exports = router;
