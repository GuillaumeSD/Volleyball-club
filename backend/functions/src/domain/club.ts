import axios, { AxiosRequestConfig } from "axios";

export const getClubCompetitionsUrls = async (
  clubId: string
): Promise<string[]> => {
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

  return competitionsUrl ?? [];
};
