import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface VideoFile {
  filepath: string;
  webviewPath: string;
  name: string;
  size: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoCaptureService {
  private videos: VideoFile[] = [];
  private readonly VIDEO_STORAGE_KEY = 'videos';

  constructor() {
    this.loadVideos();
  }

  /**
   * Capture a video using the device camera
   * For native platforms, this uses the Camera plugin's video picker
   * For web platforms, this uses HTML5 file input
   */
  async captureVideo(): Promise<VideoFile | null> {
    try {
      // Check if running on native platform
      if (!Capacitor.isNativePlatform()) {
        // For web platform, use HTML5 video capture
        return await this.captureVideoWeb();
      }

      // For native platforms (iOS/Android), use file picker approach
      // Note: Camera plugin doesn't support video recording directly
      // You can use @capacitor/media plugin for better video recording support
      // For now, we'll use a file picker approach
      return await this.captureVideoNative();
    } catch (error: any) {
      console.error('Error capturing video:', error);
      // If user cancels, return null instead of throwing
      if (error.message && error.message.includes('cancel')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Capture video on web platform using HTML5 file input
   */
  private async captureVideoWeb(): Promise<VideoFile | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'video/*';
      input.capture = 'environment'; // Use back camera on mobile devices

      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) {
          resolve(null);
          return;
        }

        try {
          const webviewPath = URL.createObjectURL(file);
          const savedFile = await this.saveVideo(webviewPath, file.name);
          resolve(savedFile);
        } catch (error) {
          reject(error);
        }
      };

      input.onerror = () => reject(new Error('File input error'));
      input.click();
    });
  }

  /**
   * Capture video on native platforms
   * Note: The Camera plugin doesn't support video recording directly
   * For full video recording support, consider using @capacitor/media plugin
   * This implementation uses a file picker approach for native platforms
   */
  private async captureVideoNative(): Promise<VideoFile | null> {
    // For native platforms, we'll use the same file input approach
    // as web, which works well on mobile browsers
    // For better native video recording, install @capacitor/media plugin
    return await this.captureVideoWeb();
  }

  /**
   * Save video file to local storage
   */
  private async saveVideo(webPath: string, filename: string): Promise<VideoFile> {
    const timestamp = new Date().getTime();
    const name = `${timestamp}_${filename}`;
    const filepath = `videos/${name}`;

    let fileSize: number;

    if (Capacitor.isNativePlatform()) {
      try {
        // On native platforms, we need to convert the webPath (capacitor://) to a file
        // First, fetch the file as a blob
        const response = await fetch(webPath);
        const blob = await response.blob();
        fileSize = blob.size;
        
        // Convert blob to base64
        const reader = new FileReader();
        const base64Data = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix if present
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        // Ensure videos directory exists
        try {
          await Filesystem.mkdir({
            path: 'videos',
            directory: Directory.Data,
            recursive: true,
          });
        } catch (e) {
          // Directory might already exist, ignore error
        }

        // Save to filesystem
        await Filesystem.writeFile({
          path: filepath,
          data: base64Data,
          directory: Directory.Data,
        });
      } catch (error) {
        // If saving fails, store the webPath reference
        console.warn('Could not save file to filesystem, storing reference:', error);
        fileSize = 0;
        await Preferences.set({
          key: filepath,
          value: webPath,
        });
      }
    } else {
      // For web, store as blob URL reference
      try {
        const response = await fetch(webPath);
        const blob = await response.blob();
        fileSize = blob.size;
        
        // Store blob URL reference in preferences
        await Preferences.set({
          key: filepath,
          value: webPath,
        });
      } catch (error) {
        console.warn('Could not fetch blob, using webPath directly:', error);
        fileSize = 0;
        await Preferences.set({
          key: filepath,
          value: webPath,
        });
      }
    }

    const videoFile: VideoFile = {
      filepath,
      webviewPath: webPath,
      name,
      size: fileSize,
      date: new Date().toISOString(),
    };

    this.videos.unshift(videoFile);
    await this.saveVideos();
    return videoFile;
  }

  /**
   * Get all saved videos
   */
  getVideos(): VideoFile[] {
    return [...this.videos];
  }

  /**
   * Get video by filepath
   */
  async getVideo(filepath: string): Promise<string | null> {
    try {
      if (Capacitor.isNativePlatform()) {
        const file = await Filesystem.readFile({
          path: filepath,
          directory: Directory.Data,
        });
        return `data:video/mp4;base64,${file.data}`;
      } else {
        const result = await Preferences.get({ key: filepath });
        return result.value;
      }
    } catch (error) {
      console.error('Error reading video:', error);
      return null;
    }
  }

  /**
   * Delete a video
   */
  async deleteVideo(video: VideoFile): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Filesystem.deleteFile({
          path: video.filepath,
          directory: Directory.Data,
        });
      } else {
        await Preferences.remove({ key: video.filepath });
      }

      this.videos = this.videos.filter(v => v.filepath !== video.filepath);
      await this.saveVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }

  /**
   * Save videos metadata to preferences
   */
  private async saveVideos(): Promise<void> {
    await Preferences.set({
      key: this.VIDEO_STORAGE_KEY,
      value: JSON.stringify(this.videos),
    });
  }

  /**
   * Load videos metadata from preferences
   */
  private async loadVideos(): Promise<void> {
    const result = await Preferences.get({ key: this.VIDEO_STORAGE_KEY });
    if (result.value) {
      this.videos = JSON.parse(result.value);
    }
  }
}

