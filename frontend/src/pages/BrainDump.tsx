import { useState } from "react";
import api from "../api/client";
import type { Task } from "../types/task";
import "./BrainDump.css";

export default function BrainDump() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const parseTasks = async () => {
    if (!text.trim()) {
      alert("Please enter some text to parse!");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/ai/parse-task", { text });
      setTasks(res.data);
    } catch (err: any) {
      console.error("AI parse error:", err);
      const details = err?.response?.data || err?.message || String(err);
      alert("AI parse failed: " + JSON.stringify(details));
    } finally {
      setLoading(false);
    }
  };

  const saveTask = async (task: Task) => {
    try {
      await api.post("/tasks", task);
      setTasks(tasks.filter((_, i) => _ !== task));
      alert("✓ Task saved!");
    } catch (err) {
      alert("Failed to save task");
    }
  };

  return (
    <div className="brain-dump-container">
      <div className="brain-dump-header">
        <h2>🧠 Smart Brain Dump</h2>
        <p className="subtitle">Paste your thoughts, let AI organize them into actionable tasks</p>
      </div>

      <div className="input-section">
        <label htmlFor="brain-dump-textarea">What's on your mind?</label>
        <textarea
          id="brain-dump-textarea"
          className="brain-dump-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write anything that comes to mind...&#10;- Finish project report&#10;- Call client at 2pm&#10;- Review code&#10;- Buy groceries&#10;..."
        />
        <div className="input-footer">
          <span className="char-count">{text.length} characters</span>
          <button
            className="parse-button"
            onClick={parseTasks}
            disabled={loading || !text.trim()}
          >
            {loading ? "🔄 Parsing..." : "✨ AI Parse"}
          </button>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="results-section">
          <h3>📝 Extracted Tasks ({tasks.length})</h3>
          <div className="tasks-grid">
            {tasks.map((t, i) => (
              <div key={i} className="task-card">
                <div className="task-header">
                  <h4 className="task-title">{t.title}</h4>
                  <span className={`priority-badge priority-${(t.priority || "Low").toLowerCase()}`}>
                    {t.priority || "N/A"}
                  </span>
                </div>

                <div className="task-meta">
                  {t.category && (
                    <span className="tag category-tag">{t.category}</span>
                  )}
                  {t.estimated_minutes && (
                    <span className="tag time-tag">⏱ {t.estimated_minutes}min</span>
                  )}
                  {t.due_date && (
                    <span className="tag date-tag">📅 {t.due_date}</span>
                  )}
                </div>

                <button
                  className="save-button"
                  onClick={() => saveTask(t)}
                >
                  💾 Save Task
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && text.trim() !== "" && !loading && (
        <div className="empty-state">
          <p>Click "AI Parse" to extract tasks from your brain dump</p>
        </div>
      )}
    </div>
  );
}
