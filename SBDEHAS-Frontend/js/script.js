/*
=========================================
SBDEHAS
Smart Blood Donor & Emergency Healthcare
Assistance System
=========================================

Frontend Technologies:
- HTML5
- CSS3
- Bootstrap 5
- JavaScript

Developer:
GTU Societal Internship Project

Current Version:
Frontend Prototype (LocalStorage Based)
*/

/* Blood Donor Data */

let donors =
JSON.parse(localStorage.getItem("donors"))
|| [

{
    name: "Rahul Patel",
    blood: "B+",
    city: "Vadodara",
    phone: "9876543210"
},

{
    name: "Amit Shah",
    blood: "O+",
    city: "Ahmedabad",
    phone: "9876543222"
},

{
    name: "Priya Sharma",
    blood: "A+",
    city: "Surat",
    phone: "9876543233"
}

];

localStorage.setItem(
"donors",
JSON.stringify(donors)
);

/* Emergency Requests */

let requests =
JSON.parse(localStorage.getItem("requests"))
|| [];

localStorage.setItem(
"requests",
JSON.stringify(requests)
);

/* Registered Users */

let users =
JSON.parse(localStorage.getItem("users"))
|| [];

localStorage.setItem(
"users",
JSON.stringify(users)
);

/* Contact Messages */

let messages =
JSON.parse(localStorage.getItem("messages"))
|| [];

localStorage.setItem(
"messages",
JSON.stringify(messages)
);

/* Session Information */

let currentUser =
JSON.parse(localStorage.getItem("currentUser"))
|| null;

let adminLoggedIn =
localStorage.getItem("adminLoggedIn")
|| "false";

console.log(
"SBDEHAS Frontend Loaded Successfully"
);