import { AxiosRequestConfig } from "axios";
import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import { parse } from "parse5";
import {
  Element,
  ParentNode,
  TextNode,
} from "parse5/dist/tree-adapters/default";

export const getCalendarData = onRequest(
  { cors: true, region: "europe-west9" },
  async (request, response) => {
    const clubId = request.query.clubId;
    console.log("clubId", clubId);

    await handleGetCalendarData(clubId as string);

    response.send("Hello from Firebase!");
  }
);

const handleGetMatchData = async (match: ParentNode): Promise<void> => {
  const tds = match.childNodes.filter(
    (child) => child.nodeName === "td" && child.attrs.length > 0
  ) as (ParentNode & { childNodes: [TextNode] })[];

  const homeTeam = tds[3].childNodes[0].value;
  const awayTeam = tds[5].childNodes[0].value;

  if (homeTeam === "xxxxx" || awayTeam === "xxxxx") {
    return;
  }

  console.log(homeTeam);
  console.log(awayTeam);

  const matchDate = tds[1].childNodes[0].value;
  console.log(matchDate);

  const matchTime = tds[2].childNodes[0].value;
  console.log(matchTime);

  const setsPoint = tds[8].childNodes[0].value.split(", ");
  console.log(setsPoint);

  const matchReferee = tds[10].childNodes[0].value;
  console.log(matchReferee);

  // use at
  const matchFileForm = match.childNodes[11] as Element;
  const matchFileUrl = matchFileForm.attrs[2].value;
  console.log(matchFileUrl);
};

const handleGetCompetitionData = async (url: string): Promise<void> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url,
  };
  const res = await axios(config);

  const resData = res.data as string;
  const dom = parse(resData);

  const html = dom.childNodes[0] as ParentNode;
  const body = html.childNodes[2] as ParentNode;
  const table = body.childNodes[7] as ParentNode;
  const tbody = table.childNodes[0] as ParentNode;

  const trs = tbody.childNodes.filter(
    (child) => child.nodeName === "tr" && child.attrs.length > 0
  ) as ParentNode[];

  for (const tr of trs) {
    handleGetMatchData(tr);
  }
};

const handleGetCalendarData = async (clubId: string): Promise<void> => {
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

  // for
  handleGetCompetitionData(competitionsUrl[0]);
  console.log("res", competitionsUrl);
};
