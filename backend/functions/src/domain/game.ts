import * as dayjs from "dayjs";
import { CustomNode } from "../infrastructure/types/parser";
import { GameDto } from "./dto/competition";
import { formatWords } from "./utils/formatWords";
import { Timestamp } from "firebase-admin/firestore";
import { includeOnlyNumbers, isValidName } from "./utils/helpers";

export const getGameData = (tr: {
  childNodes: CustomNode[];
}): GameDto | null => {
  const tds = tr.childNodes.filter((child) => child.nodeName === "td");

  const homeTeam = tds[3].childNodes[0].value;
  const awayTeam = tds[5].childNodes[0].value;

  if (homeTeam === "xxxxx" || awayTeam === "xxxxx") {
    return null;
  }

  if (
    !homeTeam.toLowerCase().includes("rueil") &&
    !awayTeam.toLowerCase().includes("rueil")
  ) {
    return null;
  }

  const formattedHomeTeam = formatWords(homeTeam);
  const formattedAwayTeam = formatWords(awayTeam);

  const ffvbId = tds.at(0)?.childNodes?.[0]?.value;
  if (!ffvbId) {
    throw new Error("No match ffvbId found");
  }

  const { date, time, timestamp } = getDateAndTime(tds);

  const venue = getVenue(tds);

  const setsPoint = getSetsPoint(tds);

  const referee = getReferee(tds);

  const fileUrl = getFileUrl(tr);

  const gameData: GameDto = {
    ffvbId,
    homeTeam: formattedHomeTeam,
    awayTeam: formattedAwayTeam,
    timestamp,
    date,
    time,
    venue,
    setsPoint,
    referee,
    fileUrl,
  };

  return gameData;
};

const getDateAndTime = (
  tds: CustomNode[]
): { date?: string; time?: string; timestamp?: Timestamp } => {
  const date = tds.at(1)?.childNodes?.[0]?.value;
  const time = tds.at(2)?.childNodes?.[0]?.value;

  let timestamp: Timestamp | undefined = undefined;

  if (date && time) {
    const dateMillis = dayjs
      .tz(`${date} ${time ?? ""}`, "DD/MM/YY HH:mm", "Europe/Paris")
      .valueOf();

    timestamp = Timestamp.fromMillis(dateMillis);
  } else if (date) {
    const dateMillis = dayjs.tz(date, "DD/MM/YY", "Europe/Paris").valueOf();

    timestamp = Timestamp.fromMillis(dateMillis);
  }

  return { date, time, timestamp };
};

const getVenue = (tds: CustomNode[]): string | undefined => {
  const venue = tds.at(7)?.childNodes?.[0]?.value;
  const formattedVenue = venue ? formatWords(venue) : undefined;

  return isValidName(formattedVenue) ? formattedVenue : undefined;
};

const getSetsPoint = (tds: CustomNode[]): string[] | undefined => {
  const setsPoint = tds.at(8)?.childNodes?.[0]?.value?.split(", ");

  if (
    setsPoint &&
    setsPoint.length > 1 &&
    setsPoint.every(includeOnlyNumbers)
  ) {
    return setsPoint;
  }

  return undefined;
};

const getReferee = (tds: CustomNode[]): string | undefined => {
  for (const td of [tds.at(9), tds.at(10)]) {
    const referee = td?.childNodes?.[0]?.value;
    const formattedReferee = referee
      ? formatWords(referee.replaceAll("/", " / "))
      : undefined;

    if (isValidName(formattedReferee)) return formattedReferee;
  }

  return undefined;
};

const getFileUrl = (tr: { childNodes: CustomNode[] }): string | undefined => {
  const fileForm = tr.childNodes.at(11);
  if (fileForm?.nodeName !== "form") return undefined;

  const fileEndpoint = fileForm?.attrs?.at(2)?.value;
  const fileUrl = fileEndpoint
    ? `https://www.ffvbbeach.org/ffvbapp${fileEndpoint.slice(2)}`
    : undefined;

  return fileUrl;
};
