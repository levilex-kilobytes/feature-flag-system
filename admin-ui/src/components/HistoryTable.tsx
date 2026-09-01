import type { HistoryEntry } from "../types/flag";

interface Props {
  history: HistoryEntry[];
}

export default function HistoryTable({
  history,
}: Props) {
  return (
    <section>
      <h2>Flag History</h2>

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Environment</th>
              <th>Actor</th>
              <th>Change</th>
              <th>Before</th>
              <th>After</th>
              <th>When</th>
            </tr>
          </thead>

          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.environment}</td>
                <td>{entry.actorId}</td>
                <td>{entry.changeType}</td>

                <td>
                  {JSON.stringify(entry.beforeValue)}
                </td>

                <td>
                  {JSON.stringify(entry.afterValue)}
                </td>

                <td>
                  {new Date(
                    entry.createdAt,
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}