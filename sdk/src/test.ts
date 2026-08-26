import { FeatureFlagClient } from "./client";

async function main() {
  const client = new FeatureFlagClient({
    baseUrl: "http://localhost:4000",
    environment: "staging",
    fallback: false,
  });

  const result = await client.isEnabled("checkout", "user123");

  console.log("Checkout enabled:", result);
}

main().catch((error) => {
  console.error(error);
});
