import { AxiosRequestConfig } from "axios";
import axios from "axios";
import { parse } from "parse5";
import { logError } from "../utils/logging";
import { Competition, Match } from "../types/competition";
import { isNotNull } from "../utils/helpers";
import { CustomDom, CustomNode } from "../types/parser";

export const handleGetCalendarData = async (clubId: string): Promise<void> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php?cnclub=${clubId}`,
  };
  const res = await axios(config);
  const resData = res.data as string;

  const competitionsUrl = resData
    .match(
      /https:\/\/www\.ffvbbeach\.org\/ffvbapp\/resu\/vbspo_calendrier\.php\?[\s\S]*?'/gm
    )
    ?.map((url) => url.slice(0, -1));

  if (!competitionsUrl?.length) {
    return;
  }

  const competitions = await Promise.all(
    competitionsUrl.map((url) => handleGetCompetitionData(url))
  );

  console.log("res", competitions);
};

const handleGetCompetitionData = async (
  url: string
): Promise<Competition & { matches: Match[] }> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url,
  };
  const res = await axios(config);

  const resData = res.data as string;
  const dom = parse(resData) as CustomDom;

  const html = dom.childNodes[0];
  const body = html.childNodes[2];

  const table = body.childNodes[7];
  const tbody: { childNodes: CustomNode[] } = table.childNodes[0];

  const trs = tbody.childNodes.filter(
    (child) => child.nodeName === "tr" && child.attrs.length > 0
  );

  getCompetitionMetadata(body);

  const matchesData = trs.map((tr) => getMatchData(tr));

  return {
    name: getCompetitionMetadata(body).name,
    matches: matchesData.filter(isNotNull),
  };
};

const getCompetitionMetadata = (body: CustomNode): Competition => {
  try {
    const table = body.childNodes[4];
    const tbody = table.childNodes[0];
    const tr = tbody.childNodes[1];
    const td = tr.childNodes[0];
    const name = td.childNodes[0].value;

    return { name };
  } catch (error) {
    logError(error);
    return {};
  }
};

const getMatchData = (tr: { childNodes: CustomNode[] }): Match | null => {
  const tds = tr.childNodes.filter(
    (child) => child.nodeName === "td" && child.attrs.length > 0
  );

  const homeTeam = tds[3].childNodes[0].value;
  const awayTeam = tds[5].childNodes[0].value;

  if (homeTeam === "xxxxx" || awayTeam === "xxxxx") {
    return null;
  }

  const ffvbId = tds.at(0)?.childNodes?.[0]?.value;

  const matchDate = tds.at(1)?.childNodes?.[0]?.value;

  const matchTime = tds.at(2)?.childNodes?.[0]?.value;

  const setsPoint = tds.at(8)?.childNodes?.[0]?.value?.split(", ");

  const matchReferee = tds.at(10)?.childNodes?.[0]?.value;

  const matchFileForm = tr.childNodes.at(11);
  const matchFileEndpoint = matchFileForm?.attrs?.at(2)?.value;
  const matchFileUrl = `https://www.ffvbbeach.org/ffvbapp${matchFileEndpoint?.slice(
    2
  )}`;

  const matchData = {
    ffvbId,
    homeTeam,
    awayTeam,
    matchDate,
    matchTime,
    setsPoint,
    matchReferee,
    matchFileUrl,
  };

  return matchData;
};
