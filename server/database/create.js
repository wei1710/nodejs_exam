import db from "./connection.js";

const testUsers = [
  {
    username: "JohnDoe",
    password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
    email: "johndoe@gmail.com",
    is_signed_up: true,
    verified: true,
    session_id: null,
    verification_token: null,
    verification_key: null,
    expiration_timestamp: null,
    reset_token: null,
    reset_timestamp: null,
    is_admin: false
  },
  {
    username: "AliceDoe",
    password: "$2b$10$lzGn5RlBjQxmMgOUMSB5UeZ6Wh5J2kSDmsEhaK4dTvnW/armWEcZ2",
    email: "alicedoe@gmail.com",
    is_signed_up: true,
    verified: true,
    session_id: null,
    verification_token: null,
    verification_key: null,
    expiration_timestamp: null,
    reset_token: null,
    reset_timestamp: null,
    is_admin: false
  },
  {
    username: "admin",
    password: "$2b$10$i4gqSJB0TdZlnQV8oJMSn.atCAx/pWliVfz6WFdovsI6UhkRN5MN.",
    email: "admin@movieportal.com",
    is_signed_up: true,
    verified: true,
    session_id: null,
    verification_token: null,
    verification_key: null,
    expiration_timestamp: null,
    reset_token: null,
    reset_timestamp: null,
    is_admin: true
  }
];

await db.users.insertMany(testUsers);
console.log("Test users inserted");

