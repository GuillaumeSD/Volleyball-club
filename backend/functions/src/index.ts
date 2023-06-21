import { onRequest } from "firebase-functions/v2/https";
import { handleGetCalendarData } from "./controller/competition";

export const getCalendarData = onRequest(
  { cors: true, region: "europe-west9" },
  async (request, response) => {
    const clubId = request.query.clubId;
    console.log("clubId", clubId);

    await handleGetCalendarData(clubId as string);

    response.send("Hello from Firebase!");
  }
);
