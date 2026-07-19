import { useEffect, useMemo, useState } from "react";
import api from "../api/axiosApi";
import TaskModal from "../components/TaskModal";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");

            const taskData =
                response.data.tasks ||
                response.data.data ||
                response.data ||
                [];

            setTasks(
                Array.isArray(taskData)
                    ? taskData
                    : []
            );

        } catch (error) {
            console.log(
                "Fetch tasks error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to load tasks"
            );

        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            await api.delete(`/tasks/${id}`);

            setTasks((previousTasks) =>
                previousTasks.filter(
                    (task) => task._id !== id
                )
            );

        } catch (error) {
            console.log(
                "Delete task error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to delete task"
            );
        }
    };

    const toggleTask = async (id) => {
        try {
            setError("");

            await api.patch(`/tasks/${id}/toggle`);

            await fetchTasks();

        } catch (error) {
            console.log(
                "Toggle task error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to update task"
            );
        }
    };

    const openAddModal = () => {
        setSelectedTask(null);
        setShowModal(true);
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const formatPriority = (priority) => {
        if (!priority) {
            return "Not Set";
        }

        return (
            priority.charAt(0).toUpperCase() +
            priority.slice(1).toLowerCase()
        );
    };

    /*
        Get the exact statuses stored in the database.

        Example:
        If backend returns:
        "In Progress", "Done"

        The filter will automatically show:
        All Status
        In Progress
        Done
    */

    const availableStatuses = useMemo(() => {
        return [
            ...new Set(
                tasks
                    .map((task) => task.status)
                    .filter(Boolean)
            )
        ];
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return [...tasks]
            .filter((task) => {
                const title =
                    task.title || "";

                const description =
                    task.description || "";

                const searchValue =
                    search.toLowerCase().trim();

                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(searchValue) ||
                    description
                        .toLowerCase()
                        .includes(searchValue);

                const matchesStatus =
                    statusFilter === "" ||
                    task.status === statusFilter;

                const matchesPriority =
                    priorityFilter === "" ||
                    task.priority === priorityFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority
                );
            })
            .sort((a, b) => {
                if (sortBy === "title") {
                    return (a.title || "").localeCompare(
                        b.title || ""
                    );
                }

                if (sortBy === "priority") {
                    const priorityOrder = {
                        high: 3,
                        medium: 2,
                        low: 1
                    };

                    return (
                        (priorityOrder[
                            b.priority?.toLowerCase()
                        ] || 0) -
                        (priorityOrder[
                            a.priority?.toLowerCase()
                        ] || 0)
                    );
                }

                if (sortBy === "date") {
                    if (!a.dueDate && !b.dueDate) {
                        return 0;
                    }

                    if (!a.dueDate) {
                        return 1;
                    }

                    if (!b.dueDate) {
                        return -1;
                    }

                    return (
                        new Date(a.dueDate) -
                        new Date(b.dueDate)
                    );
                }

                return 0;
            });

    }, [
        tasks,
        search,
        statusFilter,
        priorityFilter,
        sortBy
    ]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="tasks-page">

            <div className="task-header">

                <h1>My Tasks</h1>

                <button
                    type="button"
                    className="add-btn"
                    onClick={openAddModal}
                >
                    + Add Task
                </button>

            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            <div className="filters">

                <input
                    type="text"
                    placeholder="Search task..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="">
                        All Status
                    </option>

                    {availableStatuses.map((status) => (
                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>
                    ))}

                </select>

                <select
                    value={priorityFilter}
                    onChange={(event) =>
                        setPriorityFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="">
                        All Priority
                    </option>

                    <option value="low">
                        Low
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="high">
                        High
                    </option>

                </select>

                <select
                    value={sortBy}
                    onChange={(event) =>
                        setSortBy(event.target.value)
                    }
                >
                    <option value="">
                        Sort By
                    </option>

                    <option value="title">
                        Title (A-Z)
                    </option>

                    <option value="priority">
                        Priority
                    </option>

                    <option value="date">
                        Due Date
                    </option>

                </select>

            </div>

            {filteredTasks.length === 0 ? (
                <div className="empty-state">

                    <h3>No tasks found</h3>

                    <p>
                        Create a new task or change
                        your search and filters.
                    </p>

                </div>
            ) : (
                <div className="task-grid">

                    {filteredTasks.map((task) => (
                        <div
                            key={task._id}
                            className={
                                task.completed
                                    ? "task-card completed"
                                    : "task-card"
                            }
                        >
                            <h3>
                                {task.title}
                            </h3>

                            <p>
                                {task.description ||
                                    "No description"}
                            </p>

                            <p>
                                <strong>
                                    Priority:
                                </strong>{" "}
                                {formatPriority(
                                    task.priority
                                )}
                            </p>

                            <p>
                                <strong>
                                    Status:
                                </strong>{" "}
                                {task.status ||
                                    "Not Set"}
                            </p>

                            <p>
                                <strong>
                                    Due Date:
                                </strong>{" "}
                                {task.dueDate
                                    ? new Date(
                                          task.dueDate
                                      ).toLocaleDateString()
                                    : "Not Set"}
                            </p>

                            <div className="task-buttons">

                                <button
                                    type="button"
                                    className="complete-btn"
                                    onClick={() =>
                                        toggleTask(
                                            task._id
                                        )
                                    }
                                >
                                    {task.completed
                                        ? "Undo"
                                        : "Complete"}
                                </button>

                                <button
                                    type="button"
                                    className="edit-btn"
                                    onClick={() =>
                                        openEditModal(
                                            task
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        deleteTask(
                                            task._id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

            {showModal && (
                <TaskModal
                    task={selectedTask}
                    fetchTasks={fetchTasks}
                    closeModal={closeModal}
                />
            )}

        </div>
    );
}

export default Tasks;