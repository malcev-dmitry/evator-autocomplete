import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiDataService } from '../../services/api-data.service';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { SuggestionInterface } from '../../services/dadata.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {

  @Input() formGroup: FormGroup;
  public suggestions$: Observable<SuggestionInterface[]>;
  public suggestionsInput$ = new Subject<string>();
  public suggestionsLoading = false;

  private privateSelectedSuggestions: SuggestionInterface[] | [] = [];

  get selectedSuggestions(): SuggestionInterface[] | [] {
    return this.privateSelectedSuggestions;
  }

  set selectedSuggestions(value: SuggestionInterface[] | []) {
    this.privateSelectedSuggestions = value;

    if (!Array.isArray(this.privateSelectedSuggestions) || !this.privateSelectedSuggestions.length) {
      this.formGroup.reset();
      return;
    }

    const lastSelectedSuggestionIndex = this.privateSelectedSuggestions.length - 1;

    this.formGroup.patchValue(value[lastSelectedSuggestionIndex].data);
  }

  constructor(private dataService: ApiDataService) {
  }

  ngOnInit(): void {
    this.loadSuggestions();
  }

  private loadSuggestions(): void {
    this.suggestions$ = concat(
      of([]),
      this.suggestionsInput$.pipe(
        tap(() => this.suggestionsLoading = true),
        debounceTime(300),
        switchMap(term => this.dataService.getDaData(term)),
        catchError(() => of([])),
        tap(() => this.suggestionsLoading = false)
      )
    );
  }

  public trackByFn(item: { id: number }): number {
    return item.id;
  }

}
