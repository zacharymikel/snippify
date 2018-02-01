import { ToasterService } from 'angular2-toaster';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { ContentService } from './../auth/content-service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchState } from '../shared/stores/search-store';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { nearer } from 'q';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchQuery: string;
  public state$: Observable<SearchState>;
  public dataLoaded = false;

  constructor(
    private contentService: ContentService,
    private store: Store<SearchState>,
    private toasterService: ToasterService,
    private titleService: Title
  ) {
    this.state$ = this.store.select('searchStore');
  }

  ngOnInit() {
    this.titleService.setTitle('Search');
  }

  public search(): void {

    if(this.searchQuery === undefined) {
      this.searchQuery = "";
    }

    this.contentService.getSearchResults(this.searchQuery).then(res => {
      if (res.status === 200) {
        this.dataLoaded = true;
      } else {
        this.toasterService.pop('error', 'Error', res.json().errors[0]);
      }
    });
  }
}
