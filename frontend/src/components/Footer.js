import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <Link to="#">Contact Us</Link>
            <Link to="#">About FlitCart</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Press</Link>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <Link to="#">Payments</Link>
            <Link to="#">Shipping</Link>
            <Link to="#">Cancellations & Returns</Link>
            <Link to="#">FAQ</Link>
          </div>
          <div className="footer-col">
            <h4>POLICY</h4>
            <Link to="#">Return Policy</Link>
            <Link to="#">Terms of Use</Link>
            <Link to="#">Security</Link>
            <Link to="#">Privacy</Link>
          </div>
          <div className="footer-col">
            <h4>SOCIAL</h4>
            <Link to="#">Facebook</Link>
            <Link to="#">Twitter</Link>
            <Link to="#">YouTube</Link>
            <Link to="#">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
