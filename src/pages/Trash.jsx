import { useEffect, useState } from "react";
import api from "../api/axiosApi";

function Trash() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDeletedTasks();
    }, []);

    const fetchDeletedTasks = async () => {
        try {
            setError("");

            const response = await api.get("/tasks/deleted");

            setTasks(response.data.tasks || []);
        } catch (error) {
            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to load deleted tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    const restoreTask = async (id) => {
        try {
            await api.patch(`/tasks/${id}/restore`);

            setTasks((previousTasks) =>
                previousTasks.filter((task) => task._id !== id)
            );
        } catch (error) {
            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to restore task"
            );
        }
    };

    if (loading) {
        return <h2>Loading deleted tasks...</h2>;
    }

    return (
        <div className="trash-page">

            <div className="trash-header">
                <div>
                    <h1>Trash</h1>
                    <p>Restore tasks that you deleted.</p>
                </div>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <h3>Trash is empty</h3>
                    <p>You do not have any deleted tasks.</p>
                </div>
            ) : (
                <div className="task-grid">

                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="task-card"
                        >
                            <h3>{task.title}</h3>

                            <p>
                                {task.description || "No description"}
                            </p>

                            <p>
                                <strong>Priority:</strong>{" "}
                                {task.priority}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {task.status}
                            </p>

                            <p>
                                <strong>Deleted:</strong>{" "}
                                {task.deletedAt
                                    ? new Date(
                                          task.deletedAt
                                      ).toLocaleDateString()
                                    : "Unknown"}
                            </p>

                            <button
                                className="restore-btn"
                                onClick={() =>
                                    restoreTask(task._id)
                                }
                            >
                                Restore Task
                            </button>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Trash;