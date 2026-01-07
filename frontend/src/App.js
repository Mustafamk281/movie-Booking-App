// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import MyBookings from './components/MyBookings';
import Movies from './components/MoviePage';
import MovieDetails from './components/MovieDetails';
import PrivateRoute from './components/PrivateRoute';
import AddMovie from './components/AddMovie';
import AdminActions from './components/AdminActions'; 
import DeleteMovie from './components/DeleteMovie'; 
import Venues from './components/Venues'; 
import VenueDetails from './components/VenueDetails'; 
import AddVenue from './components/AddVenue'; 
import Halls from './components/HallList'; 
import HallDetails from './components/HallDetails'; 
import AddHall from './components/AddHall'; 
import DeleteVenue from './components/DeleteVenue'; 
import DeleteHall from './components/DeleteHall'; 
import Shows from './components/Shows';
import ShowDetails from './components/ShowDetails'; 
import AddShow from './components/AddShow';
import CreateBooking from './components/CreateBooking';
import Payment from './components/Payment';
import ContactUs from './components/ContactUs';



function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/venues" element={<Venues />} /> 
          <Route path="/venue/:id" element={<VenueDetails />} /> 
          <Route path="/halls" element={<Halls />} /> 
          <Route path="/hall/:id" element={<HallDetails />} /> 
          <Route path="/shows" element={<Shows />} /> 
          <Route path="/show/:id" element={<ShowDetails />} /> 
          <Route path="/create-booking/:showId" element={<CreateBooking />} /> 
          <Route path="/payment/:bookingId" element={<Payment />} /> 
          <Route path ="/contact-us" element={<ContactUs />} />
          {/* Admin protected actions */}
          <Route path="/admin-actions" element={<PrivateRoute element={<AdminActions />} />} />
          <Route path="/add-movie" element={<PrivateRoute element={<AddMovie />} />} />
          <Route path="/delete-movie" element={<PrivateRoute element={<DeleteMovie />} />} />
          <Route path="/add-venue" element={<PrivateRoute element={<AddVenue />} />} /> 
          <Route path="/add-hall" element={<PrivateRoute element={<AddHall />} />} /> 
          <Route path="/delete-venue" element={<PrivateRoute element={<DeleteVenue />} />} /> 
          <Route path="/delete-hall" element={<PrivateRoute element={<DeleteHall />} />} /> 
          <Route path="/add-show" element={<PrivateRoute element={<AddShow />} />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
