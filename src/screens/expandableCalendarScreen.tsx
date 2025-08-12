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
} from 'react-native-calendars';
import testIDs from '../testIDs';
import {agendaItems, getMarkedDates} from '../mocks/agendaItems';
import AgendaItem from '../mocks/AgendaItem';
import {getTheme, themeColor, lightThemeColor} from '../mocks/theme';

const leftArrowIcon = require('../img/previous.png');
const rightArrowIcon = require('../img/next.png');
const ITEMS: any[] = agendaItems;

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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [current, setCurrent] = useState('2025-01-01');

  // Generate marked dates for the date range
  const markedDates = useMemo(() => {
    const dates: any = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure start is before or equal to end
      let actualStart = start;
      let actualEnd = end;
      if (start > end) {
        actualStart = end;
        actualEnd = start;
      }

      const currentDate = new Date(actualStart);

      while (currentDate <= actualEnd) {
        const dateString = currentDate.toISOString().split('T')[0];
        const isStart = dateString === actualStart.toISOString().split('T')[0];
        const isEnd = dateString === actualEnd.toISOString().split('T')[0];

        dates[dateString] = {
          startingDay: isStart,
          endingDay: isEnd,
          color: 'green',
          textColor: 'white',
        };

        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (startDate && !endDate) {
      // Only start date selected - show as single selection
      dates[startDate] = {
        selected: true,
        selectedColor: 'blue',
        selectedTextColor: 'white',
      };
    }

    return dates;
  }, [startDate, endDate]);

  const onDateChanged = useCallback((date: any, updateSource: any) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    //setCurrent(date);
  }, []);

  const onMonthChange = useCallback(({dateString}: {dateString: any}) => {
    console.log('ExpandableCalendarScreen onMonthChange: ', dateString);

    // Fix the bug: when switching months, the calendar automatically selects the first day
    // Set both startDate and endDate to the first day of the new month
    if (dateString) {
      const firstDayOfMonth = new Date(dateString);
      firstDayOfMonth.setDate(1);
      const firstDayString = firstDayOfMonth.toISOString().split('T')[0];

      setStartDate(firstDayString);
      setEndDate(firstDayString);
      setCurrent(firstDayString);
    }
  }, []);

  const onDayPress = useCallback(
    (day: any) => {
      const {dateString} = day;

      if (!startDate) {
        // First selection - set start date
        setStartDate(dateString);
        setEndDate(null);
      } else if (!endDate) {
        // Second selection - complete the range
        if (dateString === startDate) {
          // Same date selected - set both to the same date
          setEndDate(dateString);
        } else {
          // Different date selected - set end date
          setEndDate(dateString);
        }
      } else {
        // Range already exists - extend the range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const newDate = new Date(dateString);

        if (newDate < start) {
          // New date is before start date - extend range backward
          setStartDate(dateString);
        } else if (newDate > end) {
          // New date is after or equal to start date - extend range forward
          setEndDate(dateString);
        } else {
          setStartDate(dateString);
        }
      }

      setCurrent(dateString);
    },
    [startDate, endDate],
  );

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

  const clearSelection = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setCurrent('2025-01-01');
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Date Range Display */}
      <View style={styles.dateRangeContainer}>
        <Text style={styles.dateRangeTitle}>Selected Date Range:</Text>
        <View style={styles.dateRangeInfo}>
          <Text style={styles.dateLabel}>
            Start: {startDate ? startDate : 'Not selected'}
          </Text>
          <Text style={styles.dateLabel}>
            End: {endDate ? endDate : 'Not selected'}
          </Text>
        </View>
        {startDate && endDate && (
          <Text style={styles.rangeInfo}>
            {(() => {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const diffTime = Math.abs(end.getTime() - start.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              return `${diffDays} day${diffDays > 1 ? 's' : ''} selected`;
            })()}
          </Text>
        )}
        <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
          <Text style={styles.clearButtonText}>Clear Selection</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          width: 50,
          height: 30,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          setCurrent('2021-01-01');
        }}>
        <Text>TEST</Text>
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
          // animateScroll
          closeOnDayPress={false}
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
