import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  limit: 100, // Allow max 100 requests per 15 minutes
  message: "You have reached your rate limit! Please try again after some time",
  standardHeaders: "draft-6",
  skipFailedRequests: true,
});

export { limiter };
