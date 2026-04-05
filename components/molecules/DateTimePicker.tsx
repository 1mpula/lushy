import { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface DateTimePickerProps {
    onDateSelect: (date: string) => void;
    onTimeSelect: (time: string) => void;
    blockedDates?: string[]; // Dates the provider is unavailable
}

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM'
];

export function DateTimePicker({ onDateSelect, onTimeSelect, blockedDates = [] }: DateTimePickerProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const handleDatePress = (day: any) => {
        // Don't allow selecting blocked dates
        if (blockedDates.includes(day.dateString)) return;

        setSelectedDate(day.dateString);
        onDateSelect(day.dateString);
        setSelectedTime(''); // Reset time on date change
    };

    const handleTimePress = (time: string) => {
        setSelectedTime(time);
        onTimeSelect(time);
    };

    // Get today's date for minDate
    const today = new Date().toISOString().split('T')[0];

    // Build marked dates object: selected date + blocked dates
    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};

        // Mark blocked dates
        for (const date of blockedDates) {
            marks[date] = {
                disabled: true,
                disableTouchEvent: true,
                customStyles: {
                    container: { backgroundColor: '#FEE2E2' },
                    text: { color: '#D1D5DB', textDecorationLine: 'line-through' },
                },
            };
        }

        // Mark selected date (overrides blocked if somehow selected)
        if (selectedDate && !blockedDates.includes(selectedDate)) {
            marks[selectedDate] = {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
                selectedColor: '#FF4081',
            };
        }

        return marks;
    }, [selectedDate, blockedDates]);

    return (
        <View className="bg-background rounded-xl overflow-hidden p-4 shadow-sm border border-border">
            <Text className="text-lg font-bold font-heading text-foreground mb-1">Select Date</Text>
            {blockedDates.length > 0 && (
                <Text className="text-xs text-mediumGray font-inter mb-3">Greyed out dates are unavailable</Text>
            )}

            <Calendar
                onDayPress={handleDatePress}
                minDate={today}
                markedDates={markedDates}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#FF4081',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#FF4081',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    arrowColor: '#FF4081',
                    monthTextColor: '#2d4150',
                    indicatorColor: '#FF4081',
                    textDayFontFamily: 'Inter_400Regular',
                    textMonthFontFamily: 'Inter_700Bold',
                    textDayHeaderFontFamily: 'Inter_500Medium',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14
                }}
            />

            {selectedDate ? (
                <View className="mt-6">
                    <Text className="text-lg font-bold font-heading text-foreground mb-3">Select Time</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                        {TIME_SLOTS.map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => handleTimePress(time)}
                                className={`px-4 py-2 rounded-full border ${selectedTime === time
                                    ? 'bg-primary border-primary'
                                    : 'bg-background border-border'
                                    }`}
                            >
                                <Text className={`font-bold text-sm ${selectedTime === time ? 'text-white' : 'text-foreground'}`}>
                                    {time}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            ) : null}

            {selectedDate && selectedTime && (
                <View className="mt-6 p-4 bg-card rounded-lg border border-border items-center">
                    <Text className="text-mediumGray font-body">Selected Appointment:</Text>
                    <Text className="text-primary font-bold text-lg mt-1">{selectedDate} @ {selectedTime}</Text>
                </View>
            )}
        </View>
    );
}

