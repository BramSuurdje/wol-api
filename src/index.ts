import { Hono } from "hono";
import wol = require("wake_on_lan");
import { pinoLogger } from "hono-pino";
import pino = require("pino");
import notFound from "stoker/middlewares/not-found";
import onError from "stoker/middlewares/on-error";
import serveEmojiFavicon from "stoker/middlewares/serve-emoji-favicon";
import * as HttpStatusCodes from "stoker/http-status-codes";

if (
  !process.env.API_KEY ||
  !process.env.MAC_ADDRESS ||
  !process.env.IP_ADDRESS
) {
  throw new Error("Missing environment variables");
}

const macAddress = process.env.MAC_ADDRESS;
const ipAddress = process.env.IP_ADDRESS;

const app = new Hono({ strict: false })
  .use(serveEmojiFavicon("⏰"))
  .notFound(notFound)
  .onError(onError);

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

app.get("/", (c) => {
  return c.json({ message: "Wake-on-LAN API" }, HttpStatusCodes.OK);
});

app.post("/wake", (c) => {
  const apikey = c.req.header("x-api-key");
  if (apikey !== process.env.API_KEY) {
    return c.json({ error: "Invalid API key" }, HttpStatusCodes.UNAUTHORIZED);
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
          HttpStatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return c.json(
        { message: "OK", timestamp: new Date().toISOString() },
        HttpStatusCodes.OK
      );
    }
  );

  return c.json(
    {
      message: "OK",
      timestamp: new Date().toISOString(),
    },
    HttpStatusCodes.OK
  );
});

export default app;
