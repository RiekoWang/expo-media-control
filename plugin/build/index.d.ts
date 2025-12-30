import { ConfigPlugin } from 'expo/config-plugins';
/**
 * Configuration options for the Expo Media Control plugin
 *
 * Note: This plugin config is only for build-time configuration.
 * Runtime media control options should be passed to enableMediaControls().
 */
interface MediaControlOptions {
    /** Enable background audio modes (iOS) */
    enableBackgroundAudio?: boolean;
    /** Audio session category for iOS */
    audioSessionCategory?: string;
    /**
     * Custom notification icon (Android)
     *
     * IMPORTANT: Notification icon specification for Android:
     *
     * The notification icon MUST be monochrome (white/transparent only).
     *
     * Option 1: Use a custom icon (Recommended):
     * ----------------------------------------
     * 1. Create a monochrome PNG (white silhouette on transparent background)
     * 2. Place in your project: "./assets/notification-icon.png"
     * 3. Reference in app.json:
     *    ```json
     *    {
     *      "plugins": [
     *        ["expo-media-control", {
     *          "notificationIcon": "./assets/notification-icon.png"
     *        }]
     *      ]
     *    }
     *    ```
     * 4. The plugin will automatically copy it to Android drawable during prebuild
     *
     * Option 2: Use the default icon:
     * -------------------------------
     * - Don't specify notificationIcon
     * - A default music note icon will be created automatically
     *
     * Option 3: Reference existing Android resource:
     * ----------------------------------------------
     * - For bare workflow only
     * - Reference by name: "ic_notification"
     * - Icon must already exist in android/app/src/main/res/drawable/
     *
     * Icon Requirements:
     * - MUST be monochrome (white on transparent only)
     * - PNG format recommended (24x24dp to 96x96dp)
     * - Colored icons will render as white squares
     * - Simple, recognizable design
     *
     * If not specified or file not found, the module will:
     * - Create a default music note icon automatically
     * - Or use standard Android icon names (ic_notification, etc.)
     * - Or fall back to system default media icon
     */
    notificationIcon?: string;
}
/**
 * Main plugin function
 * Combines iOS and Android configurations for comprehensive media control support
 */
declare const withExpoMediaControl: ConfigPlugin<MediaControlOptions>;
export default withExpoMediaControl;
