import express from "express";
import cors from "cors";

import flagRoutes from "./routes/flagRoutes";
import targetRoutes from "./routes/targetRoutes";
import evaluationRoutes from "./routes/evaluationRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Feature Flag System API",
  });
});

app.use("/flags", flagRoutes);
app.use("/flags", targetRoutes);
app.use("/evaluate", evaluationRoutes);

export default app;
