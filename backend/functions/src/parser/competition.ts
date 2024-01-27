import { CompetitionDto, CompetitionMetadataDto } from "../dto/competition";
import { getParsedDom } from "./dom";
import { CustomNode } from "../types/parser";
import { logError } from "../logging";
import { isNotNull } from "../utils/helpers";
import { getGameData } from "./game";

export const getCompetitionData = async (
  url: string
): Promise<CompetitionDto | null> => {
  const dom = await getParsedDom(url);

  const html = dom.childNodes.find((child) => child.nodeName === "html");
  if (!html) throw new Error("No html found");

  const body = html.childNodes.find((child) => child.nodeName === "body");
  if (!body) throw new Error("No body found");

  const table = body.childNodes.find((child) => {
    if (child.nodeName !== "table") return false;

    const tbody = child.childNodes.find((child) => child.nodeName === "tbody");

    const trs = tbody?.childNodes.filter(
      (child) => child.nodeName === "tr" && child.attrs.length > 0
    );

    return trs?.length && trs.length > 20;
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
    const tr = tbody.childNodes[1];
    const td = tr.childNodes[0];
    const name = td.childNodes[0].value;
    const formattedName = name.replace(`${pool} -`, "").trim();

    return { ffvbId, name: formattedName, pool, season, url, active: true };
  } catch (error) {
    logError(error);
    return null;
  }
};
