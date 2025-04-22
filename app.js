import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Логування помилки
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// app.use((err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err); // Передаємо помилку далі, якщо відповідь уже відправлена
//   }

//   const { status = 500, message = "Server error" } = err;
//   res.status(status).json({ message });
// });

export default app;
