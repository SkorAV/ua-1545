export class AppealType {
  children: AppealType[];
  model: AppealTypeModel;
}

export class AppealTypeModel {
  id: number;
  name: string;
  orderNum: number;
  // tslint:disable-next-line:variable-name
  parent_id: number;
}
