import authRouter from "./auth.router.js";
// import tweetRouter from "./tweet.router.js";
import userRouter from "./user.router.js";
// import notificationRouter from "./notification.router.js";
import searchRouter from "./search.router.js";

export function setupRoutes(app) {
  app.use("/api/v1/auth", authRouter);
  // app.use("/api/v1/tweets", tweetRouter);
  app.use("/api/v1/users", userRouter);
  // app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/search", searchRouter);
}
