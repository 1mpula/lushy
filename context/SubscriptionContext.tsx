import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, LOG_LEVEL, PurchasesPackage } from 'react-native-purchases';

// TODO: Replace these with your actual RevenueCat Public App API Keys
const API_KEYS = {
    apple: 'appl_test_XsWUSPcoAbMhBAkeVVbyWuqhdyl',
    google: 'goog_test_XsWUSPcoAbMhBAkeVVbyWuqhdyl',
};

// The name of our RevenueCat entitlement that gives pro access
export const PRO_ENTITLEMENT_ID = 'Pro';

interface SubscriptionContextType {
    isPro: boolean;
    customerInfo: CustomerInfo | null;
    packages: PurchasesPackage[];
    isLoading: boolean;
    purchasePackage: (pack: PurchasesPackage) => Promise<boolean>;
    restorePurchases: () => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user, userRole } = useUser();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPro, setIsPro] = useState(false);

    // 1. Initialize RevenueCat
    useEffect(() => {
        const init = async () => {
            Purchases.setLogLevel(LOG_LEVEL.DEBUG);

            if (Platform.OS === 'ios') {
                Purchases.configure({ apiKey: API_KEYS.apple });
            } else if (Platform.OS === 'android') {
                Purchases.configure({ apiKey: API_KEYS.google });
            }

            // Listen for customer info updates (e.g. from background renewals)
            Purchases.addCustomerInfoUpdateListener((info) => {
                setCustomerInfo(info);
                checkProStatus(info);
            });
        };
        init();
    }, []);

    // 2. Identify user & fetch packages when logged in
    useEffect(() => {
        const loadSubscriptionData = async () => {
            if (!user?.id) return;

            try {
                // Identify the user in RevenueCat using our Supabase UUID
                // This correctly links their purchase to their cross-platform account
                const { customerInfo: info } = await Purchases.logIn(user.id);
                setCustomerInfo(info);
                checkProStatus(info);

                // Fetch available products (Offerings)
                const offerings = await Purchases.getOfferings();
                if (offerings.current && offerings.current.availablePackages.length !== 0) {
                    setPackages(offerings.current.availablePackages);
                }
            } catch (error) {
                console.error('Error loading RevenueCat data', error);
            }
        };

        // Only bother if they are a provider
        if (userRole === 'provider') {
            loadSubscriptionData();
        }
    }, [user, userRole]);

    // Helper to evaluate entitlement
    const checkProStatus = async (info: CustomerInfo) => {
        if (!user?.id || userRole !== 'provider') return;

        const active = typeof info.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
        setIsPro(active);

        // Sync with Supabase (Optional but recommended for Web/DB logic)
        try {
            await supabase
                .from('professionals')
                .update({
                    subscription_status: active ? 'active' : 'suspended'
                })
                .eq('user_id', user.id);
        } catch (err) {
            console.error('Error syncing pro status to DB', err);
        }
    };

    // 3. Purchase a package
    const purchasePackage = async (pack: PurchasesPackage) => {
        if (!user) return false;
        try {
            setIsLoading(true);
            const { customerInfo: newInfo } = await Purchases.purchasePackage(pack);
            setCustomerInfo(newInfo);

            const isNowPro = typeof newInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
            setIsPro(isNowPro);

            // Sync with Supabase right away
            if (isNowPro) {
                await supabase
                    .from('professionals')
                    .update({ subscription_status: 'active' })
                    .eq('user_id', user.id);
            }

            return isNowPro;
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Purchase error', e);
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 4. Restore purchases
    const restorePurchases = async () => {
        try {
            setIsLoading(true);
            const restoredInfo = await Purchases.restorePurchases();
            setCustomerInfo(restoredInfo);

            const isNowPro = typeof restoredInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== 'undefined';
            setIsPro(isNowPro);

            // Sync with Supabase
            if (user?.id) {
                await supabase
                    .from('professionals')
                    .update({ subscription_status: isNowPro ? 'active' : 'suspended' })
                    .eq('user_id', user.id);
            }

            return isNowPro;
        } catch (e) {
            console.error('Restore error', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SubscriptionContext.Provider value={{
            isPro,
            customerInfo,
            packages,
            isLoading,
            purchasePackage,
            restorePurchases
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
