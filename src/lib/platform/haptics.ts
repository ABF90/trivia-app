import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const enabled = Platform.OS === "ios" || Platform.OS === "android";

/** Success / error buzz for answers. No-op on web. */
export const haptics = {
  success: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  error: () => enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {}),
  tap: () => enabled && Haptics.selectionAsync().catch(() => {}),
};
