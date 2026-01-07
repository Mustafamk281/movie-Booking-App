const db = require('../config/db'); 

const User = {
    async createNewUser(username, email, password, full_name, phone_number, role) {
        try {
            const sql = `INSERT INTO users (user_name, email, password, full_name, phone_number, role) 
                         VALUES (?, ?, ?, ?, ?, ?)`;
            const result = await db.query(sql, [username, email, password, full_name, phone_number, role]);
            return result;
        } catch (error) {
            console.error('Error during user creation:', error);
            throw new Error('Error during user creation');
        }
    },

   
    async findByEmail(email) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
            console.log('User found by email:', rows); 
            return rows;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Error finding user by email');
        }
    },

    async findByUserName(userName) {
        try {
            const [rows] = await db.query("SELECT * FROM users WHERE user_name = ?", [userName]);
            console.log('User found by username:', rows); 
            return rows;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw new Error('Error finding user by username');
        }
    },
    async findByID(ID){
        const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [ID]);
        return rows;
    },
    async getBookingsByUserId(ID){
        const sql = `SELECT 
                b.booking_id, b.booking_time, b.total_price, b.payment_status,
                s.show_id, s.start_time, s.end_time,
                m.name AS movie_title,
                h.name AS hall_name
            FROM Bookings b
            JOIN Shows s ON b.show_id = s.show_id
            JOIN Movies m ON s.movie_id = m.id
            JOIN Halls h ON s.hall_id = h.id
            WHERE b.user_id = ?
            ORDER BY b.booking_time DESC`;
        const [rows] = await db.query(sql, [ID]);
        return rows;
    },
    async deleteUser(ID){
        const sql = `DELETE FROM users WHERE id = ?`;
        const result = await db.query(sql, [ID]);
        return result;
    }
};

module.exports = User;
