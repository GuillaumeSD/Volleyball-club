import { useFirestore } from "@/contexts/firestore";
import { Grid, Badge } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";

export default function HomePage() {
  const { gameEvents } = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [highlightedDays, setHighlightedDays] = useState<number[]>([]);

  console.log(gameEvents);

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

  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      alignItems="center"
      marginTop={1}
    >
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
  );
}

const ServerDay = (
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) => {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.includes(props.day.date());

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🔵" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
};
