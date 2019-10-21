import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {QuestionService} from './question/question.service';
import {UkcApiService} from '../../services/ukc-api.service';
import {AppealLocation} from '../../models/appeal-locations';
import {Chooser} from '@ionic-native/chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {Platform} from '@ionic/angular';
import {FileInfo} from '../../models/file-info';
import {LoadingService} from '../../services/loading.service';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-new-appeal',
  templateUrl: './new-appeal.page.html',
  styleUrls: ['./new-appeal.page.scss'],
})
export class NewAppealPage implements OnInit {
  public form: FormGroup;
  public locations: AppealLocation[] = [];
  public selectedLocation: AppealLocation;
  appealText = '';
  files: FileInfo[] = [];
  fileMaxSize = 5 * 1024 * 10024; // 5 Mb

  constructor(
    private router: Router,
    public question: QuestionService,
    private apiService: UkcApiService,
    private chooser: Chooser,
    private filepath: FilePath,
    private platform: Platform,
    private loader: LoadingService,
    public toast: ToastController
  ) {
  }

  ngOnInit() {
    this.apiService.getAppealTypesTree().then(response => {
      try {
        this.question.typesTree = JSON.parse(response.data);
        this.question.setDefault();
      } catch (e) { }
    });
  }

  selectLevel1() {
    this.router.navigate(['/members/level1']);
  }

  getLocation($event) {
    const value = $event.detail.value;
    if (value.indexOf(', ') > -1) {
      this.locations = [];
      return;
    }
    if (value === '' || this.getFullLocation(this.selectedLocation) === value) {
      this.locations = [];
      return;
    }
    this.apiService.getLocations(value).then(response => {
      try {
        const data = JSON.parse(response.data);
        this.locations = data.collection;
      } catch (e) { }
    });
  }

  getFullLocation(item?: AppealLocation) {
    if (!item) {
      return '';
    }
    let result = item.name;
    if (item.parents.length > 0) {
      item.parents.forEach(parent => {
        if (
          parent.type === 'адміністративний район'
          || parent.type === 'місто'
          || parent.type === 'область'
        ) {
          result += ', ' + parent.name;
        }
      });
    }
    return result;
  }

  selectLocation(item: AppealLocation) {
    this.selectedLocation = item;
    this.locations = [];
  }

  sendAppeal() {
    const fileIds = [];
    this.files.map(value => {
      fileIds.push(value.id);
    });
    this.apiService.addAppeal({
      content: this.appealText,
      region: {
        value: this.selectedLocation.id,
        label: this.selectedLocation.name,
        region: this.getFullLocation(this.selectedLocation).replace(this.selectedLocation.name, '')
      },
      region_id: this.selectedLocation.id,
      source: null,
      type_id: this.question.selected.model.id,
      files: fileIds
    }).then(() => {
      this.router.navigate(['members', 'dashboard']);
    });
  }

  showError(message) {
    return this.toast.create({
      message,
      position: 'bottom',
      color: 'danger',
      duration: 5000
    }).then(toast => {
      return toast.present();
    });
  }

  chooseFile() {
    this.chooser.getFile().then((result) => {
      if (typeof result !== 'undefined') {
        this.processFile(result);
      }
    }).catch(error => {
      if (error && error.hasOwnProperty('name')) {
        this.processFile(error);
      }
    });
  }

  async processFile(data) {
    // console.log(data);
    let found = false;
    this.files.forEach(item => {
      if (item.name === data.name) {
        found = true;
        return;
      }
    });
    if (found) {
      return;
    }
    const acceptTypes = [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'rtf',
      'txt',
      'jpeg',
      'jpg',
      'bmp',
      'png',
      'tiff'
    ];
    if (acceptTypes.indexOf(data.name.split('.').pop()) === -1) {
      this.showError('Цей тип файлів не підтримується!');
      return;
    }

    if (data.data.length > this.fileMaxSize) {
      this.showError('Файл занадто великий! Оберіть файл розміром до 5 Мб.');
      return;
    }

    let path = data.uri;

    if (this.platform.is('android')) {
      path = await this.filepath.resolveNativePath(data.uri);
    }

    // console.log(path);

    this.loader.present({
      message: 'Завантаження файла на сервер...'
    });
    this.apiService.uploadFile(path).then(result => {
      // console.log(result);
      try {
        const parsedResponse = JSON.parse(result.data);
        this.files.push({
          name: data.name,
          id: parsedResponse.image.id
        } as FileInfo);
      } catch (e) {
        this.showError('Сталася невідома помилка. Будь ласка, спробуйте ще!');
      }
      this.loader.dismiss();
    }).catch(error => {
      // console.error(error);
      this.loader.dismiss();
    });
  }

  removeFile(index) {
    this.files.splice(index, 1);
  }
}
