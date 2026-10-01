import { activityLog, clearLocalState } from '../state/ops.js';

export default function Activity() {
  return (
    <section class="page-enter">
      <div class="page-heading split">
        <div>
          <p class="system-label">Activity log</p>
          <h1>Every local workflow mutation is visible.</h1>
          <p>The log is persisted in this browser only, then resettable for demos and tests.</p>
        </div>
        <button class="button" onClick={clearLocalState}>Reset local state</button>
      </div>
      <div class="activity-list">
        {activityLog().length === 0 ? <div class="empty-panel"><h2>No activity yet.</h2></div> : activityLog().map((event) => (
          <article class={`activity-event tone-${event.tone}`}>
            <span>{event.at}</span>
            <p>{event.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
