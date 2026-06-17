const express = require("express");
const router = express.Router();
const db = require("../db");
const sendEmail = require("../emailService");

/* Get All Emergency Requests */

router.get("/", (req, res) => {

    const sql =
    "SELECT * FROM emergency_requests";

    db.query(sql, (err, result) => {

        if(err)
        {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result);

    });

});

/* Create Emergency Request */

router.post("/", (req, res) => {

    console.log("REQUEST BODY:");
    console.log(req.body);

    const {
        user_id,
        patient_name,
        blood_group,
        hospital_name,
        contact_number
    } = req.body;

    const sql = `
    INSERT INTO emergency_requests
    (
        user_id,
        patient_name,
        blood_group,
        hospital_name,
        contact_number
    )
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            patient_name,
            blood_group,
            hospital_name,
            contact_number
        ],
        (err, result) => {

            if(err)
            {
                console.log(err);

                return res.status(500).json({
                    message: "Request Failed"
                });
            }

            res.json({
                message:
                "Emergency Request Submitted Successfully"
            });

            sendEmail(
    "sbdehas@gmail.com",
    "New Emergency Blood Request",
    `
Patient: ${patient_name}
Blood Group: ${blood_group}
Hospital: ${hospital_name}
Contact: ${contact_number}
`
);

        }
    );

});


/* Approve Request */

router.put("/approve/:id", (req, res) => {

    const requestId = req.params.id;

    const sql = `
    SELECT emergency_requests.*, users.email
    FROM emergency_requests
    LEFT JOIN users ON emergency_requests.user_id = users.id
    WHERE emergency_requests.id = ?
    `;

    db.query(sql, [requestId], (err, result) => {

        if(err || result.length === 0)
        {
            return res.status(500).json({
                message: "Request Not Found"
            });
        }

        const request = result[0];

        console.log("REQUEST DATA:");
console.log(request);

        db.query(
            "UPDATE emergency_requests SET status='Approved' WHERE id=?",
            [requestId],
            (err) => {

                if(err)
                {
                    return res.status(500).json({
                        message: "Approval Failed"
                    });
                }

                console.log("SENDING EMAIL TO:");
console.log(request.email);

                sendEmail(

                    request.email,

                    "Blood Request Approved",

                    `Hello,

Your emergency blood request has been approved.

Patient: ${request.patient_name}
Blood Group: ${request.blood_group}
Hospital: ${request.hospital_name}

Thank you,
SBDEHAS Team`

                );

                res.json({
                    message: "Request Approved"
                });

            }
        );

    });

});

router.put("/reject/:id", (req, res) => {

    const requestId = req.params.id;

    const sql = `
    SELECT emergency_requests.*, users.email
    FROM emergency_requests
    LEFT JOIN users ON emergency_requests.user_id = users.id
    WHERE emergency_requests.id = ?
    `;

    db.query(sql, [requestId], (err, result) => {

        if(err || result.length === 0)
        {
            return res.status(500).json({
                message: "Request Not Found"
            });
        }

        const request = result[0];

        db.query(
            "UPDATE emergency_requests SET status='Rejected' WHERE id=?",
            [requestId],
            (err) => {

                if(err)
                {
                    return res.status(500).json({
                        message: "Rejection Failed"
                    });
                }

                console.log("REJECT REQUEST DATA:");
console.log(request);

console.log("SENDING REJECTION EMAIL TO:");
console.log(request.email);

                sendEmail(

                    request.email,

                    "Blood Request Rejected",

                    `Hello,

Your emergency blood request has been rejected.

Patient: ${request.patient_name}
Blood Group: ${request.blood_group}
Hospital: ${request.hospital_name}

Please contact the administrator for further assistance.

SBDEHAS Team`

                );

                res.json({
                    message: "Request Rejected"
                });

            }
        );

    });

});

/* Delete Request */

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    const sql =
    "DELETE FROM emergency_requests WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if(err)
        {
            console.log(err);

            return res.status(500).json({
                message: "Delete Failed"
            });
        }

        res.json({
            message: "Request Deleted"
        });

    });

});

router.get("/history/:userId", (req, res) => {

    const sql =
    "SELECT * FROM emergency_requests WHERE user_id=? ORDER BY created_at DESC";

    db.query(
        sql,
        [req.params.userId],
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

module.exports = router;