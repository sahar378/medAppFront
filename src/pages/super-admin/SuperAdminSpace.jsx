// src/pages/super-admin/SuperAdminSpace.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const SuperAdminSpace = () => {
    return (
        <div className="wrapper">
            <Navbar />
            <Sidebar />
            <div className="content-wrapper">
                <div className="content-header">
                    <h1 className="m-0">Espace Super Admin</h1>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="card">
                            <div className="card-body">
                                <h5>Gestion des comptes</h5>
                                <Link to="/super-admin/intendants" className="btn btn-primary">
                                    Gérer les intendants
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SuperAdminSpace;