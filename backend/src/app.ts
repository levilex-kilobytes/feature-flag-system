import express from "express";
import cors from "cors";

import flagRoutes from "./routes/flagRoutes";
import evaluationRoutes from "./routes/evaluationRoutes";
import targetRoutes from "./routes/targetRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Feature Flag System API",
  });
});

app.use("/flags", flagRoutes);
app.use("/evaluate", evaluationRoutes);
app.use("/flags", targetRoutes);

export default app;
