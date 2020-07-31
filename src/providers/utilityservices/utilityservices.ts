import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform,MenuController,NavController, NavParams ,ToastController,LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';
/*
  Generated class for the UtilityservicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilityservicesProvider {

  constructor(public platform: Platform, public http: HttpClient, public toastCtrl: ToastController, public navCtrl: MenuController,
               private menuCtrl: MenuController, private storage: Storage, private loadingCtrl: LoadingController,
               public nativeAudio: NativeAudio) {
      this.platform.ready().then((ready)=>{
          this.nativeAudio.preloadSimple("id1","assets/audio/Bite.mp3").then((loaded)=>{
              console.log("got preloaded");
          },(err)=>{
              this.presentToast(err,2);
          });

          //preload second sound;
          this.nativeAudio.preloadSimple("id2","assets/audio/Splat.mp3").then((loaded)=>{
              console.log("loaded second sound");
          },(err)=>{
              this.presentToast("Second Sound Not Loaded "+err,1);
          });
      },(err)=>{
          console.log("error in platform");
      });
    console.log('Hello UtilityservicesProvider Provider');
  }


    presentToast(message, duration){
        let timer: any;
        if(duration == 1){
            timer = 4000;
        }else if(duration == 2){
            timer = 10000;
        }else{
            timer = duration;
        }
        let toast = this.toastCtrl.create({
            "message":message,
            "position":"middle",
            "duration": timer
        });
        toast.present();

    }

    playSound(SoundNumber){
        this.nativeAudio.play("id"+SoundNumber).then((playing)=>{
            console.log("playing");
        },(err)=>{
            this.presentToast("sound not played "+err,1);
        })
    }
    presentLoading(message): Loading{
        let loader = this.loadingCtrl.create({
            "content": message,
            "showBackdrop": true,
            "enableBackdropDismiss": true,
            "dismissOnPageChange": true
        });
        loader.present();
        return loader;
    }

    dismissLoader(loader: Loading){
        loader.dismiss()
    }

    echoTextInTranslation(paragraphobject: any, langcode){
        if(langcode == "1"){
            return paragraphobject.paragraphtext;
        }else if(langcode == "2"){
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }else if(langcode == "3"){
            //return JSON.parse(paragraphobject.paragraphannotation);
            return paragraphobject.paragraphannotation;
        }else{
            //return JSON.parse(paragraphobject.paragraphigbotext);
            return paragraphobject.paragraphigbotext;
        }
    }

    /*echoTextInTranslation(paragraphobject: any){
        this.storage.get("LangCode")
            .then((langcode)=>{
                if(langcode == 1){
                    return paragraphobject.paragraphtext;
                }else if(langcode == 2){
                    return paragraphobject.paragraphigbotext;
                }else if(langcode == 3){
                    return paragraphobject.paragraphannotation;
                }else{
                    return paragraphobject.paragraphigbotext;
                }
            }).catch((err)=>{
                this.presentToast('unable to get stored date',1);
                return paragraphobject.paragraphigbotext;
            })
    }*/
    /*pushPageWithParams(PageString: string , Params: any){
        this.menuCtrl.getOpen().close();
        let nCtrl = new NavController();
        nCtrl.push(PageString,Params);
    }*/

    /*pushPage(page: string, parameters: any){
        this.navCtrl.push(page,parameters);
    }*/
}
