// Re-export types and enums from ExpoMediaControlModule
import ExpoMediaControlModule from "./ExpoMediaControlModule";
export { PlaybackState, Command, RatingType, 
// Error types
MediaControlError, ValidationError, NativeError, NotEnabledError, } from "./ExpoMediaControlModule";
// =============================================
// EXPORTED API
// =============================================
/**
 * Main API object for media controls
 * Implements the ExpoMediaControlInterface for managing media playback controls
 */
export const MediaControl = {
    enableMediaControls: ExpoMediaControlModule.enableMediaControls,
    disableMediaControls: ExpoMediaControlModule.disableMediaControls,
    updateMetadata: ExpoMediaControlModule.updateMetadata,
    updatePlaybackState: ExpoMediaControlModule.updatePlaybackState,
    resetControls: ExpoMediaControlModule.resetControls,
    addListener: ExpoMediaControlModule.addListener,
    addVolumeChangeListener: ExpoMediaControlModule.addVolumeChangeListener,
    removeAllListeners: ExpoMediaControlModule.removeAllListeners,
    isEnabled: ExpoMediaControlModule.isEnabled,
    getCurrentMetadata: ExpoMediaControlModule.getCurrentMetadata,
    getCurrentState: ExpoMediaControlModule.getCurrentState,
};
// Export individual functions for backward compatibility
export const { enableMediaControls, disableMediaControls, updateMetadata, updatePlaybackState, resetControls, addListener, addVolumeChangeListener, removeAllListeners, isEnabled, getCurrentMetadata, getCurrentState, } = MediaControl;
// Export everything for convenience
export default MediaControl;
//# sourceMappingURL=index.js.map