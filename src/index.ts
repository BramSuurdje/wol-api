import serveEmojiFavicon from "stoker/middlewares/serve-emoji-favicon";
import * as HttpStatusCodes from "stoker/http-status-codes";
import notFound from "stoker/middlewares/not-found";
import onError from "stoker/middlewares/on-error";
import { logger, pinoLogger } from "hono-pino";
import wol from "wake_on_lan";
import { pino } from "pino";
import { Hono } from "hono";

if (
  !process.env.API_KEY
  || !process.env.MAC_ADDRESS
  || !process.env.IP_ADDRESS
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
      transport: process.env.NODE_ENV === "production" ? undefined : {
        target: "hono-pino/debug-log",
      },
    }),
  }),
);

app.get("/", (c) => {
  return c.json({ message: "Wake-on-LAN API" }, HttpStatusCodes.OK);
});

app.post("/wake", async (c) => {
  const apikey = c.req.header("x-api-key");
  if (apikey !== process.env.API_KEY) {
    return c.json({ error: "Invalid API key" }, HttpStatusCodes.UNAUTHORIZED);
  }

  return new Promise((resolve) => {
    wol.wake(
      macAddress,
      {
        address: ipAddress,
        port: 9, // Standard WOL port
      },
      (err: Error | null) => {
        if (err) {
          console.error("WOL Error:", err);
          resolve(c.json(
            { error: "Failed to wake up", details: err.message },
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
          ));
        }
        else {
          resolve(c.json(
            { message: "OK", timestamp: new Date().toISOString() },
            HttpStatusCodes.OK,
          ));
        }
      },
    );
  });
});

export default app;

// Start the server
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

export { port };
