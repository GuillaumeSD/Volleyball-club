import { useFirestore } from "@/contexts/firestore";
import { Button, Grid, Typography } from "@mui/material";

export default function GoogleCalendar() {
  const { competitions } = useFirestore();

  const activeCompetitions =
    competitions?.filter(
      (competition) => competition.active && competition.calendarId
    ) ?? [];

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
      <Grid item xs={12}>
        <Typography textAlign="justify">
          Toutes les compétitions du club référencées par la{" "}
          <a
            href="https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php?cnclub=0924130"
            target="_blank"
            style={{ color: "blue", textDecoration: "none" }}
          >
            FFVB
          </a>{" "}
          ont leurs calendriers Google synchronisés automatiquement grâce à ce
          projet, pour les ajouter sur vos agendas cliquez sur le bouton
          correspondant ci-dessous. Vous y trouverez tous les matchs du RAC pour
          chaque compétition avec toutes les informations correspondantes :
          lieu, adversaires, date et heure, arbitre, résultat, etc... Si vous
          rencontrez des problèmes, n'hésitez pas à{" "}
          <a
            href="https://github.com/GuillaumeSD/RAC-Volley/issues"
            target="_blank"
            style={{ color: "blue", textDecoration: "none" }}
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
                {competition.name?.replaceAll("�", "E")} :{" "}
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
                Ouvrir le calendrier
              </Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
