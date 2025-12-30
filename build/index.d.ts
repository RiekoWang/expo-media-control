import ExpoMediaControlModule from "./ExpoMediaControlModule";
export { PlaybackState, Command, RatingType, MediaArtwork, MediaRating, MediaMetadata, MediaControlOptions, MediaControlEvent, VolumeChange, MediaControlEventListener, VolumeChangeListener, MediaControlError, ValidationError, NativeError, NotEnabledError, } from "./ExpoMediaControlModule";
/**
 * Main interface for the Expo Media Control module
 * Provides methods to control media playback and handle remote control events
 */
export interface ExpoMediaControlInterface {
    enableMediaControls: typeof ExpoMediaControlModule.enableMediaControls;
    disableMediaControls: typeof ExpoMediaControlModule.disableMediaControls;
    updateMetadata: typeof ExpoMediaControlModule.updateMetadata;
    updatePlaybackState: typeof ExpoMediaControlModule.updatePlaybackState;
    resetControls: typeof ExpoMediaControlModule.resetControls;
    addListener: typeof ExpoMediaControlModule.addListener;
    addVolumeChangeListener: typeof ExpoMediaControlModule.addVolumeChangeListener;
    removeAllListeners: typeof ExpoMediaControlModule.removeAllListeners;
    isEnabled: typeof ExpoMediaControlModule.isEnabled;
    getCurrentMetadata: typeof ExpoMediaControlModule.getCurrentMetadata;
    getCurrentState: typeof ExpoMediaControlModule.getCurrentState;
}
/**
 * Main API object for media controls
 * Implements the ExpoMediaControlInterface for managing media playback controls
 */
export declare const MediaControl: ExpoMediaControlInterface;
export declare const enableMediaControls: (options?: import("./ExpoMediaControlModule").MediaControlOptions) => Promise<void>, disableMediaControls: () => Promise<void>, updateMetadata: (metadata: import("./ExpoMediaControlModule").MediaMetadata) => Promise<void>, updatePlaybackState: (state: import("./ExpoMediaControlModule").PlaybackState, position?: number, playbackRate?: number) => Promise<void>, resetControls: () => Promise<void>, addListener: (listener: import("./ExpoMediaControlModule").MediaControlEventListener) => (() => void), addVolumeChangeListener: (listener: import("./ExpoMediaControlModule").VolumeChangeListener) => (() => void), removeAllListeners: () => Promise<void>, isEnabled: () => Promise<boolean>, getCurrentMetadata: () => Promise<import("./ExpoMediaControlModule").MediaMetadata | null>, getCurrentState: () => Promise<import("./ExpoMediaControlModule").PlaybackState>;
export default MediaControl;
//# sourceMappingURL=index.d.ts.map