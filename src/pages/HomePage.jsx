import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import Ticker from '../components/Ticker/Ticker';
import Categories from '../components/Categories/Categories';
import HomeProducts from '../components/Products/HomeProducts';
import Story from '../components/Story/Story';
import Features from '../components/Features/Features';
import Newsletter from '../components/Newsletter/Newsletter';
import Footer from '../components/Footer/Footer';

const HomePage = () => (
  <div>
    <Navbar />
    <Hero />
    <Ticker />
    <Categories />
    <HomeProducts />
    <Story />
    <Features />
    <Newsletter />
    <Footer />
  </div>
);
export default HomePage;
