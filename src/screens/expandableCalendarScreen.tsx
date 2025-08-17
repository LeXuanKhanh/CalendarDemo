import React, {useRef, useCallback, createRef, useState, useMemo} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
  DateData,
} from 'react-native-calendars';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
import testIDs from '../testIDs';
import {agendaItems, getMarkedDates} from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../mocks/theme';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');

// Define types for agenda items
interface AgendaDataItem {
  hour: string;
  duration: string;
  title: string;
}

interface AgendaItem {
  title: string;
  data: (AgendaDataItem | Record<string, never>)[];
}

// Define types for marked dates
interface MarkedDate {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
}

const ITEMS: AgendaItem[] = agendaItems;

interface Props {
  weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
  const weekView = false;
  const marked = useRef(getMarkedDates());

  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  // State for date range selection
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [current, setCurrent] = useState(dayjs().format('YYYY-MM-DD'));

  // Date range selection logic:
  // 1. No dates: First tap creates single day selection (both startDate and endDate)
  // 2. Both dates: Subsequent taps extend existing range based on date position
  // Note: current state only changes when user navigates between months

  // Generate marked dates for the date range
  const markedDates = useMemo(() => {
    const dates: Record<string, MarkedDate> = {};

    if (startDate && endDate) {
      // Check if it's a single day selection or a range
      if (startDate.isSame(endDate, 'day')) {
        // Single day selection
        const dateString = startDate.format('YYYY-MM-DD');
        dates[dateString] = {
          startingDay: true,
          endingDay: true,
          color: 'green',
          textColor: 'white',
        };
      } else {
        // Range selection
        // Ensure start is before or equal to end
        let actualStart = startDate;
        let actualEnd = endDate;
        if (startDate.isAfter(endDate, 'day')) {
          actualStart = endDate;
          actualEnd = startDate;
        }

        // Mark all dates in the range
        let currentDate = actualStart;
        while (currentDate.isSameOrBefore(actualEnd, 'day')) {
          const dateString = currentDate.format('YYYY-MM-DD');
          const isStart = dateString === actualStart.format('YYYY-MM-DD');
          const isEnd = dateString === actualEnd.format('YYYY-MM-DD');

          dates[dateString] = {
            startingDay: isStart,
            endingDay: isEnd,
            color: 'green',
            textColor: 'white',
          };

          currentDate = currentDate.add(1, 'day');
        }
      }
    }

    return dates;
  }, [startDate, endDate]);

  const onDateChanged = useCallback((date: string, updateSource: string) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  }, []);

  const onMonthChange = useCallback(({dateString}: {dateString: string}) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);

    // Fix the bug: when switching months, the calendar automatically selects the first day
    // Set both startDate and endDate to the first day of the new month
    if (dateString) {
      const firstDayOfMonth = dayjs(dateString).startOf('month');

      setStartDate(firstDayOfMonth);
      setEndDate(firstDayOfMonth);
    }
  }, []);

  const onDayPress = useCallback(
    (day: DateData) => {
      const newDate = dayjs(day.dateString);

      // Case 1: No dates selected - create single day selection
      if (!startDate && !endDate) {
        setStartDate(newDate);
        setEndDate(newDate);
        return;
      }

      // Case 2: Both dates selected - extend existing range
      if (startDate && endDate) {
        if (newDate.isBefore(startDate, 'day')) {
          // New date is before start date - extend range backward
          setStartDate(newDate);
        } else if (newDate.isAfter(endDate, 'day')) {
          // New date is after end date - extend range forward
          setEndDate(newDate);
        } else if (
          newDate.isSame(startDate, 'day') ||
          newDate.isSame(endDate, 'day')
        ) {
          // New date is within the range - reset range to start from this day
          setStartDate(newDate);
          setEndDate(newDate);
        } else {
          setStartDate(newDate);
        }
        return;
      }
    },
    [startDate, endDate],
  );

  const renderItem = useCallback(({item}: {item: AgendaItem}) => {
    return <AgendaItem item={item} />;
  }, []);

  const clearSelection = useCallback(() => {
    // Reset all date selections to initial state
    setStartDate(null);
    setEndDate(null);
  }, []);

  // Utility function to format dates for display
  const formatDateForDisplay = useCallback((date: dayjs.Dayjs | null) => {
    if (!date) return 'Not selected';
    return date.format('MMM DD, YYYY');
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Date Range Display */}
      <View style={styles.dateRangeContainer}>
        <Text style={styles.dateRangeTitle}>Selected Date Range:</Text>
        <View style={styles.dateRangeInfo}>
          <Text style={styles.dateLabel}>
            Start: {formatDateForDisplay(startDate)}
          </Text>
          <Text style={styles.dateLabel}>
            End: {formatDateForDisplay(endDate)}
          </Text>
        </View>
        {startDate && endDate && (
          <Text style={styles.rangeInfo}>
            {startDate.isSame(endDate, 'day')
              ? '1 day selected'
              : `${endDate.diff(startDate, 'day') + 1} days selected`}
          </Text>
        )}
        <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
          <Text style={styles.clearButtonText}>Clear Selection</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          height: 30,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setCurrent(dayjs().add(1, 'month').format('YYYY-MM-DD'));
        }}>
        <Text>Change month</Text>
      </TouchableOpacity>
      <CalendarProvider
        date={current}
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        // showTodayButton
        // disabledOpacity={0.6}
        theme={todayBtnTheme.current}
        // todayBottomMargin={16}
      >
        <View
          style={{
            zIndex: 100,
            position: 'absolute',
            width: 200,
            height: 30,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            top: 10,
            alignSelf: 'center',
          }}>
          <Text style={{fontSize: 16, fontWeight: 300}}>{current}</Text>
        </View>
        <ExpandableCalendar
          // testID={testIDs.expandableCalendar.CONTAINER}
          // horizontal={false}
          // hideArrows
          // disablePan
          // hideKnob
          // initialPosition={ExpandableCalendar.positions.OPEN}
          // calendarStyle={styles.calendar}
          // headerStyle={styles.header} // for horizontal only
          // disableWeekScroll
          theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          markingType={'period'}
          markedDates={markedDates}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          onDayPress={onDayPress}
          closeOnDayPress={false}
          // animateScroll
        />
        {/* <AgendaList
          sections={ITEMS}
          renderItem={renderItem}
          // scrollToNextEvent
          sectionStyle={styles.section}
          // dayFormat={'yyyy-MM-d'}
        /> */}
        <View
          style={{
            height: 100,
            backgroundColor: 'green',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16}}>Place Search Filter Here</Text>
        </View>
        <FlatList
          data={ITEMS}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: 'lightgrey',
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
  dateRangeContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateRangeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dateRangeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  rangeInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
