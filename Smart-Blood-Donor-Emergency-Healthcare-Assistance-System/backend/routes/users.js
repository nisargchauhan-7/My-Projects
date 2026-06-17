const express = require("express");
const router = express.Router();
const db = require("../db");
const sendEmail = require("../emailService");

/* User Registration */

router.post("/register", (req, res) => {

    const {
        fullname,
        email,
        password
    } = req.body;

    const sql = `
    INSERT INTO users
    (fullname, email, password)
    VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [fullname, email, password],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Registration Failed"
                });
            }

            sendEmail(
    email,
    "Welcome to SBDEHAS",
    `Hello ${fullname},

Welcome to Smart Blood Donor & Emergency Healthcare Assistance System.

Your registration was successful.

Thank you for joining SBDEHAS.`
);

res.json({
    message: "User Registered Successfully"
});

        }
    );

});

/* User Login */

router.post("/login", (req, res) => {

    const {
        email,
        password
    } = req.body;

    const sql =
    "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        (err, result) => {

            if(err)
            {
                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if(result.length === 0)
            {
                return res.status(401).json({
                    message: "User Not Found"
                });
            }

            const user = result[0];

            if(user.password !== password)
            {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            res.json({
                message: "Login Successful",
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email
                }
            });

        }
    );

});

/* Change Password */

router.put("/change-password/:id", (req, res) => {

    const id = req.params.id;

    const {
        oldPassword,
        newPassword
    } = req.body;

    const checkSql =
    "SELECT * FROM users WHERE id=?";

    db.query(checkSql, [id], (err, result) => {

        if(err)
        {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if(result.length === 0)
        {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        if(result[0].password !== oldPassword)
        {
            return res.status(400).json({
                message: "Current Password Incorrect"
            });
        }

        const updateSql =
        "UPDATE users SET password=? WHERE id=?";

        db.query(
            updateSql,
            [newPassword, id],
            (err) => {

                if(err)
                {
                    return res.status(500).json({
                        message: "Update Failed"
                    });
                }

                res.json({
                    message:
                    "Password Updated Successfully"
                });

            }
        );

    });

});

function updateProfile()
{
    fetch(
        `http://localhost:8000/api/users/update-profile/${currentUser.id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                fullname:
                document.getElementById("editName").value,

                email:
                document.getElementById("editEmail").value

            })
        }
    )

    .then(res => res.json())

    .then(data => {

        currentUser.fullname =
        document.getElementById("editName").value;

        currentUser.email =
        document.getElementById("editEmail").value;

        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );

        alert(data.message);

        location.reload();

    })

    .catch(err => {

        console.log(err);

        alert("Update Failed");

    });
}

router.put("/update-profile/:id", (req, res) => {

    console.log("UPDATE ROUTE HIT");

    const id = req.params.id;

    const {
        fullname,
        email
    } = req.body;

    const sql =
    "UPDATE users SET fullname=?, email=? WHERE id=?";

    db.query(
        sql,
        [fullname, email, id],
        (err, result) => {

            console.log(result);

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Update Failed"
                });
            }

            res.json({
                message: "Profile Updated Successfully"
            });

        }
    );

});

/* Delete User */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM users WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if(err)
        {
            console.log(err);

            return res.status(500).json({
                message: "Delete Failed"
            });
        }

        res.json({
            message: "User Deleted Successfully"
        });

    });

});

router.get("/", (req, res) => {

    const sql = "SELECT * FROM users";

    db.query(sql, (err, result) => {

        if(err)
        {
            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result);

    });

});

module.exports = router;