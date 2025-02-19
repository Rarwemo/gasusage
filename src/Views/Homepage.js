// src/Views/Homepage.js
import React, { useState } from 'react';
import './Homepage.css';

const Homepage = () => {
    const [isBlue, setIsBlue] = useState(false);

    const toggleColor = () => {
        setIsBlue(!isBlue);
    };

    return (
        <div className="gasusage-homepage">
            <h1>Welcome to your Gas Usage Website</h1>
            <p>The trusted site in managing your gas usage</p>
            <div className={`gasusage-color-box ${isBlue ? 'gasusage-blue' : 'gasusage-red'}`}></div>
            <button className="gasusage-button" onClick={toggleColor}>Change Color</button>
        </div>
    );
};

export default Homepage;