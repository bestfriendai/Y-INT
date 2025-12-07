import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
    FadeInRight,
    FadeOutLeft,
} from "react-native-reanimated";
import Icon from "./LucideIcons";
import { ThemedText } from "./themed-text";

// Imported newly created screens
import ExplorePage from '@/app/explore/index';
import FavoritePage from '@/app/favorite/index';
import HomePage from '@/app/home/index';
import ProfilePage from '@/app/profile/index';

interface NavItem {
    icon: string;
    label: string;
    screen: React.ComponentType<any>;
}

const NAV_ITEMS: NavItem[] = [
    { icon: "Home", label: "Home", screen: HomePage },
    { icon: "Compass", label: "Explore", screen: ExplorePage },
    { icon: "Heart", label: "Favorite", screen: FavoritePage },
    { icon: "User", label: "Profile", screen: ProfilePage },
];

export default function GlassNavBar(): React.JSX.Element {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            {/* Active screen with shared axis transition */}
            <View style={styles.screenContainer}>
                <Animated.View
                    key={activeTab}
                    entering={FadeInRight.duration(250)}
                    exiting={FadeOutLeft.duration(250)}
                    style={{ flex: 1 }}
                >
                    {(() => {
                        const ActiveScreen = NAV_ITEMS[activeTab].screen;
                        return <ActiveScreen />;
                    })()}
                </Animated.View>
            </View>

            {/* Glass bottom nav */}
            <View style={styles.container}>
                <BlurView style={styles.blurContainer} intensity={30} tint="dark">
                    <View style={styles.content}>
                        {NAV_ITEMS.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                style={[
                                    styles.navItem,
                                    index === activeTab && styles.activeNavItem,
                                ]}
                                onPress={() => setActiveTab(index)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    name={item.icon}
                                    size={24}
                                    color={
                                        index === activeTab ? "#fff" : "rgba(255, 255, 255, 0.6)"
                                    }
                                />
                                <ThemedText
                                    style={[
                                        styles.navText,
                                        index === activeTab && styles.activeNavText,
                                    ]}
                                >
                                    {item.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </BlurView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        position: "absolute",
        bottom: Platform.OS === "ios" ? 30 : 20,
        left: 20,
        right: 20,
        height: 70,
        borderRadius: 35,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.15)",
    },
    blurContainer: {
        flex: 1,
        backgroundColor: "rgba(28, 28, 30, 0.4)",
        borderRadius: 35,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    content: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    navItem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        minWidth: 70,
        opacity: 0.7,
    },
    activeNavItem: {
        transform: [{ scale: 1.05 }],
        opacity: 1,
    },
    navText: {
        fontSize: 11,
        color: "rgba(255, 255, 255, 0.6)",
        marginTop: 6,
        fontWeight: "500",
    },
    activeNavText: {
        color: "#fff",
        fontWeight: "600",
    },
});
