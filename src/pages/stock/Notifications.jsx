// src/pages/stock/Notifications.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await authService.getNotifications();
                setNotifications(response);
            } catch (error) {
                console.error('Erreur lors de la récupération des notifications', error);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content-header">
                    <h1 className="m-0">Notifications</h1>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">
                                {notifications.length === 0 ? (
                                    <p>Aucune notification trouvée.</p>
                                ) : (
                                    <ul className="list-group">
                                        {notifications.map((notif) => (
                                            <li key={notif.id} className="list-group-item">
                                                <strong>Notification de {notif.emetteur.prenom} {notif.emetteur.nom}</strong>
                                                <p>{notif.message}</p>
                                                <small>{new Date(notif.dateCreation).toLocaleString()}</small>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Notifications;