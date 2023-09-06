import { isVenueFileAvailable, openVenueFile } from "@/helpers/gameEvents";
import { GameEvent } from "@/types/calendar";
import { Icon } from "@iconify/react";
import { Typography, Grid, Link, Stack } from "@mui/material";
import { yellow } from "@mui/material/colors";
import FileIcon from "./FileIcon";

export interface Props {
  game: GameEvent;
  isSameCompetition: boolean;
}

export default function GameSchedule({ game, isSameCompetition }: Props) {
  const isGamePassed = game.dayjs?.isBefore(new Date()) ?? true;

  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      rowSpacing={1}
    >
      {!isSameCompetition && (
        <Grid item xs={12}>
          <Link href={game.competition?.url} underline="hover" target="_blank">
            <Typography variant="body1">{game.competition?.name}</Typography>
          </Link>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body2" fontStyle="italic">
          {game.dayjs?.hour() === 0
            ? "Horaire non défini"
            : game.dayjs?.format("HH[h]mm")}
        </Typography>
      </Grid>
      <Grid item container xs={12}>
        <Grid item xs textAlign="right">
          <Typography variant="body1">{game.homeTeam}</Typography>
        </Grid>
        <Grid item marginX={1.5}>
          <Icon icon="mdi:sword-cross" color={yellow[900]} width="1.2em" />
        </Grid>
        <Grid item xs textAlign="left">
          <Typography variant="body1">{game.awayTeam}</Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Typography variant="body1">
            Lieu : {game.venue || "Non défini"}
          </Typography>
          {isVenueFileAvailable(game) && (
            <FileIcon onClick={() => openVenueFile(game)} />
          )}
        </Stack>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body1">
          Arbitre : {game.referee || "Non défini"}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" spacing={0.5} justifyContent="center">
          <Typography variant="body1">
            Résultat :{" "}
            {!isGamePassed
              ? "À venir"
              : game.setsPoint?.map((set) => set).join(" / ") ?? "Non défini"}
          </Typography>
          {game.fileUrl && (
            <Link href={game.fileUrl} underline="hover" target="_blank">
              <FileIcon />
            </Link>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
