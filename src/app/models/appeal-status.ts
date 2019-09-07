export class AppealStatus {
  value: string;
  label: string;
}

export class Meta {
  pageNumber: number;
  pageSize: number;
  pagesCount: number;
  itemsCount: number;
}

export class AppealStatuses {
  collection: AppealStatus[];
  meta: Meta;
}
