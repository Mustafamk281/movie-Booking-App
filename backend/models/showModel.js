const db = require('../config/db'); 
const Show = {
    async addNewShow(hall_id, movie_id, start_time, duration) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            if (!start_time || isNaN(new Date(start_time))) {
                throw new Error('Invalid or missing start_time');
            }

            if (isNaN(duration)) {
                throw new Error('Invalid duration');
            }

            const startDate = new Date(start_time);
            const endDate = new Date(startDate.getTime() + duration * 60000);

            const formatUTC = (d) => d.toISOString().slice(0, 19).replace('T', ' ');
            const start = formatUTC(startDate);
            const end = formatUTC(endDate);

            const [overlaps] = await connection.query(
                `SELECT show_id FROM shows 
                 WHERE hall_id = ? 
                 AND NOT (end_time <= ? OR start_time >= ?)`,
                [hall_id, start, end]
            );

            if (overlaps.length > 0) {
                throw new Error('Show time overlaps with existing shows');
            }

            const available_seats = 75;
            const [result] = await connection.query(
                `INSERT INTO shows (hall_id, movie_id, start_time, end_time, available_seats) 
                 VALUES (?, ?, ?, ?, ?)`,
                [hall_id, movie_id, start, end, available_seats]
            );

            await connection.commit();
            return result.insertId;

        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    },
    async getAllShows() {
        const connection = await db.getConnection();
        const sql = `
            SELECT 
    s.show_id, 
    h.name AS hall_name, 
    m.name AS movie_name, 
    s.start_time, 
    s.end_time, 
    s.available_seats, 
    v.name AS venue_name, 
    m.name AS movie_title,
    m.banner_image_url AS banner_image_url
FROM shows s
JOIN halls h ON s.hall_id = h.id
JOIN venues v ON h.venue_id = v.id
JOIN movies m ON s.movie_id = m.id;

        `;
        const [shows] = await connection.query(sql);
        return shows;
    },      
    /*async getAllShows() {
        const connection = await db.getConnection();
        const sql = `
                SELECT 
                    s.show_id, 
                    s.hall_id, 
                    s.movie_id, 
                    s.start_time, 
                    s.end_time, 
                    s.available_seats, 
                    v.name AS hall_name, 
                    m.name AS movie_title,
                    m.banner_image_url AS banner_image_url,
                FROM shows s
                JOIN venues v ON s.hall_id = v.id
                JOIN movies m ON s.movie_id = m.id
            `;
            
            const [shows] = await connection.query(sql);  // Execute query
            
            return shows; // Return the result
    },*/


    async getShowByID(showID) {
        const sql = `
            SELECT s.*,h.type as hall_type, h.name AS hall_name, v.name AS venue_name, m.name AS movie_title, m.banner_image_url
            FROM Shows s
            JOIN Halls h ON s.hall_id = h.id
            JOIN Venues v ON h.venue_id = v.id
            JOIN Movies m ON s.movie_id = m.id
            WHERE s.show_id = ?
        `;
        const [rows] = await db.query(sql, [showID]);
        return rows;
    },
    
   /* async getShowByID(ID) {
        const connection = await db.getConnection();
        const sql = `
            SELECT 
                s.show_id, 
                h.name AS hall_name, 
                v.name AS venue_name,  -- Renamed to avoid conflict with hall_name
                m.name AS movie_title,  -- Renamed to avoid conflict with movie_name
                h.type as hall_type,
                s.start_time, 
                s.end_time, 
                s.available_seats, 
                m.banner_image_url AS banner_image_url
            FROM shows s
            JOIN venues v ON s.hall_id = v.id
            JOIN Halls h ON s.hall_id = h.id
            JOIN movies m ON s.movie_id = m.id
            WHERE s.show_id = ?;
        `;
        const [shows] = await connection.query(sql, [ID]);  // Execute query
        return shows.length ? shows : [];  // Ensure an empty array is returned if no shows are found
    },    */
    
    /*ync getShowByID(ID) {
        const connection = await db.getConnection();
        const sql = `
            SELECT 
                s.show_id, 
                s.hall_id, 
                s.movie_id, 
                s.start_time, 
                s.end_time, 
                s.available_seats, 
                v.name AS hall_name, 
                m.name AS movie_title,
                m.banner_image_url AS banner_image_url
            FROM shows s
            JOIN venues v ON s.hall_id = v.id
            JOIN movies m ON s.movie_id = m.id
            WHERE s.show_id = ?
        `;
        
        const [shows] = await connection.query(sql, [ID]);  // Execute query
        
        return shows; // Return the result
    },*/
    async deleteShow(id) {
        const connection = await db.getConnection();
        try {
            // Check if the show exists (this can be done directly in the DELETE query)
            const [result] = await connection.query('DELETE FROM shows WHERE show_id = ?', [id]);
    
            return (result);
        } catch (err) {
            throw err;  
        } finally {
            connection.release();
        }
    },
    async getShowsByMovieId(movieId){
        const connection = await db.getConnection();
        const sql = `
            SELECT 
                s.show_id, 
                s.hall_id, 
                s.movie_id, 
                s.start_time, 
                s.end_time, 
                s.available_seats, 
                v.name AS hall_name, 
                m.name AS movie_title,
                m.banner_image_url AS banner_image_url
            FROM shows s
            JOIN venues v ON s.hall_id = v.id
            JOIN movies m ON s.movie_id = m.id
            WHERE s.movie_id = ?
        `;
        
        const [shows] = await connection.query(sql, [movieId]);  
        
        return shows; 
    },
    async getShowsByVenueId(venueId) {
        const connection = await db.getConnection();
        
        const sql = `
            SELECT 
                s.show_id, 
                s.hall_id, 
                s.movie_id, 
                s.start_time, 
                s.end_time, 
                s.available_seats, 
                v.name AS hall_name, 
                m.name AS movie_title,
                m.banner_image_url AS banner_image_url
            FROM shows s
            JOIN venues v ON s.hall_id = v.id  -- Join to get hall info
            JOIN movies m ON s.movie_id = m.id -- Join to get movie info
            WHERE v.id = ?  -- Filter by venue ID
        `;
        
        const [shows] = await connection.query(sql, [venueId]);  
    
        return shows; 
    },
    async getShowsByHallId(hallId) {
        const connection = await db.getConnection();
    
        const sql = `
            SELECT 
                s.show_id, 
                s.hall_id, 
                s.movie_id, 
                s.start_time, 
                s.end_time, 
                s.available_seats, 
                v.name AS hall_name, 
                m.name AS movie_title,
                m.banner_image_url AS banner_image_url
            FROM shows s
            JOIN venues v ON s.hall_id = v.id
            JOIN movies m ON s.movie_id = m.id
            WHERE s.hall_id = ?
        `;
    
        const [shows] = await connection.query(sql, [hallId]);
    
        return shows;
    },
    async updateAvailableSeats(show_id, updatedAvailableSeats)
    {
        const sql = `UPDATE shows SET available_seats = ? WHERE show_id = ?`;
        const [result] = await db.query(sql, [updatedAvailableSeats, show_id]);
        return result.affectedRows > 0; 
    }
    
    
    
}

module.exports = Show;
