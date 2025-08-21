import { Hono } from "hono";
import wol = require("wake_on_lan");
import { StatusCodes } from "http-status-codes";
import { pinoLogger } from "hono-pino";
import pino = require("pino");

const macAddress = "9c:6b:00:17:78:68";
const ipAddress = "10.0.1.1";

const app = new Hono({ strict: false });

app.use(
  pinoLogger({
    pino: pino({
      base: null,
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport: {
        target: "hono-pino/debug-log",
      },
      timestamp: pino.stdTimeFunctions.unixTime,
      serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    }),
  })
);

app.notFound((c) => {
  return c.json({ error: "Not Found" }, StatusCodes.NOT_FOUND);
});

app.onError((err, c) => {
  console.error(err);
  return c.json(
    { error: "Internal Server Error" },
    StatusCodes.INTERNAL_SERVER_ERROR
  );
});

app.post("/wake", (c) => {
  const apikey = c.req.header("x-api-key");
  if (apikey !== "jBqqNSgG2gYiGfYDI9dmyLL8nT5E9PnQDwpFbbZM4b") {
    return c.json({ error: "Invalid API key" }, StatusCodes.UNAUTHORIZED);
  }

  wol.wake(
    macAddress,
    {
      address: ipAddress,
    },
    (err: Error | null) => {
      if (err) {
        console.error(err);
        return c.json(
          { error: "Failed to wake up" },
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return c.json(
        { message: "OK", timestamp: new Date().toISOString() },
        StatusCodes.OK
      );
    }
  );

  return c.json(
    { message: "OK", timestamp: new Date().toISOString() },
    StatusCodes.OK
  );
});

export default app;
