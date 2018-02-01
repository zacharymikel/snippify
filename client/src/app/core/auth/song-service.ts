import { REMOVE_FROM_NEWS_FEED } from './../shared/actions/home-actions';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Http } from '@angular/http';
import {getApiEnvironment, getFileUploadRequestOptions, getRequestOptions} from './http-utilities';
import { Store } from '@ngrx/store';
import {ProfileState} from '../shared/stores/profile-store';
import {UploadSongs} from '../../models/upload-songs';
import { REMOVE_SONG } from '../shared/actions/profile-actions';

@Injectable()
export class SongService {
  private env: string;

  constructor(
    private http: Http,
    private store: Store<ProfileState>
  ) {
    this.env = getApiEnvironment();
  }


  uploadSong(upload: UploadSongs): Promise<any> {
    const formData: FormData = new FormData();
    formData.append('songName', upload.songName);
    formData.append('start', upload.start);
    formData.append('end', upload.end);
    formData.append('songFile', upload.file);
    formData.append('imageFile', upload.image);
    formData.append('description', upload.description);
    formData.append('tags', JSON.stringify(upload.tags));

    return this.http.post(this.env + '/song/upload', formData, getFileUploadRequestOptions()).toPromise();
  }

  deleteSong(songId: string): Promise<any> {
    return this.http.delete(this.env + '/song?songId=' + songId, getRequestOptions())
    .toPromise()
    .then(res => {
      if (res.status === 200) {
        this.store.dispatch({type: REMOVE_SONG, payload: songId});
        this.store.dispatch({type: REMOVE_FROM_NEWS_FEED, payload: songId});
      }
      return res;
    }, err => {
      return err;
    });
  }
}
