import type { Flag } from "../types/flag";

interface Props {
  flag: Flag;
  onSelect: (key: string) => void;
}

export default function FlagCard({
  flag,
  onSelect,
}: Props) {
  return (
    <article>
      <h2>{flag.key}</h2>

      <p>{flag.description}</p>

      <div>
        {flag.environments?.map((environment) => (
          <div key={environment.id}>
            <h3>{environment.environment}</h3>

            <p>
              Status:{" "}
              <strong>
                {environment.enabled
                  ? "ON"
                  : "OFF"}
              </strong>
            </p>

            <p>
              Rollout:{" "}
              {environment.rolloutPercentage}%
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSelect(flag.key)}
      >
        Manage Flag
      </button>
    </article>
  );
}