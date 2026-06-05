require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ============ TEST ENDPOINTS ============

app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1+1 as result');
        res.json({ message: 'Database connected!', result: rows[0].result });
    } catch (error) {
        console.error('Test error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ ROOM ENDPOINTS ============

app.get('/api/rooms', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM room_types');
        res.json(rows);
    } catch (error) {
        console.error('Rooms error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/rooms/featured', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM room_types WHERE is_featured = TRUE LIMIT 3');
        res.json(rows);
    } catch (error) {
        console.error('Featured rooms error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/rooms/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT rt.*, 
                   (SELECT id FROM rooms WHERE room_type_id = rt.id AND is_available = TRUE LIMIT 1) as available_room_id
            FROM room_types rt 
            WHERE rt.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Room detail error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/rooms/available/:roomTypeId', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT id as available_room_id 
            FROM rooms 
            WHERE room_type_id = ? AND is_available = TRUE 
            LIMIT 1
        `, [req.params.roomTypeId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No available rooms for this type' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Available room error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============ AUTH ENDPOINTS ============

app.post('/api/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Please provide name, email and password' });
    }
    
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, phone || null]
        );
        
        const token = jwt.sign(
            { id: result.insertId, email: email },
            process.env.JWT_SECRET || 'vacation_cat_secret_key',
            { expiresIn: '7d' }
        );
        
        res.status(201).json({
            message: 'Registration successful!',
            token: token,
            user: { id: result.insertId, name: name, email: email }
        });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'vacation_cat_secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({
            message: 'Login successful!',
            token: token,
            user: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// ============ CAT ENDPOINTS ============

app.get('/api/cats', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const [cats] = await db.query('SELECT * FROM cats WHERE user_id = ? ORDER BY id DESC', [decoded.id]);
        res.json(cats);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/api/cats', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const { name, breed, age, color, special_needs, diet_instructions } = req.body;
        
        if (!name) return res.status(400).json({ error: 'Cat name is required' });
        
        const [result] = await db.query(
            'INSERT INTO cats (user_id, name, breed, age, color, special_needs, diet_instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [decoded.id, name, breed || null, age || null, color || null, special_needs || null, diet_instructions || null]
        );
        
        res.status(201).json({ message: 'Cat added!', cat: { id: result.insertId, name } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add cat' });
    }
});

app.put('/api/cats/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const catId = req.params.id;
        const { name, breed, age, color, special_needs, diet_instructions } = req.body;
        
        const [existing] = await db.query('SELECT id FROM cats WHERE id = ? AND user_id = ?', [catId, decoded.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Cat not found' });
        
        await db.query(
            'UPDATE cats SET name = ?, breed = ?, age = ?, color = ?, special_needs = ?, diet_instructions = ? WHERE id = ?',
            [name, breed || null, age || null, color || null, special_needs || null, diet_instructions || null, catId]
        );
        
        res.json({ message: 'Cat updated!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cat' });
    }
});

app.delete('/api/cats/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const catId = req.params.id;
        
        const [existing] = await db.query('SELECT id FROM cats WHERE id = ? AND user_id = ?', [catId, decoded.id]);
        if (existing.length === 0) return res.status(404).json({ error: 'Cat not found' });
        
        await db.query('DELETE FROM cats WHERE id = ?', [catId]);
        res.json({ message: 'Cat deleted!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cat' });
    }
});

// ============ BOOKING ENDPOINTS ============

app.get('/api/bookings', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        
        const [bookings] = await db.query(`
            SELECT b.*, rt.name as room_name, rt.image_url 
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `, [decoded.id]);
        
        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to get bookings' });
    }
});

app.get('/api/bookings/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const bookingId = req.params.id;
        
        const [bookings] = await db.query(`
            SELECT b.*, rt.name as room_name, rt.image_url, rt.price_per_night, rt.description as room_description,
                   r.room_number
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE b.id = ? AND b.user_id = ?
        `, [bookingId, decoded.id]);
        
        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const [cats] = await db.query(`
            SELECT c.* FROM booking_cats bc
            JOIN cats c ON bc.cat_id = c.id
            WHERE bc.booking_id = ?
        `, [bookingId]);
        
        res.json({ ...bookings[0], cats });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Failed to get booking' });
    }
});

app.post('/api/bookings', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const { room_id, check_in, check_out, cat_ids, special_requests } = req.body;
        
        const startDate = new Date(check_in);
        const endDate = new Date(check_out);
        const total_nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (total_nights <= 0) {
            return res.status(400).json({ error: 'Check-out must be after check-in' });
        }
        
        const [roomRows] = await db.query(`
            SELECT rt.price_per_night, rt.name
            FROM rooms r
            JOIN room_types rt ON r.room_type_id = rt.id
            WHERE r.id = ?
        `, [room_id]);
        
        if (roomRows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        
        const total_amount = parseFloat(roomRows[0].price_per_night) * total_nights;
        
        const [result] = await db.query(
            `INSERT INTO bookings (user_id, room_id, check_in, check_out, total_nights, total_amount, special_requests, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [decoded.id, room_id, check_in, check_out, total_nights, total_amount, special_requests || null]
        );
        
        for (const cat_id of cat_ids) {
            await db.query('INSERT INTO booking_cats (booking_id, cat_id) VALUES (?, ?)', [result.insertId, cat_id]);
        }
        
        res.status(201).json({ 
            message: 'Booking confirmed!', 
            booking_id: result.insertId,
            room_name: roomRows[0].name,
            total_amount: total_amount
        });
        
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

app.put('/api/bookings/:id/cancel', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vacation_cat_secret_key');
        const bookingId = req.params.id;
        
        const [existing] = await db.query('SELECT id FROM bookings WHERE id = ? AND user_id = ?', [bookingId, decoded.id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        await db.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [bookingId]);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📦 Database: vacatation`);
});