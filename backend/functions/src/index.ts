import * as functions from "firebase-functions/v2";
import { handleUpdateCalendar } from "./handlers/calendar";
import { refreshCompetitionsData } from "./handlers/competition";

functions.setGlobalOptions({
  memory: "512MiB",
  maxInstances: 1,
  timeoutSeconds: 60,
  region: "europe-west1",
});

const clubId = "0783185";

export const scheduleRefreshCompetitionData = functions.scheduler.onSchedule(
  // every 2 hours
  "0 */2 * * *",
  async () => {
    const competitionsIds = await refreshCompetitionsData(clubId);
    await handleUpdateCalendar(competitionsIds);
  }
);
