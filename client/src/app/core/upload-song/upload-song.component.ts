import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import {ENTER} from '@angular/cdk/keycodes';
import {UploadSongs} from '../../models/upload-songs';
import {MatChipInputEvent} from '@angular/material';
import {SongService} from '../auth/song-service';
import {ToasterService} from 'angular2-toaster';
import {Router} from '@angular/router';


@Component({
  selector: 'app-upload-song',
  templateUrl: './upload-song.component.html',
  styleUrls: ['./upload-song.component.css']
})
export class UploadSongComponent implements OnInit {
  // For chiplists
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  private fileList: FileList;
  model: UploadSongs = new UploadSongs();
  separatorKeysCodes = [ENTER];

  fruits = [ ];
  constructor(
    private songService: SongService,
    private toasterService: ToasterService,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Song Upload');
  }

  upload(): void {
    this.model.tags = this.fruits;
    // console.log(this.model.tags);
    this.songService.uploadSong(this.model).then(res => {
      if (res.status === 200) {
        this.toasterService.pop('success', 'Success', 'Song uploaded successfully!');
      } else {

        this.toasterService.pop('error', 'Error', res.json().errors[0]);
      }
      this.router.navigate(['']);
    }, (err) => {
      this.toasterService.pop('error', 'Error', err.json().errors[0]);
    });
  }

  fileChange(event: any): void {
    this.model.file = event.target.files[0];
  }

  imageChange(event: any): void {
    this.model.image = event.target.files[0];
  }

  // For Chiplists:
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our person
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
}
