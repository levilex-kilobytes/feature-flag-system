import { useState } from "react";
import Flags from "./pages/Flags";
import FlagDetails from "./pages/FlagDetails";

export default function App() {
  const [selectedFlag, setSelectedFlag] =
    useState<string | null>(null);

  if (selectedFlag) {
    return (
      <FlagDetails
        flagKey={selectedFlag}
        onBack={() => setSelectedFlag(null)}
      />
    );
  }

  return (
    <Flags
      onSelect={(key) =>
        setSelectedFlag(key)
      }
    />
  );
}