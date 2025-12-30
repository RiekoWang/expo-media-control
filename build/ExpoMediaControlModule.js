import { requireNativeModule } from "expo";
// =============================================
// CUSTOM ERROR TYPES
// =============================================
/**
 * Base error class for media control errors
 */
export class MediaControlError extends Error {
    code;
    cause;
    constructor(message, code, cause) {
        super(message);
        this.code = code;
        this.cause = cause;
        this.name = "MediaControlError";
    }
}
/**
 * Error thrown when validation fails
 */
export class ValidationError extends MediaControlError {
    field;
    constructor(message, field) {
        super(message, "VALIDATION_ERROR");
        this.field = field;
        this.name = "ValidationError";
    }
}
/**
 * Error thrown when native module operations fail
 */
export class NativeError extends MediaControlError {
    constructor(message, code, cause) {
        super(message, code, cause);
        this.name = "NativeError";
    }
}
/**
 * Error thrown when media controls are not enabled
 */
export class NotEnabledError extends MediaControlError {
    constructor(message = "Media controls are not enabled") {
        super(message, "NOT_ENABLED");
        this.name = "NotEnabledError";
    }
}
// =============================================
// VALIDATION UTILITIES
// =============================================
/**
 * Validates media metadata input
 */
function validateMetadata(metadata) {
    if (!metadata || typeof metadata !== "object") {
        throw new ValidationError("Metadata must be an object", "metadata");
    }
    // Validate optional string fields
    const stringFields = ["title", "artist", "album", "genre", "date"];
    for (const field of stringFields) {
        if (metadata[field] !== undefined && typeof metadata[field] !== "string") {
            throw new ValidationError(`${field} must be a string`, field);
        }
    }
    // Validate optional number fields
    const numberFields = [
        "duration",
        "elapsedTime",
        "trackNumber",
        "albumTrackCount",
    ];
    for (const field of numberFields) {
        if (metadata[field] !== undefined && typeof metadata[field] !== "number") {
            throw new ValidationError(`${field} must be a number`, field);
        }
        if (metadata[field] !== undefined && metadata[field] < 0) {
            throw new ValidationError(`${field} must be non-negative`, field);
        }
    }
    // Validate artwork
    if (metadata.artwork !== undefined) {
        if (!metadata.artwork || typeof metadata.artwork !== "object") {
            throw new ValidationError("artwork must be an object", "artwork");
        }
        if (typeof metadata.artwork.uri !== "string" ||
            metadata.artwork.uri.length === 0) {
            throw new ValidationError("artwork.uri must be a non-empty string", "artwork.uri");
        }
        if (metadata.artwork.width !== undefined &&
            typeof metadata.artwork.width !== "number") {
            throw new ValidationError("artwork.width must be a number", "artwork.width");
        }
        if (metadata.artwork.height !== undefined &&
            typeof metadata.artwork.height !== "number") {
            throw new ValidationError("artwork.height must be a number", "artwork.height");
        }
    }
    // Validate rating
    if (metadata.rating !== undefined) {
        if (!metadata.rating || typeof metadata.rating !== "object") {
            throw new ValidationError("rating must be an object", "rating");
        }
        if (!Object.values(RatingType).includes(metadata.rating.type)) {
            throw new ValidationError("rating.type must be a valid RatingType", "rating.type");
        }
        if (typeof metadata.rating.value !== "boolean" &&
            typeof metadata.rating.value !== "number") {
            throw new ValidationError("rating.value must be a boolean or number", "rating.value");
        }
    }
}
/**
 * Validates playback state input
 */
function validatePlaybackState(state) {
    if (typeof state !== "number") {
        throw new ValidationError("Playback state must be a number", "state");
    }
    if (!Object.values(PlaybackState).includes(state)) {
        throw new ValidationError("Invalid playback state value", "state");
    }
}
/**
 * Validates position input
 */
function validatePosition(position) {
    if (typeof position !== "number") {
        throw new ValidationError("Position must be a number", "position");
    }
    if (position < 0) {
        throw new ValidationError("Position must be non-negative", "position");
    }
    if (!isFinite(position)) {
        throw new ValidationError("Position must be finite", "position");
    }
}
/**
 * Validates playback rate input
 */
function validatePlaybackRate(rate) {
    if (typeof rate !== "number") {
        throw new ValidationError("Playback rate must be a number", "playbackRate");
    }
    if (rate < 0) {
        throw new ValidationError("Playback rate must be non-negative", "playbackRate");
    }
    if (rate > 10) {
        throw new ValidationError("Playback rate must not exceed 10", "playbackRate");
    }
    if (!isFinite(rate)) {
        throw new ValidationError("Playback rate must be finite", "playbackRate");
    }
}
/**
 * Validates media control options
 */
function validateMediaControlOptions(options) {
    if (!options || typeof options !== "object") {
        throw new ValidationError("Options must be an object", "options");
    }
    if (options.capabilities !== undefined) {
        if (!Array.isArray(options.capabilities)) {
            throw new ValidationError("capabilities must be an array", "capabilities");
        }
        for (const capability of options.capabilities) {
            if (!Object.values(Command).includes(capability)) {
                throw new ValidationError(`Invalid capability: ${capability}`, "capabilities");
            }
        }
    }
    if (options.notification !== undefined) {
        if (typeof options.notification !== "object") {
            throw new ValidationError("notification must be an object", "notification");
        }
    }
    if (options.ios !== undefined) {
        if (typeof options.ios !== "object") {
            throw new ValidationError("ios must be an object", "ios");
        }
    }
    if (options.android !== undefined) {
        if (typeof options.android !== "object") {
            throw new ValidationError("android must be an object", "android");
        }
    }
}
// =============================================
// TYPE DEFINITIONS
// =============================================
/**
 * Represents the current state of media playback
 */
export var PlaybackState;
(function (PlaybackState) {
    PlaybackState[PlaybackState["NONE"] = 0] = "NONE";
    PlaybackState[PlaybackState["STOPPED"] = 1] = "STOPPED";
    PlaybackState[PlaybackState["PLAYING"] = 2] = "PLAYING";
    PlaybackState[PlaybackState["PAUSED"] = 3] = "PAUSED";
    PlaybackState[PlaybackState["BUFFERING"] = 4] = "BUFFERING";
    PlaybackState[PlaybackState["ERROR"] = 5] = "ERROR";
})(PlaybackState || (PlaybackState = {}));
/**
 * Represents different types of media control commands
 */
export var Command;
(function (Command) {
    Command["PLAY"] = "play";
    Command["PAUSE"] = "pause";
    Command["STOP"] = "stop";
    Command["NEXT_TRACK"] = "nextTrack";
    Command["PREVIOUS_TRACK"] = "previousTrack";
    Command["SKIP_FORWARD"] = "skipForward";
    Command["SKIP_BACKWARD"] = "skipBackward";
    Command["SEEK"] = "seek";
    Command["SET_RATING"] = "setRating";
    Command["VOLUME_UP"] = "volumeUp";
    Command["VOLUME_DOWN"] = "volumeDown";
})(Command || (Command = {}));
/**
 * Rating types for media content
 */
export var RatingType;
(function (RatingType) {
    RatingType["HEART"] = "heart";
    RatingType["THUMBS_UP_DOWN"] = "thumbsUpDown";
    RatingType["THREE_STARS"] = "threeStars";
    RatingType["FOUR_STARS"] = "fourStars";
    RatingType["FIVE_STARS"] = "fiveStars";
    RatingType["PERCENTAGE"] = "percentage";
})(RatingType || (RatingType = {}));
// =============================================
// MODULE IMPLEMENTATION
// =============================================
// Create the native module instance
const nativeModule = requireNativeModule("ExpoMediaControl");
console.log("📱 JS: Native module loaded:", nativeModule);
/**
 * Map to store event listeners for manual management
 */
const eventListeners = {
    mediaControl: [],
    volumeChange: [],
};
/**
 * Extended module class that combines native methods with simplified event handling
 * This provides a complete interface for media control functionality
 */
class ExtendedExpoMediaControlModule {
    // =============================================
    // NATIVE METHOD PROXIES
    // Forward calls to the native module with proper error handling
    // =============================================
    /**
     * Enable media controls with specified configuration
     * Initializes the media session and sets up remote control handlers
     */
    enableMediaControls = async (options) => {
        try {
            // Validate input
            if (options !== undefined) {
                validateMediaControlOptions(options);
            }
            await nativeModule.enableMediaControls(options);
            // Add native event listeners
            nativeModule.addListener("mediaControlEvent", this._dispatchMediaControlEvent);
            nativeModule.addListener("volumeChangeEvent", this._dispatchVolumeChangeEvent);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            const nativeError = new NativeError(`Failed to enable media controls: ${errorMessage}`, "ENABLE_FAILED", error instanceof Error ? error : undefined);
            console.error(nativeError.message);
            throw nativeError;
        }
    };
    /**
     * Disable media controls and clean up all resources
     * Stops the media session and removes all handlers
     */
    disableMediaControls = async () => {
        try {
            await nativeModule.disableMediaControls();
            // Remove all native event listeners
            nativeModule.removeAllListeners("mediaControlEvent");
            nativeModule.removeAllListeners("volumeChangeEvent");
        }
        catch (error) {
            console.error("Failed to disable media controls:", error);
            throw error;
        }
    };
    /**
     * Update the media metadata displayed in system controls
     * Updates notification, lock screen, and control center information
     */
    updateMetadata = async (metadata) => {
        try {
            console.log("📱 JS: Updating metadata:", JSON.stringify(metadata, null, 2));
            // Validate input
            validateMetadata(metadata);
            // Filter out undefined values to prevent native conversion errors
            // This ensures robust handling of optional metadata fields
            const cleanMetadata = Object.fromEntries(Object.entries(metadata).filter(([_, value]) => value !== undefined));
            console.log("📱 JS: Sending cleaned metadata to native:", JSON.stringify(cleanMetadata, null, 2));
            await nativeModule.updateMetadata(cleanMetadata);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            const nativeError = new NativeError(`Failed to update metadata: ${errorMessage}`, "UPDATE_METADATA_FAILED", error instanceof Error ? error : undefined);
            console.error(nativeError.message);
            throw nativeError;
        }
    };
    /**
     * Update the current playback state and position
     * Updates the system about current playback status
     * @param state - The playback state
     * @param position - The current position in seconds (optional)
     * @param playbackRate - The playback rate/speed (optional, defaults to 1.0 when playing, 0.0 when paused)
     */
    updatePlaybackState = async (state, position, playbackRate) => {
        try {
            // Validate input
            validatePlaybackState(state);
            if (position !== undefined) {
                validatePosition(position);
            }
            if (playbackRate !== undefined) {
                validatePlaybackRate(playbackRate);
            }
            await nativeModule.updatePlaybackState(state, position, playbackRate);
        }
        catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            const nativeError = new NativeError(`Failed to update playback state: ${errorMessage}`, "UPDATE_STATE_FAILED", error instanceof Error ? error : undefined);
            console.error(nativeError.message);
            throw nativeError;
        }
    };
    /**
     * Reset all media control information to default state
     * Clears all metadata and resets playback state
     */
    resetControls = async () => {
        try {
            await nativeModule.resetControls();
        }
        catch (error) {
            console.error("Failed to reset controls:", error);
            throw error;
        }
    };
    /**
     * Check if media controls are currently enabled
     * Returns whether the media session is active
     */
    isEnabled = async () => {
        try {
            return await nativeModule.isEnabled();
        }
        catch (error) {
            console.error("Failed to check if controls are enabled:", error);
            return false;
        }
    };
    /**
     * Get the current media metadata
     * Returns the currently set metadata information
     */
    getCurrentMetadata = async () => {
        try {
            return await nativeModule.getCurrentMetadata();
        }
        catch (error) {
            console.error("Failed to get current metadata:", error);
            return null;
        }
    };
    /**
     * Get the current playback state
     * Returns the current playback status
     */
    getCurrentState = async () => {
        try {
            return await nativeModule.getCurrentState();
        }
        catch (error) {
            console.error("Failed to get current state:", error);
            return PlaybackState.NONE;
        }
    };
    // =============================================
    // SIMPLIFIED EVENT HANDLING METHODS
    // Use manual listener management for better control
    // =============================================
    /**
     * Add listener for media control events (play, pause, next, etc.)
     * These events are triggered when users interact with system media controls
     * @param listener Function to call when media control events occur
     * @returns Function to remove the listener
     */
    addListener = (listener) => {
        console.log("📱 JS: Adding media control event listener");
        eventListeners.mediaControl.push(listener);
        // Return removal function
        return () => {
            const index = eventListeners.mediaControl.indexOf(listener);
            if (index > -1) {
                eventListeners.mediaControl.splice(index, 1);
            }
        };
    };
    /**
     * Add listener for volume change events
     * These events are triggered when system volume changes
     * @param listener Function to call when volume changes
     * @returns Function to remove the listener
     */
    addVolumeChangeListener = (listener) => {
        eventListeners.volumeChange.push(listener);
        // Return removal function
        return () => {
            const index = eventListeners.volumeChange.indexOf(listener);
            if (index > -1) {
                eventListeners.volumeChange.splice(index, 1);
            }
        };
    };
    /**
     * Remove all event listeners for all event types
     * Cleans up all subscribed event handlers
     * @returns Promise that resolves when all listeners are removed
     */
    removeAllListeners = async () => {
        eventListeners.mediaControl.length = 0;
        eventListeners.volumeChange.length = 0;
    };
    // =============================================
    // INTERNAL EVENT DISPATCH METHODS
    // These will be called by the native modules
    // =============================================
    /**
     * Internal method to dispatch media control events
     * This will be called by the native modules when control events occur
     */
    _dispatchMediaControlEvent = (event) => {
        console.log("📱 JS: Dispatching media control event:", event);
        eventListeners.mediaControl.forEach((listener) => {
            try {
                listener(event);
            }
            catch (error) {
                console.error("Error in media control event listener:", error);
            }
        });
    };
    /**
     * Internal method to dispatch volume change events
     * This will be called by the native modules when volume changes
     */
    _dispatchVolumeChangeEvent = (change) => {
        eventListeners.volumeChange.forEach((listener) => {
            try {
                listener(change);
            }
            catch (error) {
                console.error("Error in volume change event listener:", error);
            }
        });
    };
}
// Export the extended module instance
export default new ExtendedExpoMediaControlModule();
//# sourceMappingURL=ExpoMediaControlModule.js.map