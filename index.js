/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ExpandableCalendarScreen from './src/screens/expandableCalendarScreen';
import CalendarScreen from './src/screens/calendarScreen';

AppRegistry.registerComponent(appName, () => ExpandableCalendarScreen);
