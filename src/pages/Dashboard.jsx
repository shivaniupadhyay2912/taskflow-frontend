import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosApi";

function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    });

    const [recentTasks, setRecentTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");

            const [statsResponse, tasksResponse] =
                await Promise.all([
                    api.get("/tasks/stats"),
                    api.get("/tasks")
                ]);

            const statsData =
                statsResponse.data.stats ||
                statsResponse.data;

            const tasksData =
                tasksResponse.data.tasks ||
                tasksResponse.data.data ||
                tasksResponse.data ||
                [];

            setStats({
                total: statsData.total || 0,
                completed: statsData.completed || 0,
                pending: statsData.pending || 0,
                overdue: statsData.overdue || 0
            });

            setRecentTasks(
                Array.isArray(tasksData)
                    ? tasksData.slice(0, 4)
                    : []
            );

        } catch (error) {
            console.log(
                "Dashboard error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard"
            );

        } finally {
            setLoading(false);
        }
    };

    const completionPercentage =
        stats.total > 0
            ? Math.round(
                  (stats.completed / stats.total) * 100
              )
            : 0;

    const formatPriority = (priority) => {
        if (!priority) {
            return "Not Set";
        }

        return (
            priority.charAt(0).toUpperCase() +
            priority.slice(1).toLowerCase()
        );
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="dashboard">

            <div className="dashboard-hero">

                <div>
                    <span className="dashboard-label">
                        Task Management
                    </span>

                    <h1>Welcome Back 👋</h1>

                    <p>
                        Stay organized and complete your
                        tasks on time.
                    </p>
                </div>

                <Link
                    to="/tasks"
                    className="dashboard-add-task"
                >
                    + Add New Task
                </Link>

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="stats-grid dashboard-stats">

                <div className="stat-card stat-total">

                    <div className="stat-card-top">
                        <span className="stat-icon">📋</span>
                        <span className="stat-badge">
                            Overview
                        </span>
                    </div>

                    <p>Total Tasks</p>
                    <h2>{stats.total}</h2>

                    <small>
                        All tasks in your account
                    </small>

                </div>

                <div className="stat-card stat-completed">

                    <div className="stat-card-top">
                        <span className="stat-icon">✓</span>
                        <span className="stat-badge">
                            Finished
                        </span>
                    </div>

                    <p>Completed</p>
                    <h2>{stats.completed}</h2>

                    <small>
                        Successfully completed tasks
                    </small>

                </div>

                <div className="stat-card stat-pending">

                    <div className="stat-card-top">
                        <span className="stat-icon">⏳</span>
                        <span className="stat-badge">
                            Active
                        </span>
                    </div>

                    <p>Pending</p>
                    <h2>{stats.pending}</h2>

                    <small>
                        Tasks waiting for completion
                    </small>

                </div>

                <div className="stat-card stat-overdue">

                    <div className="stat-card-top">
                        <span className="stat-icon">⚠</span>
                        <span className="stat-badge">
                            Attention
                        </span>
                    </div>

                    <p>Overdue</p>
                    <h2>{stats.overdue}</h2>

                    <small>
                        Tasks past their due date
                    </small>

                </div>

            </div>

            <div className="dashboard-bottom-grid">

                <section className="dashboard-progress-card">

                    <div className="dashboard-section-header">

                        <div>
                            <h2>Task Progress</h2>

                            <p>
                                Your overall completion
                                status.
                            </p>
                        </div>

                        <strong>
                            {completionPercentage}%
                        </strong>

                    </div>

                    <div className="progress-track">

                        <div
                            className="progress-fill"
                            style={{
                                width:
                                    `${completionPercentage}%`
                            }}
                        ></div>

                    </div>

                    <div className="progress-details">

                        <div>
                            <span>Completed</span>
                            <strong>
                                {stats.completed}
                            </strong>
                        </div>

                        <div>
                            <span>Remaining</span>
                            <strong>
                                {stats.pending}
                            </strong>
                        </div>

                        <div>
                            <span>Total</span>
                            <strong>
                                {stats.total}
                            </strong>
                        </div>

                    </div>

                </section>

                <section className="dashboard-quick-card">

                    <div className="dashboard-section-header">
                        <div>
                            <h2>Quick Actions</h2>

                            <p>
                                Access important pages.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-quick-links">

                        <Link to="/tasks">
                            <span>＋</span>

                            <div>
                                <strong>
                                    Create Task
                                </strong>

                                <small>
                                    Add a new task
                                </small>
                            </div>
                        </Link>

                        <Link to="/trash">
                            <span>⌫</span>

                            <div>
                                <strong>
                                    Open Trash
                                </strong>

                                <small>
                                    Restore deleted tasks
                                </small>
                            </div>
                        </Link>

                        <Link to="/profile">
                            <span>◉</span>

                            <div>
                                <strong>
                                    View Profile
                                </strong>

                                <small>
                                    Check account details
                                </small>
                            </div>
                        </Link>

                    </div>

                </section>

            </div>

            <section className="recent-tasks-section">

                <div className="dashboard-section-header">

                    <div>
                        <h2>Recent Tasks</h2>

                        <p>
                            Your latest task activity.
                        </p>
                    </div>

                    <Link
                        to="/tasks"
                        className="view-all-link"
                    >
                        View All →
                    </Link>

                </div>

                {recentTasks.length === 0 ? (
                    <div className="empty-state">

                        <h3>No tasks available</h3>

                        <p>
                            Create your first task to see
                            it here.
                        </p>

                    </div>
                ) : (
                    <div className="recent-task-list">

                        {recentTasks.map((task) => (
                            <div
                                key={task._id}
                                className="recent-task-item"
                            >

                                <div className="recent-task-main">

                                    <div className="recent-task-icon">
                                        ✓
                                    </div>

                                    <div>
                                        <h3>
                                            {task.title}
                                        </h3>

                                        <p>
                                            {task.description ||
                                                "No description"}
                                        </p>
                                    </div>

                                </div>

                                <div className="recent-task-meta">

                                    <span
                                        className={`priority-pill priority-${task.priority}`}
                                    >
                                        {formatPriority(
                                            task.priority
                                        )}
                                    </span>

                                    <span className="status-pill">
                                        {task.status ||
                                            "Not Set"}
                                    </span>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </section>

        </div>
    );
}

export default Dashboard;