const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator"); 
const { put } = require("./users");

const validateCreate = [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("date").not().isEmpty(),
];

const validateUpdate = [
    check("title").optional(),
    check("description").optional(),
    check("date").optional(),
];

// Create communication (POST)
router.post("/", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO communications (title, description, date) VALUES (?, ?, ?)",
            [req.body.title, req.body.description, req.body.date]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating communication: ${error.message}`);
    }
});

//get all communications (GET)
router.get("/", async (req, res) => {
    try {
        const [communications] = await db.query("SELECT * FROM communications order by date desc");
        res.send(communications);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting communications");
    }
});

//update communication (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "UPDATE communications SET title = ?, description = ?, date = ? WHERE id = ?",
            [req.body.title, req.body.description, req.body.date, req.params.id]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating communication: ${error.message}`);
    }
});

//delete communication (DELETE)
router.delete("/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM communications WHERE id = ?", [req.params.id]);
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error deleting communication: ${error.message}`);
    }
});

module.exports = router;
