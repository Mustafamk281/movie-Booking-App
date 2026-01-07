const db = require('../config/db'); 
const bcrypt = require('bcrypt');
const Movie = {
    async getMovies() {
        const sql = `SELECT * FROM movies`;
        const [rows] = await db.query(sql);  
        return rows;
    },
    async getMovieGenre(genre_id) {
        const sql = `SELECT name FROM genres WHERE id = ?`;
        const [rows] = await db.query(sql, [genre_id]);
        return rows[0].name; 
    },
    async getMovieById(id) {
        const sql = `SELECT * FROM movies WHERE id = ?`;
        const [rows] = await db.query(sql, [id]);
        return rows; 
    },
    async addMovie(genre_id, name, trailer_url, banner_image_url, duration, rating, description, language, country_of_origin) {
        const sql = `
            INSERT INTO movies (
                genre_id, name, trailer_url, banner_image_url, duration,
                rating, description, language, country_of_origin, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const [result] = await db.query(sql, [
            genre_id, name, trailer_url, banner_image_url, duration,
            rating, description, language, country_of_origin
        ]);

        return result.insertId;
    },
    async deleteMovie(id) {
        const sql = `DELETE FROM movies WHERE id = ?`;
        const [result] = await db.query(sql, [id]);
        
        
        if (result.affectedRows > 0) {
            return { success: true }; 
        }
        return { success: false }; 
    },    
    async getAllGenres(){
        const sql = `SELECT * FROM genres`;
        const [rows] = await db.query(sql);  
        return rows; 

    },
    async searchMoviesByName(query) {
        const sql = `SELECT * FROM movies WHERE LOWER(name) LIKE LOWER(?) LIMIT 10`;
        const [rows] = await db.query(sql, [`%${query}%`]);
        return rows; 
    },
    async getAllMoviesNamesAndIDs(){
        const sql = `SELECT id, name FROM movies`;
        const [rows] = await db.query(sql);  
        return rows; 
    },
    async getMoviesByGenre(genre_id){
        const sql = `SELECT * FROM movies WHERE genre_id = ?`;
        const [rows] = await db.query(sql, [genre_id]);
        return rows; 
    }
    
    
}


module.exports = Movie;