import { Component,OnInit,  ViewChild } from '@angular/core';
import { Platform,Nav, MenuController, AlertController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { UtilityservicesProvider } from '../providers/utilityservices/utilityservices';


import { WelcomePage } from '../pages/welcome/welcome';
@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  rootPage:any = WelcomePage;
    @ViewChild("nav1") public nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private httpservice: HttpserviceProvider,
              private storage: Storage, private utilityservice: UtilityservicesProvider, public menuCtrl: MenuController,
              private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }


    /*ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');
    }*/
    private Law: Array<any>;
    private LangCode: any;

    ngOnInit() {

        this.updateLangCode();

        //check for locally stored law
        this.storage.get("law")
            .then((law)=>{
                if(law){
                    this.Law = law.sections;
                    //alert(law.sections[0].title);
                }else{
                    //if no law was fetched
                    this.loadLaw();
                }
            }).catch((err)=>{
                this.utilityservice.presentToast("storage error: unable to fetch the law "+err.message,1);
            });


        console.log('ionViewDidLoad WelcomePage');
    }


    updateLaw(){
        /*let loader = this.loadingCtrl.create({
            "content": message,
            "showBackdrop": true,
            "enableBackdropDismiss": true,
            "dismissOnPageChange": true
        });
        loader.present();
        return loader;*/

        //let loader = this.utilityservice.presentLoading("loading pls wait");
        this.updateLangCode();
        this.loadLaw();

    }

    updateLangCode(){
        //set language
        this.storage.get("LangCode")
            .then((langcode)=>{
                this.LangCode = langcode;
                //this.utilityservice.presentToast('get stored date'+this.LangCode,1);
            }).catch((err)=>{
                this.utilityservice.presentToast('unable to get stored date',1);
            });
    }
    menuWillOpen(){
        this.updateLangCode();
    }


    loadLaw(){
        let postdata = {"getlaw": true};
        let loader = this.utilityservice.presentLoading("loading please wait");

        let law = this.httpservice.postStuff("/api/paragraph/index.php", postdata)
            .subscribe((data)=>{
                //store data
                let result = data.result;
                if(result != "0"){
                    this.storage.set("law",result)
                        .then((lawstored)=>{
                            this.utilityservice.presentToast("Disability law is set successfully", 1);
                        }).catch((storingerr)=>{
                            this.utilityservice.presentToast("unable to save law, try again, check permissions"+storingerr, 1);
                        })
                }
                this.utilityservice.dismissLoader(loader);
            },(httperr)=>{
                this.utilityservice.dismissLoader(loader);
                this.utilityservice.presentToast("Bad Or No Internet Connection, try again "+httperr.message,1);
            })
    }


    selectLanguage(LangCode){
        this.utilityservice.playSound(1);
        this.storage.set("LangCode", LangCode)
            .then((done)=>{
                this.utilityservice.presentToast("Language Selected ",1);
            }).catch((err)=>{
                this.utilityservice.presentToast("Language Not Selected "+err,1);
            });

        this.updateLangCode();
    }



    popLanguageSelector(){
        let alert = this.alertCtrl.create({
            "title": 'Select Language Translation',
            "message": "Select The Default Language Translation",
            "buttons":[
                {
                    "text": "English",
                    "handler":()=>{
                        this.selectLanguage(1)
                    }
                },
                {
                    "text": "Igbo",
                    "handler":()=>{
                        this.selectLanguage(2)
                    }
                },
                {
                    "text": "Annotation",
                    "handler":()=>{
                        this.selectLanguage(3)
                    }
                }
            ]

        });
        alert.present();
    }

    pushPage(page){
        this.menuCtrl.getOpen().close();
        this.nav.push(page);
        this.utilityservice.playSound(1);
    }


    pushPageWithParameters(PageString: String , Params: any){
        this.menuCtrl.getOpen().close();

        this.nav.push(PageString,Params);
        this.utilityservice.playSound(2);
    }

    goHome(){
        this.utilityservice.playSound(1);
        this.menuCtrl.getOpen().close();
        this.nav.setRoot(WelcomePage);


    }

}

