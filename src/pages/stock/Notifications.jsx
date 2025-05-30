import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import authService from '../../services/authService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async (dateFilter) => {
        setLoading(true);
        try {
            const response = await authService.getNotifications(dateFilter);
            setNotifications(response);
        } catch (error) {
            console.error('Erreur lors de la récupération des notifications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(selectedDate || null);
    }, [selectedDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value || '');
    };

    const clearFilter = () => {
        setSelectedDate('');
    };

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
                            <div className="card-header">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <div className="form-group mb-0">
                                            <label>Filtrer par date :</label>
                                            <input 
                                                type="date" 
                                                className="form-control"
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <button 
                                            className="btn btn-secondary mt-3"
                                            onClick={clearFilter}
                                            disabled={!selectedDate}
                                        >
                                            Réinitialiser
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Chargement...</span>
                                        </div>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <p className="text-muted text-center">
                                        Aucune notification{selectedDate ? ` pour le ${selectedDate}` : ''} trouvée
                                    </p>
                                ) : (
                                    <ul className="list-group">
                                        {notifications.map((notif) => (
                                            <li key={notif.id} className="list-group-item">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <strong>
                                                            Notification de {notif.emetteur.prenom} {notif.emetteur.nom}
                                                        </strong>
                                                        <p className="mb-1">{notif.message}</p>
                                                        <small className="text-muted">
                                                            {new Date(notif.dateCreation).toLocaleString()}
                                                        </small>
                                                    </div>
                                                </div>
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