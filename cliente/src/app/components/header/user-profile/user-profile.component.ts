import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import { UserDataService } from '../../../services/user-data.service';
import { UserServiceService} from '../../../services/user-service.service';

import { UserProfile } from '../../../dataModels/userProfile';
import { ToastrService } from 'ngx-toastr';
import { url } from 'inspector';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  profileForm;
  editProfile: boolean;
  otherAddress: boolean;
  userProfile: UserProfile;
  idClient: string;
  address: string;
  email: string;
  orders: number;
  discounts: string;
  successUpdate: boolean;
  errorUpdate: boolean = false;
  showButtonCart: boolean;
  urlComeBack: string;

  constructor(private profileFormBuilder: FormBuilder,
              private activeRoute: ActivatedRoute,
              private UserDataService: UserDataService,
              private userService: UserServiceService,
              private router: Router,
              private toastr: ToastrService) {

    this.profileForm = this.profileFormBuilder.group({

      nameUser: '',
      subname: '',
      email: '',
      phone: '',
      dni: '',
      birthday: '',
      billingStreet: '',
      billingPostalCode: '',
      billingTown: '',
      province: '',
      country: '',
      sendAddress: '',
      street: '',
      postalCode2: '',
      sendTown: '',
      sendProvince: '',
    });
  }

  ngOnInit() {
    console.log(2);
    const url: Observable<string> = this.activeRoute.url.pipe(map(segments => segments.join('/')));;
    this.userService.setPreviousPath(JSON.parse(localStorage.getItem('currentPath')));
    url.subscribe(currentUrl => this.userService.setPath(currentUrl));

    this.editProfile = true;
    let userProfile1 = this;
    let idUser = this.activeRoute.snapshot.params.idUser;
    this.UserDataService.getUserProfile(idUser).subscribe(function (response) {
      if (response.body.code == 200) {
        let birthay = (response.body.birthday != "")? (response.body.birthday.split("-")[2] + "/" + response.body.birthday.split("-")[1] + "/" + response.body.birthday.split("-")[0]) : "";
        let billingAddress = (response.body.billingAddress != "") ? response.body.billingAddress : "";
        let billingPostalCode = (response.body.billingPostalCode != "") ? response.body.billingPostalCode: "";
        let billingTown = (response.body.billingTown != "") ? response.body.billingTown : "";
        let province = (response.body.province != "") ? response.body.province : "";
        let  postalCode2 = (response.body.postalCode2 != "") ? response.body.postalCode2 : "";
        let sendTown = (response.body.sendTown != "") ? response.body.sendTown : "";
        let sendProvince =  (response.body.sendProvince != "") ? response.body.sendProvince : "";
        let streetSend = (response.body.sendAddress != "") ? response.body.sendAddress : "";
        userProfile1.email = response.body.email;
        userProfile1.profileForm.patchValue({ email: userProfile1.email });
        userProfile1.profileForm.controls['email'].disable();
        userProfile1.profileForm.patchValue({ nameUser: response.body.name });
        userProfile1.profileForm.patchValue({ subname: response.body.subname });
        userProfile1.profileForm.patchValue({ dni: response.body.dni });
        userProfile1.profileForm.patchValue({ birthday: birthay});
        userProfile1.profileForm.patchValue({ phone: response.body.phone });
        userProfile1.profileForm.patchValue({ billingStreet: (billingAddress != "") ? billingAddress : ""});
        userProfile1.profileForm.patchValue({billingPostalCode: billingPostalCode});
        userProfile1.profileForm.patchValue({billingTown: billingTown});
        userProfile1.profileForm.patchValue({province: province});
        userProfile1.profileForm.patchValue({postalCode2: postalCode2});
        userProfile1.profileForm.patchValue({sendTown: sendTown});
        userProfile1.profileForm.patchValue({sendProvince: sendProvince});
        userProfile1.profileForm.patchValue({country: "España"});
        userProfile1.profileForm.patchValue({street: streetSend});
        userProfile1.idClient = response.body.idClient;
        if (response.body.sendAddress != "") {
          userProfile1.profileForm.patchValue({ sendAddress: true });
          userProfile1.otherAddress = true;
        };
        userProfile1.orders = response.body.orders;
        userProfile1.discounts = response.body.discount;
      };
    });

    if(this.activeRoute.snapshot.queryParams.url == "cart") {
      this.showButtonCart =  true;
    }
  };

  onSubmit(profileData) {
    let idUser = this.activeRoute.snapshot.params.idUser;

    if (profileData.nameUser == null || profileData.nameUser  == undefined || profileData.nameUser == "" ) {
      this.toastr.error("El nombre es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.subname == null || profileData.subname  == undefined || profileData.subname == "" ) {
      this.toastr.error("El apellido es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.phone == null || profileData.phone  == undefined || profileData.phone == "" ) {
      this.toastr.error("El teléfono es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.dni == null || profileData.dni  == undefined || profileData.dni == "" ) {
      this.toastr.error("El DNI es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.birthday == null || profileData.birthday  == undefined || profileData.birthday == "" ) {
      this.toastr.error("La fecha de nacimiento es obligatoria", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.birthday.indexOf("-") == -1 && profileData.birthday.indexOf("/") == -1) {

      this.toastr.error("La fecha introducida tiene un formato incorrecto", "", {
        timeOut: 2000
      });
      return;
    } else if (profileData.birthday.indexOf("-") != -1) {
      profileData.birthday = (profileData.birthday.split("-")[0].length != 4) ? profileData.birthday.split("-")[2] + "-"
                              + profileData.birthday.split("-")[1] + "-" + profileData.birthday.split("-")[0] : profileData.birthday;
    } else {
      profileData.birthday = (profileData.birthday.split("/")[0].length != 4) ? profileData.birthday.split("/")[2] + "-"
      + profileData.birthday.split("/")[1] + "-" + profileData.birthday.split("/")[0] : profileData.birthday.replace(/\//g, "-");
    };

    if (profileData.billingStreet == null || profileData.billingStreet  == undefined || profileData.billingStreet == "" ) {
      this.toastr.error("La dirección es obligatoria", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.billingPostalCode == null || profileData.billingPostalCode  == undefined || profileData.billingPostalCode == "" ) {
      this.toastr.error("El código postal es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }
debugger;
    if (profileData.billingTown == null || profileData.billingTown  == undefined || profileData.billingTown == "" ) {
      this.toastr.error("El municipio es obligatorio", "", {
        timeOut: 2000
      });
      return;
    }

    if (profileData.province == null || profileData.province  == undefined || profileData.province == "" || profileData.province == "Seleccione Provincia") {
      this.toastr.error("La provincia es obligatoria", "", {
        timeOut: 2000
      });
      return;
    }
    

    if (!profileData.sendAddress) {
      profileData.street  = "";
      profileData.postaCode2 = "";
      profileData.sendProvince= "";
      profileData.sendTown  = "";
    } else {
      if (profileData.street == null || profileData.street  == undefined || profileData.street == "" ) {
        this.toastr.error("La dirección de envío es obligatoria", "", {
          timeOut: 2000
        });
        return;
      }

      if (profileData.postalCode2 == null || profileData.postalCode2  == undefined || profileData.postalCode2 == "" ) {
        this.toastr.error("El código postal de la dirección de envío es obligatorio", "", {
          timeOut: 2000
        });
        return;
      }

      if (profileData.sendTown == null || profileData.sendTown  == undefined || profileData.sendTown == "" ) {
        this.toastr.error("El municipio de la dirección de envío es obligatorio", "", {
          timeOut: 2000
        });
        return;
      }

      if (profileData.sendProvince == null || profileData.sendProvince  == undefined || profileData.sendProvince == "" || profileData.sendProvince == "Seleccione Provincia" ) {
        this.toastr.error("La provincia de la dirección de envío es obligatoria", "", {
          timeOut: 2000
        });
        return;
      }
    }

    this.userProfile = {
      name: profileData.nameUser,
      subname: profileData.subname,
      dni: profileData.dni,
      phone: profileData.phone,
      birthday: profileData.birthday,
      email: this.email,
      billingAddress: profileData.billingStreet,
      billingPostalCode: profileData.billingPostalCode,
      billingTown: profileData.billingTown,
      province: profileData.province,
      sendAddress: profileData.street,
      postalCode2: profileData.postalCode2,
      sendTown: profileData.sendTown,
      sendProvince: profileData.sendProvince,
      code: 0,
      error: false,
      message: "Actualizando Perfil de usuario",
      idClient: this.idClient,
      idUser: idUser,
      orders: this.orders,
      discount: this.discounts
    };

    let userInfo = this;
    this.urlComeBack = this.userService.getPreviousPath();
    
    debugger;
    this.UserDataService.updateUserProfile(this.userProfile).subscribe(function (response) {
      if (response.body.code == 200) {
        userInfo.toastr.success("Los datos se han guardado correctamente", "", {
          timeOut: 2000
        });
        if(userInfo.activeRoute.snapshot.queryParams.url == "cart") {
          let urlRedirect = "/paymentsMethod/" +  userInfo.userProfile.idClient;
          let  params  = userInfo.userProfile.idUser;
          userInfo.router.navigate([urlRedirect], { queryParams: { idUser: params }});
        } else {
          if (userInfo.urlComeBack != null && userInfo.urlComeBack != "") {
            userInfo.userService.setPath(userInfo.urlComeBack);
            userInfo.userService.setPreviousPath(userInfo.router.url);
            userInfo.router.navigate([userInfo.urlComeBack]);
          } else {
            userInfo.router.navigate(["/home"]);
          }
        }
      } else {
        userInfo.toastr.error("Los datos no se han podido guardar. Inténtelo más tarde", "", {
          timeOut: 2000
        });
      }
    })
  };

  createAddress(street: string, num: string, portal: string, floor: string, door: string, codePostal: string, town: string, municipe: string) {
    let address = "";
    address = (street != undefined && street != "") ? street + "-" : "";
    address += (num != undefined && num != "") ? num + "-" : "-";
    address += (portal != undefined && portal != "") ? portal + "-" : "-";
    address += (floor != undefined && floor != "") ? floor + "-" : "-";
    address += (door != undefined && door != "") ? door + "-" : "-";
    address += (codePostal != undefined && codePostal != "") ? codePostal + "-" : "-";
    address += (town != undefined && town != "") ? town + "-" : "-";
    address += (municipe != undefined && municipe != "") ? municipe : "-";
    return address;
  };

  comeBack() {
    debugger;
    let urlComeBack = this.userService.getPreviousPath(); 
    // const url: Observable<string> = this.activeRoute.url.pipe(map(segments => segments.join('/')));;
    // this.userService.setPreviousPath(JSON.parse(localStorage.getItem('currentPath')));
    // url.subscribe(currentUrl => this.userService.setPath(currentUrl));
    this.userService.setPath(urlComeBack);
    this.userService.setPreviousPath(this.router.url);
    if (urlComeBack != null && urlComeBack != "") {
      this.router.navigate([urlComeBack]);
    } else {
      this.router.navigate(["/home"]);
    } 
  };

  comeBackCart() {
    let urlBack  = "/home/cart";
    this.router.navigate([urlBack]);
  }

}
