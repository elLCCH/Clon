import { COMPILER_OPTIONS, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  filterpost= '';

  @ViewChild('CerrarBoton') cerrarBtn;
  ruta = 'http://localhost:8000/';
  mallaGlobal=''
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    this.CargarMalla()
    // this.CargarCurso();
    // this.ListarForCentralizadorFinal('PRIMERO INICIACION A');
  }

  //#region CRUD CURSO
  curso =[ ];
  nivelSelect='';
  newCurso = new FormGroup({
    nombreCurso:new FormControl('',[Validators.required]),
    nivelCurso:new FormControl('',[Validators.required]),
    Sigla:new FormControl('',[Validators.required]),
    Tipo:new FormControl('',[Validators.required]),
    Horas:new FormControl('',[Validators.required]),
    BiTriEstado:new FormControl(''),
    Malla:new FormControl('',[Validators.required])
  });
  CargarCurso() {
    axios.get(this.ruta+'api/curso?Malla='+this.mallaGlobal)
      .then(res =>{
        console.log("OBTENIENDO ADMINs");
        console.log(res.data);
        res.data.forEach(element => {
          element.Editando=false;
        });
        this.curso = res.data;
      }).catch(error =>{
        console.log("hay error");
        console.log(error);
      })
  }

  AgregarCurso()
  {
    const formData = new FormData();
    formData.append('NombreCurso',this.newCurso.value.nombreCurso);
    formData.append('NivelCurso',this.nivelSelect+' '+this.newCurso.value.nivelCurso);
    formData.append('Sigla',this.newCurso.value.Sigla);
    formData.append('Tipo',this.newCurso.value.Tipo);
    formData.append('Horas',this.newCurso.value.Horas);
    formData.append('BiTriEstado','NINGUN BIMESTRE');
    formData.append('Malla','NUEVA '+this.newCurso.value.Malla);
    axios({
      method:'post',
      url:this.ruta+'api/curso',
      data:formData,
      headers:{'Content-Type':'multipart/form-data'}
    })
    .then(res=>{
      console.log('SE AÑADIO CORRECTAMENTE');
      console.log(res);
      this.cerrarBtn.nativeElement.click();
      this.CargarCurso();
      this.MostrarMensaje('success','SE AGREGO CORRECTAMENTE')
    })
    .catch(error=>{
      console.log('HAY ERROR XD');
      console.log(error);
      this.MostrarMensaje('danger','NO SE PUDO REALIZAR LA ACCIÓN')
    })
  }

  ModificarCurso(Curso)
  {
    Curso.Editando=false;

    // ESTO ES OTRA MANERA DE USAR
    axios.put(this.ruta+'api/curso/'+Curso.id, {
      NombreCurso: Curso.NombreCurso,
      NivelCurso:Curso.NivelCurso,
      Sigla:Curso.Sigla,
      Tipo:Curso.Tipo,
      Horas:Curso.Horas,
      BiTriEstado:Curso.BiTriEstado,
      Malla:Curso.Malla
    })
    .then(res=>{
      //OBTENER RETURN DE CONTROLLER
      // var x = res;
      // var xD:string  = x.toString();

      // console.log(xD);

      console.log('SE MODIFICO CORRECTAMENTE');
      console.log(res);
      this.CargarCurso();
      this.MostrarMensaje('success','SE MODIFICO CORRECTAMENTE')
    })
    .catch(error=>{
      console.log('HAY ERROR AL MODIFICAR');
      console.log(error);
      this.MostrarMensaje('danger','NO SE PUDO REALIZAR LA ACCIÓN')
    })
  }
  EliminarCurso(Curso)
  {
     Swal.fire({
      title: 'SEGURO QUE QUIERE ELIMINAR EL CURSO?',
      color: '#FFFFFF',
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonColor: "#DD6B55",
      cancelButtonText:'CANCELAR',
      confirmButtonText: 'ELIMINAR',
      confirmButtonColor: "#DD6B55",
      background: '#D62600',

    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('NombreCurso',Curso.nombreCurso);
        formData.append('NivelCurso',Curso.nivelCurso);

        axios({
          method:'delete',
          url:this.ruta+'api/curso/'+Curso.id
        })
        .then(res=>{
          console.log('SE ELIMINO CORRECTAMENTE');
          console.log(res);
          this.CargarCurso();
          this.MostrarMensaje('success','SE ELIMINO CORRECTAMENTE')
        })
        .catch(error=>{
          console.log('HAY ERROR AL BORRAR');
          console.log(error);
          this.MostrarMensaje('danger','NO SE PUDO REALIZAR LA ACCIÓN')
        })
          }
        })
  }
  //#endregion CRUD CURSO



  // PARA OBTENER MALLA
  malla=[]
  CargarMalla(){
    axios.get(this.ruta+'api/CargarMalla')
    .then(res => {
      console.log("Malla Cargado",res.data);
      this.malla = res.data;
    }).catch(error =>  {
    console.log('Error al Cargar Malla',error.response.data.message);
    });
  }

//#region PDF QUITAR?
  Columnas: Array<{titulo: string}> = [];
  calificacion=[]
  CargarListaCurso(idCurso)
  {
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT CONCAT(administrativos.Ap_Paterno, ' ', administrativos.Ap_Materno,' ', administrativos.Nombre) Nombre_Docente ,estudiantes.Especialidad,estudiantes.Foto,estudiantes.Sexo,`estudiantes`.`Ap_Paterno`,`estudiantes`.`Ap_Materno`,`estudiantes`.`Nombre`, `calificaciones`.* FROM `calificaciones` LEFT JOIN `estudiantes` ON `calificaciones`.`estudiante_id` = `estudiantes`.`id` LEFT JOIN `administrativos` ON `estudiantes`.`Admin_id` = `administrativos`.`id` WHERE calificaciones.curso_id = "+idCurso+" ORDER BY estudiantes.Ap_Paterno , estudiantes.Ap_Materno, estudiantes.Nombre"
    })
    .then(res => {
      console.log(res.data);
      this.calificacion = res.data;
      var keyNames = Object.keys(res.data[0] );
      keyNames.forEach(element => {
        this.Columnas.push({'titulo':element});
        // console.log('KEY', element);
      });
      console.log('KEY', this.Columnas);
      // console.log(keyNames); // Outputs ["a","b","c"]
      res.data.forEach(element => {
        element.Editando=false;
      });
    }).catch(err =>  {
    console.log("err");
    });
  }

  CentralizadorFinal=[]
  cantMaterias=0;
  forHeaders=[]
  conjdata=[] //ACA COLOCAREMOS LOS TITULOS COMO JSON

  TitlesColums: Array<{titulo: string}> = [];
  ListarForCentralizadorFinal(NivelCursoTxt){
    let data = {
      // ejemplo: atributo:this.newnombreCrud?.value.atributo,
      NivelCurso:NivelCursoTxt
    };
    axios.post(this.ruta+'api/ListarForCentralizadorFinal',data)
    .then(res=>{
      // var conjdata=[] //ACA COLOCAREMOS LOS TITULOS COMO JSON

      //OBTENER LOS TITULOS DEL res.data[0]
      var keyNames = Object.keys(res.data[0]);
      keyNames.forEach(element => {
        this.TitlesColums.push({'titulo':element});
      });
      console.log('los tittles', this.TitlesColums)
      this.TitlesColums.forEach(e => {
        this.conjdata.push(e.titulo);
      });
            //ESTO ES APARTE... ES PARA CONSTRUIR SUS HEADERS DEL GENERADOR PDF MAKEÇ
              // var Arrayconjdata=conjdata;
              // var cantidadMaterias=conjdata.length-6 //OBTENER CANTIDAD DE MATERIAS EN NIVEL
              var ArrayHeader=[]
              var ArrayMats=[]
              // for (let c = 0; c < Arrayconjdata.length; c++) {
              //   ArrayHeader.push(conjdata[c]);

              // }
              // this.

              axios.post(this.ruta+'api/ListarForHeaderFinal',this.TitlesColums)
              .then(res1=>{
                console.table(res1.data)
                this.forHeaders = res1.data;
                console.log('getCoso',this.forHeaders['0']['1'])
              })
              // ArrayHeader.push({'ASIGNATURA':})
            //HASTA ACA
      console.log('res titulos CONVERTIDOS', this.conjdata)

      //PROCEDER A CONTRUIR EL DATA DEL CENTRALIZADOR FINAL LCCH
      this.cantMaterias=this.conjdata.length-6 //OBTENER CANTIDAD DE MATERIAS EN NIVEL
      res.data.forEach(e => {
        e.Area='ACADEMICA CLASICA';
        var contRetirado=0; var contReprobado=0; var contAprobado=0;
        for (let cont = 6; cont < this.conjdata.length; cont++) {
          //VERIFICANDO MATERIA POR MATERIAS
           var title = this.conjdata[cont] //ACA TENEMOS EL NOMBRE DE LA COLUMNA
          if (e[title]!=0) {
            if (e[title]<61) {
              contReprobado++;
            } else {
              contAprobado++;
            }
          }
          else{
            contRetirado++;
            contReprobado++;
          }
        }
        //REALIZANDO DISTINTAS PRUEBAS
        if (contRetirado==this.cantMaterias) {
          //PRUEBA DEL RETIRADO => TODO CERO o CANTIDAD DE CEROS = cantMaterias
          //RETIRADO
          e.Promovido = 'NO';
          e.Observacion = 'RETIRADO';
          e.FechBaja = '04/03/2022'; //DETERMINAR FECHA HACIENDO CONSULTA APARTE REVIZANDO SUS CALIFICACIONES DEL REGISTRO
        } else {
          if (contAprobado==this.cantMaterias) {
            e.Promovido = 'SI';
            e.Observacion = 'APROBÓ';
            e.FechBaja = ' ';
          } else {
            if (NivelCursoTxt.indexOf("SUPERIOR")!== -1) { //SI EN EL TXT DE NIVEL HAY UNA PALABRA QUE TENGA SUPERIOR HACER
              //PRUEBA DEL REPROBADO / APROBADO, SUPERIOR => REPRUEBA MAX 2 IGUAL APRUEBA PERO DEBE LLEVAR SOLO ESAS 2 MATERIAS
              //SI TIENE MAS DE 2 MATERIAS REPROBADAS PIERDE EL AÑO
              if(contReprobado>2)
              {
                //REPROBADO - SUPERIOR
                e.Promovido = 'NO';
                e.Observacion = 'REPROBADO';
                e.FechBaja = ' ';
              }else{
                //APROBADO- SUPERIOR
                e.Promovido = 'SI';
                e.Observacion = 'APROBÓ C/ ARRASTRE';
                e.FechBaja = ' ';
              }
            } else {
              //PRUEBA DEL REPROBADO / APROBADO, NIVEL CAPACITACION => REPRUEBA SOLO 1 Y PIERDE TODO
              //SI TIENE 1 MATERIA REPROBADAS PIERDE EL AÑO
              if(contReprobado>0)
              {
                //REPROBADO - CAPACITACION
                e.Promovido = 'NO';
                e.Observacion = 'REPROBADO';
                e.FechBaja = ' ';
              }else{
                //APROBADO- CAPACITACION
                e.Promovido = 'SI';
                e.Observacion = 'APROBÓ';
                e.FechBaja = ' ';
              }
            }
          }
        }
      });
      this.CentralizadorFinal=res.data
      console.table(this.CentralizadorFinal)
      // console.log('tittles',JSON.stringify(this.TitlesColums)) //PARA CONVERTIR JSON UN ARRAY
    })
    .catch(error=>{
      console.log(error)
    })
  }
  openCentralizadorFinal(){
    // var headers = {
    //   fila_0:{
    //     col_0:{text:'Nº'},
    //     col_1:{text:'NOMBRE COMPLETO'},
    //     col_2:{text:'CARNET'},
    //   },
    //   fila_1:{
    //     col_0:{text:'Nº'},
    //     col_1:{text:'NOMBRE COMPLETO'},
    //     col_2:{text:'CARNET'},
    //   },
    // }

    var body=[]
    var headers = this.forHeaders
    var contColumsHeader=0   //SIRVE PARA RECORRER LA FILA [contColumsHeader][i]
    for(var key in headers){
      if (headers.hasOwnProperty(key)) {
        var header = headers[key]
        var fila = new Array();
        if(contColumsHeader==0){
          fila.push(
            {
              // border: [false ,false,false ,false],
              text: 'CURSO:PRIMERO "A"',
              colSpan: 2,
              rowSpan:4,
              style:'tittlefijosHeader'
            }
          ); //0
          fila.push(' '); //1
        }
        else{
          fila.push(''); //0
          fila.push(''); //1
        }

        switch (contColumsHeader) {
          case 0: fila.push({text:'PRERREQUISITOS',alignment: 'center',style:'tittlefijosHeader'}); //2
           break;
          case 1: fila.push({text:'HORAS ACADÉMICAS',alignment: 'center',style:'tittlefijosHeader'}); //2
            break;
          case 2: fila.push({text:'CÓDIGO',alignment: 'center',style:'tittlefijosHeader'}); //2
            break;
          case 3: fila.push({text:'ASIGNATURA',alignment: 'center',style:'tittlefijosHeader'}); //2
            break;
          // case 4: fila.push('ASIGNATURA'); //2
          //   break;
          default: console.log("NO SE PUDO PONER LA LETRA")
            break;
        }
        for (let num = 0; num < this.cantMaterias; num++) {
          fila.push({text:this.forHeaders[contColumsHeader][num],alignment: 'center',style:'tittlefijosHeader'}); //n....
        }
        contColumsHeader++
        body.push(fila);
      }
      // console.table(body)
    }
    //CALCULACION DEL MARGIN IZQUIERDA RESPECTO A LA CANTIDAD DE MATERIAS
    var valorMarginLeft=(40*(-this.cantMaterias+8))-10; //EN SI EL VALOR MAX SERIA 8(8 es cuando no debe moverse el margin)
    (this.cantMaterias<5)?valorMarginLeft=valorMarginLeft-40:valorMarginLeft=valorMarginLeft+0;
    //pero daba 0 y al dar cero pues se pegaba en la hoja y pues le damos un espacio de 2

    //COLOCAR LOS VALORES A ALOS COLS NECESARIOSS PARA BODY1(QUE ES LAS CALIF DE LOS ESTS)
    var longitudColums1= []
    //-2 x q todo el nombre yano ocupa 3 campos, sino q 1 => -2
    // peero se agregan mas datos fijos q son area, mencion,observaciones, fechbaja, promovido =  5
    //-2+5=> 3
    for (let index = 0; index < this.conjdata.length+3; index++) {
      switch (index) {
        case 0:
          longitudColums1.push(8)
          break;
        case 1:
          longitudColums1.push(92)
          break;
        case 2:
          longitudColums1.push(42)
          break;
        default:
          if (index<this.conjdata.length) {
            longitudColums1.push(43)
          } else {
            longitudColums1.push(28)
          }
          // longitudColums1.push(42)
          break;
      }
    }
    //COLOCAR SU LONGITUD A LOS COLS NECESARIOS DE BODY
    var longitudColums= []
    for (let index = 0; index < this.cantMaterias+3; index++) {
      switch (index) {
        case 0:
          longitudColums.push(8)
          break;
        case 1:
          longitudColums.push(92)
          break;
        case 2:
          longitudColums.push(42)
          break;
        default:
          longitudColums.push(43)
          break;
      }
    }
    console.log("push",longitudColums)
    console.log("conjdata",this.conjdata[6].toString())
    // PARA EL CONTENIDO DE LA TABLA USAMOS OTRO BODY1
    var rows = this.CentralizadorFinal;
    console.log("CONJUNTO DE DATOS CURSO", rows)
    var body1=[] //CONTENIDO DE LAS TABALS

    var titlesbody1=[] //ES PARA AÑADIR UNA FILA COMO TITULOS
    titlesbody1.push({ text: 'Nº',alignment: 'center',style:'tittlefijosHeader'}) //0
    titlesbody1.push({ text: 'NÓMINA',alignment: 'center',style:'tittlefijosHeader'}) //1
    titlesbody1.push({ text: 'CARNET DE IDENTIDAD',alignment: 'center',style:'tittlefijosHeader'}) //2
    for (let numTituloMateria = 6; numTituloMateria <this.conjdata.length ; numTituloMateria++) {
      titlesbody1.push({ text: 'CALIFICACIÓN FINAL',alignment: 'center',style:'tittlefijosHeader'}); //n....
    } //n...
    titlesbody1.push({ text: 'ÁREA',alignment: 'center',style:'tittlefijosHeader'})
    titlesbody1.push({ text: 'MENCIÓN',alignment: 'center',style:'tittlefijosHeader'})
    titlesbody1.push({ text: 'OBSERVACIÓN',alignment: 'center',style:'tittlefijosHeader'})
    titlesbody1.push({ text: 'FECHA BAJA',alignment: 'center',style:'tittlefijosHeader'})
    titlesbody1.push({ text: 'PROMOVIDO AL STE. CURSO',alignment: 'center',style:'tittlefijosHeader'})
    body1.push(titlesbody1); //SUBIMOS LA PRIMERA FILA COMO TITULOS

    //CONTRUIR DATOS DE CALIFICACIONES
    var contador = 0; //NO SOLO ES EL CONTADOR DE LAS FILAS; tambn es para RECORRER LA FILA [contador][i]
    for(var key in rows){
      if (rows.hasOwnProperty(key)) {
        var data = rows[key]
        var row = new Array();
        contador= contador+1;
        row.push(contador); //0
        row.push({ text: data.Ap_Paterno.toString() +' '+ data.Ap_Materno.toString()+' ' + data.Nombre.toString(),style:'tittlefijosBody'}); //1
        row.push({ text: data.CI.toString(),alignment: 'center',style:'tittlefijosBody'}); //2

        for (let numTituloMateria = 6; numTituloMateria <this.conjdata.length ; numTituloMateria++) {
          row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',style:'tittlefijosHeader'}); //n....
        } //n...
        contColumsHeader++

        row.push({ text: data.Area.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+1
        row.push({ text: data.Especialidad.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+2
        row.push({ text: data.Observacion.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+3
        row.push({ text: data.FechBaja.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+4
        row.push({ text: data.Promovido.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+5

        body1.push(row);
      }
    }

    var dd = {

      // pageMargins: [ 20, 10, 10 ,10],
      //izq, arriba,derecha,abajo
      pageMargins: [20, 40, 20, 135],
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        {
        text: 'CENTRALIZADOR DE CALIFICACIONES\n',
        fontSize: 15,
        alignment: 'center',
        bold: true
        },
        {
          columns: [
            {
              width: 250,
              text: 'NOMBRE DE LA INSTITUCION: INSTITUTO SUPERIOR DE FORMACIÓN ARTÍSTICA "MARÍA LUISA LUZIO"',
              bold:true
            },
            {
              width: 80,
              text: 'RESOLUCIÓN MINISTERIAL:',
              bold:true
            },
            {
              width: 200,
              text: 'Nº718/16(INSTITUTO), Nº 1295/18 (MALLA CURRICULAR)'
            },
            {
              width: 30,
              text: 'CARÁCTER:',
              bold:true
            },
            {
              width: '*',
              text: 'FISCAL\n'
            },
          ],
          style:'tittlefijosHeader',
          margin: [80,0,0,0]
        },
        {
          columns: [
            {
              width: 200,
              text: 'ÁREA DE FORMACIÓN ARTÍSTICA',
              bold:true
            },
            {
              width: 25,
              text: 'DISTRITO: ',
              bold:true
            },
            {
              width: 25,
              text: 'ORURO',
            },
            {
              width: 80,
              text: 'RÉGIMEN:',
              bold:true
            },
            {
              width: 100,
              text: 'ANUALIZADO'
            },
            {
              width: 20,
              text: 'NIVEL: ',
              bold:true
            },
            {
              width: 80,
              text: 'TECNICO SUPERIOR'
            },
            {
              width: 30,
              text: 'CARRERA:',
              bold:true
            },
            {
              width: '*',
              text: 'MÚSICA\n\n\n'
            },
          ],
          style:'tittlefijosHeader',
          margin: [80,0,0,0]
        },
        {
          // style: 'tableExampleHeader',
          color: '#444',
          table: {
            widths: longitudColums,
            // headerRows:2,
            // keepWithHeaderRows: 1,
            body: body
          },
          margin: [valorMarginLeft,0,0,0]
        },
        {
          style: 'tableExampleHeader',
          color: '#444',
          table: {
            widths: longitudColums1,
            // headerRows:2,
            // keepWithHeaderRows: 1,
            body: body1
          },
          margin: [valorMarginLeft,0,0,0]
        },

      ],
      styles: {
        tittlefijosHeader:{ //TODO SOBRE EL BODY
          fontSize:5,
          bold: true
        },
        tableExampleBody:{ //CONTENIDO DEL BODY1
          bold:false,
          fontSize:5,
        },

        // allgral: {
        //   bold: false,
        //   // fontSize: 11,
        //   color: 'black'
        // },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableExampleHeader:{
          bold:true,
          fontSize:5,
        }


      }


    }
    pdfMake.createPdf(dd).open();
  }
//#endregion PDF QUITAR?
  MostrarMensaje(iconText,tittleText){
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
    Toast.fire({
      icon: iconText, //success, info, error,warning,question
      title: tittleText
    })
  }
  BimestreMod;
  ModificarBimestres(){
    Swal.fire({
      title: '¿SEGURO QUE QUIERE MODIFICAR EL BIMESTRE PARA TODOS LOS CURSOS DE LA ACTUAL MALLA (MALLA '+this.mallaGlobal+')?',
      text:'AL PRESIONAR EN "SI" SE MODIFICARA EL ESTADO DE BIMESTRE PARA TODOS LOS CURSOS',
      color: '#FFFFFF',
      showDenyButton: false,
      showCancelButton: true,
      cancelButtonColor: "secondary",
      cancelButtonText:'CANCELAR',
      confirmButtonText: 'SI',
      confirmButtonColor: "#DD6B55",
      background: '#D62600',

    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(this.ruta+'api/ModificarBimestres',{
          BiTriEstado:this.BimestreMod,
          Malla:this.mallaGlobal
        })
        .then(res=>{
          console.log('SE MODIFICO CORRECTAMENTE');
          console.log(res);
          this.CargarCurso();
          this.MostrarMensaje('success','SE CAMBIO EL ESTADO DE BIMESTRES')
        })
        .catch(error=>{
          console.log('HAY ERROR AL MODIFICAR');
          console.log(error);
          this.MostrarMensaje('danger','NO SE PUDO REALIZAR LA ACCIÓN')
        })
      }
    })

  }
}

