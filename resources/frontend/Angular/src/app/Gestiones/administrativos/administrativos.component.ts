import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import axios from 'axios';
import { HerramientasService } from 'src/app/services/herramientas.service';

@Component({
  selector: 'app-administrativos',
  templateUrl: './administrativos.component.html',
  styleUrls: ['./administrativos.component.css']
})
export class AdministrativosComponent implements OnInit {
  @ViewChild('CerrarBoton') cerrarBtn;
  @ViewChild('CerrarBotonMod') cerrarBtnMod;
  @ViewChild('btnModalCursos') btnmodalCursos; //para abrir el modal de cargar cursos
  txtGG = '';
  ruta = 'http://localhost:8000/';
  admin =[ ];
  curso=[ ];
  AdministrativoSeleccionado = {
    id:'',
    Foto:'',
    Ap_Paterno:'',
    Ap_Materno:'',
    Nombre:'',
    Sexo:'',
    FechNac:'',
    CI:'',
    Password:'',
    Tipo:'',
    curso_id:'',
    Estado:''
  };


  newAdministrativo = new FormGroup({
    Foto:new FormControl(''),
    Ap_Paterno:new FormControl(''), //CHOQUE
    Ap_Materno:new FormControl(''), //FLORES
    Nombre:new FormControl(''),
    Sexo:new FormControl(''),
    FechNac:new FormControl(''),
    CI:new FormControl(''),
    Password:new FormControl(''),
    Tipo:new FormControl(''),
    curso_id:new FormControl(''),
    Estado:new FormControl('')
  });

  constructor(protected _Tools:HerramientasService) { }

ngOnInit(): void {
  let rootVar = window['rutacion'];
    this.ruta = rootVar;
  this.CargarAdministrativo();
  //this.CargarCurso();
}
CargarAdministrativo() {
axios.get(this.ruta+'api/Administrativo')
.then(res => {
  console.log(res.data);

  res.data.forEach(element => {
    element.Editando=false;
  });
  this.admin = res.data;
  // this._Tools.MostrarMensaje('success','DATO AGREGADO EXITOSAMENTE')
}).catch(err =>  {
console.log("err",err);
this._Tools.MostrarMensaje('error','OCURRIO UN ERROR AL CARGAR INFORMACION')
});



    // axios.get(this.ruta+'api/Administrativo')
    //       .then(res =>{
    //         console.log("OBTENIENDO ADMINs");
    //         console.log(res.data);
    //         res.data.forEach(element => {
    //           element.Editando=false;
    //         });
    //         this.est = res.data;
    //       }).catch(error =>{
    //         console.log("hay error");
    //         console.log(error);
    //       })
  }
  curso1roS=[ ];
  curso2doS=[ ];
  curso3roS=[ ];
  curso1roM=[ ];
  curso2doM=[ ];
  curso3roM=[ ];
  curso1roB=[ ];
  curso2doB=[ ];
  curso3roB=[ ];
  iniciacionbasico = [ ];
  intermediosuperior = [ ];
  filterCursos= '';


  position = new FormControl('below');
  async CargarCurso()
  {
    // var Agrupacion:any = await this.AgruparCurso('INICIACION'); this.iniciacion = Agrupacion;
    var Agrupacion:any = await this.AgruparCurso();
    console.log(Agrupacion);
    this.iniciacionbasico = Agrupacion;
    //RECIEN CARGAR LA INFORMACION DE CURSOS
    this.btnmodalCursos.nativeElement.click();
  }
  async AgruparCurso() {
    const formData = new FormData();
      console.log(this.AdministrativoSeleccionado.id);
      formData.append('admin_id',this.AdministrativoSeleccionado.id);
      // formData.append('curso_id',CursoID);
      var request = await axios(
      {
        method:'get',
        url:this.ruta+'api/ListaAgrupacionMateriasXCursos/'+this.AdministrativoSeleccionado.id,
        data:formData,
        headers:{'Content-Type':'multipart/form-data'}
      })
      .then(res=>{
        console.log("OBTENIENDO LISTA DE MATERIAS");
          console.log(res.data);
          res.data.forEach(async element => {
            element.Editando=false;
            //REALIZACION DE VERIFICACION EN TABLA DEBIL ADMIN_CURSOS
            var AdminID = this.AdministrativoSeleccionado.id; //ADMIN SELECCIONADO
            var CursoID = element.id; //CURSOS EN GENERAL POR ITERACION
            // console.log("admin",AdminID);
            // console.log("curso",CursoID);
            // console.log("ITERACION");
            //debemos mandar los parametros a consultar:

            //SI EXISTE ENTONCES checked
            if (element.Existencia == "ACTIVADO") {
              element.Chequeo="checked";
              element.Disable = false;
            } else {


              if (element.Existencia == "ACTIVO") {
                element.Chequeo="";
                element.Disable = true;
              } else {
                element.Chequeo="";
                element.Disable = false;
              }


            }
          });
          console.log('RESDATA',res.data);
          return res.data;
      })
      console.log('VEEDOR',request);
      return request;






      // console.log(Grupo);
      // var request = await axios.get(this.ruta+'api/ListaAgrupacionMateriasXCursos?tipo='+Grupo)
      // // axios.get(this.ruta+'api/curso') //PARA CARGAR A TODOS
      //   .then(res =>{
      //     console.log("OBTENIENDO LISTA DE MATERIAS");
      //     console.log(res.data);
      //     res.data.forEach(async element => {
      //       element.Editando=false;
      //       //REALIZACION DE VERIFICACION EN TABLA DEBIL ADMIN_CURSOS
      //       var AdminID = this.AdministrativoSeleccionado.id; //ADMIN SELECCIONADO
      //       var CursoID = element.id; //CURSOS EN GENERAL POR ITERACION
      //       console.log("admin",AdminID);
      //       console.log("curso",CursoID);
      //       console.log("ITERACION");
      //       //debemos mandar los parametros a consultar:
      //       var resultado = await this.VerificarExistencia(AdminID,CursoID);
      //       //SI EXISTE ENTONCES checked
      //       if (resultado.data == "EXISTE") {
      //         element.Chequeo="checked";
      //       } else {
      //         element.Chequeo="";
      //       }
      //     });
      //     console.log('RESDATA',res.data);
      //     return res.data;
      //     // this.curso = res.data;
      //   }).catch(error =>{
      //     console.log("hay error");
      //     console.log(error);
      //   })
      //   return request;
  }
   async VerificarExistencia(AdminID,CursoID) {
    const formData = new FormData();
    console.log("AdminVerificacion",AdminID);
    console.log("CursoVerificacion",CursoID);
              formData.append('admin_id',AdminID);
              formData.append('curso_id',CursoID);
    var request = await axios(
      {
        method:'post',
        url:this.ruta+'api/PruebaExistencia',
        data:formData,
        headers:{'Content-Type':'multipart/form-data'}
      })
      .then(res=>{
        console.log('LA PRUEBA SE REALIZÓ CORRECTAMENTE',res);
        return res;
      })
      console.log('VEEDOR',request.data);
    return request;
  }
  ParaCargarListadoEstudiantesAdmin(CursoListar) {
    // NiveldeCurso='SEGUNDO MEDIO';
    sessionStorage.setItem('CursoParalelo', CursoListar);
    // this.router.navigate(['/Paralelos']);
    window.open('Paralelos', '_blank');

  }
  AgregarDocenteCurso(event, itemCurso)
  {
    if ( event.target.checked ) {
      //CUANDO NO ESTA CHECKED AL HACER CLICK ESTE SE ACTIVA POR LO TANTO AGREGAR
      var AdminID = this.AdministrativoSeleccionado.id; //ADMIN SELECCIONADO
      var CursoID = itemCurso.id; //CURSOS EN GENERAL POR ITERACION
      console.log('ADMIN',AdminID);
      console.log('CURSO',CursoID);
      const formData = new FormData();
      formData.append('curso_id',CursoID);
      formData.append('admin_id',AdminID);
      axios({
      method:'post',
      url:this.ruta+'api/AdminCursos',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE');
      console.log(res.data);
      // this.cerrarBtn.nativeElement.click();
      // this.CargarAdministrativo();
    })
    .catch(error=>{
      console.log('HAY ERROR XD');
      console.log(error);
    })
      console.log('NO ESTABA CHECKED');

    }
    else
    {
      //CUANDO ESTA CHECKED AL HACER CLICK ESTE SE DESACTIVA POR LO TANTO ELIMINAR
      var AdminID = this.AdministrativoSeleccionado.id; //ADMIN SELECCIONADO
      var CursoID = itemCurso.id; //CURSOS EN GENERAL POR ITERACION


      // ESTO ES OTRA MANERA DE USAR (NO FUNCIONA CUANDO HAY FOTO; POR LO TANTO USAR method POST)
      const formData = new FormData();
      formData.append('curso_id',CursoID);
      formData.append('admin_id',AdminID);
      axios({
      method:'post',
      url:this.ruta+'api/EliminarAdminCursos',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
      })


      .then(res=>{
        //OBTENER RETURN DE CONTROLLER
        // var x = res;
        // var xD:string  = x.toString();

        // console.log(xD);

        console.log('SE QUITO EL CURSO CORRECTAMENTE');

        // this.cerrarBtnMod.nativeElement.click();
        // this.CargarAdministrativo();
      })
      .catch(error=>{
        console.log('HAY ERROR AL QUITAR CURSO');
        console.log(error);
      })
        console.log('SI ESTABA CHECKED');
    }
  }
    //FUNCIONA PARTE DE LAS MANIAS
  ObtenertxtGG()
  {
    console.log(this.txtGG);
    this.txtGG;
  }
  onFileChange(event){

    if (event.target.files.length>0) {
      const file = event.target.files[0];
      this.newAdministrativo.patchValue({
        Foto: file
      })
      console.log(file);
    }
  }
  AgregarAdministrativo()
  {
    //para prueba
    // this.cerrarBtn.nativeElement.click();
    // return;
    //hasta aca
    const formData = new FormData();
    formData.append('Foto',this.newAdministrativo.value.Foto);
    formData.append('Ap_Paterno',this.newAdministrativo.value.Ap_Paterno); //CHOQUE
    formData.append('Ap_Materno',this.newAdministrativo.value.Ap_Materno); //FLORES
    formData.append('Nombre',this.newAdministrativo.value.Nombre);
    formData.append('Sexo',this.newAdministrativo.value.Sexo);
    formData.append('FechNac',this.newAdministrativo.value.FechNac);
    formData.append('CI',this.newAdministrativo.value.CI);
    formData.append('Password',this.newAdministrativo.value.Password);
    formData.append('Tipo',this.newAdministrativo.value.Tipo);
    //formData.append('curso_id',this.newAdministrativo.value.curso_id);
    formData.append('Estado',this.newAdministrativo.value.Estado);
    axios({
      method:'post',
      url:this.ruta+'api/Administrativo',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE');
      console.log(res.data);
      this.cerrarBtn.nativeElement.click();
      this.CargarAdministrativo();
    })
    .catch(error=>{
      console.log('HAY ERROR XD');
      console.log(error);
    })
  }
  MODonFileChange(event){

    if (event.target.files.length>0) {
      const file = event.target.files[0];
      this.newAdministrativo=file;
      console.log(file);
    }
  }
  ModificarAdministrativo(Administrativo)
  {
    Administrativo.Editando=false;

    const formData = new FormData();
    formData.append('Foto',this.newAdministrativo.value.Foto);
    formData.append('Ap_Paterno',Administrativo.Ap_Paterno); //PEDRO
    formData.append('Ap_Materno',Administrativo.Ap_Materno);
    formData.append('Nombre',Administrativo.Nombre);
    formData.append('Sexo',Administrativo.Sexo);
    formData.append('FechNac',Administrativo.FechNac);
    formData.append('CI',Administrativo.CI);
    formData.append('Password',Administrativo.Password);
    formData.append('Tipo',Administrativo.Tipo);
    // formData.append('curso_id',Administrativo.curso_id);
    formData.append('Estado',Administrativo.Estado);
    axios({
      method:'post',
      url:this.ruta+'api/AdministrativoUpdate/'+Administrativo.id,
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })

    // ESTO ES OTRA MANERA DE USAR (NO FUNCIONA CUANDO HAY FOTO; POR LO TANTO USAR method POST)
  // axios.put(this.ruta+'api/Administrativo/'+Administrativo.id, {
  //     Foto:this.newAdministrativo.value.Foto,
  //     Ap_Paterno: Administrativo.Ap_Paterno,
  //     Ap_Materno: Administrativo.Ap_Materno,
  //     Nombre: Administrativo.Nombre,
  //     Sexo: Administrativo.Sexo,
  //     FechNac: Administrativo.FechNac,
  //     CI: Administrativo.CI,
  //     Nombre_Padre: Administrativo.Nombre_Padre,
  //     OcupacionP: Administrativo.OcupacionP,
  //     Nombre_Madre: Administrativo.Nombre_Madre,
  //     OcupacionM: Administrativo.OcupacionM,
  //     Direccion: Administrativo.Direccion,
  //     Telefono: Administrativo.Telefono,
  //     Celular: Administrativo.Celular,
  //     NColegio: Administrativo.NColegio,
  //     TipoColegio: Administrativo.TipoColegio,
  //     CGrado: Administrativo.CGrado,
  //     CNivel: Administrativo.CNivel,
  //     Especialidad: Administrativo.Especialidad,
  //     Password: Administrativo.Password,
  //     Estado: Administrativo.Estado
  // })


    .then(res=>{
      //OBTENER RETURN DE CONTROLLER
      // var x = res;
      // var xD:string  = x.toString();

      // console.log(xD);

      console.log('SE MODIFICO CORRECTAMENTE');
      console.log(res);
      this.cerrarBtnMod.nativeElement.click();
      this.CargarAdministrativo();
    })
    .catch(error=>{
      console.log('HAY ERROR AL MODIFICAR');
      console.log(error);
    })
  }
  EliminarAdministrativo(Administrativo)
  {

    if(confirm("Seguro que desea Eliminar Administrativo? ")) {
        // const IdAdmin = 3;
    // const formData = new FormData();
    // formData.append('NombreAdministrativo',Administrativo.nombreAdministrativo);
    // formData.append('NivelAdministrativo',Administrativo.nivelAdministrativo);

    axios({
      method:'delete',
      url:this.ruta+'api/Administrativo/'+Administrativo.id
    })
    .then(res=>{
      console.log('SE ELIMINO CORRECTAMENTE');
      console.log(res);
      this.CargarAdministrativo();
    })
    .catch(error=>{
      console.log('HAY ERROR AL BORRAR');
      console.log(error);
    })
    }
  }
}
