import { CompetitionDto, CompetitionMetadataDto } from "../dto/competition";
import { getParsedDom } from "./dom";
import { CustomNode } from "../types/parser";
import { logError } from "../logging";
import { isNotNull } from "../utils/helpers";
import { getGameData } from "./game";

export const getCompetitionData = async (
  rawUrl: string
): Promise<CompetitionDto | null> => {
  const { body, url } = await getBody(rawUrl);

  const table = body.childNodes.find((child) => {
    if (child.nodeName !== "table") return false;

    const tbody = child.childNodes.find((child) => child.nodeName === "tbody");
    const tr0 = tbody?.childNodes.find(
      (child) =>
        child.nodeName === "tr" &&
        child.childNodes.find((child) => child.nodeName === "td")
    );
    const td = tr0?.childNodes.find(
      (child) => child.nodeName === "td" && child.childNodes.length > 0
    );
    if (!td) return false;

    const value = td.childNodes[0].value;
    if (value === "Journ�e 01") return true;
    return false;
  });
  if (!table) throw new Error("No table found");

  const tbody = table.childNodes.find((child) => child.nodeName === "tbody");
  if (!tbody) throw new Error("No tbody found");

  const trs = tbody.childNodes.filter(
    (child) => child.nodeName === "tr" && child.attrs.length > 0
  );

  const competitionData = getCompetitionMetadata(url, body);
  if (!competitionData) return null;

  const gamesData = trs.map((tr) => getGameData(tr));

  return {
    metadata: competitionData,
    games: gamesData.filter(isNotNull),
  };
};

const getCompetitionMetadata = (
  url: string,
  body: CustomNode
): CompetitionMetadataDto | null => {
  try {
    const ffvbId = url.match(/codent=(.*?)(&|$)/)?.[1];
    if (!ffvbId) {
      throw new Error("No competition ffvbId found");
    }
    const pool = url.match(/poule=(.*?)(&|$)/)?.[1];
    if (!pool) {
      throw new Error("No competition pool found");
    }
    const season = url.match(/saison=(.*?)(&|$)/)?.[1];
    if (!season) {
      throw new Error("No competition season found");
    }

    const table = body.childNodes[4];
    const tbody = table.childNodes[0];
    const tr = tbody.childNodes.find(
      (tr) =>
        tr.nodeName === "tr" &&
        tr.childNodes?.[0]?.nodeName === "td" &&
        tr.childNodes[0].childNodes[0].nodeName === "#text"
    );
    if (!tr) throw new Error("Competition name not found");
    const name = tr.childNodes[0].childNodes[0].value;
    const formattedName = name.replace(`${pool} -`, "").trim();

    return { ffvbId, name: formattedName, pool, season, url, active: true };
  } catch (error) {
    logError(error);
    return null;
  }
};

const getBody = async (
  rawUrl: string
): Promise<{ body: CustomNode; url: string }> => {
  const dom = await getParsedDom(rawUrl);

  const html = dom.childNodes.find((child) => child.nodeName === "html");
  if (!html) throw new Error("No html found");

  const rootBody = html.childNodes.find((child) => child.nodeName === "body");
  if (rootBody) return { body: rootBody, url: rawUrl };

  const frameSet = html.childNodes.find(
    (child) => child.nodeName === "frameset"
  );
  if (!frameSet) throw new Error("No body or frameset found");

  const frame = frameSet.childNodes.find(
    (child) =>
      child.nodeName === "frame" &&
      child.attrs.find(
        (attr) => attr.name === "name" && attr.value === "calendrier"
      )
  );
  if (!frame) throw new Error("No matching frame found");

  const src = frame.attrs.find((attr) => attr.name === "src")?.value;
  if (!src) throw new Error("No src found");

  const newDom = await getParsedDom(src);

  const newHtml = newDom.childNodes.find((child) => child.nodeName === "html");
  if (!newHtml) throw new Error("No html found");

  const body = newHtml.childNodes.find((child) => child.nodeName === "body");
  if (!body) throw new Error("No body found");

  return { body, url: src };
};
