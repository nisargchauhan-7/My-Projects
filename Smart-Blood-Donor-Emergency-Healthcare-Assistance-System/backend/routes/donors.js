const express = require("express");
const router = express.Router();
const db = require("../db");

/* Register Donor */

router.post("/register", (req, res) => {

    const { name, blood, city, phone } = req.body;

    const sql = `
    INSERT INTO donors
    (name, blood_group, city, phone)
    VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, blood, city, phone],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.json({
                message: "Donor Registered Successfully"
            });

        }
    );

});

/* Get All Donors */

router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM donors",
        (err, result) => {

            if(err)
            {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            res.json(result);

        }
    );

});

/* Delete Donor */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM donors WHERE id = ?",
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
                message: "Donor Deleted Successfully"
            });

        }
    );

});

module.exports = router;