import { useState } from "react";
import api from "../api/axiosApi";

function TaskModal({
    task,
    fetchTasks,
    closeModal
}) {
    const [formData, setFormData] = useState({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "medium",
        status: task?.status || "TO-DO",
        dueDate: task?.dueDate
            ? task.dueDate.split("T")[0]
            : ""
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            setError("Task title is required");
            return;
        }

        if (!formData.description.trim()) {
            setError("Task description is required");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate || null
            };

            if (task) {
                await api.put(
                    `/tasks/${task._id}`,
                    taskData
                );
            } else {
                await api.post(
                    "/tasks",
                    taskData
                );
            }

            await fetchTasks();
            closeModal();

        } catch (error) {
            console.log(
                "Task save error:",
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Unable to save task"
            );

        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={closeModal}
        >
            <div
                className="modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <div className="modal-header">

                    <h2>
                        {task
                            ? "Edit Task"
                            : "Add Task"}
                    </h2>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={closeModal}
                    >
                        ×
                    </button>

                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label htmlFor="title">
                            Task Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Enter task description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="priority">
                            Priority
                        </label>

                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
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

                    </div>

                    <div className="form-group">

                        <label htmlFor="status">
                            Status
                        </label>

                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="TO-DO">
                                To Do
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Done">
                                Done
                            </option>
                        </select>

                    </div>

                    <div className="form-group">

                        <label htmlFor="dueDate">
                            Due Date
                        </label>

                        <input
                            id="dueDate"
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={closeModal}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : task
                                  ? "Update Task"
                                  : "Save Task"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default TaskModal;