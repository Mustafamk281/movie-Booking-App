const db = require('../config/db'); 

const Booking = {
    async isSeatBooked(seat_no, show_id){

        const sql = `SELECT * FROM BookedSeats WHERE seat_no = ? AND show_id = ?`;

        const [rows] = await db.query(sql, [seat_no, show_id]);
        return rows.length > 0;
    },
    async createBooking(userID, show_ID, seats, total_price) {
        const sql = `INSERT INTO bookings (user_id, show_id, total_price, payment_status) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(sql, [userID, show_ID, total_price, 'Pending']);
        
        const insertBookSeats = `INSERT INTO bookedseats (booking_id, seat_no, show_id) VALUES (?, ?, ?)`;
        const remainingSeats = `UPDATE shows SET available_seats = available_seats - ? WHERE show_id = ?`;
        await db.query(remainingSeats, [seats.length, show_ID]);
        for (let seat of seats) {
            await db.query(insertBookSeats, [result.insertId, seat, show_ID]);
        }
    
        return result.insertId;
    },    
    async insertBookedSeats(booking_id, seat_no, show_id){
        const sql = `INSERT INTO BookedSeats (booking_id, seat_no, show_id) VALUES (?, ?, ?)`;
        await db.query(sql, [booking_id, seat_no, show_id]);

    },
    async getBookingsByUserID(userID){
        const sql = `SELECT * FROM bookings WHERE user_id = ?`;
        const [rows] = await db.query(sql, [userID]);
        return rows; 
    },
    async cancelBooking(booking_id){
        const sql2 = `DELETE FROM bookings WHERE booking_id = ?`;
        await db.query(sql2, [booking_id]);
    },
    async getBookedSeats(show_id){
        const sql = `SELECT seat_no FROM BookedSeats WHERE show_id = ?`;
        const [rows] = await db.query(sql, [show_id]);
        return rows.map(row => row.seat_no); 
    },
    async getBookingsByUserID(bookingID){
        const sql = 'SELECT* FROM bookings WHERE user_id = ?';
        const [rows] = await db.query(sql, [bookingID]);
        return rows;
    },
    async getBookingByID(bookingID){
        const sql = 'SELECT* FROM bookings WHERE booking_id = ?';
        const [rows] = await db.query(sql, [bookingID]);
        return rows[0]; 
    }
}


module.exports = Booking