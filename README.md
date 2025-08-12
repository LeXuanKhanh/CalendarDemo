# CalendarDemo

A React Native calendar application demonstrating various calendar implementations.

## Features

### ExpandableCalendarScreen - Date Range Selection

The `ExpandableCalendarScreen` now includes a comprehensive date range selection feature:

#### How to Use:

1. **Select Start Date**: Tap on any date to start the selection
2. **Select End Date**: Tap on another date to complete the range
3. **Same Date Selection**: Tap the same date twice to select a single day
4. **Clear Selection**: Use the "Clear Selection" button to reset

#### Features:

- **Visual Range Highlighting**: Selected dates are highlighted in green with proper start/end indicators
- **Automatic Range Calculation**: The calendar automatically calculates and displays the number of days selected
- **Month Navigation Bug Fix**: Automatically handles the bug where switching months would auto-select the first day
- **Flexible Selection**: Start and end dates can be selected in any order (automatically sorted)
- **Real-time Updates**: The UI updates immediately as dates are selected

#### Technical Implementation:

- Uses `markingType={'period'}` for proper range visualization
- Implements `onDayPress` handler for date selection logic
- Uses `onMonthChange` to fix the month switching bug
- Dynamic `markedDates` generation based on selected range
- Responsive UI with clear visual feedback

#### Bug Fixes:

- **Month Switching Issue**: When navigating between months, the calendar automatically sets both start and end dates to the first day of the new month, preventing the bug where the first day was automatically selected.

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native 0.74.2
- iOS/Android development environment

### Installation

```bash
npm install
# or
yarn install
```

### Running the App

```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## Available Screens

- `ExpandableCalendarScreen` - Date range selection with expandable calendar
- `CalendarScreen` - Basic calendar implementation
- `CalendarListScreen` - Calendar list view
- `AgendaScreen` - Agenda view with calendar
- `TimelineCalendarScreen` - Timeline view with calendar
- And more...

## Dependencies

- `react-native-calendars`: ^1.1305.0
- `react-native`: 0.74.2
- `react`: 18.2.0
