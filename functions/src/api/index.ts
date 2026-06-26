import express from "express";
import cors from "cors";
import healthRouter from "./routes/health";
import digestsRouter from "./routes/digests";
import contactRouter from "./routes/contact";
import statusRouter from "./routes/status";
import notificationsRouter from "./routes/notifications";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use("/v1/health", healthRouter);
app.use("/v1/digests", digestsRouter);
app.use("/v1/contact", contactRouter);
app.use("/v1/status", statusRouter);
app.use("/v1/notifications", notificationsRouter);

// Error handler (must be last)
app.use(errorHandler);

export default app;
