import { View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface DatePickerModuleProps {
    onDateSelect: (date: DateData) => void;
    markedDates?: any;
}

export function DatePickerModule({ onDateSelect, markedDates }: DatePickerModuleProps) {
    return (
        <View className="p-4 bg-background rounded-lg shadow-sm">
            <Calendar
                onDayPress={onDateSelect}
                markedDates={markedDates}
                theme={{
                    todayTextColor: '#FF4081',
                    arrowColor: '#FF4081',
                    selectedDayBackgroundColor: '#FF4081',
                    selectedDayTextColor: '#ffffff',
                    textDayFontFamily: 'Inter_400Regular',
                    textMonthFontFamily: 'Outfit_700Bold',
                    textDayHeaderFontFamily: 'Inter_500Medium',
                }}
            />
        </View>
    );
}
