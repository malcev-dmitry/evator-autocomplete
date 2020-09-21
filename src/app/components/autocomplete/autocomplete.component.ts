import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiDataService} from '../../services/api-data.service';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, switchMap, tap} from 'rxjs/operators';
import {SuggestionInterface} from '../../services/dadata.interface';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

    this.formGroup.controls.postalCode.setValue(value[lastSelectedSuggestionIndex].data.postal_code || 'не указан');
    this.formGroup.controls.city.setValue(value[lastSelectedSuggestionIndex].data.city || 'не указан');
    this.formGroup.controls.street.setValue(value[lastSelectedSuggestionIndex].data.street || 'не указана');
    this.formGroup.controls.house.setValue(value[lastSelectedSuggestionIndex].data.house || 'не указан');
  }

  constructor(private cd: ChangeDetectorRef,
              private dataService: ApiDataService) {
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
        switchMap(term => this.dataService.getDaData(term).pipe(
          catchError(() => of([])),
          tap(() => this.suggestionsLoading = false)
        ))
      )
    );
  }

  public trackByFn(item: { id: number }): number {
    return item.id;
  }

}
