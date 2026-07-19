import {
    NavLink,
    useNavigate
} from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const getLinkClass = ({ isActive }) => {
        return isActive
            ? "sidebar-link active"
            : "sidebar-link";
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>TaskFlow</h2>
                <p>Task Manager</p>
            </div>

            <nav className="sidebar-menu">

                <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                >
                    <span className="sidebar-icon">⌂</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/tasks"
                    className={getLinkClass}
                >
                    <span className="sidebar-icon">✓</span>
                    <span>Tasks</span>
                </NavLink>

                <NavLink
                    to="/trash"
                    className={getLinkClass}
                >
                    <span className="sidebar-icon">⌫</span>
                    <span>Trash</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={getLinkClass}
                >
                    <span className="sidebar-icon">◉</span>
                    <span>Profile</span>
                </NavLink>

            </nav>

            <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
            >
                <span className="sidebar-icon">↪</span>
                <span>Logout</span>
            </button>

        </aside>
    );
}

export default Navbar;