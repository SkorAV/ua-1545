import { Injectable } from '@angular/core';
import {AppealType, AppealTypeModel} from '../../../models/appeal-type';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public level1: AppealType;
  public level2: AppealType;
  public level3: AppealType;
  public level4: AppealType;
  public selected: AppealType;
  public typesTree: AppealType[] = [];

  constructor() {
    this.selected = new AppealType();
    this.selected.model = new AppealTypeModel();
    this.selected.model.id = 56;
    this.selected.model.name = 'Не визначено';
    this.selected.model.orderNum = 0;
    this.selected.model.parent_id = null;
    this.selected.children = [];
    this.level1 = this.selected;
  }

  setDefault() {
    if (this.typesTree.length > 0) {
      this.selected = this.level1 = this.typesTree[0];
    }
  }

  setLevel1(item: any) {
    this.level1 = this.selected = item;
  }

  setLevel2(item: any) {
    this.level2 = this.selected = item;
  }

  setLevel3(item: any) {
    this.level3 = this.selected = item;
  }

  setLevel4(item: any) {
    this.level4 = this.selected = item;
  }

  getFullName() {
    if (this.selected.model.id === this.level1.model.id) {
      return this.level1.model.name;
    }
    if (this.selected.model.id === this.level2.model.id) {
      return this.level1.model.name + ' | ' + this.level2.model.name;
    }
    if (this.selected.model.id === this.level3.model.id) {
      return this.level1.model.name + ' | ' + this.level2.model.name + ' | ' + this.level3.model.name;
    }
    return this.level1.model.name + ' | ' + this.level2.model.name + ' | ' + this.level3.model.name + ' | ' + this.level4.model.name;
  }
}
