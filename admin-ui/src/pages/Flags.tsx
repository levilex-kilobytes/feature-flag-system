import { useEffect, useState } from "react";

import {
  createFlag,
  getFlags,
} from "../api/client";

import type { Flag } from "../types/flag";

interface Props {
  onSelect: (key: string) => void;
}

export default function Flags({ onSelect }: Props) {
  const [flags, setFlags] = useState<Flag[]>([]);

  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingFlags, setLoadingFlags] = useState(true);

  const [error, setError] = useState("");

  async function loadFlags() {
    try {
      setLoadingFlags(true);
      setError("");

      const result = await getFlags();

      setFlags(result);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load flags",
      );
    } finally {
      setLoadingFlags(false);
    }
  }

  useEffect(() => {
    loadFlags();
  }, []);

  async function handleCreate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedKey = key.trim();
    const trimmedDescription = description.trim();

    if (!trimmedKey) {
      setError("Flag key is required.");
      return;
    }

    if (!trimmedDescription) {
      setError("Description is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createFlag(
        trimmedKey,
        trimmedDescription,
        "monda",
      );

      setKey("");
      setDescription("");

      await loadFlags();
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create flag",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flags-page">
      <header className="top-bar">
        <div className="top-bar-content">
          <div className="logo">
            ⚑
          </div>

          <span>Feature Flag System</span>
        </div>
      </header>

      <main className="flags-container">
        <section className="page-header">
          <h1>Feature Flags</h1>

          <p>
            Manage your application features across
            different environments.
          </p>
        </section>

        <section className="create-section">
          <h2>Create a new flag</h2>

          <form
            className="create-form"
            onSubmit={handleCreate}
          >
            <div className="form-field">
              <label htmlFor="flag-key">
                Flag key
              </label>

              <input
                id="flag-key"
                type="text"
                placeholder="e.g. new-checkout"
                value={key}
                onChange={(event) =>
                  setKey(event.target.value)
                }
              />
            </div>

            <div className="form-field">
              <label htmlFor="flag-description">
                Description
              </label>

              <input
                id="flag-description"
                type="text"
                placeholder="Describe what this flag controls"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="create-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Flag"}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </section>

        <section className="flags-section">
          <div className="section-header">
            <h2>All Flags</h2>

            <span className="flag-count">
              {flags.length}{" "}
              {flags.length === 1
                ? "flag"
                : "flags"}
            </span>
          </div>

          {loadingFlags ? (
            <div className="empty-state">
              <p>Loading flags...</p>
            </div>
          ) : flags.length === 0 ? (
            <div className="empty-state">
              <h3>No flags yet</h3>

              <p>
                Create your first feature flag above.
              </p>
            </div>
          ) : (
            <div className="flag-list">
              {flags.map((flag) => (
                <article
                  className="flag-card"
                  key={flag.id}
                >
                  <div className="flag-card-top">
                    <div>
                      <h3>{flag.key}</h3>

                      <p className="description">
                        {flag.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="manage-button"
                      onClick={() =>
                        onSelect(flag.key)
                      }
                    >
                      Manage
                    </button>
                  </div>

                  <div className="created">
                    Created{" "}
                    {new Date(
                      flag.createdAt,
                    ).toLocaleString()}
                  </div>

                  <div className="environment-grid">
                    {flag.environments?.map(
                      (environment) => (
                        <div
                          className="environment-card"
                          key={environment.id}
                        >
                          <div className="environment-header">
                            <h4>
                              {environment.environment}
                            </h4>

                            <span
                              className={
                                environment.enabled
                                  ? "status status-on"
                                  : "status status-off"
                              }
                            >
                              {environment.enabled
                                ? "ON"
                                : "OFF"}
                            </span>
                          </div>

                          <div className="environment-info">
                            <span>
                              Rollout
                            </span>

                            <strong>
                              {
                                environment.rolloutPercentage
                              }
                              %
                            </strong>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}