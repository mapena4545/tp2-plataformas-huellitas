import { STATUS } from "../utils/helpers.js";

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({label, value }) {
  return (
    <div className="card stat-card">
      <div>
        <div className="stat-value">{value}</div>
        <div className="muted">{label}</div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS[status];
  return <span className={`badge badge-${s.tone}`}>{s.label}</span>;
}

export function EmptyState({text, children }) {
  return (
    <div className="empty">
      <p>{text}</p>
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}