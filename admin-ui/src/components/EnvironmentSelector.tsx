interface Props {
  environment: string;
  onChange: (environment: string) => void;
}

const environments = [
  "development",
  "staging",
  "production",
];

export default function EnvironmentSelector({
  environment,
  onChange,
}: Props) {
  return (
    <div>
      <label htmlFor="environment">
        Environment
      </label>

      <select
        id="environment"
        value={environment}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {environments.map((env) => (
          <option key={env} value={env}>
            {env}
          </option>
        ))}
      </select>
    </div>
  );
}