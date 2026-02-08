import { useEffect, useState } from "react";
import api from "../api/client";
import type { Task } from "../types/task";

export default function FocusMode() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tasks and sort by priority
    api.get("/tasks").then(res => {
      const sorted = res.data.sort((a: Task, b: Task) => {
        const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
        const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        return bPriority - aPriority;
      });
      setTasks(sorted);
      setLoading(false);
    });
  }, []);

  const completeTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      // Call backend to mark task as complete
      await api.put(`/tasks/${taskId}`, { completed: true });
      setTasks(tasks.filter(t => t.id !== taskId));
      alert("Task completed!");
    } catch (err) {
      alert("Failed to complete task");
    }
  };

  if (loading) return <div><h2>Focus Mode</h2><p>Loading...</p></div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎯 Focus Mode</h2>
      <p>AI-prioritized tasks for maximum productivity</p>

      {tasks.length === 0 ? (
        <p>No tasks yet. Create one in Brain Dump or Dashboard!</p>
      ) : (
        <div>
          {tasks.map((task, idx) => (
            <div
              key={task.id || idx}
              style={{
                padding: "15px",
                margin: "10px 0",
                border: "1px solid #ddd",
                borderLeft: `4px solid ${
                  task.priority === "High"
                    ? "#ff4444"
                    : task.priority === "Medium"
                    ? "#ffaa00"
                    : "#44ff44"
                }`,
                borderRadius: "4px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <h3>{task.title}</h3>
              <p>
                <strong>Priority:</strong> {task.priority} |{" "}
                <strong>Category:</strong> {task.category || "N/A"} |{" "}
                <strong>Est. Time:</strong> {task.estimated_minutes || 0} min
              </p>
              {task.due_date && (
                <p><strong>Due:</strong> {task.due_date}</p>
              )}
              <button
                onClick={() => completeTask(task.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                ✓ Complete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
