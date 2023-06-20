import { Grid } from "@mui/material";
import { useEffect } from "react";

export default function HomePage() {
  const getCalendar = async () => {
    const requestConfig: RequestInit = {
      method: "GET",
      mode: "no-cors",
      referrerPolicy: "strict-origin-when-cross-origin",
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
        "User-Agent": "PostmanRuntime/7.32.3",
        Connection: "keep-alive",
        Host: "www.ffvbbeach.org",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const response = await fetch(
      "https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php?cnclub=0924130",
      requestConfig
    );
    console.log(response);
  };

  useEffect(() => {
    getCalendar();
  }, []);

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
      Hello
    </Grid>
  );
}
