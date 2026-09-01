import { FeatureFlagClient } from "./client";

async function testHappyPath() {
  const client = new FeatureFlagClient({
    baseUrl: "http://localhost:4000",
    environment: "staging",
    fallback: false,
  });

  const result = await client.isEnabled("checkout", "user123");

  console.log("Happy path:");
  console.log("Checkout enabled:", result);
}

async function testFallback() {
  const client = new FeatureFlagClient({
    baseUrl: "http://localhost:9999",
    environment: "staging",
    fallback: true,
  });

  const result = await client.isEnabled("checkout", "user123");

  console.log("Fallback:");
  console.log("Checkout enabled:", result);
}

async function main() {
  await testHappyPath();
  await testFallback();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
