const express = require("express");
const router = express.Router();
const db = require("../db");

/* Get Hospitals */

router.get("/", (req, res) => {

    const sql = "SELECT * FROM hospitals";

    db.query(sql, (err, result) => {

        if(err)
        {
            return res.status(500).json(err);
        }

        res.json(result);

    });

});

/* Add Hospital */

router.post("/", (req, res) => {

    const {
        hospital_name,
        city,
        available_beds,
        contact
    } = req.body;

    const sql = `
    INSERT INTO hospitals
    (
        hospital_name,
        city,
        available_beds,
        contact
    )
    VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            hospital_name,
            city,
            available_beds,
            contact
        ],
        (err, result) => {

            if(err)
            {
                return res.status(500).json(err);
            }

            res.json({
                message: "Hospital Added Successfully"
            });

        }
    );

});

/* Delete Hospital */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM hospitals WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if(err)
        {
            return res.status(500).json(err);
        }

        res.json({
            message: "Hospital Deleted Successfully"
        });

    });

});

router.put("/addBeds/:id", (req, res) => {

    db.query(
        "UPDATE hospitals SET available_beds = available_beds + 1 WHERE id=?",
        [req.params.id],
        (err) => {

            if(err)
            {
                return res.status(500).json({
                    message: "Failed"
                });
            }

            res.json({
                message: "Bed Added"
            });
        }
    );

});

router.put("/removeBeds/:id", (req, res) => {

    db.query(
        "UPDATE hospitals SET available_beds = GREATEST(available_beds - 1, 0) WHERE id=?",
        [req.params.id],
        (err) => {

            if(err)
            {
                return res.status(500).json({
                    message: "Failed"
                });
            }

            res.json({
                message: "Bed Removed"
            });
        }
    );

});

module.exports = router;