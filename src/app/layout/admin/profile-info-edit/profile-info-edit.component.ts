import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Description } from 'app/model/Description';
import { DescriptionService } from 'app/services/http/description.service';
import { FilesService} from 'app/services/files.service';
import { LoadingService } from 'app/services/loading.service';
import { finalize, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'app/services/language.service';
import { Language } from 'app/model/LanguageEnum';





@Component({
  selector: 'app-profile-info-edit',
  templateUrl: './profile-info-edit.component.html',
  styleUrls: ['./profile-info-edit.component.css']
})
export class ProfileInfoEditComponent implements OnInit {

  constructor(private readonly formBuilder : FormBuilder, private readonly descHttpSvc:DescriptionService,
    private imgSvc: FilesService, private loading:LoadingService, private toastr:ToastrService,
    private readonly _languageSvc : LanguageService) {
    this.form = this.initForm();

}


ngOnInit(): void {
    this.getDescription();
}

   //---------------CRUD READ UPDATE-------------------

  private getDescription():void{
    this.descHttpSvc.readDescription().subscribe({
      next: data =>  {
        this.id= 1;
        this.text= data[0].text;
        this.title = data[0].title;
        this.imageUrl = data[0].photo;
      },
      error: error => console.log(error),
    })
  }


  private updateDescription(id:number, desc:Description):void{
    this.descHttpSvc.updateDescription(id, desc).subscribe({
      error: error => alert(error)
    })
  }


  //-------------------------------------------------

  //construccion del reactiveForm
  initForm(): FormGroup{
    return this.formBuilder.group({
      text: [this.text,[Validators.required, Validators.minLength(12), Validators.maxLength(100)]],
      title: [this.title,[Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
    })
  }

  get Text(){
    return this.form.get('text');
  }

  get Title(){
    return this.form.get('title');
  }

  //para editar el texto descriptivo principal 
  textEditPen(){
      this.onEditText = !this.onEditText;
  }


  /*  -----------------------------
  para cambiar la foto de perfil*/

  onPhotoEditPen():void{
    this.editPhoto = !this.editPhoto;
  }

  uploadImg($e:any){
    const file = $e.target.files[0];
    if(this.imgSvc.isFileValid(file)){
      if (confirm("deseas subir este archivo?")){
        this.isUploadingIncomplete = true;
        const fileRef = this.imgSvc.getRef(file.name, "images/")
        const task = this.imgSvc.uploadFile(file, "images/");
        this.namePhoto = file.name;
        this.uploadPercent = task.percentageChanges();
        this.uploadPercent.subscribe(
          ({complete: ()=> this.isUploadingIncomplete = false})
        )
        task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(imgRef => this.imageUrl = imgRef)
          } )
       ).subscribe()
      }
    }
  }

  onEditButtom():void{
    let currentLang;
    this.editPhoto = !this.editPhoto;
    const formText = this.form.value;
    this.title = formText.title;
    this.text = formText.text;
    currentLang = this._languageSvc.getCurrentLanguage()
    this.onEditText = true;
    let desc:Description = new Description(this.text, this.title, this.imageUrl, this.namePhoto, currentLang);
    this.updateDescription(this.id, desc);
  }


  onSubmitPhoto():void{
    let currentLang : Language;
    this.editPhoto = !this.editPhoto;
    this.Title == undefined? "Sin titulo": this.title;
    currentLang = this._languageSvc.getCurrentLanguage();
    let desc:Description = new Description(this.text, this.title, this.imageUrl,this.namePhoto, currentLang);
    this.updateDescription(this.id, desc)
  }

  onDeletePhoto():void{
    let currentLang : Language;
    this.editPhoto = !this.editPhoto;
    const task = this.imgSvc.deleteFile(this.namePhoto, "images/")
    task.suscribe()
    this.imageUrl = "#";
    this.namePhoto = "";
    currentLang = this._languageSvc.getCurrentLanguage();
    let desc:Description = new Description(this.text, this.title, this.imageUrl, this.namePhoto, currentLang);
    this.updateDescription(this.id, desc);
    this.loading.show()
    setTimeout(()=> this.loading.hide(), 2000)
  }

  private isFileValid(file:any):boolean{
    //verifica que el archivo seleccionado sea img
    //EXTENSIONES PERMITIDO.
      var ext_availables = [".png", ".bmp", ".jpg", ".jpeg", ".svg"];
      var route = file.name;
      var last_dot = file.name.lastIndexOf(".");
      var extension = route.slice(last_dot, route.length);
      if(ext_availables.indexOf(extension) == -1)
      {
          this.toastr.warning("las imagenes solo pueden ser png, bmb, jpg , jpeg o svg","archivo no válido");
          file.name = "";
          return false;
      }
      return true;
  }


//--------------atributos------------

id!:number;
text!: String;
editPhoto: boolean = true;
onEditText: boolean = true;
form: FormGroup;
title!:String;
file!:any;
namePhoto:String = "";
imageUrl!:String;
isUploadingIncomplete!:boolean;
uploadPercent!: Observable<any>;
downloadURL!: Observable<string>;

}




