import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import type { Task } from "../types/task";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [location]); // Refetch whenever we navigate to this page

  const deleteTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(t => t.id !== taskId));
      alert("✓ Task deleted!");
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  const markCompleted = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      await api.put(`/tasks/${taskId}`, { completed: true });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: "completed" } : t
      ));
      alert("✓ Task marked as completed!");
    } catch (err) {
      alert("Failed to mark task as completed");
    }
  };

  const archiveTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      await api.put(`/tasks/${taskId}`, { archived: true });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: "archived" } : t
      ));
      alert("✓ Task archived!");
    } catch (err) {
      alert("Failed to archive task");
    }
  };

  const restoreTask = async (taskId: string | undefined) => {
    if (!taskId) return;
    try {
      await api.put(`/tasks/${taskId}`, { archived: false });
      setTasks(tasks.map(t =>
        t.id === taskId ? { ...t, status: "completed" } : t
      ));
      alert("✓ Task restored!");
    } catch (err) {
      alert("Failed to restore task");
    }
  };

  if (loading) return (
    <div style={{ padding: "20px" }}>
      <h2>📋 Dashboard</h2>
      <p>Loading...</p>
    </div>
  );

  const completedTasks = tasks.filter(t => t.status === "completed");
  const activeTasks = tasks.filter(t => t.status !== "completed" && t.status !== "archived");
  const archivedTasks = tasks.filter(t => t.status === "archived");

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>📋 My Tasks</h2>
        <button
          onClick={fetchTasks}
          style={{
            padding: "8px 16px",
            backgroundColor: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          padding: "40px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <p style={{ fontSize: "1.1em", color: "#999" }}>
            No tasks yet. Go to <strong>Smart Add</strong> to create some!
          </p>
        </div>
      ) : (
        <div>
          {activeTasks.length > 0 && (
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ color: "#333", marginBottom: "15px" }}>Active Tasks ({activeTasks.length})</h3>
              {activeTasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: "15px",
                    margin: "10px 0",
                    border: "1px solid #ddd",
                    borderLeft: `4px solid ${
                      t.priority === "High" ? "#ff4444" :
                      t.priority === "Medium" ? "#ffaa00" : "#44ff44"
                    }`,
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9",
                    transition: "all 0.3s ease"
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0" }}>{t.title}</h3>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Category:</strong> {t.category || "N/A"} |
                    <strong> Priority:</strong> {t.priority || "N/A"} |
                    <strong> Time:</strong> {t.estimated_minutes || 0} min
                  </p>
                  {t.due_date && <p style={{ margin: "5px 0" }}><strong>Due:</strong> {t.due_date}</p>}
                  <p style={{ margin: "5px 0" }}>
                    <strong>Status:</strong>
                    <span style={{
                      marginLeft: "8px",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      backgroundColor: "#fff3e0",
                      color: "#e65100",
                      fontWeight: "600"
                    }}>
                      {t.status || "pending"}
                    </span>
                  </p>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      onClick={() => markCompleted(t.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                    >
                      ✓ Complete
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <div style={{ marginTop: "30px", opacity: 0.7 }}>
              <h3 style={{ color: "#666", marginBottom: "15px" }}>✓ Completed ({completedTasks.length})</h3>
              {completedTasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: "12px 15px",
                    margin: "8px 0",
                    border: "1px solid #e0e0e0",
                    borderLeft: "4px solid #4CAF50",
                    borderRadius: "4px",
                    backgroundColor: "#f5f5f5",
                    textDecoration: "line-through",
                    color: "#999"
                  }}
                >
                  <h4 style={{ margin: "0 0 5px 0" }}>{t.title}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9em" }}>
                    {t.category} • {t.priority} priority • {t.estimated_minutes} min
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => archiveTask(t.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#ff9800",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85em",
                        fontWeight: "600"
                      }}
                    >
                      📦 Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {archivedTasks.length > 0 && (
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "2px solid #e0e0e0" }}>
              <h3 style={{ color: "#999", marginBottom: "15px" }}>📦 Archived ({archivedTasks.length})</h3>
              {archivedTasks.map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: "12px 15px",
                    margin: "8px 0",
                    border: "1px solid #ddd",
                    borderLeft: "4px solid #999",
                    borderRadius: "4px",
                    backgroundColor: "#f0f0f0",
                    opacity: 0.6
                  }}
                >
                  <h4 style={{ margin: "0 0 5px 0" }}>{t.title}</h4>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9em" }}>
                    {t.category} • {t.priority} priority • {t.estimated_minutes} min
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => restoreTask(t.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85em",
                        fontWeight: "600"
                      }}
                    >
                      ↩️ Restore
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.85em",
                        fontWeight: "600"
                      }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
