import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpserviceProvider } from '../../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../../providers/utilityservices/utilityservices';
import { NativeAudio } from '@ionic-native/native-audio';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

    private Law: Array<any>;
  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private httpservice: HttpserviceProvider, private storage: Storage, private utilityserservice: UtilityservicesProvider, public nativeAudio: NativeAudio) {
      /*this.platform.ready().then((ready)=>{
          this.nativeAudio.preloadSimple("id1","assets/audio/bite.mp3").then((loaded)=>{
              console.log("got preloaded");
          },(err)=>{
              this.utilityserservice.presentToast(err,2);
          });
          this.nativeAudio.preloadSimple("id2","assets/audio/splat.mp3").then((loaded)=>{},(err)=>{});
      },(err)=>{
          console.log("error in platform");
      })*/
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }

    ionViewDidEnter() {
        //this.navCtrl.push("SectionPage",{"sectionid": 1, "sectionnumber": 1});
        //check for locally stored law
        this.storage.get("law")
            .then((law)=>{
                if(law){
                    this.Law = law.sections;
                }else{
                    //if no law was fetched
                    let postdata = {"getlaw": true};
                    let law = this.httpservice.postStuff("/api/paragraph/index.php", postdata)
                        .subscribe((data)=>{
                            //store data
                            let result = data.result;
                            if(result != "0"){
                                this.storage.set("law",result)
                                    .then((lawstored)=>{
                                        this.utilityserservice.presentToast("law set",1);

                                    }).catch((storingerr)=>{
                                        this.utilityserservice.presentToast("unable to store law "+ storingerr,1);

                                    })
                            }
                        },(httperr)=>{
                            this.utilityserservice.presentToast("Bad network "+ httperr.message,1);

                        })
                }
            }).catch((err)=>{
                this.utilityserservice.presentToast("storage error "+err.message,1);

            });


        //get langcode that is the translation mode;
        //set language
        this.storage.get("LangCode")
            .then((langcode)=>{
                this.LangCode = langcode;
                //this.utilityservice.presentToast('get stored date'+this.LangCode,1);
            }).catch((err)=>{
                //this.utilityservice.presentToast('unable to get stored date',1);
            });
        console.log('ionViewDidLoad WelcomePage');
    }

    LangCode: any;

    updateLangCode(){
        //set language
        this.storage.get("LangCode")
            .then((langcode)=>{
                this.LangCode = langcode;
                //this.utilityservice.presentToast('get stored date'+this.LangCode,1);
            }).catch((err)=>{
                //this.utilityservice.presentToast('unable to get stored date',1);
            });
    }

    pushPageWithParameters(PageString , Params: any){
        /*this.nativeAudio.play("id1").then((played)=>{
            console.log("played");
        },(err)=>{
            this.utilityserservice.presentToast(err,1);
        });*/
        this.utilityserservice.playSound(2);
        this.navCtrl.push(PageString,Params);
    }

    pushPage(page){
        this.navCtrl.push(page);
    }


}
