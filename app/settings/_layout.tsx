import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="personal-info" />
            <Stack.Screen name="security" />
            <Stack.Screen name="help-center" />
            <Stack.Screen name="terms" />
        </Stack>
    );
}
