import { Header } from '@/components/molecules/Header';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            <Header title="Terms & Privacy" />

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 60 }}>
                {/* Terms of Service */}
                <Text className="text-2xl font-bold font-heading text-charcoal mb-4">Terms of Service</Text>
                <Text className="text-sm text-mediumGray mb-2">Last updated: January 2026</Text>

                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    Welcome to Lushy! By using our app, you agree to be bound by these Terms of Service. Please read them carefully.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2 mt-4">1. Acceptance of Terms</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    By accessing or using the Lushy application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this app.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">2. User Accounts</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">3. Booking Services</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    Lushy facilitates connections between clients and beauty professionals ("Pros"). We are not responsible for the quality, timing, legality, or any other aspect of services provided by Pros. All bookings are subject to the Pro's availability and acceptance.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">4. Cancellation Policy</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    Cancellations made less than 24 hours before an appointment may be subject to a cancellation fee. Repeated no-shows may result in account suspension.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">5. Payments</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    All payments are processed securely through our payment partners. Lushy charges a small service fee on each transaction. Pros receive their earnings weekly after the service is completed.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">6. Prohibited Conduct</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    You agree not to: use the app for any unlawful purpose; harass, abuse, or harm other users; post false or misleading information; attempt to circumvent our payment system; or violate any applicable laws or regulations.
                </Text>

                {/* Divider */}
                <View className="h-px bg-gray-200 my-8" />

                {/* Privacy Policy */}
                <Text className="text-2xl font-bold font-heading text-charcoal mb-4">Privacy Policy</Text>
                <Text className="text-sm text-mediumGray mb-2">Last updated: January 2026</Text>

                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2 mt-4">Information We Collect</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    We collect information you provide directly, including: name, email address, phone number, location, payment information, and profile photos. We also collect usage data such as app interactions, booking history, and device information.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">How We Use Your Information</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    We use your information to: provide and improve our services; process transactions and send related information; send notifications about bookings and updates; personalize your experience; and ensure safety and security on our platform.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">Information Sharing</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    We share your information with: Pros you book with (limited to what's necessary for the service); payment processors; service providers who assist our operations; and law enforcement when required by law.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">Data Security</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">Your Rights</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    You have the right to: access, update, or delete your personal information; opt out of marketing communications; request a copy of your data; and withdraw consent for data processing where applicable.
                </Text>

                <Text className="text-lg font-bold text-charcoal mb-2">Contact Us</Text>
                <Text className="text-base text-charcoal leading-relaxed mb-4">
                    If you have any questions about these Terms or our Privacy Policy, please contact us at privacy@lushy.app.
                </Text>

                <View className="bg-gray-50 p-4 rounded-xl mt-4">
                    <Text className="text-sm text-mediumGray text-center">
                        By using Lushy, you acknowledge that you have read and understood these Terms of Service and Privacy Policy.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
