import { Header } from '@/components/molecules/Header';
import { useRouter } from 'expo-router';
import { ChevronRight, FileText, Mail, MessageCircle } from 'lucide-react-native';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const FAQ_ITEMS = [
    {
        question: 'How do I book an appointment?',
        answer: 'Browse the Explore tab, tap on a service you like, and click "Book Now". Select your preferred date and time, then confirm your booking.'
    },
    {
        question: 'Can I cancel or reschedule a booking?',
        answer: 'Yes! Go to your Bookings tab and find the appointment. You can reschedule or cancel up to 24 hours before the appointment time.'
    },
    {
        question: 'How do I become a Pro on Lushy?',
        answer: 'Sign up and select "I am a Pro" during registration. Complete your profile, upload your portfolio, and start accepting bookings!'
    },
    {
        question: 'How are payments processed?',
        answer: 'Payments are securely processed through the app. Pros receive their earnings weekly, minus a small service fee.'
    },
];

export default function HelpCenterScreen() {
    const router = useRouter();

    const handleContactEmail = () => {
        Linking.openURL('mailto:support@lushy.app?subject=Help Request');
    };

    const handleOpenChat = () => {
        // In a real app, this would open an in-app chat or external chat service
        Linking.openURL('https://lushy.app/chat');
    };

    const handleOpenTerms = () => {
        router.push('/settings/terms');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Header title="Help Center" />

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Contact Options */}
                <Text className="px-6 py-4 text-sm font-bold text-mediumGray uppercase tracking-wider">Contact Us</Text>
                <View className="bg-white border-y border-gray-100">
                    <TouchableOpacity
                        onPress={handleContactEmail}
                        className="flex-row items-center justify-between p-4 border-b border-gray-50"
                    >
                        <View className="flex-row items-center gap-3">
                            <Mail size={22} color="#FF4081" />
                            <View>
                                <Text className="text-base font-bold text-charcoal">Email Support</Text>
                                <Text className="text-sm text-mediumGray">support@lushy.app</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#CDCDE0" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleOpenChat}
                        className="flex-row items-center justify-between p-4"
                    >
                        <View className="flex-row items-center gap-3">
                            <MessageCircle size={22} color="#FF4081" />
                            <View>
                                <Text className="text-base font-bold text-charcoal">Live Chat</Text>
                                <Text className="text-sm text-mediumGray">Available 9AM - 6PM</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color="#CDCDE0" />
                    </TouchableOpacity>
                </View>

                {/* FAQs */}
                <Text className="px-6 py-4 text-sm font-bold text-mediumGray uppercase tracking-wider">Frequently Asked Questions</Text>
                <View className="bg-white border-y border-gray-100">
                    {FAQ_ITEMS.map((item, index) => (
                        <View key={index} className="p-4 border-b border-gray-50">
                            <Text className="text-base font-bold text-charcoal mb-2">{item.question}</Text>
                            <Text className="text-sm text-mediumGray leading-relaxed">{item.answer}</Text>
                        </View>
                    ))}
                </View>

                {/* Legal */}
                <Text className="px-6 py-4 text-sm font-bold text-mediumGray uppercase tracking-wider">Legal</Text>
                <View className="bg-white border-y border-gray-100">
                    <TouchableOpacity
                        onPress={handleOpenTerms}
                        className="flex-row items-center justify-between p-4"
                    >
                        <View className="flex-row items-center gap-3">
                            <FileText size={22} color="#333" />
                            <Text className="text-base text-charcoal">Terms of Service & Privacy Policy</Text>
                        </View>
                        <ChevronRight size={20} color="#CDCDE0" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
