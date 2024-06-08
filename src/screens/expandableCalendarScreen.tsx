import React, {useRef, useCallback, createRef, useState} from 'react';
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
  const [current, setCurrent] = useState('2020-01-01');

  const onDateChanged = useCallback((date, updateSource) => {
    console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
    setCurrent(date);
  }, []);

  const onMonthChange = useCallback(({dateString}) => {
    // console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    // console.log();
    // setCurrent(dateString);
  }, []);

  const renderItem = useCallback(({item}: any) => {
    return <AgendaItem item={item} />;
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
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
          // theme={theme.current}
          // disableAllTouchEventsForDisabledDays
          firstDay={1}
          //markedDates={marked.current}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          // animateScroll
          // closeOnDayPress={false}
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
});
