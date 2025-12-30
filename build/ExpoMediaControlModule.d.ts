/**
 * Base error class for media control errors
 */
export declare class MediaControlError extends Error {
    readonly code?: string | undefined;
    readonly cause?: Error | undefined;
    constructor(message: string, code?: string | undefined, cause?: Error | undefined);
}
/**
 * Error thrown when validation fails
 */
export declare class ValidationError extends MediaControlError {
    readonly field?: string | undefined;
    constructor(message: string, field?: string | undefined);
}
/**
 * Error thrown when native module operations fail
 */
export declare class NativeError extends MediaControlError {
    constructor(message: string, code?: string, cause?: Error);
}
/**
 * Error thrown when media controls are not enabled
 */
export declare class NotEnabledError extends MediaControlError {
    constructor(message?: string);
}
/**
 * Represents the current state of media playback
 */
export declare enum PlaybackState {
    NONE = 0,
    STOPPED = 1,
    PLAYING = 2,
    PAUSED = 3,
    BUFFERING = 4,
    ERROR = 5
}
/**
 * Represents different types of media control commands
 */
export declare enum Command {
    PLAY = "play",
    PAUSE = "pause",
    STOP = "stop",
    NEXT_TRACK = "nextTrack",
    PREVIOUS_TRACK = "previousTrack",
    SKIP_FORWARD = "skipForward",
    SKIP_BACKWARD = "skipBackward",
    SEEK = "seek",
    SET_RATING = "setRating",
    VOLUME_UP = "volumeUp",
    VOLUME_DOWN = "volumeDown"
}
/**
 * Rating types for media content
 */
export declare enum RatingType {
    HEART = "heart",
    THUMBS_UP_DOWN = "thumbsUpDown",
    THREE_STARS = "threeStars",
    FOUR_STARS = "fourStars",
    FIVE_STARS = "fiveStars",
    PERCENTAGE = "percentage"
}
/**
 * Represents artwork/album cover information
 */
export interface MediaArtwork {
    uri: string;
    width?: number;
    height?: number;
}
/**
 * Represents rating information for media content
 */
export interface MediaRating {
    type: RatingType;
    value: boolean | number;
    maxValue?: number;
}
/**
 * Complete media metadata information
 */
export interface MediaMetadata {
    title?: string;
    artist?: string;
    album?: string;
    artwork?: MediaArtwork;
    duration?: number;
    elapsedTime?: number;
    genre?: string;
    trackNumber?: number;
    albumTrackCount?: number;
    date?: string;
    rating?: MediaRating;
    color?: string;
    colorized?: boolean;
}
/**
 * Configuration options for media controls
 *
 * Note: Audio focus management should be handled by your media player,
 * not by this control module.
 */
export interface MediaControlOptions {
    capabilities?: Command[];
    notification?: {
        icon?: string;
        largeIcon?: MediaArtwork;
        color?: string;
        showWhenClosed?: boolean;
    };
    ios?: {
        skipInterval?: number;
    };
    android?: {
        skipInterval?: number;
    };
}
/**
 * Media control event data
 */
export interface MediaControlEvent {
    command: Command;
    data?: any;
    timestamp: number;
}
/**
 * Volume change information
 */
export interface VolumeChange {
    volume: number;
    userInitiated: boolean;
}
export type MediaControlEventListener = (event: MediaControlEvent) => void;
export type VolumeChangeListener = (change: VolumeChange) => void;
/**
 * Extended module class that combines native methods with simplified event handling
 * This provides a complete interface for media control functionality
 */
declare class ExtendedExpoMediaControlModule {
    /**
     * Enable media controls with specified configuration
     * Initializes the media session and sets up remote control handlers
     */
    enableMediaControls: (options?: MediaControlOptions) => Promise<void>;
    /**
     * Disable media controls and clean up all resources
     * Stops the media session and removes all handlers
     */
    disableMediaControls: () => Promise<void>;
    /**
     * Update the media metadata displayed in system controls
     * Updates notification, lock screen, and control center information
     */
    updateMetadata: (metadata: MediaMetadata) => Promise<void>;
    /**
     * Update the current playback state and position
     * Updates the system about current playback status
     * @param state - The playback state
     * @param position - The current position in seconds (optional)
     * @param playbackRate - The playback rate/speed (optional, defaults to 1.0 when playing, 0.0 when paused)
     */
    updatePlaybackState: (state: PlaybackState, position?: number, playbackRate?: number) => Promise<void>;
    /**
     * Reset all media control information to default state
     * Clears all metadata and resets playback state
     */
    resetControls: () => Promise<void>;
    /**
     * Check if media controls are currently enabled
     * Returns whether the media session is active
     */
    isEnabled: () => Promise<boolean>;
    /**
     * Get the current media metadata
     * Returns the currently set metadata information
     */
    getCurrentMetadata: () => Promise<MediaMetadata | null>;
    /**
     * Get the current playback state
     * Returns the current playback status
     */
    getCurrentState: () => Promise<PlaybackState>;
    /**
     * Add listener for media control events (play, pause, next, etc.)
     * These events are triggered when users interact with system media controls
     * @param listener Function to call when media control events occur
     * @returns Function to remove the listener
     */
    addListener: (listener: MediaControlEventListener) => (() => void);
    /**
     * Add listener for volume change events
     * These events are triggered when system volume changes
     * @param listener Function to call when volume changes
     * @returns Function to remove the listener
     */
    addVolumeChangeListener: (listener: VolumeChangeListener) => (() => void);
    /**
     * Remove all event listeners for all event types
     * Cleans up all subscribed event handlers
     * @returns Promise that resolves when all listeners are removed
     */
    removeAllListeners: () => Promise<void>;
    /**
     * Internal method to dispatch media control events
     * This will be called by the native modules when control events occur
     */
    _dispatchMediaControlEvent: (event: MediaControlEvent) => void;
    /**
     * Internal method to dispatch volume change events
     * This will be called by the native modules when volume changes
     */
    _dispatchVolumeChangeEvent: (change: VolumeChange) => void;
}
declare const _default: ExtendedExpoMediaControlModule;
export default _default;
//# sourceMappingURL=ExpoMediaControlModule.d.ts.map