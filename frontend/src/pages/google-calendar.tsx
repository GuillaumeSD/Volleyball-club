import { useFirestore } from "@/contexts/firestore";
import { Button, Grid } from "@mui/material";

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
      <Grid item xs={12} textAlign="justify">
        Toutes les compétitions du club référencées par la{" "}
        <a
          href="https://www.ffvbbeach.org/ffvbapp/resu/planning_club_class.php?cnclub=0924130"
          target="_blank"
          style={{ color: "blue", textDecoration: "none" }}
        >
          FFVB
        </a>{" "}
        ont leurs calendriers Google synchronisés automatiquement grâce à ce
        projet, pour y accéder et les ajouter sur vos agendas cliquez sur le
        bouton correspondant ci-dessous. Vous y trouverez tous les matchs du RAC
        pour chaque compétition avec toutes les informations correspondantes :
        lieu, adversaires, date et heure, arbitre, résultat, etc...
      </Grid>

      <Grid item container xs={12} justifyContent="center" alignItems="center">
        {activeCompetitions.map((competition) => (
          <Grid
            item
            container
            key={`${competition.ffvbId}-${competition.pool}-${competition.season}`}
            marginBottom={3}
            xs={12}
            justifyContent="center"
            alignItems="center"
          >
            <span style={{ fontWeight: "bold" }}>
              {competition.name?.replaceAll("�", "E")} :{" "}
            </span>
            <Button
              variant="contained"
              href={`https://calendar.google.com/calendar/u/1?cid=${competition.calendarId}`}
              target="_blank"
              style={{ marginLeft: "1em", textTransform: "none" }}
            >
              Ouvrir le calendrier
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
