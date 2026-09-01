import { useEffect, useState } from "react";

import {
  getTargets,
  addTarget,
  removeTarget,
} from "../api/client";

import type { Target } from "../types/flag";

interface Props {
  flagKey: string;
  environment: string;
}

export default function TargetManager({
  flagKey,
  environment,
}: Props) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTargets() {
    try {
      setLoading(true);

      const result = await getTargets(
        flagKey,
        environment,
      );

      setTargets(result);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load targets",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTargets();
  }, [flagKey, environment]);

  async function handleAddTarget(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      alert("User ID is required.");
      return;
    }

    try {
      await addTarget(
        flagKey,
        environment,
        trimmedUserId,
      );

      setUserId("");

      await loadTargets();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add target",
      );
    }
  }

  async function handleRemoveTarget(
    targetUserId: string,
  ) {
    try {
      await removeTarget(
        flagKey,
        environment,
        targetUserId,
      );

      await loadTargets();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to remove target",
      );
    }
  }

  return (
    <section>
      <h2>Target Users</h2>

      <p>
        Environment:{" "}
        <strong>{environment}</strong>
      </p>

      <form onSubmit={handleAddTarget}>
        <input
          type="text"
          value={userId}
          onChange={(event) =>
            setUserId(event.target.value)
          }
          placeholder="Enter user ID"
        />

        <button type="submit">
          Add User
        </button>
      </form>

      {loading ? (
        <p>Loading targets...</p>
      ) : targets.length === 0 ? (
        <p>No targeted users.</p>
      ) : (
        <ul>
          {targets.map((target) => (
            <li key={target.id}>
              <span>{target.userId}</span>

              <button
                type="button"
                onClick={() =>
                  handleRemoveTarget(
                    target.userId,
                  )
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}