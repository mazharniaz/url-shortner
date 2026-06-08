const pool = require('../db');

const createUser = async(email, passwordHash) => {
    const result = await pool.query(
        `INSERT INTO users ("email", password_hash) VALUES ($1, $2) RETURNING id, email, created_at`,
        [email, passwordHash]
    );
    return result.rows[0];
};

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    );
    return result.rows[0];
};

const findUserById = async (id) => {
    const result = await pool.query(
        `SELECT id, email, created_at FROM users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById };