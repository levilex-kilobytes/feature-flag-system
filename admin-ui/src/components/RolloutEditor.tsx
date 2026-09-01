import { useState } from "react";
import { updateRollout } from "../api/client";

interface Props {
  flagKey: string;
  environment: string;
  currentPercentage: number;
  onUpdated: () => void;
}

export default function RolloutEditor({
  flagKey,
  environment,
  currentPercentage,
  onUpdated,
}: Props) {
  const [percentage, setPercentage] =
    useState(currentPercentage);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    try {
      setLoading(true);

      await updateRollout(
        flagKey,
        environment,
        percentage,
        "monda",
      );

      onUpdated();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update rollout",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label>
        Rollout: {percentage}%
      </label>

      <input
        type="number"
        min="0"
        max="100"
        value={percentage}
        onChange={(event) =>
          setPercentage(Number(event.target.value))
        }
      />

      <button
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Rollout"}
      </button>
    </div>
  );
}