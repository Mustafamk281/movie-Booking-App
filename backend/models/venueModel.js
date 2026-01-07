const db = require('../config/db'); 

const Venue = {
    async getAllVenues() {
        const sql = `SELECT * FROM venues`;
        const [rows] = await db.query(sql); 
        return rows;
    },
    async getAllHalls() {
        const sql = `SELECT * FROM halls`; 
        const [rows] = await db.query(sql); 
        return rows; 
    },    
    async getVenueByID(venueId) {
        const sql = `
            SELECT 
                v.*, 
                JSON_ARRAYAGG(h.name) AS hall_names
            FROM 
                venues v
            LEFT JOIN 
                halls h ON v.id = h.venue_id
            WHERE 
                v.id = ?
            GROUP BY 
                v.id
        `;
    
        const [rows] = await db.query(sql, [venueId]);
        return rows; 
    },    
    async addVenue(name, contact_email, contact_phone, address, city, state, postal_code, country, status) {
        const sql = `
            INSERT INTO venues (name, contact_email, contact_phone, address, city, state, postal_code, country, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [name, contact_email, contact_phone, address, city, state, postal_code, country, status]); // Insert a new venue
        return result.insertId; 
    },
    async getVenueById(venueId){
        const sql = `SELECT * FROM venues WHERE id = ?`;
        const [rows] = await db.query(sql, [venueId]); 
        return rows;
    },
    async deleteVenueById(venueId){
        const sql = `DELETE FROM venues WHERE id = ?`;
        const [result] = await db.query(sql, [venueId]); 
        return result; 
    },
    async getVenuesByStatus(status){
        const sql = `SELECT * FROM venues WHERE status = ?`;
        const [rows] = await db.query(sql, [status]); 
        return rows; 
    },
    async getHallByID(hallId) {
        const sql = `
            SELECT v.name as venue_name, h.name as hall_name, h.id, h.type, h.status, h.created_at  
            FROM halls h 
            JOIN venues v ON h.venue_id = v.id 
            WHERE h.id = ?
        `;
        const [rows] = await db.query(sql, [hallId]);
        return rows.length > 0 ? rows[0] : null;
    }, 
    async createHall(venue_id, name, type, status){
        const sql = `
            INSERT INTO halls (venue_id, name, type, status)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [venue_id, name, type, status]); 
        const hallId = result.insertId;

        const seatSql = `INSERT INTO seats (hall_id, seat_number) VALUES ?`;
        const seatValues = [];

        for (let seatNumber = 1; seatNumber <= 75; seatNumber++) {
            seatValues.push([hallId, seatNumber]);
        }
        await db.query(seatSql, [seatValues]); 
        
        return result.insertId; 
    },
    async deleteHallById(hallId){
        const asql = `DELETE FROM seats WHERE hall_id = ?`;
        await db.query(asql, [hallId]); 
        const sql = `DELETE FROM halls WHERE id = ?`;
        const [result] = await db.query(sql, [hallId]); 
        return result; 
    },
    async getHallsByVenueId(venueId){
        const sql = `SELECT * FROM halls WHERE venue_id = ?`;
        const [rows] = await db.query(sql, [venueId]); 
        return rows;
    },
    async getAllVenuesIDAndNames(){
        const sql = `SELECT id, name FROM venues`;
        const [rows] = await db.query(sql); 
        return rows; 
    },
    async getAllHallsIDAndNames(){
        const sql = `SELECT id, name FROM halls WHERE status = 'active'`;
        const [rows] = await db.query(sql); 
        return rows; 
    }
}
module.exports = Venue;