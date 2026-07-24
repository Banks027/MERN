import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/SavedItems.css";

function SavedItems() {

    const savedItems = [

        {
            title: "MacBook Air M2",
            price: "$850",
            location: "UCF Main Campus",
            image:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
        },

        {
            title: "Mini Fridge",
            price: "$125",
            location: "Orlando",
            image:
                "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=800&q=80",
        },

        {
            title: "Calculus Textbook",
            price: "$40",
            location: "Student Union",
            image:
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
        },

    ];

    return (
        <>
            <Navbar />

            <main className="saved-page">

                <div className="saved-header">

                    <p className="section-label">
                        MY ACCOUNT
                    </p>

                    <h1>Saved Items</h1>

                    <p>
                        Your favorite listings all in one place.
                    </p>

                </div>

                <div className="saved-grid">

                    {savedItems.map((item, index) => (

                        <div
                            className="saved-card"
                            key={index}
                        >

                            <div
                                className="saved-image"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                }}
                            >

                                <button className="saved-heart">
                                    ❤️
                                </button>

                                <span className="saved-price">
                                    {item.price}
                                </span>

                            </div>

                            <div className="saved-info">

                                <h3>{item.title}</h3>

                                <p>{item.location}</p>

                            </div>

                        </div>

                    ))}

                </div>

                <Link
                    to="/"
                    className="primary-button"
                >
                    Browse More Listings
                </Link>

            </main>

            <Footer />
        </>
    );
}

export default SavedItems;