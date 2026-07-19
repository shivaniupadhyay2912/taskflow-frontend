import { useEffect, useState } from "react";
import {
    useNavigate,
    Link
} from "react-router-dom";

import api from "../api/axiosApi";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                profileResponse,
                statsResponse
            ] = await Promise.all([
                api.get("/auth/me"),
                api.get("/tasks/stats")
            ]);

            const userData =
                profileResponse.data.user ||
                profileResponse.data;

            const statsData =
                statsResponse.data.stats ||
                statsResponse.data;

            setUser({
                name: userData.name || "User",
                email: userData.email || "Not available"
            });

            setStats({
                total: statsData.total || 0,
                completed: statsData.completed || 0,
                pending: statsData.pending || 0,
                overdue: statsData.overdue || 0
            });

        } catch (error) {
            console.log(
                "Profile error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load profile information"
            );

        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        if (!user.name) {
            return "U";
        }

        const words = user.name
            .trim()
            .split(" ")
            .filter(Boolean);

        if (words.length === 1) {
            return words[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-page-header">

                <div>
                    <h1>My Profile</h1>

                    <p>
                        View your account information and
                        task activity.
                    </p>
                </div>

                <span className="profile-status">
                    Active Account
                </span>

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="profile-layout">

                <section className="profile-main-card">

                    <div className="profile-banner"></div>

                    <div className="profile-user-section">

                        <div className="profile-avatar">
                            {getInitials()}
                        </div>

                        <div className="profile-user-info">

                            <h2>{user.name}</h2>

                            <p>{user.email}</p>

                            <span className="profile-role">
                                TaskFlow Member
                            </span>

                        </div>

                    </div>

                    <div className="profile-divider"></div>

                    <div className="profile-details">

                        <div className="profile-detail-item">

                            <div className="profile-detail-icon">
                                👤
                            </div>

                            <div>
                                <span>Full Name</span>
                                <strong>{user.name}</strong>
                            </div>

                        </div>

                        <div className="profile-detail-item">

                            <div className="profile-detail-icon">
                                ✉
                            </div>

                            <div>
                                <span>Email Address</span>
                                <strong>{user.email}</strong>
                            </div>

                        </div>

                        <div className="profile-detail-item">

                            <div className="profile-detail-icon">
                                ✓
                            </div>

                            <div>
                                <span>Account Status</span>
                                <strong>Active</strong>
                            </div>

                        </div>

                        <div className="profile-detail-item">

                            <div className="profile-detail-icon">
                                🔒
                            </div>

                            <div>
                                <span>Authentication</span>
                                <strong>JWT Protected</strong>
                            </div>

                        </div>

                    </div>

                </section>

                <aside className="profile-side-column">

                    <section className="profile-stats-card">

                        <div className="profile-section-heading">
                            <h3>Task Activity</h3>
                            <span>Overview</span>
                        </div>

                        <div className="profile-stats-grid">

                            <div className="profile-stat-box">
                                <span>Total Tasks</span>
                                <strong>{stats.total}</strong>
                            </div>

                            <div className="profile-stat-box">
                                <span>Completed</span>
                                <strong>{stats.completed}</strong>
                            </div>

                            <div className="profile-stat-box">
                                <span>Pending</span>
                                <strong>{stats.pending}</strong>
                            </div>

                            <div className="profile-stat-box">
                                <span>Overdue</span>
                                <strong>{stats.overdue}</strong>
                            </div>

                        </div>

                    </section>

                    <section className="profile-actions-card">

                        <div className="profile-section-heading">
                            <h3>Quick Actions</h3>
                        </div>

                        <div className="profile-action-links">

                            <Link
                                to="/tasks"
                                className="profile-action-link"
                            >
                                <span>＋</span>

                                <div>
                                    <strong>
                                        Manage Tasks
                                    </strong>

                                    <small>
                                        Add, edit and complete tasks
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                            <Link
                                to="/dashboard"
                                className="profile-action-link"
                            >
                                <span>⌂</span>

                                <div>
                                    <strong>
                                        View Dashboard
                                    </strong>

                                    <small>
                                        Check your task overview
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                            <Link
                                to="/trash"
                                className="profile-action-link"
                            >
                                <span>⌫</span>

                                <div>
                                    <strong>
                                        Open Trash
                                    </strong>

                                    <small>
                                        Restore deleted tasks
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                        </div>

                        <button
                            type="button"
                            className="profile-logout-button"
                            onClick={handleLogout}
                        >
                            Logout from TaskFlow
                        </button>

                    </section>

                </aside>

            </div>

        </div>
    );
}

export default Profile;