export interface BodyInterface {
  count: number;
  query: string;
}

export interface DaDataInterface {
  suggestions: SuggestionInterface[];
}

export interface SuggestionInterface {
  value: string;
  unrestricted_value: string;
  data: {
    postal_code: string;
    city: string;
    street: string;
    house: string;
  };
}
