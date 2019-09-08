export class AppealLocations {
  collection: AppealLocation[];
  meta: AppealLocationMeta;
}

export class AppealLocation {
  id: number;
  level: number;
  name: string;
  parents: AppealLocationParent[];
}

export class AppealLocationParent {
  id: number;
  type: string;
  name: string;
}

export class AppealLocationMeta {
  pageNumber: number;
  pageSize: number;
  pagesCount: number;
  itemsCount: number;
}
