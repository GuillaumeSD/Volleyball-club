import axios, { AxiosRequestConfig } from "axios";

export const getClubCompetitionsUrls = async (
  clubId: string
): Promise<string[]> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php",
    params: {
      cnclub: clubId,
    },
  };
  const res = await axios(config);
  const resData = res.data as string;

  const competitionsUrl = [
    /https:\/\/www\.ffvbbeach\.org\/ffvbapp\/resu\/vbspo_calendrier\.php\?[\s\S]*?'/gm,
    /https:\/\/www\.ffvbbeach\.org\/ffvbapp\/resu\/seniors\/[\s\S]*?\.htm'/gm,
  ]
    .flatMap((regex) => resData.match(regex) ?? [])
    .map((url) => url.slice(0, -1));

  return competitionsUrl;
};
