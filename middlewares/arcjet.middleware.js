import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        // --- DEBUGGING STEP ---
        // Log the full decision object to see what Arcjet is doing
        console.log("Arcjet Decision:", decision);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Rate Limit Exceeded" });
            }
            if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot Detected" });
            }
            return res.status(403).json({ error: "Access Denied" });
        }

        next();
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default arcjetMiddleware;