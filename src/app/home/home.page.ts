import { Component, OnInit } from '@angular/core';
import { VideoCaptureService, VideoFile } from '../services/video-capture.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  videos: VideoFile[] = [];
  selectedVideo: VideoFile | null = null;
  videoUrl: string | null = null;

  constructor(
    private videoCaptureService: VideoCaptureService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  /**
   * Load all saved videos
   */
  loadVideos() {
    this.videos = this.videoCaptureService.getVideos();
  }

  /**
   * Capture a new video
   */
  async captureVideo() {
    const loading = await this.loadingController.create({
      message: 'Preparing camera...',
    });
    await loading.present();

    try {
      const video = await this.videoCaptureService.captureVideo();
      await loading.dismiss();

      if (video) {
        this.loadVideos();
        await this.showAlert('Success', 'Video captured successfully!');
      } else {
        await this.showAlert('Cancelled', 'Video capture was cancelled.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Error', error.message || 'Failed to capture video. Please check camera permissions.');
    }
  }

  /**
   * Play a selected video
   */
  async playVideo(video: VideoFile) {
    const loading = await this.loadingController.create({
      message: 'Loading video...',
    });
    await loading.present();

    try {
      const url = await this.videoCaptureService.getVideo(video.filepath);
      await loading.dismiss();

      if (url) {
        this.selectedVideo = video;
        this.videoUrl = url;
      } else {
        await this.showAlert('Error', 'Could not load video.');
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showAlert('Error', error.message || 'Failed to load video.');
    }
  }

  /**
   * Delete a video
   */
  async deleteVideo(video: VideoFile) {
    const alert = await this.alertController.create({
      header: 'Delete Video',
      message: `Are you sure you want to delete "${video.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              await this.videoCaptureService.deleteVideo(video);
              this.loadVideos();
              
              // Clear selected video if it was deleted
              if (this.selectedVideo?.filepath === video.filepath) {
                this.selectedVideo = null;
                this.videoUrl = null;
              }
              
              await this.showAlert('Success', 'Video deleted successfully.');
            } catch (error: any) {
              await this.showAlert('Error', error.message || 'Failed to delete video.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  /**
   * Format file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  /**
   * Close video player
   */
  closeVideo() {
    this.selectedVideo = null;
    this.videoUrl = null;
  }

  /**
   * Show alert
   */
  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

