import {randomUUID} from "crypto";

const requestLogger = (req, res, next) => {

    const requestId = randomUUID();

    req.requestId = requestId;
    res.setHeader("X-Request-ID", requestId);

    res.on("finish", () => {
        console.log(JSON.stringify({
            requestId,
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            timestamp: new Date().toISOString()
        }));
    });

    next();
};

export default requestLogger;