import { Search, SlidersHorizontal } from 'lucide-react-native';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress: () => void;
}

export function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
    return (
        <View className="flex-row items-center w-full gap-3 mb-4">
            <View className="flex-row items-center flex-1 px-4 py-3 bg-white border border-gray-100 rounded-full shadow-sm">
                <Search size={20} color="#757575" className="mr-2" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder="Find a hairstyle..."
                    placeholderTextColor="#999"
                    className="flex-1 text-base font-body text-charcoal"
                />
            </View>

            <TouchableOpacity
                onPress={onFilterPress}
                className="items-center justify-center w-12 h-12 bg-white border border-gray-100 rounded-full shadow-sm"
            >
                <SlidersHorizontal size={20} color="#333" />
            </TouchableOpacity>
        </View>
    );
}
