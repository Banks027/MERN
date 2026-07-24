import React from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "../styles/Notifications.css";

function Notifications() {
  const notifications = [
    {
      icon: "💬",
      title: "New Message",
      text: "John sent you a message about your MacBook listing.",
      time: "2 minutes ago",
    },
    {
      icon: "💰",
      title: "Offer Received",
      text: "Someone offered $125 for your Mini Fridge.",
      time: "1 hour ago",
    },
    {
      icon: "❤️",
      title: "Listing Saved",
      text: "A student saved your Calculus Textbook listing.",
      time: "Yesterday",
    },
    {
      icon: "🛍️",
      title: "Item Sold",
      text: "Your Desk Chair has been marked as sold.",
      time: "2 days ago",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="notifications-page">

        <div className="notifications-header">

          <p className="section-label">
            ACCOUNT
          </p>

          <h1>Notifications</h1>

          <p>
            Stay up to date with your marketplace activity.
          </p>

        </div>

        <div className="notifications-list">

          {notifications.map((notification, index) => (

            <div
              className="notification-card"
              key={index}
            >

              <div className="notification-icon">
                {notification.icon}
              </div>

              <div className="notification-content">

                <h3>{notification.title}</h3>

                <p>{notification.text}</p>

                <small>{notification.time}</small>

              </div>

            </div>

          ))}

        </div>

        <button className="primary-button">
          Mark All as Read
        </button>

      </main>

      <Footer />
    </>
  );
}

export default Notifications;