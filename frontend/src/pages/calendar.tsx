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
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { GameEvent } from "@/types/calendar";
import { capitalizeFirstLetter } from "@/helpers/string";
import GameSchedule from "@/components/GameSchedule";

export default function HomePage() {
  const { gameEvents } = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
  const [todayEvents, setTodayEvents] = useState<GameEvent[]>([]);

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

  useEffect(() => {
    const todayEvents = gameEvents
      ?.filter(
        (event): event is { dayjs: Dayjs } =>
          event.dayjs?.isSame(selectedDate, "day") === true
      )
      .sort((a, b) => (a.dayjs.isAfter(b.dayjs) ? 1 : -1));
    setTodayEvents(todayEvents ?? []);
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
          onChange={(newVal) => setSelectedDate(newVal ?? dayjs())}
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
            {todayEvents.length ? (
              todayEvents.map((event, idx) => (
                <>
                  <GameSchedule key={event.ffvbId} game={event} />
                  {idx !== todayEvents.length - 1 && (
                    <Divider sx={{ marginY: "1.5em" }} variant="fullWidth" />
                  )}
                </>
              ))
            ) : (
              <Typography textAlign="center">Aucun match</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const dayFormatter = new Intl.DateTimeFormat("fr", { dateStyle: "full" });

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
