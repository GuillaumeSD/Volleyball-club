import { useFirestore } from "@/contexts/firestore";
import {
  Grid,
  Badge,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { capitalizeFirstLetter } from "@/helpers/string";
import GameSchedule from "@/components/GameSchedule";
import { useRouter } from "next/router";

const dayFormatter = new Intl.DateTimeFormat("fr", { dateStyle: "full" });

export default function HomePage() {
  const { gameEvents } = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  const router = useRouter();
  const { date: queryDate } = router.query as { date?: string };
  const selectedDate = useMemo(() => dayjs(queryDate), [queryDate]);

  const handleMonthChange = (date: Dayjs) => {
    setIsLoading(true);
    const monthEvents = gameEvents?.filter(
      (event): event is { dayjs: Dayjs } =>
        event.dayjs?.isSame(date, "month") === true
    );
    setHighlightedDays(monthEvents?.map((event) => event.dayjs?.date()) ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    handleMonthChange(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEvents]);

  const todayGames = useMemo(() => {
    const todayGames = gameEvents?.filter(
      (event): event is typeof event & { dayjs: Dayjs } =>
        event.dayjs?.isSame(selectedDate, "day") === true
    );

    if (!todayGames) return [];

    return todayGames.sort((a, b) => {
      const [aTime, bTime] = [a.dayjs, b.dayjs].map((time) => {
        if (time.hour() === 0) {
          const sameCompetitionGame = todayGames.find(
            (game) =>
              game.competition?.name === a.competition?.name &&
              game.dayjs?.hour() !== 0
          );
          if (sameCompetitionGame) {
            return sameCompetitionGame.dayjs.add(1, "minute");
          }
        }
        return time;
      });

      const timeDiff = aTime.diff(bTime, "minute");

      if (timeDiff > 10) return 1;
      if (timeDiff < -10) return -1;

      if (!a.competition?.name || !b.competition?.name) return 0;

      if (a.competition.name === b.competition.name) {
        return aTime.isAfter(bTime) ? 1 : -1;
      }

      return a.competition.name > b.competition.name ? 1 : -1;
    });
  }, [gameEvents, selectedDate]);

  return (
    <Grid
      container
      rowSpacing={2}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
      <Grid item xs={12}>
        <DateCalendar
          showDaysOutsideCurrentMonth
          value={selectedDate}
          onChange={(newVal) =>
            router.replace(`?date=${(newVal ?? dayjs()).format("YYYY-MM-DD")}`)
          }
          loading={!gameEvents?.length || isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          }}
        />
      </Grid>
      <Grid item maxWidth="1000px">
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {capitalizeFirstLetter(
                dayFormatter.format(selectedDate.toDate())
              )}
            </Typography>
            <Divider sx={{ marginBottom: "1.5em" }} />
            {todayGames.length ? (
              todayGames.map((event, idx) => {
                const isSameCompetition =
                  idx !== 0 &&
                  todayGames[idx - 1]?.competition?.name ===
                    event.competition?.name;
                return (
                  <>
                    {idx !== 0 && !isSameCompetition && (
                      <Divider sx={{ marginY: "1.5em" }} variant="fullWidth" />
                    )}
                    {isSameCompetition && (
                      <Divider
                        sx={{ marginY: "0.5em", paddingX: "20%" }}
                        variant="fullWidth"
                      >
                        &
                      </Divider>
                    )}
                    <GameSchedule
                      key={event.ffvbId}
                      game={event}
                      isSameCompetition={isSameCompetition}
                    />
                  </>
                );
              })
            ) : (
              <Typography textAlign="center">Aucun match</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const ServerDay = (
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const showBadge =
    !props.outsideCurrentMonth && highlightedDays.includes(props.day.date());

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={showBadge ? "🟢" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
};
