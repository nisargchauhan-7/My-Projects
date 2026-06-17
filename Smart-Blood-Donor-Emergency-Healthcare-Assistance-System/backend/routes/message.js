const express = require("express");
const router = express.Router();
const db = require("../db");
const sendEmail = require("../emailService");

/* Get All Messages */

router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM contact_messages ORDER BY created_at DESC",
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.json(result);

        }
    );

});

/* Add Message */

router.post("/", (req, res) => {

    const {
        name,
        email,
        subject,
        message
    } = req.body;

    const sql = `
    INSERT INTO contact_messages
    (
        name,
        email,
        subject,
        message
    )
    VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            email,
            subject,
            message
        ],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Message Failed"
                });
            }

            sendEmail(

    "sbdehas@gmail.com",

    "New Contact Message",

    `
Name: ${name}

Email: ${email}

Message:
${message}
`

);

            res.json({
                message: "Message Sent Successfully"
            });

        }
    );

});

/* Delete Message */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM contact_messages WHERE id = ?",
        [id],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Delete Failed"
                });
            }

            res.json({
                message: "Message Deleted Successfully"
            });

        }
    );

});

module.exports = router;