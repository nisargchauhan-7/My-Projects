const express = require("express");
const router = express.Router();
const db = require("../db");

/* Admin Login */

router.post("/login", (req, res) => {

    const {
        username,
        password
    } = req.body;

    const sql = `
    SELECT *
    FROM admins
    WHERE username = ?
    AND password = ?
    `;

    db.query(
        sql,
        [username, password],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if(result.length > 0)
            {
                res.json({
                    success: true,
                    message: "Admin Login Successful"
                });
            }
            else
            {
                res.json({
                    success: false,
                    message: "Invalid Username or Password"
                });
            }

        }
    );

});

module.exports = router;