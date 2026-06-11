const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../queries/auth.queries');

const generateTokens = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
    return { accessToken, refreshToken };
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await findUserByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already exists'});

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser(email, passwordHash);
        const { accessToken, refreshToken } = generateTokens(user.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ user, accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if(!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if(!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const { accessToken, refreshToken } = generateTokens(user.id);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: { id: user.id, email: user.email, }, accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });
    } catch(err) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

const logout = async (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
};

module.exports = { register, login, refresh, logout };