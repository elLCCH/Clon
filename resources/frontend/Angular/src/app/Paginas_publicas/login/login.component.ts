import { AppComponent } from '../../app.component';
import {Component,OnInit} from '@angular/core';
import {  FormControl,  FormGroup} from '@angular/forms';
import {  Router} from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  admin = [];
  Auth;
  admin1;
  Administrador = new FormGroup({
    Foto: new FormControl(''),
    Ap_Paterno: new FormControl(''),
    Ap_Materno: new FormControl(''),
    Nombre: new FormControl(''),
    Sexo: new FormControl(''),
    FechNac: new FormControl(''),
    CI: new FormControl(''),
    Password: new FormControl(''),
    Tipo: new FormControl(''),
    curso_id: new FormControl(''),
    Estado: new FormControl('')
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    var sesion = localStorage.getItem('sesion');
    this.admin1 = JSON.parse(localStorage.getItem('sesion'));
    if (sesion != null) { //SI YA EXISTE LA SESION ENTONCES REDIRECCIONAR A INICIO
      this.router.navigate(['/']);
    }
    this.Auth = false;
  }
  // inputValue:AppComponent;
  Registrarse() {
    document.querySelector("#sign-up-btn");
    document.getElementById('sign-up-btn').classList.add("sign-up-mode");
    // document.getElementById('wrapper').classList.toggle("toggled")
    // document.getElementById("sideNavigation").style.width = "250px";
    // container.classList.add("sign-up-mode");
    // sign_up_btn.addEventListener("click", () => {

    // });
  }
  
  
  autenticar() {
    const formData = new FormData();
    formData.append('Foto', this.Administrador.value.Foto);
    formData.append('Ap_Paterno', this.Administrador.value.Ap_Paterno);
    formData.append('Ap_Materno', this.Administrador.value.Ap_Materno);
    formData.append('Nombre', this.Administrador.value.Nombre);
    formData.append('Sexo', this.Administrador.value.Sexo);
    formData.append('FechNac', this.Administrador.value.FechNac);
    formData.append('CI', this.Administrador.value.CI);
    formData.append('Password', this.Administrador.value.Password);
    formData.append('Tipo', this.Administrador.value.Tipo);
    formData.append('curso_id', this.Administrador.value.curso_id);
    formData.append('Estado', this.Administrador.value.Estado);

    axios({
        method: 'post',
        url: this.ruta + 'api/AdministrativoAUTH', //llamada a Autentificar del AdministrativosController
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        // OBTENER RETURN DE CONTROLLER
        // var mail = res.data[0].correo;
        // var pass = res.data[0].password;
        // var correo:string  = mail.toString();
        // var password:string  = pass.toString();
        // console.log(correo,password);

        var x = res;

        console.log(x.data);
        if (x.data != 'NOLOG') {
          console.log('SE LOGEO CORRECTAMENTE');
          console.log(res);
          if (x.data.Estado == "ACTIVO" && x.data.Tipo == "ADMINISTRATIVO") {
            localStorage.setItem('l', 'службаданныхlcch'); //ESTE APARTADO ES PARA GUARDAR SESSION l PARA LOS ADMINs
            localStorage.setItem('numberADD', res.data.id);
            //   //mantener sesion activa //GUARDAR EN LOCALSTORAGE

            //  //Imaginate que el usuario añadio a favorito estos coches
            let carListFav = res;

            //Miramos si ya hemos guardado algo anteriormente.
            let recoveredData = localStorage.getItem('sesion')
            if (recoveredData == null) {
              //No tenemos nada guardado, por lo cual vamos a guardar el carListFav
              localStorage.setItem('sesion', JSON.stringify(carListFav))
            } else {
              //Tenemos algo, por lo cual vamos a añadir un nuevo coche
              localStorage.setItem('sesion', JSON.stringify(carListFav))
            }

            //Check si se guardo bien
            console.log(localStorage.getItem('sesion'));
            //REDIRECCIOANR A LA PAGINA PRINCIPAL
            // window.location.href = window.location.href; HACE F5 o recarga la pagina
            // this.router.navigateByUrl('/mnav', { skipLocationChange: true }).then(() => {
            //   this.router.navigate(['/']);
            // }); 


            // window['variable'] = 'ASD';
            this.router.navigate(['/']);

            // this.CargarAdmin();
          }
          //ESTO ES PARA LOS DOCENTES QUE QUIEREN INICIAR SESION
          console.log('SE LOGEO CORRECTAMENTE');
          console.log(res);
          if (x.data.Estado == "ACTIVO" && x.data.Tipo == "DOCENTE") {
            localStorage.setItem('l', 'службаданныхellcch'); //ESTE APARTADO ES PARA GUARDAR SESSION l PARA LOS ADMINs QUE SON DOCENTES
            localStorage.setItem('numberADD', res.data.id);
            //   //mantener sesion activa //GUARDAR EN LOCALSTORAGE

            //  //Imaginate que el usuario añadio a favorito estos coches
            let carListFav = res;

            //Miramos si ya hemos guardado algo anteriormente.
            let recoveredData = localStorage.getItem('sesion')
            if (recoveredData == null) {
              //No tenemos nada guardado, por lo cual vamos a guardar el carListFav
              localStorage.setItem('sesion', JSON.stringify(carListFav))
            } else {
              //Tenemos algo, por lo cual vamos a añadir un nuevo coche
              localStorage.setItem('sesion', JSON.stringify(carListFav))
            }

            //Check si se guardo bien
            console.log(localStorage.getItem('sesion'));
            //REDIRECCIOANR A LA PAGINA PRINCIPAL
            //window.location.href = window.location.href;
            this.router.navigate(['/']);

            // this.CargarAdmin();
          }
        } else {
          this.Auth = true;
        }

      })
      .catch(error => {
        // console.log('ERROR AL LOGEARSE');
        // this.Auth=true;
        console.log('BUSCANDO POR ESTUDIANTES');


        //SI NO EXISTE ADMIN ENTONCES BUSCAR LISTA DE ESTUDIANTES
        axios({
            method: 'post',
            url: this.ruta + 'api/EstudianteAUTH',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(res => {
            // OBTENER RETURN DE CONTROLLER
            // var mail = res.data[0].correo;
            // var pass = res.data[0].password;
            // var correo:string  = mail.toString();
            // var password:string  = pass.toString();
            // console.log(correo,password);

            var x = res;

            console.log(x.data);
            if (x.data != 'NOLOG') {
              console.log('SE LOGEO CORRECTAMENTE');
              console.log(res);
              if (x.data.Estado == "ACTIVO") {
                //mantener sesion activa //GUARDAR EN LOCALSTORAGE
                //Imaginate que el usuario añadio a favorito estos coches
                let carListFav = res;
                //Miramos si ya hemos guardado algo anteriormente.
                let recoveredData = localStorage.getItem('sesion')
                if (recoveredData == null) {
                  //No tenemos nada guardado, por lo cual vamos a guardar el carListFav
                  localStorage.setItem('sesion', JSON.stringify(carListFav))
                } else {
                  //Tenemos algo, por lo cual vamos a añadir un nuevo coche
                  localStorage.setItem('sesion', JSON.stringify(carListFav))
                }

                //Check si se guardo bien
                console.log(localStorage.getItem('sesion'));
                //window.location.href = window.location.href;
                this.router.navigate(['/']);

                // this.CargarAdmin();
              } else {
                this.Auth = true;
              }
            } else {
              console.log('ERROR AL LOGEARSE');
              this.Auth = true;
            }


          })
          .catch(error => {
            console.log('ERROR AL LOGEARSE');
            this.Auth = true;
            // console.log(error);


          })
      })
  }
}
