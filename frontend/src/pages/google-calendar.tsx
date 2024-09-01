import { useFirestore } from "@/contexts/firestore";
import { Button, Grid, Typography } from "@mui/material";

export default function GoogleCalendar() {
  const { competitions } = useFirestore();

  const activeCompetitions =
    competitions?.filter(
      (competition) => competition.active && competition.calendarId
    ) ?? [];

  return (
    <Grid container spacing={4} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography textAlign="justify" marginX={1}>
          Toutes les compétitions du club référencées par la{" "}
          <a
            href="https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php?cnclub=0783185"
            target="_blank"
            style={{ color: "#217eff", textDecoration: "none" }}
          >
            FFVB
          </a>{" "}
          ont leurs calendriers Google synchronisés automatiquement grâce à ce
          projet, pour les ajouter sur votre agenda cliquez sur les boutons
          correspondants ci-dessous. Vous y trouverez tous les matchs du Vésinet
          pour chaque compétition avec toutes les informations correspondantes:
          lieu, adversaires, date et heure, arbitre, résultat, etc... Si vous
          rencontrez des problèmes, n'hésitez pas à{" "}
          <a
            href="https://github.com/GuillaumeSD/Volleyball-club/issues"
            target="_blank"
            style={{ color: "#217eff", textDecoration: "none" }}
          >
            ouvrir une issue sur le repo github du projet.
          </a>
        </Typography>
      </Grid>

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        {activeCompetitions.map((competition) => (
          <Grid
            item
            container
            key={`${competition.ffvbId}-${competition.pool}-${competition.season}`}
            marginBottom={3}
            xs={12}
          >
            <Grid
              item
              container
              xs={12}
              lg={6}
              justifyContent={{ xs: "center", lg: "flex-end" }}
              alignItems="center"
            >
              <Typography style={{ fontWeight: "bold", textAlign: "center" }}>
                {competition.name?.replaceAll("�", "E").replaceAll(" :", "")} :{" "}
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={12}
              lg={6}
              justifyContent={{ xs: "center", lg: "flex-start" }}
              marginTop={{ xs: 1, lg: 0 }}
              marginBottom={{ xs: 2, lg: 0 }}
              paddingLeft={{ xs: 0, lg: 4 }}
            >
              <Button
                variant="contained"
                href={`https://calendar.google.com/calendar/u/1?cid=${competition.calendarId}`}
                target="_blank"
                style={{ textTransform: "none" }}
              >
                Ajouter le calendrier
              </Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
