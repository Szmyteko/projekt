import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import VegetableList from './components/VegetableList';
import AddVegetable from './components/AddVegetable';
import EditVegetable from './components/EditVegetable';

import AddCategory from './components/AddCategory';
import CategoryList from './components/CategoryList';
import EditCategory from './components/EditCategory';

import Login from './components/Login';
import Register from './components/Register';
import UserList from './components/UserList';
import Cart from './components/Cart';
import Orders from './components/Orders';        
import MyOrders from './components/MyOrders';     

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';

function App() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', boxSizing: 'border-box' }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vegetables" element={<VegetableList />} />
          <Route path="/add-vegetable" element={<AddVegetable />} />
          <Route path="/edit-vegetable/:id" element={<EditVegetable />} />

          <Route path="/categories" element={<CategoryList />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />         
          <Route path="/my-orders" element={<MyOrders />} />   

          <Route path="*" element={<div>404 - Nie znaleziono strony</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
