import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import digestsRouter from "./routes/digests";
import contactRouter from "./routes/contact";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use("/v1/health", healthRouter);
app.use("/v1/digests", digestsRouter);
app.use("/v1/contact", contactRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
