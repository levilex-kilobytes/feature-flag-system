import { useEffect, useState } from "react";

import {
  getFlag,
  getHistory,
  toggleFlag,
} from "../api/client";

import type {
  Flag,
  HistoryEntry,
} from "../types/flag";

import EnvironmentSelector from "../components/EnvironmentSelector";
import RolloutEditor from "../components/RolloutEditor";
import TargetManager from "../components/TargetManager";
import HistoryTable from "../components/HistoryTable";

interface Props {
  flagKey: string;
  onBack: () => void;
}

export default function FlagDetails({
  flagKey,
  onBack,
}: Props) {
  const [flag, setFlag] = useState<Flag | null>(null);

  const [history, setHistory] = useState<
    HistoryEntry[]
  >([]);

  const [environment, setEnvironment] =
    useState("staging");

  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const [flagResult, historyResult] =
        await Promise.all([
          getFlag(flagKey),
          getHistory(flagKey),
        ]);

      setFlag(flagResult);

      const chronologicalHistory = [
        ...historyResult,
      ].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime(),
      );

      setHistory(chronologicalHistory);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to load flag",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [flagKey]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-container">
          <div className="loading-state">
            Loading flag...
          </div>
        </div>
      </div>
    );
  }

  if (!flag) {
    return (
      <div className="details-page">
        <div className="details-container">
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back
          </button>

          <div className="not-found">
            <h2>Flag not found</h2>

            <p>
              The requested feature flag could not
              be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const environmentConfig =
    flag.environments?.find(
      (item) =>
        item.environment === environment,
    );

  async function handleToggle() {
    if (!environmentConfig) {
      return;
    }

    try {
      await toggleFlag(
        flagKey,
        environment,
        !environmentConfig.enabled,
        "monda",
      );

      await load();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to toggle flag",
      );
    }
  }

  return (
    <div className="details-page">
      <main className="details-container">

        {/* Header */}
        <section className="details-header">

          <div className="details-header-top">
            <button
              className="back-button"
              onClick={onBack}
            >
              ← Back
            </button>
          </div>

          <div className="flag-title">
            <h1>{flag.key}</h1>

            <p>{flag.description}</p>
          </div>

          <div className="environment-selector-wrapper">
            <EnvironmentSelector
              environment={environment}
              onChange={setEnvironment}
            />
          </div>
        </section>

        {/* Configuration */}
        {environmentConfig ? (
          <section className="dashboard-card">

            <div className="card-heading">
              <div>
                <h2>
                  ⚙ {environment} Configuration
                </h2>

                <p>
                  Manage the state and rollout of this
                  flag in the selected environment.
                </p>
              </div>
            </div>

            <div className="configuration-grid">

              <div className="configuration-item">
                <span className="configuration-label">
                  Status
                </span>

                <div className="status-row">
                  <span
                    className={
                      environmentConfig.enabled
                        ? "status status-on"
                        : "status status-off"
                    }
                  >
                    {environmentConfig.enabled
                      ? "ON"
                      : "OFF"}
                  </span>
                </div>
              </div>

              <div className="configuration-item">
                <span className="configuration-label">
                  Rollout
                </span>

                <strong className="rollout-value">
                  {environmentConfig.rolloutPercentage}%
                </strong>
              </div>

            </div>

            <div className="configuration-actions">

              <button
                className={
                  environmentConfig.enabled
                    ? "danger-button"
                    : "primary-button"
                }
                onClick={handleToggle}
              >
                {environmentConfig.enabled
                  ? "Turn Off"
                  : "Turn On"}
              </button>

              <RolloutEditor
                flagKey={flagKey}
                environment={environment}
                currentPercentage={
                  environmentConfig.rolloutPercentage
                }
                onUpdated={load}
              />

            </div>

          </section>
        ) : (
          <section className="dashboard-card">
            <h2>
              {environment} Configuration
            </h2>

            <p className="muted">
              No configuration found for{" "}
              {environment}.
            </p>
          </section>
        )}

        {/* Target Users */}
        <section className="dashboard-card">

          <div className="card-heading">
            <div>
              <h2>
                👥 Target Users
              </h2>

              <p>
                Manage users who should receive this
                feature.
              </p>
            </div>
          </div>

          <TargetManager
            flagKey={flagKey}
            environment={environment}
          />

        </section>

        {/* History */}
        <section className="dashboard-card history-card">

          <div className="card-heading">
            <div>
              <h2>
                ◷ Flag History
              </h2>

              <p>
                See who changed this flag, what changed,
                and when.
              </p>
            </div>
          </div>

          <HistoryTable history={history} />

        </section>

      </main>
    </div>
  );
}