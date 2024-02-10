const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const validateCreate = [
    check("date").isDate(),
    check("time").isTime(),
    check("venue").not().isEmpty(),
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
];

const validateUpdate = [
    check("date").optional().isDate(),
    check("time").optional().isTime(),
    check("venue").optional(),
    check("title").optional(),
    check("description").optional(),
];

// Create event (POST)
router.post("/", validateCreate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "INSERT INTO events (date, time, venue, title, description) VALUES (?, ?, ?, ?, ?)",
            [req.body.date, req.body.time, req.body.venue, req.body.title, req.body.description]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error creating event: ${error.message}`);
    }
});

//get all events (GET)
router.get("/", async (req, res) => {
    try {
        const [events] = await db.query("SELECT * FROM events order by date desc");
        res.send(events);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting events");
    }
});

//update event (PUT)
router.put("/:id", validateUpdate, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const [result] = await db.query(
            "UPDATE events SET date = ?, time = ?, venue = ?, title = ?, description = ? WHERE id = ?",
            [req.body.date, req.body.time, req.body.venue, req.body.title, req.body.description, req.params.id]
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error updating event: ${error.message}`);
    }
});

module.exports = router;
