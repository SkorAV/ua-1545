export class Appeal {
  id: string;
  // tslint:disable-next-line:variable-name
  request_id: string;
  // tslint:disable-next-line:variable-name
  external_id: string;
  // tslint:disable-next-line:variable-name
  type_id: string;
  // tslint:disable-next-line:variable-name
  region_id: string;
  // tslint:disable-next-line:variable-name
  use_profile: string;
  // tslint:disable-next-line:variable-name
  use_legal: string;
  subject: string;
  content: string;
  // tslint:disable-next-line:variable-name
  created_at: string;
  // tslint:disable-next-line:variable-name
  updated_at: string;
  status: string;
  updates: any;
  destination: string;
  // tslint:disable-next-line:variable-name
  count_of_comments: number;
}

export class Meta {
  pageNumber: number;
  pageSize: number;
  pagesCount: number;
  itemsCount: number;
}

export class AppealDetails {
  id: any;
  // tslint:disable-next-line:variable-name
  request_id: any;
  // tslint:disable-next-line:variable-name
  external_id: any;
  subject: any;
  content: any;
  // tslint:disable-next-line:variable-name
  created_at: any;
  status: any;
  // tslint:disable-next-line:variable-name
  status_id: any;
  decision: any;
  resolution: any;
  updates: any;
  // tslint:disable-next-line:variable-name
  max_resolve_at: any;
  destination: any;
  documents: any;
  comments: any[];
}
