import { getLocaleDateTimeFormat } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  NgForm
} from '@angular/forms';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-tarjetas-pdf',
  templateUrl: './tarjetas-pdf.component.html',
  styleUrls: ['./tarjetas-pdf.component.css']
})
export class TarjetasPDFComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  estCuadro = [];
  numeroPaginaCuadro = 0; //PAGINA DEFAULT OPEN CUADRO ALUMNOS
  numeroPaginaCurso = 0; //PAGIN DEFAULT POR CURSOS
  CursoListar;
  CursoNivel;
  nivelUnique = [];
  cursoUnique = [];
  est = [];
  // CursoSeleccionado;
  constructor() {}

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // this.CargarListadoEstudiantes();

    this.CargarCursoUnique();
    this.CargarNivelUnique();

    // this.ListarForCentralizadorFinal('PRIMERO INICIACION A');
    // axios.get(this.ruta+'api/ListarEstadisticasCentralizadorFinal')
    // .then(res => {
    //   console.log("xd Cargado",res.data);
    //   // this.dataP? = res.data;
    // }).catch(error =>  {
    // console.log('Error al Cargar xd',error);
    // });

  }


  //#region LISTA DE 2DA INSTANCIA
  openListaSegundaInstancia(){
    //DETERMINANDO NIVEL
    var lvlCurso;
    if (this.CursoSeleccionado.indexOf("SUPERIOR") !== -1) {
      lvlCurso = 'TECNICO SUPERIOR'
    }else{
      lvlCurso = 'CAPACITACIÓN'
    }

    var body=[]
    console.log("valor forheaders",this.forHeaders);
    var fila = new Array();
    fila.push({text:'No.',alignment: 'center',style:'tittlefijosHeader'})//0
    fila.push({text:'NombreCompleto',alignment: 'center',style:'tittlefijosHeader'})//1
    // fila.push('carnet')//2
    //LOGICA PARA HACER EL HEADER DINAMICO CON LOS DATOS DE NOMBRES DE MATERIAS
    for (let index = 6; index < this.conjdata.length; index++) {
      fila.push({text:this.conjdata[index],alignment: 'center',style:'tittlefijosHeader'})//n
    }
    console.log(fila);

    body.push(fila);
    var headers = this.forHeaders
    var contColumsHeader=0   //SIRVE PARA RECORRER LA FILA [contColumsHeader][i]

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
        // case 2:
        //   longitudColums1.push(42)
        //   break;
        default:
          if (index<this.conjdata.length) {
            longitudColums1.push(65)
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
        // case 2:
        //   longitudColums.push(42)
        //   break;
        default:
          longitudColums.push(65)
          break;
      }
    }
    console.log("push",longitudColums)
    console.log("conjdata",this.conjdata[6].toString())
    // PARA EL CONTENIDO DE LA TABLA USAMOS OTRO BODY1
    var rows = this.CentralizadorFinal;
    // rows.forEach(e => {
      for (let i = 0; i < rows.length; i++) { //recorrer rows
        for (let index = 6; index < this.conjdata.length; index++) {
          if (rows[i][this.conjdata[index]]<61 && rows[i][this.conjdata[index]]>39) {
            rows[i][this.conjdata[index]]='SEGUNDA INSTANCIA'
          } else if(rows[i][this.conjdata[index]]>60){
            rows[i][this.conjdata[index]]='APROBÓ'
          }else if(rows[i][this.conjdata[index]]==0){
            rows[i][this.conjdata[index]]='RETIRADO'
          }else if(rows[i][this.conjdata[index]]<40 && rows[i][this.conjdata[index]]>0){
            rows[i][this.conjdata[index]]='REPROBÓ/SIN DERECHO A 2da INSTANCIA'
          }else{
            rows[i][this.conjdata[index]]='REPROBÓ'
          }
        }

      }
    // });
    // console.log("CONJUNTO DE DATOS CURSO", rows[0]['TEORIA DEL SONIDO'])
    var body1=[] //CONTENIDO DE LAS TABALS

    console.log("283 xd")
    //CONTRUIR DATOS DE CALIFICACIONES
    var contador = 0; //NO SOLO ES EL CONTADOR DE LAS FILAS; tambn es para RECORRER LA FILA [contador][i]
    for(var key in rows){
      if (rows.hasOwnProperty(key)) {
        var EstudianteMereceListar=true
        var data = rows[key]
        var row = new Array();
        contador= contador+1;
        row.push(contador); //0
        row.push({ text: data.Ap_Paterno.toString() +' '+ data.Ap_Materno.toString()+' ' + data.Nombre.toString(),style:'tittlefijosBody'}); //1
        // row.push({ text: data.CI.toString(),alignment: 'center',style:'tittlefijosBody'}); //2


        //PARA DETERMINAR ESTUDIANTE MERECE LISTAR
        var contarAprobados=0
        var contarReprobados=0
        var contarRetirados=0
        var contarSegundaInstancia=0
        var contarInvalidos=0





        //COLOREAR CAMPOS
        for (let numTituloMateria = 6; numTituloMateria <this.conjdata.length ; numTituloMateria++) {
          if (this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]]=='APROBÓ') {
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',style:'tittlefijosHeader'}); //n....
            contarAprobados++
          } else if (this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]]=='SEGUNDA INSTANCIA'){
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',bold:true,color:'orange',style:'tittlefijosHeader'}); //n...
            contarSegundaInstancia++
            contarReprobados++
          } else if (this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]]=='REPROBÓ/SIN DERECHO A 2da INSTANCIA'){
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',bold:true,color:'red',style:'tittlefijosHeader'}); //n...
            contarReprobados++
            contarInvalidos++
          }else{
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',bold:true,color:'red',style:'tittlefijosHeader'}); //n...
            contarReprobados++
            contarRetirados++
          }

        } //n...
        contColumsHeader++

        //DETERMINAR SI ES SUPERIOR O CAPACITACION
        if (this.CursoSeleccionado.indexOf("SUPERIOR") !== -1) {
          lvlCurso = 'TECNICO SUPERIOR'
        }else{
          lvlCurso = 'CAPACITACION'
        }
        //MERECE LISTAR ESTUDIANTE O NO
        if (contarReprobados>3) {
          EstudianteMereceListar=false
        } else {
          console.log("este es el nivel de curso",lvlCurso);

          switch (lvlCurso) {
            case 'TECNICO SUPERIOR':
                if (contarSegundaInstancia<4) { //SOLO SE ADMITEN HASTA 3 MATERIAS COMO 2DA INSTANCIA
                        EstudianteMereceListar=true;
                }
                break;
            case 'CAPACITACION':
                if (contarRetirados!=0) {
                  EstudianteMereceListar=false;

                } else if (contarInvalidos!=0) {
                    EstudianteMereceListar=false;
                }else{
                  EstudianteMereceListar=true;
                }

                break;
            default:
                // # code...
                break;
          }
        }
        //VERIFICACION EXTRA - SI LA MATERIA ACTUAL COINCIDE CON LA MATERIA INVALIDA POR LO TANTO FALSEAR
        // for (i=0; i < contarInvalidos; $i++) {
        //   if ($CursosInvalidos[$i]==$MateriaActual) {
        //       $RealizaraSegundaInstancia=false;
        //   }
        // }

        //SI EL ESTUDIANTE MERECE SER PUSHEADO EN LA LISTA ENTONCES SERA TRUE
        if (EstudianteMereceListar==true) {
          body1.push(row);
        } else {
          //NO MERECE LISTAR
        }

      }
    }

    var dd = {

      // pageMargins: [ 20, 10, 10 ,10],
      //izq, arriba,derecha,abajo
      pageMargins: [20, 20, 20, 155],
      pageOrientation: 'landscape',
      pageSize: 'LETTER',
      content: [
        {
          //#region
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgYAAAIGCAYAAAAvP0egAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQd4VNXWhr8z6SEQSuih9xYI1YK9XHv3XutVwYZiBeUqkAaCREAFEYWrgL2LomLvXoSEJISe0EILhADpfeb8z95J+CFMkjOZds6cb56Hx//+7LPLu9Ycvll77bUV8EMCJEACJEACJEACNQQUkiABEiABEiABEiCBWgIUBvQFEiABEiABEiCBEwQoDOgMJEACJEACJEACFAb0ARIgARIgARIggdMJMGJAryABEiABEiABEmDEgD5AAiRAAiRAAiTAiAF9gARIgARIgARIoAEC3Eqge5AACZAACZAACXArgT5AAiRAAiRAAiTArQT6AAmQAAmQAAmQALcS6AMkQAIkQAIkQAJaCDDHQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCoAFKqqoGAOgH4HJVVS9QFKUvgLYAmgHw0wLYRG2sAIoBHFFVdZuiKL8B+B7AFkVRKk3EodGlqqraHsBZAC5RVXU0gM6KooQDCAbA7+T/E1QBlAPIU1V1v6IoKTU+9YeiKDmNgjZRA1VVAwEMBHCZqqrn1by3IhRFCeW76jRHsKqqWijeVQC2qar6m8Vi+QHAVr6rqlnxJWTn5aGqqgVAfwC3A7geQE8AQSZ6z7hiqRUAdgP4CsC7ANIVRRHiwbQfVVVb17y471QURQiClgCEr/GjjYAQCgWqqq612Wwr/Pz8vlUU5Zi2R32zlaqq4gfKEAB3qKp6taIo3QEIkcCPdgLiXbXLZrN9abFYxLtqs9nfVRQGdZyn5uV9jaqqDwAYrigKv2Tav2D2WgoxsAnAYgCfKIpy1LnujPe0eHlXVlYO8/Pzm6AoynWKorQx3ir0M2NVVaEoSi6AL2r8Ks2ML3JVVUX08gZVVR8U4kBRFEYxnXPTKlVVNyiK8iqAlWYWnRQGJzmSqqrdbTbbfYqi3K0oSifnfIxP1yEgwnbvAXhVUZQMs9BRVVVEmv4BYDKAMwH4m2XtHlin2KJaA2Ce2GJQFKXMA2PqYghVVXsDEILgDgBia4of1xE4DOAtIToVRRFRT9N9KAxqTK6qai+bzfaIoih38Bed274HIgfhUwAvKIoiogg+/VFVNcRqtd5gsVieVhQlyqcX68XFqaqaqijK8wC+NIM4UFV1kM1mm2SxWG4C0NyL6H15aJGD8AGA+YqibPPlhdpbG4UBgJpIwUSLxXIXgAizOYGH11tks9netVgscxVF2eHhsT02XE3i6pUAngUwymMDm3QgVVXXKYqSAGC1oig2X8VQEyl4sib/qYWvrlMP61JVNV9RlGUAXlIUJUsPc/LUHEwvDFRVFQlg4wA8DqCLp8CbfJwcm822yGKxiG0FsVfsUx9VVZWqqqqz/Pz8pgK4lHu/HjFvFQCRWT5TUZT/eWREDw9Sk/90H4BHxEkWDw9vyuFqTsO8DOANRVGOmwWCqYWBSAqzWq1X+Pn5TQMgssT58RCBmiSfWTVJPiIr2Gc+qqr2qMkp+DeAMJ9ZmP4XUgBgeU3416d+4amqKnJTrgEg3lXR+jeFT81wHYDnAHyjKIoQoD7/MbswEAk8z9Qk8PD0gQfdXVXVSkVRRL7BLEVRNnpwaLcOpaqqqEXwTwBTas6Vu3U8dn4agc0AZgP4WFEUnxGcqqqKGipiW+o2AKK+Cj+eI1Bac+R6ji9vf56M07TCoEaB3wpAhHtFESN+PE9gO4BEAO8riiK+fIb/qKo6wGazTVUU5Z+KovAF7nmLCjEgzqILwekTOSw1tQrEu0pEC/iu8rxPiTy0jTabbZafn9+nZiiCZGZhEAngPwDG11Sc84K7mXtIVVVLFUURL/FERVEyjU6j5mjidaqqiijUUEUx7dfLq6as2aYSiYjiLLrhExHLysp6BwQETLFYLKLgWohX4Zp3cLFN9WbNNtU+X8dgyjdXTfnQC2u2Ec71dSPrdX2iUA2A/9Vkk/9g9Je4qqqdbTbbE4qi3FtT4liv6H19XuKo2UJR38AXitSoqnoZgFgAY1it1r2uW75vH0p27oStokIU0ToxmGKxoPz48S1FBw7E9Xn88Y/dOwvv925WYdADVVX3quXl/4aiRCrBwYCFlWm95I57bDbbSxaLZbmiKPlemoNLhlVVdXjNC/xqvsBdgrRJndQIzi8URYlTFCWtSZ3o5CFRCwPAvQCeBiCinPy4iUDF4cPYumABti1bhorS0lOFgaKgoqwMJSUl+1RF2Rpgsbz5oNX6oZum4vVuTSkMvh879k4FiLVYLD27XHON0v2uuxAQwfIFXvJGnwjR1ZxwucxisUxTFOUML7HksNV1SQSHtTXC4FsjQ1FVVYiBJ2q2PMVFW/y4iYCIFKTOnIlNb78Nq8122kVCIoJgURQhGMpUIP6BqipRVMsnP6YUBq9ZLJOtqhobFBoaNuyBBzBk8mQEduzokwY2wKKsNpvtE4vFMkNRFJFRbshPzWmEG1VV/Y+iKIMNuQjfmvRWACLP4ENFUaRSMOJHVDmsOeFyM3Oh3GvByuxspCcmIn3JElSWl58SMagzstiqiru/qmq+e2fkvd5NKQyW+Ps/qapqnEVRmnc/7zwMmzwZbc4/H3JLgR+PEqj5dfd1VVVVfGBgYJJHB3fhYKqqinoFom79JADiGCw/3iUg6hiIOhlii8qwxxZVVRVVM6cDuILXJ7vZoUpKsHHePCS/8AIqS0ooDNyMW3fdC2EgFB9UtbnF4ofwzp3Q/4470OveexHSrZvu5muCCX0PIN7IFetUVW0F4H4AjwLgBVzed1ohDESod5miKOXen07TZqCqqtiWihHXdTNvpWkMtT6llpZi09y5WJ+YeFqOASMGWikauN0JYQA0F79Yq2w2tB8wAFF3343Im29GSHdxpTk/HiTwnRBqiqL87cExXTqUqqriKmVx250oV8vb7lxKt0mdCWEgCh0JYWDkiIE4iVArDJgh3SRX0PaQWlSEjYmJWD9/PirLyhgx0IbNd1qdLAxqVyXEQUSPHhgdE4Nud9zBUwqeNbcvCIPWJwmDDp7Fx9HsEKAwoFs0SqDy6FEUbdmCsoMHkb89A5lfrMSh9HSZwNpAHRLmGDRK1oAN7AkDkYXarm9fjIqNRZd//QtgcRpPWpbCwJO0zTEWhYE57NzkVYp//Pe8/TbWx8cjZ9cuiEpYfhYL/Bs/uk5h0GTqOn7wNGGgqlIhRo4ahRGxsWh/+eU6nr1PTo3CwCfN6tVFURh4Fb8BBrfZsPmFF7A2YQZKSooh9mmEMBBHEhv5YUhhYADzOjzFusJAZsarKrqff74UBm3OZTFEh6E69wCFgXP8+PTpBCgM6BWNEjj01VfYtmgR8vfuhc1qRcnRoyjNz6+thVHf8xQGjZI1YAN7wkCIg77XXCOFQYthwwy4KkNPmcLA0ObT5eQpDHRpFh1OqrISqKxEVXExNi9ciA0LFqCsqIg5Bjo0lVunVPdUgggddYyORtQTT6Dj1VfDP0wcSefHgwQoDDwI2yRDURiYxNCuXOb2RYuQHB+P4mPHKAxcCdYIfdUVBgGBgRg6YQKGTJmCgHbtjLAEX5sjhYGvWdT766Ew8L4NDDeDjFdfRXJCAopycykMDGc9Jyd8mjAICMDQhx7CkP/8BwFt2zrZOx9vAgEKgyZA4yMNEqAwoIM4TGD3W2/JUwrHsrIoDBymZ/AH7AmDqAkTECWEASMG3rAuhYE3qPv2mBQGvm1fl62u4tAhlO7ahcr8fBz4+Wdse/995B86RGHgMsIG6ciuMHjwQUQ984xdYWAtKUFBWhqO/vUXSnNz4RcQgKDwcIQPHozwUaN4M6PzdqcwcJ4heziVAIUBPaJRAgXpG7HlxfnYtXIlSgsKYBMn1EQdg4br2PBUQqNkDdigrjAIFDkGjz0mcwz8W7Y8bUWF6elImzEDWz7/HBVWa/V5V0VBWHg4el91FQY8/jjCR4wwIAndTJnCQDem8JmJUBj4jCndt5CDK1diTXw8DqSlwb/mWuWaq5UbGpTCwH0m8V7PdYWBv78/Bt56Kwbcf3+1MLCJGljiyhIFisWCnD/+QNrChTi0aRMsNVWxxD2uNpsN/n5+GHLPOAydNhUhXbt6b1HGHpnCwNj20+PsKQz0aBWdzSk/KUnej7D7229RVVEp3+k21caIgc7s5JHp2Kt8KOpiiyhA3Xuoxf+2iouWRIjJzt/LUsr9+2PU9OnocvPNgJ+fR9bgY4NQGPiYQXWwHAoDHRhB71NQrVaU7dkj70sQOQbHt2xBxsqVOJKRwRwDvRvP1fOzd1eCKHAkogCnfYQgkMEDxa6jiD2p5m3bYsSUKegzYQIsQUGunq4Z+qMwMIOVPbtGCgPP8vaJ0fKSkmQdg52rV5+IDttZGLcSfMLadRZRrzCoKY18SvOaJJT6hIG8snngQIyePh2RN97IiEHTHIbCoGnc+FT9BCgM6B0OEyjbtUseV9z8zjtyG7meD4WBw2QN8IC9ksitunRB1zPPRLOOHaGKHIOarQNLQADydu5E1l9/oeDIkeoLNiD+WpVbDOImrkG33Iph06ehWb9+Bli9LqdIYaBLsxh6UhQGhjafdyZflZcnhYEoi0xh4B0beG3UusJAJJx0v/hieeVy67POOm1eRZs2yVMJWz/5BKqiICAgAP6BgQhs1gyR55yDAY88glZnndWQI3ltrQYZmMLAIIYy0DQpDAxkLD1M1VpQgJKMDKS99BK2ffCB3FoWkWJuJejBOh6Ygz1h0DEqCiNjY9Hp2mtPy0i1VVSgZNcuHPz8c+xZuRLlx44hrGNHdBg7Fl1uvRVhQ4Z4YNY+PQSFgU+b1yuLozDwCnZjDSqiwyLx8NA33+DQX38hd+tWFGQfQkVZaUML4VaCscysbbb2hEG7vn0xMiYGXW65xe5RlcrcXOxavhybFi9GQXY2/IKCENQsDO2HDUO/e8ej/T/+AUtIiLYJsFVdAhQG9AlXE6AwcDVRH+zPWlyMrfPnI/mFF1BUWChPpflZLPJPAx8KAx/0BdjLMWjTo4cUBt3uvNPukg+vXo2k+HjsT0o6kWcgTiSIbYjI6GiMnDYNHa+5Boq/vy8ic/eaKAzcTdh8/VMYmM/mDq/YVlqK7a+8grWJicjLzYV4e4u8MQoDh1Ea/wF7wiC0RQv0veoqdD7//OqIQc0xxdoiR9lr1sjzrYV1bt2ShxltNvS55hoMj41F+LBhxgfk+RVQGHieua+PSGHg6xZ2xfpsNhRnZuLQt9+ieM8elBcWYv+aNTiyfTvrGLiCr5H6sHdcUQoBe8cVaxYmBYDFYr+Wgc2GNr16yRyF7rffbiQUepkrhYFeLOE786Aw8B1bemwlIgFx60svIeXFF1FaWHgiOlxnAtxK8JhFPDiQXWEgfvjXbA3Ym4rITq2vhrZIYAnv1AkjYmPR+957PbgSnxmKwsBnTKmbhVAY6MYUxprIoe++Q1JcHA6sW1fflgKFgbFMqm229QkDETGQh1NqtxFO6k5EDMRRRXvHV0RZ5E7Dh8vjjh2vukrbJNjqZAIUBh70B1t+Pir27UPZsWOoLChA+ZEjqCoqqj5uq6oQtTsC27SBf1gYlIAAWc3TX/wJC0NA69bwE/eJ6L/CJ4WBB33Kl4Yq3bNH1jLY8tZb1WXwTz+ySGHgSwavXYv9uxIs6HLGGeh91ZXypSiLHNV+LBbkpqYi88svkZ+dfYqjiCiDuIRpqLi2+T//QWCHDr6IzN1rojBwM+GqnBwUpKTgaGoqjqSk4NC6dcg7cADlViusdsYWArn2FtEAf38EBQcjtG1btOjRA+G9esk/raOi0GL4cPi3a+fm2TepewqDJmHjQ+IE2tYFC5D2yisoyc+3FzWgMPBFN7GXfGix+GHgnXcgeupUhPTsedqyj69ZI1Xkzu+/P3GcUVQ+FMWO+l11FaKeeQYtR470RVyeWBOFgZsol2ZkYP/nnyPru+9waEM68o4dhZC8ASdtjdmLgonKnrWf2ntEhAgWPi+eF9nb4S1bosdFF8kCX63HjtVbOXAKAzf5lK93Ky5WOvjVV1g3YwayU1MRcPrRRQoDX3QCe8JAUSzoe911iJ4+DS2iok5btq28HDk//IAtr7yCnA0bENS8OdoOGYIu116L9pdeimBGCpxxFQoDZ+jVfbaqCqWZmdj19tvI+PhjHMnKQkVlpbw9VBzDqqeam0MzEGJB3BMiogot27VDeOfO6HjGGeg1fjyaR0c3dm2tQ2M1sTGFQRPB8TEg988/sS4uDnt+/lkeX6zznaEw8EUnsScMxDp7XnIJRsTEoNWZZ9a/bHEL40k3Lsqjjfw4S4DCwFmCNc+X79+Pve+9h01vvIHDmZmyrKurxIC9KYrvQm3SrkjO7TF2LIZPnYq2F10EeLemB4WBi3zKjN3kJyXJCPGO1avt5RlQGPiiU9QrDC68EMNjYqrDovx4kgCFgZO0bQUFyP3tN6S//DJ2/fKLDPc3UqTFyRFPf1xuOYhE3KFD0fPKKxHUpg2CIyIQcc45CO7e3eXjNdIhhYGnifvQeLX342z77DMpfBkx8CHj1reUeoXBRRdVRwzOPtsEFHS1RAoDJ8xRtns3MhcvRtpbbyE/J0fuidbeAupEt016tHaLoTYXIcjfH4OuvQ5Dp01FC88W/6IwaJIF+ZAgULJzJzbOmSOvX64sL4fl1DwDRgx80U3qEwY9LrhACoPW55zji8vW85ooDJpiHasVR3/7DRvmzMHOX35BVVWVW7cNHJli7Xab+LUl8hCi/v1vDJs+HcF2Ensd6deBthQGDsBi01MJqCUlyHz9dSQlJqIwJ6du9I3CwBcdpj5h0Osf/5DCoOWYMb64bD2vicLAQeuIy1/2f/AB1s+di8Pbt+tGENhbhrhPJCQsDIP//W/0Hz9eigNLixYOrtjh5hQGDiPjAycIlJUhc8kSrJszB4WHDlEYmME17AkD/4AADBk3Th47DIqMNAMGPa2RwsABa1QdPYqdS5di/cKFyK95aek9BbY2/6BF27bodfnl6DthAlqOHu3O0wsUBg74FJvWIUBhYD6XsCcMgps3x8gpUzDw8ceB4GDzQfHuiikMNPIv37sX2xcuRNqby1Ccd1wepTLKR4gDUSVU/LfXuediRFwcIi64wF3TpzBwF1kz9FtZiR1vvIGk555D/sGDjBiYweZ2b1ds2RIjnn4a/R95BEpIiBkw6GmNFAYarFGelYXNc+diw/LlKC8p8fipAw1T1NSkNv8g6p57MHz6dAR27arpOQcbURg4CIzNTyJQXo7MpUuR9PzzKMjOpjAwg3PYFQbh4dXC4NFHKQw87wQUBo0wL9+zB1vmzZOioMzAoqB2mSJy0LZPH3m/SNdbb3WHx1EYuIOqWfosLUXGkiVIEjkGhw9TGJjB7vaEQYv27TFiyhT0fuABKPq/IMbXzERh0IBFhSjY/EJNpKCs1LCRgpOXKIRBSKtWGPnU0xjwyERYQkNd7dMUBq4maqb+anMMnn+ewsAsdrcnDJq3bSuFQZ8JEygMPO8IFAb1MK88fBhb5s9H6uLFKC0uNlROQUNuJE4qBIaGYui992LI5MkI6NzZ1V5HYeBqombqj8LATNauXiu3EnRncwoDOyaxlZRg53//i+TERHmrp6crGbrTS0SegThJ0ePcczHsqadkUTFLSIi85tlFHwoDF4E0ZTdCGNTmGPC4ojlcwJ4waNaqFYZPmYL+EydC4akETzsChYEd4kd++AHJ8fHYu2ZNdSVDH7uXQ4oDRUFISCjadO+OPrffhm533OGq6AGFgae/xT40nlpUhO2vvYbkuXNRdOQIcwx8yLb1LsWeMAhp0QIjnnoKAx57DIrr9zvNgNWZNVIY1KFXvmsX0p9/HhvffhuVlZVeK3HsjFE1PSvuVwDkTY2tu3XD6JgY9LzrLsD5Y5gUBpoMwEb2CJTu2YONL7yATStWoLK0lCWRzeAm9oSB2O8cPmkSBk+aBEtYmBkw6GmNFAYnWUPkFWx7+WWkvvYaSvLzfWoLoT6nE8mIQWFhGDFxIgY9+ST82rRx1j8pDJwlaOLni7ZuxYaZz2Hbxx/J2hu8RMkEzmC38qG/PwbcdhuGPvssQnv3NgEFXS2RwqDGHGpxMXavWIGkuXNxLCvLZ5ING/M2ua2gquhzxRXyhtMWo0Y19khjf09h0Bgh/n29BKQwmDUL2z76CFarlcLADL5iTxgIRdj3uuswfNo0NB861AwY9LRGCgMAank5DnzyCZJmz8bhrVtNESk42QnFL7OwiAhET5iAfg89BP927ZzxUQoDZ+iZ/NnibduQJoTBhx9SGJjFF+q9ROnSS6svUTrjDLOg0Ms6KQxUFYe+/hrrEhJwYP1600QK6jqgEAfN2rTBwOuvl+IgLCqqqUmXFAZ6+XYbcB4UBgY0mrNTrvfa5fPPl2HMNuee6+wQfN4xAqYXBvlJSUiKj8eOb76RiU519jQdo2nw1iIR0V9RMOTWWzF02jSE9OvXlBVRGDSFGp+RBCgMTOgIdYUBRGa0qiLyzDMxMjYW7S65xIRUvLpkUwuDypyc6iJGr76KsuJi020h2PM8ETnoOGgQRsXFodMNNzTFOSkMmkKNz1AYALLGiOk+9QmDTiNGSGHQ4corTcfEyws2tTDIS0rC2rg47Pz2W7mFYMovZR0HFJURI3r1wsjp09Ht9tubcnyRwsDLX2ojDy8iBiL5cCtzDIxsRsfmfpowACBeRB2GDJHCoPP11zvWIVs7S8C8wqCiAvvefx/rZs9GTmamaXML6jqQiBi0iozEqKlT0XPcOMDf31EfozBwlBjbnyBQsGEDUhMSkPHFF7LOBo8rmsA5GhIG4ra3ThQGnvYC0woDW2EhMhYuRMq8eSjMy6tbSMXTdtDNeEKoBzVrhqHjx2PQpEkIjIx0dG4UBo4SY/sTBPKTk5ESH4/Mb76Rya8UBiZwDntbCTZVRYeoKHkNbKfrrjMBBV0t0bzCoKAAG2fNQsqLL6Ly9PPSujKSpycj8n4Cg0PQ//rrMfipyQgbMsSREwoUBp42mA+Nl79+PdaLZOCvv6Yw8CG7NriU+iIG7fr3l1sJXW6+2ZEXkFmwuXM1DfIyAAAgAElEQVSdphUGRZs2ITkuDts//5zRAjseJrYURN5F1N13yxMKQd26afVDCgOtpNjuNAIUBiZ0CnvCQLyA2vToISMG3e+4g8LAs35hSmFgLSioPo3w8ssoKyw09RHFhtxNfDc7DR0q71HocM01WhMRKQw8+x32qdEoDHzKnNoWQ2GgjZMHW5lSGBz/8095e+Kun3/2ydsTXeU/YkshrHVreclZX3H7aUiIlq4pDLRQYhu7BCgMTOgY9QqDnj2rIwbieJSPXXGrczObUhjk/vAD1ickIOt//6uOFtDn7LqpEAYBgYGIuu8+RE2ZgoBOnbS4M4WBFkpsY18YpKRUJx9+9RVzDMziI/UJA3FuWgiDbrfdxpe0Z53BlMKgZMsWpMycia0ffywLbJm52mFD7ibZAOh3zTWyMmnYsGFavJPCQAsltrFLIK/mVIKoRMpTCSZxkvqEQauuXTFq2jT0vPtuwM/PJDR0sUxTCgO1ogIb58zB+uefR2V5OYVBA64o64wMHlx9akhbJUQKA118tY05iaN//YWkuDjs+ekneyXKCwHE3V9VNd+Yq2t81qYsslafMGjRsSNGP/MMet93HxAY2Dg9tnAVAVMKAwFv/4cfyjsSDm/fzlLIjQiDwJAQDB1/rzy6qKGuAYWBq76dJuzn6J9/Yl18vBQGfqffXUJh4Is+UZ8wCO/UCaOnTUOv8eObUmnNF1F5ak2mFQYVBw/K89Ibly6V2fbcTrDvcmI7QUQNup55powatBX3mTSck0Fh4Klvrw+OUxsx2E1h4IPWrWdJ9QmD5m3bYsSkSeg7YQIsYWHmAeL9lZpWGKhVVTi0ahXWzZyJg2lpLIncgC+KY4uh4eEYPnEi+j/6KPwjIhryXAoD73+vDTsDCgPDmq7pE6+vwFFAaCgG3303hkyejBDthVSaPhE+WUvAtMJAALAWFWHH0qVYP28e8rOzKQ7q+V7URg36XHmlvHWxxYgRFAZ8h7iFAIWBW7Dqu9P6hEFgs2YYcs89GDxpEoK7dtX3InxrdqYWBsKU+WvXyi2FzO++k9sJ3FKw7+CyEFm3bhj5zDPo/u9/QwkKqu+bwIiBb70jPLoaCgOP4tbHYPVGDIKDMfiuuzDk6acR0r27PiZrjlmYXhjY8vKwbeFCrH/pJRTn5TERsYGogZ9iQdQDD2Do9GkIbN+ewsAc7wiPrlIKg/h47P7xRyYfepS8FwezKwxUFf7+/hjwr1sw9Nln0KxfPy/O0HRDm14YCIvvff99+TI6kplJYdDAV0AkIXY//3yZhNj63HMpDEz3unD/gnP/+APr4uKQ9csvFAbux62PEeoTBn7+/hhIYeANI1EYADj09ddyO+HA+vVQLBZv2MEQY4qbUFt17IiRMTHoee+99Z1O4FaCIaypz0nm/PIL/o6Px74//kDg6d9FHlfUp9mcm5U9YSASmyyKgn433IBh06ahubjilR9PEaAwAJC9apUUBgdTUykMGvA88V0NCg7G8CeewKCnnoKlRQt7rSkMPPXt9cFxcn79tVoY/P47hYEP2tfukuoTBlBV9L78cgyPjUXLUaPMgkMP6zS9MFArK+XJhORZs+TJBFFUhR/7BGrLRw+4/npET5uOZlF2RTyFAR2oyQQoDJqMzrgPNiQM+lxxhazHHk5h4EkDm1oYqGVlOPDZZ0iZMwfZmzbxVEIjnieEgRDxPc49FyNiYtD6ggsYMfDkt9UEY1EYmMDIdZdYnzBQbTb0uPBCjBRJTeecY0IyXluyaYWBEAUHP/0USTWiwE75Va8ZRc8Di+9q5+HDMSI2Fh2uuorCQM/GMuDcKAwMaDRnp1yfMBDZzt3OOUcWT4mw/yvE2aH5vH0CphUGlUePIi0+HhteeQU2lkTW9v1QVXkbZefo6GphcPXVFAbayLGVRgIUBhpB+VKzhoRB93POwUgKA0+b27TCwFpQgC1z5yLlxRdRVloqE2D5aZhA7VZCr0sukcKg5ZlnUhjQaVxKQJxKWFtzKiGApxJcyla3ndUnDERVtS5nnCEjBu0vvVS38/fBiZlWGMBmQ654CSUkYO+ff7IcsgbnFsIgODQU0Y8/joGTJsEvPJzCQAM3NtFOIHv1ankq4WBSEk8laMdm7JYNCYPIM87AaAoDTxvYvMIAQPn+/Uif+RzS33wDVTYbowaNeJ/IL+h58cUyF6jlWWfV15qnEjz9Lfah8Q6uWiWFQXZqKoWBD9m1waXYEwYiy1m8lCPHjMHo2Fi0v+wys+DQwzpNLQwqjxzB1pdeQtqrr6KkoIBHFRvwSPEdbdmpE0ZNmYKe48fDEhJCYaCHb7CPzSH766/xd1wcDqakUBj4mG3rXY5dYQCg0mZDp2HDMCY2Fh2vucYsOPSwTtMKAxEWz1u3DskJCdi5ejUsTECs1x/FVl9gYCCixo3DkClTENTwRWeMGOjhm23QOVAYGNRwzky7QWEQHY0xcXHoaP8IlDPD8tn6CZhWGFQdP47NiYlIXbgQ5WVl3Eaox0dO1C644ILq2gX135FQ2wOFAd84TSZAYdBkdMZ9sD5hIMKUEb17yytdu916Kyz1X+lq3MXrc+amFQZl+/YhOS4Om5Yvr44W6NM+Xp+VOEocGBqKoffeK69FD4yMbGxOFAaNEeLf10uAwsCEzlGfMBChyrCICEQ/9hj6TZgA/1atTEjHK0s2rTCoOHwYKfHx2Pj661AVRVY95Od0AlIYNGuGoffdh8FPPonAzp0bw0Rh0Bgh/j2FQT0ETPkWakgYNGvdGsMffRT9Hn4Y/q1b86vjGQKmFQa20lLsXrYMyXPm4Pj+/Uw8rMffaiMGUffcgyGTJyOw4fwC0QuFgWe+uz43ivxOvvUWkhMTcWzPHntHiHm7os9ZHUBjEYPhjz2GvowYeNL0phUGAnJhWposppLx5ZfyJWRKtd6It4loXnBYGKIfeAADn3wSAR06NOafFAaNEeLf2yUg8n4yFi9Gyssvoyg3155YpzDwRd9pSBiEhocjeuJE9H/0UQRERPji8vW4JlMLg8rsbGyeOxdpS5agrKSEUQM7HiqEQZvu3TFq6lR0u/NOKAEBjfkxhUFjhPj39QuDV19FyoIFFAZm8pH6hIEMV4aEYOj9D2DwU5MR2LGjmbB4c62mFgai+uH+zz7DmoQEHN60SZ6bZq7B/7ujreY2xYE33ihvPm02eLAWX6Uw0EKJbU4jICMGFAbm84yGIgYyXDlxYnW4sk0b88HxzorNLQwAFG3ahI1z5mDbJ5+grKwMisVi+siBOKIoIgXyiuWzzsKI6dPRVpQqP712vT2vpTDwznfZ8KNSGMCc25kNRgxCQzHw5pvlkahmAwcCzBL3xBfd9MJAQC7bswd5f/+Ngz//jMzvvjNtMqIQA+LosPiEt2yJPv/4B/o//HD1ZUn+/lr9kcJAKym2O4UAhQGFQfOTPUJFNZCg0FC07d8fEf37I7RjRzTr2BEhkZFoERWFkJ49AT8/fpVcS4DC4CSeFXv3YlNiItLefBMV5eWmiRzUFjFq3qYNOgwejPajRqH9eechfNQo+Ldt66jHURg4SoztJQFrTfLheiYfmssj6osY1FIQuQbiF4sQCkICBPj5ydyDFh06oFXv3gjv1QuthwxBm7PPRmjv3lACA7WGN80FWvtqKQxOZmWzYd9HH2FdQgJytm83xY2LQhSIK6d7nn8+op54Aq3POguWZs2AxpMM6/MyCgPt3z+2PIkAhQEjBqdEDOp+O+QvGIgtzlP/K6IKAYGBaNGuHSIGDEDkRReh/YUXIqRPH/i3aMHtB8dfMxQGdZjl/vQTkuLikPXXX6a4P0FsH4SLy5Hi4tB7/HjHPej0JygMXEHRhH1U5ORg6/z5SFu8GKVFRTyuaBYfaCxioIWDEAsiW1r8V5w9FyKh0+jR6HbllWj3j38guPECLFqGMUsbCoM6ls5fuxYpCQnY8e23pqiIKIRB8/btMerZZ9H3gQeciRTUkqQwMMvbw8XrrDh4EBsTE5G+ZIncyhOlyut8WMfAxcx10Z0rhMHJC6nNnhb/DQlths7R0ej9z5vR6ZprENy9uy7WrPNJUBjUMVBVTg62zJ+P1MWLUVZUZO/lpHOTOjY98d0RRzT7X3cdoqdNQ9jQoY51wIiBs7z4fA2B8uxsmeMjhYG42IzCwBy+4WphUEutNoogchSCQ0PR9Ywz0H/cOLS/7DIefWzYtSgM7PDJ/fFHuZ2w+6+/ZL6L+Pj58DFGkdfTMjISo6dMQc977oESEuLMC4kRA2fomfhZCgPmGDSYY9DU78aJbQabTW4x9Lv2WvR54AG0GDYMCk802MNKYWCPSlUVcr77Dltffx0F+/ZBBDTzDx5E0dGjPlkAqTby1m3sWIyOjUXERRc19SsonqMwcIaeiZ+lMKAwcIswOPk7JaIH/v7+6H7OOYiaNAkRF14Ihdc5133tUBg08CJWCwuBykqIy102vfgi0l57DeWiCJIP1tio3VIQtQuip09H+JgxTf0nisKgqeRM/hyFAYWB24WB+I7Jkq42GyJHjED0lCnocNVVsAQHm/zrd8ryKQw0esOxP/7AOrG98OuvPnuMUXxfxNHFvpddhmHTpjVVHFAYaPQpNjuVgBAGm194Aemvvy4FOHMMTOIh7soxaAifPMFgs6HrmDEY/uyzMu9Aw0UwJrEIKAw0WtpaUIDMxYuR/OKLKDxyxHfFgc0mi43JyEFMDFqecYZGQieaURg4SoztJYFycSphzhykL12KSp5KMI9XeEMYCLoyTCrqvl98sbwMpvXZZ5sHesMrpTBwwBMKUlOxvuaaZnGngi9uKQgc4gijyKvoe/nlTdlWoDBwwKfY9P8JlGZlITUhAZuXL6/vqDCPK/qiw3hLGNSKg6CQEAwZPx6DJk9GUGSkLyJ2dE0UBg4QU0tLseett5A0Zw6OZmX5bNSg9vsitxWuvArDpk1Fi5EjtZKiMNBKiu1OIVC6Z4+sIbJlxQoKAzP5hjeFQe0voVZdumD4pEnocc898A8LMxN+e2ulMHDQAyr27MGG2bORvmIFqiorfbrOgcw5ANDvyisxbPp0reKAwsBBn2LzagIiYiCFASMG5nIJbwuD2stiel12GUbExqLl6NHmMsDpq6UwaIIHHPn+eyTHxWHv2rU+LQxqxbSfiBxcdZUUB+EjRjRGjMKgMUL8e7sEKAx4KsEjpxLseZ8sAdumDaIfewx9H3oI/q1amflrSmHQBOuLLYWdS5ciKTER+dnZPn8Lozj6K7YV+tWIgxYNiwMKgyb4FB9hxED4gEj8Nd3H2xEDAVxEDcSfXpdeihE1Wde+mkSmwcEoDDRAstekPCsL6WJLYdkyVFVV+XzkQN7CKBISr766elth+PD6yFEYNNGnzP4YIwYUBl6LGNSGR1u0b48Rkyej9wMPwE9cM2vOD4VBU+2uqjj+11/ylMLOn36CL59SqEUkIwci5+CaaxoSBxQGTfUpkz/HUwkUBl4VBvL4IoDBd98tz2qb+EZGCgNnXsY2Gw6uXIl1M2Yge8OG6lMKPlgV8WREYivOr2FxQGHgjE+Z+NnS3bul0N7y9tvye2Qnksvjir7oH3rYSqjlKl5w7QcPxqjp0xF5ww3A6Td5+aIJ6q6JwsBJK6slJdi1fDnWJSYib98+nz7CeErkQOQc1EYOoqNPpkhh4KRPmfXxkp07kRwfj63vvFNfBI7CwBedQ0/CQEQNmrVqhRHPPIN+EydCCQz0ReSNrYnCoDFCGv6+KjcXGa+9hpRXXvHpqogno5A5B+K0gsg5mDbt5JwDCgMNPsMmpxMo2bVLnvahMDCZd+hNGPj7+WHYww9j6NSp8GvTxmTWkMulMHCR1asOH0bG4sVIWbz4/8WBj28riJwDsSUnTiuILbma0woUBi7yKbN1U7J7txQGYitB3JPArQSTeICehIFALn719LzoInk6oZU5yyRTGLjwu1eZnY2M119Hqriu+fBhua3Q2ImX2lMyYhqibWPtXThdl3Qlcw4UBf1rTis0Hz6cwsAlZH24E6sVtvLy6j/FxbDm5iJvwwbs+/577Pr9d3nFuZ0LlAQQbiX4olvoThjYbOgUHS2LHXW8+mpfRN7YmigMGiPk4N9XHTuGA59+ivSFC3Fg0yZYAfkPpwi7n/wRVQXFP6oqgABFkSKiSvxv0VYICgfH9WZzsQ4RfRv0r39h8KRJWc2jombDYlmmKEqFN+flzNiqqop7p2MAXAbIwxj8OEGgKi8P5fv3o+LwYRxLScHBP/5A/u7dKDlyBKX5+aioqICtcXFMYeCEDXT7qN6EgQiFRvTujZGxseh222265ebGiVEYuAOu1YrC9HRkvfcedq9ahSM7d6K8qkqKAPERQqFZWBja9OyJttHRiIiORnC7djiamoqtn36K3N27pZAwUvRAiIPA4GAMHjcua+hTT80O6tqVwsAdvmWgPoUIKEzfiPzNm3Dof//Dgf/9D/mHDqHCKuQyTvi4A5EyCgMD2V/zVPUoDFp27YpRMTHoec89mtfhQw0pDNxoTFEhseLAAYhjWBW5uTJ0qvj5yTs6Ajt0QHDnzvBv2xZKSIichU2ccHjzTaxPTMTxAwcMV1FRRDz63nhj1pinn54dNnIkhYEbfUvPXYt6BDmrV2PPl6twIGkdCo4eRZWqnoicOSAE6i6TwkDPhm/q3HQrDGJj0fPuu5u6LCM/R2GgM+uJioobZs3CxuXLYbVaDRU1UIUw+Oc/s0Y/9dTs0OHDKQx05ltunY6qouLIEVnXY9uyZTiYno7y0lK5JVYrBFwQAaMwcKsRvdS5HoVB627d5FZCj7vu8hIVrw5LYeBV/HYGV1XsXr4cyQkJOL5vn6GEgdiaE8JgDIWB3rzKrfNRy8pw9LffsPXVV7Hr119RWlhYnVPj+u0wCgO3WtJLnetNGIhfOO0HDpTJh5E33eQlKl4dlsLAq/jtD16QlISk+Hhkrl5tqO0ECgMdOpObp1R+8CD2fvABNi5dipzt22VhorqJti6cAoWBC2HqpivdCQNVRefRozEyJgbtLxPJx6b7UBjo0OQVhw4hNSEB6UuWyIRFF4RgPbJKCgOPYNbNIMWZmdj+yivY9O67KDp2TNPxXCcnT2HgJEBdPq43YQBxy+Jll2G4uGVx9GhdMnPzpCgM3Ay4Kd1bCwqwdd48pL70EkqLiykMmgLRyWd4XLFhgKJ88ZZ587D5nXekj3roFA2FgZN+rcvH9SQMRGGZgIAADHvsMUQ98wz8wsN1yczNk6IwcDPgJnVfXo79H3yAdc8/j5yMDMNsJzBi0CRrG+6h8uxsbF+4UEa0io8f9+SV4xQGhvMWDRPWmzAIa90aw2vvSggI0LACn2tCYaBHk9psOPLjj1ibkIB9a9YY5mImCgM9OpNr52QrLUXW++9j/Zw5yM3MrBatniv9TWHgWnPqozc9CQPxEhMFZkZOm4Zud9whz5eb8ENhoFOjH//f/7A2Ph67f/yRwsALNuJWgn3ox9euRVJcHHZ+950UBR7Of6Ew8MJ3we1D6kUYiG0EkV/Q48IL5YmE1mPHun3tOh2AwkCnhinYsAFr4+KQ+eWXCDDIleCMGOjUmVw0LVHue+vLLyN1wQKUFBR4Y4uLwsBFttRVN3oSBqIs7ZAHHsCw6dMR2L69rjh5cDIUBh6ErXkoVcXxNWtkxGDXjz9SGGgG57qGjBjUYamqOPrHH/IY7Z5ff/XWfR4UBq5zcf30pBdhIOq6i/yC6McfR7+JE+FvzsRD4RgUBvr5epyYiSilvPuNN5CcmIhjBiqNzIiBDp3JVVOyWpHx6qtImjkTRUePurNWQUMzpjBwlT311I9ehIGo6d5lzBiMjolB20svlUU5TPqhMNCh4Sv278f6+HhsXLbM03u4TtGgMHAKn64fLt27V9bW2LJixYnLwLwwYQoDL0B3+5B6EAYiv0D86XfjjTK/oPmgQW5ft44HoDDQoXEOfv65DNke2rjRk0fBnCZBYeA0Qt12cOSXX7A+IQF7f//dmz+kKAx06yFOTEwPwkC8vAKCgjDk7rsxZMoUBHfr5sSKDP8ohYHOTFh16BA2zJmDDa+/jqqKCkYMvGQf5hicCn7ve+8hOT4euTt2UBi40SfFpVOm++hBGIj8AnlM8T//Qbfbb4clONh0djhpwRQGOrP+/k8/ldGCw5s3eyPr2ykajBg4hU/XD2e8/roUBoWHD3szisWIga69pImT87YwEFsI4uXVbexYeaNi24suauJKfOYxCgMdmbI0M1NeuSxqz4srly0Gy32hMNCRM7lwKtaiImx++WWkzJuH8vx8b/olhYEL7aqbrvQgDET9gp4XXyzvR2h99tm6YeOliVAYeAn8acNWVWHvhx9i7cyZOJKRYZgjiievg8JAL87k2nmU79+P9BdewKY33kBlWZk3t7coDFxrWn30phthcMklGBETg1ZnnaUPMN6bBYWB99ifMnJR+kZ5EmH7ys/dcY+9R1ZJYeARzB4fpGzvXqQnJmLTsmWoKi+nMHCjBZhj4Ea49XUtTyTYbOh+zjkYEReHiAsu8MIsdDUkhYEOzKEWFWH7okVInjtXXl8r688b8ENhYECjaZhyVV4eNr/4oqx4WF5QwK0EDcya2oTCoKnknHxOJB+27toVwydPRo+77oJfWJiTPRr6cQoDHZgv57vvZMLhvrVrDSsKBEYKAx04kzumUF6OzQsWIPn551GWl0dh4A7GNX1SGLgRbkNd21RVVu0adMstshxyaN++XpqJLoalMPCyGcp27apOOHz7bZlw6OFLaVy6egoDl+LUT2eqii0iopWQgFJR9dB7ES3mGOjHK1w3E2/nGIiViO0EUfmw50UXYUxcHFqZOwGRwsB17u1wT7L08YoVSJ4zB8eysjx9ha3D823sAQqDxggZ9+/FcUUR1SricUW3GpERA7fiPalzkVdwyv9UIaIGfa68EqPi4hA+YoSnZqLHcSgMvGiVo7/9duqlNJ67194tq6YwcAtWXXQqBWx8vBSwjBi4zyQUBu5jK3uWNQtUFQJ0SEgIgsPCIP5XZWkZQiNaY9CECeh5zz0IaNPGzTPRdfcUBl4yT8XBg9j0/PPYsHQpyisqDJ1bUIuQwsBLzuSBYQ+tWiW3Eg6mpnpzu4tbCR6wtceH8NRWQq0oaB4Rgd6XXII+99yDVqNGyciBrbhYlvS0tGwJJSjI4wx0NiCFgRcMolZUIOvtt5E8ezZyd+/2CVEgMFIYeMGZPDRk3rp18q6End9+S2HgRuaMGLgJrhAFoohR2379MPTxx9H1X/8y87XKjVGmMGiMkBv+/vhff8maBbt++smbdeddvjIKA5cj1U2HZfv3I3XmTGx+800ZjfXShxEDL4F367DujhjIiIDNhlaRkYiePFluFfib+zhiY/akMGiMkIv/vjI7GxsTE5G+ZAkqvFssxsUrY8TA5UB11KGIcm2eOxcp4shiSYm3ogYUBjryCZdNxe3CQFXh5++PgbffjqHPPovQXr1cNncf7YjCwMOGFXu16+Li5F6tLGRk8ITDk/ExYuBhZ/LgcLaKCmQsWoSU2bNlES4vHaulMPCgzT02lNuFgShe1K0bop9+Gt1F8aKQEI+tzaADURh40HDlWVlInzMH6cuXo7K83GdyC2oRUhh40Jk8PJRaWYmd//2vzIvJP3hQ1oLxwofCwAvQ3T6k24WBqqLXZZdhRGwsWo4a5fb1+MAAFAYeMqJ4sR766iskPfccDqSmwt97RWLctmIKA7eh9XrHalUVst55B8nPPYeju3Z568gihYHXPcENE3CnMBAJMUEhIRg28REMemoy/Fu3dsMKfK5LCgMPmbR83z6kJiQgXSRvKYq3fnG5dbUUBm7F693ObTYcWLkSSTNm4FB6ureiXRQG3vUC94zuTmEg7kCI6N0bo6ZORdfbboPi7++eRfhWrxQGnrCn1Yp9H3yAdTNnIicjwyejBQIjhYEnnMl7Y+QnJWFdfDx2rF7tLR+mMPCe+d03sjuFgShz3O3CCzE6NhYRY8e6bxG+1TOFgQfsWbZjh4wWbHrvPVlLw0uJW25fKYWB2xF7dYCi1FSZOLv9q68oDNxkCa9kbrhpLZq7dacwEBGDvjfdJMscNx8wQPOcTN6QwsDdDmCzYffy5UieMQPH9u711t6su1cp+6cw8Ahmrw1SmJIihUHG119TGLjJChQGLgQr8gsE0CHjxiE6JgZBkZEu7N2nu6IwcLN5i9LTkTpjBravXFldots72dxuXmV19xQGHsHstUEKRcQgPh4Zq1ZRGLjJChQGGsCeXGGroReqaOenKBg8fjyGTpuGYAoDDXRlEwoDraSa0q68XN6euG72bBkt8MWTCCdjoTBoipMY5BlVRc6PP8pLv/atWcPkQzeZjcKgAbDiH3qxNSB+YdUW3xT/8IuCMPYEQq0wGFIjDBgx0Oy1FAaaUTnesCAlRd5Il7lqlSx97MvRAkYMHPcPQz1hs2Hfxx/LUwk5W7dSGLjJeBQG9YAV/8irNhuat22LLmefjTZRUSjcuxdZP/2EvP37ZaW4ui9YKQwADB43DsOmT0dQly5uMpvPdUth4CaT2kpKsGPJEiQnJiL/8GGfjxZQGLjJkXTSrahjIKJf6597zptXL/NUgk78waXTaCz5sDZXoPPIkYh69FG0GzsWFYcPw1pSgrJjx7B56VLs/OEHeYnHyeJA3qZos2HgXXdhZFwcQrt1c+m8fbgzCgM3GbcwLa16P/bLL00hCigM3ORIOulWFOjasXSpLImcn53tregXhYFO/MGl02hMGCiqKqME0VOnovWoUdi1fDnSXnoJoR06YGRMDPybNZNXf2b99ttpkQNxXLHHpZfK44qtzzjDpfP24c4oDNxhXKsVu5ctQ9LMmTi2b5+3wq7uWFmDfTLHwOPIPTagrbIS219+WQqD4vx8CgM3kedWQh2w4ld/QFAQhj74IKeE7ZUAACAASURBVIZMmYKSvXuRJM7MiqMxfn4YcuediHriCez79lukzp172kUeIieh3cCBGD11KiJvvBEICHCT6XyqWwoDN5izKjdXXlG7YdEinz+JcDI+CgM3OJNOurQWFCD9+eeR9uKLqKyspDBwk10oDOyAFeKgZWSkvO9A7Gllrl6NgkOH5Mu185gxMhogthBEQteBtWtPuctetAlr0wYjp0xB34ceghIc7CbT+VS3FAZuMOfhb76p9tHk5FN81A1D6apLCgNdmcOlkynatg0pCQnY/tFH3rwRlFsJLrWqTjprbCtBTFOeRrDZZF0CeQrBYpH/P/GP/ohJk9Dx3HOx4cUXkfHZZ6dUkROnF8RxsEF334Oh06YimAmIWqxOYaCFkiNtKiqwZcECJM+ahdL8fJ8uaFQXC4WBI45irLbH/vxTit09v/zirWiBAEZhYCy30TZbLcJA9FRbv6A2wVC8cALFBUkPPYwB99+HbW+8gbSXX0ZFRcWpSYgiz+DCC+Xtiq1ZFlmLUSgMtFByoE1BcrL8ZZX5zTc+Xf7YHhIKAwccxWBN9330kaxhcGTbNm+KXQoDg/mNpulqFQb2fokEBgcjasIEDHnySez94gt5/afIjrWcdH2tOObYtndvDJ82rfoiJT9xiJGfBghQGLjQPVSrFXs//FCe9T7iw5cl1YeMwsCFzqSjroRfb1+8GOtnzkTRkSMUBm60DXMMHIArXjgBgYGIevBBRE2Zgtz162XN7uyUlFOOgolIQ2BwCIbcdy8GT56MoM6dHRjFlE0pDFxo9vKsLGx8/nmkL18uo1liK8xMHwoD37R26e7d2DBnDra89Raq6kRpPbxiRgw8DNwjwzU1YnCi5PG992LYtGko2LFDnljY+/vvp7x85RaEqqLrWWcheto0tLv4YkYNGrYshYELPf/YX3/h7/h47P7pJwSaTBQIjBQGLnQmHXWV++uvMr8g6/ff5datFyt4UhjoyC9cNhVnhIH47SXuQhCVDa3FxUiJj8fWDz88rZ6BSFQMbd0awx99FP0nToR/q1Yum78PdkRh4CKj2oqKkPn660ieNw8FJql0aG/Lr+8//5k15qmnZocOH75MUZQKF+H1eDeqqo4BEAPgMgDmCv2cRFsUNtrz3nty6/bozp3ejoJRGHj8m+CBAZ0RBuLXyIDbb8eo2Fj4hYZi8wsvIH3JEpSXlZ2aZyBKKqsqel5yCUbGxqLVmWd6YGWGHYLCwEWmK9m5U0axtrz7br13erhoKN12w4iBbk3T5ImVHziATfPmIX3pUpSXlFAYNJmktgeZY6CN04lWorJhn2uvxZjYWIR2747MJUuw/sUXUXj48GnOKqIGIS1aIGr8eAx87DHenVA/awoDB/3QXnOR9Hrg44+RPGMGDnnvghkXrMS5LigMnOOnx6ePr10rTyPs+vZb+QPMi9sIAg8jBnp0Emfn5EzEQPxj3/fGGzE6Lg7NevTArhUr5AU1x+u5zla0b9unD4ZPnoyut9wCv7AwZ6fvi89TGLjAqtbjx5EmKh0uXAiryHMx6YfCwLcMr5aXy22EpNmz5TaCDq4NpzDwLRerXo0zwkD8Kht0110YEReHgObNkbF4MVIWLEBRbq7d8NaJRMSxYzEiJgZtL7rIF5E6uyYKA2cJAjj6889YL4q//PmnqSod1kVHYeACZ9JRF8U7dmDDzJnY+u67UvB6OVrAiIGOfMOlU3FGGIiXTu9rr5U5BiEdO2LL/PnY8NprKC0qqnffq/a2RpFvMHz6dLQ66yyXrscHOqMwcNaIVqsUqckzZ6LQu2e8nV2J089TGDiNUFcdHP7+e3ksXJSf18nRW0YMdOUhLppMU4WBGF5sDUT06SOFQacLLpDCIE0Ig+LiBp1WRBqE0u123nkYOnkyIs47TyYv8iMJUBg46QilW7cibdYsbPnoI1itVj38qnJyRU1/nMKg6ez09mTl8ePY+tJL2LBgAUoLC/Xi1xQGenMUV8zHWWHQtm9fjIqLQ8cLLsDW+fORunhxgxGD2jmLC5aEQGjTrRv63XQTut12G8IGDoRfUJCse1B24AAKUlPFQWy0iI5GcNeurliuEfqgMHDSSgdWrsS6+HgcSk/Xwx6sk6tx7nEKA+f46enpo7V3I/z8szcrHdZFQmGgJydx1VycFQYRvXtjVEwMOl92GbYtWoTUBQtQfPy4pjCX2FYQUQcREmseEYHW3bohMCwM5QUFKMzJQfGxYwgMCsLg++9H/0cfRWCHDq5atp77oTBwwjpVR49W++HChdJ/dBJudWJFzj1KYeAcP708bS0qQsbrryNt3jx56ktcZKeTD4WBTgzh0mk4IwxOXKv87LPofeedyPjvf+VxxaKcHIdeyEIg1CYmnrI4RZH//w5DhsioROfrr3fp2nXaGYWBE4bJW7dOHuXasXq1aWsXnIyPwsAJZ9LRo4VpaUidORPbv/hCvhN1kHRYS4fCQEd+4rKpOCMMhIMG+Ptj+JQpiJo8GVmffop1s2addoymNjIgyyhbLA6FwcSLrWNUlCyM1Om661y2bh13RGHQROPYSkuxVxzlmjMHufo4ytXElbjuMQoD17H0Vk9qWRl2v/MOkp9/Hsd273boR5cH5kxh4AHIHh/CGWEgJ6uqMkdgeEwMSrOz5d7u3j//PPFrTYiBkObN0WnYMASFhyM7LQ15+/druv5WCo/AQAy6+24MmTIFId26eZyPFwakMGgi9LKsLKTGx2PTihVQvVs/vokrcP1jFAauZ+rpHkt37kT67NnY9PbbqKqqcuiHlQfmSmHgAcgeH8JZYSASCNsNHCh/0bccNAipM2Zi28cfVW8NAAgICED/f/1L3sAY3KkTdr31FlLnz5dFkE6+ntnewsVLTeQdjJw+Hd3vuktP+2rutBOFQRPpHv/rL3mUa9fPP5s+6bAWIYVBE51JL49Zrdi/ciXWzpiBnI0b9ejXFAZ68RVXzsNpYSAiAuHhspph3/Hjseu997B+7lwUZGfDoigIadYM0U8+iQFPPgm/5s1xaPVqeSvYgaQk+fcQf+r5iMTETiNGyOOQHa+4osG2rmTi5b4oDJpgAHGxzMGPP0bSrFmmLoFcFx2FQROcSUePlO/fj42Jidj4xhuoqHMHjU6mSWGgE0O4dBrOCgOxlSCSEDuPGnWi0JG4ZTHjyy+rb1kEZL0CsdUg6hUcWrVKJocdSE1tdK9MCIMuZ54pEw/Fdc0m+VAYNMHQ4ibF7S+/jJT581Gcn6+n5KwmrMZ1j1AYuI6lx3tSVWR/9ZV8Xx7U8L70+PyqB6Qw8BJ4tw7rtDCoufPd39+/esvgmWdQsHUrkhIScHDDBvmPf88LLpDCoHn//ti+aBE2vPqqPEqmZSuh/eDBcish8oYbAP0c0XGnTSgMmkC3MicHqTNmIP2116q3sRqIRDWhe8M+QmFgWNOhPDtbFo3buHQpyoqK9Cp2KQyM62L1z9wVwkD0Ln7dBzdrhkF33om+48bhaHIydn/0EcL79EHvceMQ2qULdq5YIUVB3oEDjUYLRJ/iBR/eoYMUBr3uu4/CwCAOqKpqawAPAngEgEeKTxSmpGD9jBnIWLVKry9Qr1iPwsAr2J0eVLz7jv7+u7zvI+u33/ScX0Vh4LS1ddiBq4SBWJp4CQWGhqL35ZdjwPjxCO/fX/7/8jZsQMZbb2HXTz9J5dtYpKAWkzyVEBCAoY88gqj//Af+rcW/Nz7/YcTAUROrKg5+8gmSExJwaMsWPb9EHV2Z0+0pDJxG6JUOKnJzkbFoEdIXLULR0aN69mkKA694iJsHdaUwqP2VL8oYh0VEoGXXrrBVVCBv3z4UiX1fUcPAwRCvEAfdzzkHI2Jj0eb8891MQxfdUxg4agarFTuWLpWXJuWLpFdzbDlpokRhoAmT7hrlr1+PlIQEZH71VXWuloPvTQ8uiMLAg7A9NpSrhUGtOBAvJHEtqPjIokZNdG7RT3jnzhj57LPoNX48lIAAj7Hx0kAUBg6Ctx4/js0vvSSv/BbltCkM/h8ghYGDzqSD5taSEux5+22sT0zEsT17NG27enHaFAZehO+2od0hDFw5WREx8BdFju68U24nhPTo4cru9dgXhYGDVinasAFpM2di28qV8oSMjn9dObgy55tTGDjP0NM9lOzYIQsabX73XVRVVupd6FIYeNpBPDGeEYSBeLl1OesseRyy3SWXeAKLN8egMHCQfu4PPyA5Lg5Za9bI7SoKA0YMHHQh/TS3WnFQHOmeMUNWiRXRr/orvehi2hQGujCDiyehd2EglitOPLTo2BHDJ01Cn/vug19YmIsp6Ko7CgNHzGG1IuvDD7FuxgzkZmTosTKcI6txeVtGDFyO1K0dWgsLsW3hK0iZP0/zLbVunVDjnVMYNM7IeC2MIAzkbWKqigG33YbomBg069PHeKC1z5jCQDsrWAsKkPn660ieP19e1e3PxMNT6FEYOOBMOmian5Iikw53rFpllPs+KAx04Dcun4IRhIFYdJXNhq7nnovRMTFoK04n6DdL11kbURg4QLB8925sSkxE+ltvobysTO+JWg6szDVNKQxcw9FTvez76CNZ6fDItm16zy2oRUJh4Cnn8OQ4RhEGYjshvFMnjHz6aXk6wRIa6klMnhyLwsAB2gVJSfJFmvnNN9X7sb4rGB2g8v9NKQyahM0rD1UdOyYrHW5YtAilhYVG8WUKA694i5sHNYowENsJFgBDH34Yw2JiENCmjZvJeK17CgOt6FUVOT/+iLXx8di3Zg0CuI1wGjkKA63O5P12eevWyW2End9+a6SIKIWB913H9TMwijAQKxdRg95XXSVPJ4QPH+56GProkcJAox3U0lJ53jtpzhwc3bOH+QV2uFEYaHQmHTTL/vJLWQL5YFqanisd1iVFYaAD33H5FIwmDDoMGYJRMTHofP31RlLVjtiNwkAjLXFxkgy9Ll6MUgdKbWvs3ieaURgYxIyVldj5xhtInjVL3iVjoCJdFAYGcTGHpmkkYSC2E5pHRGDE9OnoO2GCr16qRGGg0YNLd+xAakICNr/3HkSNTeYXnA6OwkCjM3m5mShqtHHOHGx5911UVlQYyZcpDLzsO24Z3mjCwF9cqvT44xj6zDPwb9HCLUy83CmFgUYDHP/rLyTFxWHXzz/zNEI9zCgMNDqTl5vlrV8vrw3f8dVXRhO5FAZe9h23DG8kYYCauxf63XILRoh6Bn37uoWJlzulMNBiAJsNBz7+WFaIO7R1K4UBhYEWr9Ftm6N//CHzC3b/8ouMFhgo+kVhoFuvcmJihhIGAMR2Qo8LLpDCoPU55zixct0+SmGgwTS24mJkvPIKUubORdHx40Z6kWpYneuaMGLgOpbu7OnQqlVYJxIPU1KqRa5xjt1SGLjTMbzVt9GEgXjRdYyOlicTOl59tbewuXNcCgMNdCuzs5E+axY2LF2KqqoqCgNGDDR4jU6bqCr2f/KJFAaHt2412ukaCgOdupVT0zKaMFBtNrQfNAgjY2PR+cYbnVq7Th+mMNBgmML167E+IQEZX39NUdAAL0YMNDiTt5tYrdj7wQfyvo8jmZkUBt62R53xdX6JlXtoGU0YiBdd2759pTDoesst7oHi3V4pDDTwz/n6ayTHx2P/+vVGOvOtYWWubUJh4FqebulNXARWIwxyKQzcgtiZTikMnKHnoWdFkaNWXbtiVFwcet51l4dG9egwFAaN4bbZkCUKG82YgaO7dxvpzHdjK3P531MYuByp6zsUEYP338famTNBYeB6vM72SGHgLEEPPC+EQZvu3aUw6H7nnR4Y0eNDUBg0grwqNxdbX3oJqaKmfEEBhQG3Ejz+JXXpgDYb9n34IdYmJOCI8a4OZ46BS51BJ50ZcSuh3YABciuhy80364SiS6dBYdAIzrw1a6pryn//vVGupnWpgzjSGSMGjtDyXtsDn3+OdXFxOLRpE3MMvGcGuyMzYqAzg9ibjkg+7BgVhRGxseh03XUGmLHDU6QwaAhZRQWy3nsP62bNQu7OnUZ7iTrsDM4+QGHgLEHPPJ/z/feyWNe+v/822i2hjBh4xkU8O4rRIgaijkG3sWNlHYOICy/0LCzPjEZh0ADn8n37sGnOHGx4801UlJezsFEjPklh4JkvrbOjHF+zRhY42vXDD7KGAQscOUvUdc8zYuA6lu7pSVQ+VBTIyofTp7PyoXsoO92rqqqtATwI4BEAHZzusLYDVcXR335DUkIC9vz6q9EKwbgMgyMdURg4Qst7bQs3bkTqzJnY/tlnsogbhYH3bFF3ZAoD/djC7kzEFyYgMBDDnnoKUVOmwC80VOczbtL0GDGoB5uodrjzv/9F8gsvIC87m9sIGtyLwkADJB00sRUWImPxYqTMn4/CI0eMlFDLrQQd+I/Lp2CkrQQhDMI7dJDRgt733cfbFV3uDa7p0F0Rg/KsLHmb4qYVK2DjbYqajEVhoAmTLhod+OwzWZtDJCDy2mVdmEROghED/djC7kzEUcXIs87C6NhYtLv4Yp3PtsnTY8SgHnSHv/kGSaKoUXIycws0uheFgUZQOmgm8wwSEmSeAbcSdGCQmilQGOjHFqfNRO67qSoG/vvfiI6JQWiPHjqerVNTozCwg08tK8P2BQuwPjERxXl5RnpxOuUMzj5MYeAsQc89X5mbi20LFmDDokUoyc83io9zK8FzLuK5kYyylSCiBeGRkRg1ZQp6jRsHJTjYc5A8OxKFgR3exekbkTIjAds+/7z6b41z+5xnvafOaBQGXsXv8OCHV6+WUbEDSUlG2U6gMHDYygZ4wAjCQEQLxAuu97XXylsVw4cNMwDZJk+RwsAOun0ffCBfmDkZGdxGcMC1KAwcgKWDphWHD2NTYiLSX3sN5WVlRhAHFAY68BuXT8EIwqDKZkNYRARGPPEE+k2YAL/wcJdz0FGHFAZ1jCGuWN4yfz7SXn8dZcXFRnhZ6sadKAx0YwpNE1GrqnDwiy+QNHMmstPTjXDyhsJAk2UN1kjvwkBEC8SfHhdeKKsdthk71mCEHZ4uhUEdZHl//42U+Hjs+P57oxV/cdj4rn6AwsDVRN3fX/n+/dg4Zw7S33jDCEW8KAzc7xKeH0HvwkDkFrSMjMSImtwCi+/mFtQan8LgpK+BLT8fu0TtgpdeQt7Bg9xGcPAVQWHgIDA9NLdacfi775A8cyb2rV0Li74rIVIY6MFnXD0HPQsDESmwKBYMvON2DJs2DaG9erl6+Xrsj8JAWMVmQ9nOnch87TVseucdFOTmyixtAx3j0oVvURjowgwOT6IiJwfbX3kFGxYvRvGxY3rePqMwcNi6BnhAr8JAiAJZt2DkSHnFcocrrjAATZdM0fTCQOQUHPjkE2xcsgTZmzefuEGRosBx/6IwcJyZXp4oSEtDysyZyPziCz2XSaYw0IvDuHIeehUGIuGwTffuGD5pErrfeSf8mzd35bL13JdphUFFdjZyf/4Z21aswO7ff0dFZaURkq/07EvyNE/ff/4za8xTT80OHT58maIoFbqecAOTU1V1DIAYAJcBsBh1HVrnbS0txaGvvkJqYiIOpKToNWJGYaDVoEZqp0dhICIFzVq3xrCJE9Hv4YcRGBFhJKTOztV0wqBi714cXLkSmZ98gn1paSgpKkKAxSL3VvlxjgCFgXP8vP20tahIXjOeMncujuzYIXNsdBY5ozDwtpO4Y3w9CYPaegWhLVsiavx4DHj0UQR16eKOZeu5T1MIA1t5OUozMrD3o4+Q+dlnyNm1C2VlZTJCIF5+/LiGAIWBazh6s5eqY8ewa9kypCxYgOP79ulNHFAYeNM53DW2XoRBbU5BePv2GDJ+PPo88ACCzScKhJmFMIhXFGWNu2zu7n5VVW0D4CEAEwG0OzFeWRnKs7NxdO1a7Hr/fez+9VcUF4r3irgPS3e/hNyNySP9Uxh4BLPbB6k6fhy7VqxA6ssv43hWlp6+LxQGbre+FwbQgzAQLy8hDNr17YuhDz2ErrfeioC2bb1AQxdD+oIwaAlgPIDHYbNFlu3ahbx165Czdi32fP89DmVkwKqqevvlowvju3oSNcJg75inn54dGh0tcgzKXT2Gp/pTVfWMk3IMTLfPJMRB1ocfYsPLL+PI9u1Q9CGmKQw89QXw5DjeFAZy60BVERQcjJ4XX4yBEyei9dlnwy801JMIdDOW4AFgVVVVVXxgYOB63UzMwYmoqtoMJSW3Hfnll6f2fflln/1//IEju3ahtLxc5g2I7QKd7ZM6uEJjNJfeZLOh/+237x4dE/NccO/eKxRFqTLG7E+fpaqq0QCmArgGQIBR1+HMvK0lJbLGwcb587H377/lyS0v1zmgMHDGoHp91tPCoFYMiP/6W/zQcdBA9L3tNkTedJNZ6hQ05AqVNpvtw6qqqueCgoK26dVnGpuXqqpB1j17rk+Ki3tm84cfRpXW5A54+QXW2LR97u+rv2MW9Lv11s2jZs2KC4qM/MTIi1RVtS+ApwHcCsCcvx4AqFYrirduReaSJdj20UfIz8mRFUG99P2iMDDyl6q+uXtSGAh1K0KbQUFBaN+vH3pcdRUib74ZLQYPhuLv74t4HV1TLoAlAF5RFCXb0Yf10l5VVQvy8y9OiY2dvu3998cWHT3KCIEXjCNvJG3XDgNvu+2vQVOnxge0afODF6bhsiFVVW0P4FEADwJo7bKODdpRxZEjyP3pJ2S89RZ2//EHSouKZO6BhwWCiEDF319VNdOgGBudtun2rASRpf7+z6pAnDtDc2K7QLykgkNC0SlqCHpedx06X3klQnv39uXrkxt1uJMb1GwjbLfZbHP9/PzeVxSl2KEOdNZYVdVBO+bNm77lvfduyk5L8xMvLH48S6DSZkO3886zDbnjjve7jhuXoChKhmdn4NrRVFUV2we3q6o6VVGU3q7t3bi9le3bh4NffokdH3wo6x2UlVRfNObu75wCrFGAn6zAdw9UVf1pXIINz9yUwmAxMNji5zdZUZQbAYS5wrg1/8jJhELxaRYeji5nn43et9yCiHPPRWD79lACA10xlM/0IVgpivJTzYmEP4y+MFVVI/J+/fXBtIULH8744osOItRpyi+Ylwwp/UlV0e+mm44MfeihueHnnbfI6GJToFRV9dyaBMQLzFDkSLP7VFWh/NAhHP7+e+z57DMcSEqSZcRr3ivVxZFEZy6sDaIAcfdVVcVrnqNBG5ryvfU6EKBYLONVRXlWUZQmFw04OXdA2D8wMBBtunVD5Nlno+sNN6DNOefAr0ULlzqmQf2svmnn2Wy2NywWy0uKouw3+trEdkLVsWOXbHvhhemb3nnnbF6A5FmLimhB6+7dEXXnnX8OfOKJeKVlyx89OwP3jKaqagcAT6qq+qCiKKYph6qZptiuLS1FQXo69n/xBfb/9huOZmSgOC9PRm2lQK/9I3VC0/7ZU4FSBXi+rKpqzqOAYU+6aOHaNEJaetZ5mwVAUJC/f5wC/EfLVGsjAWKLQPyRqhRAUEAAmrdtiw7Dh6PLpZei/eWXy+0CfhonoKpqms1me87Pz2+lkTPHT16pqqpdj3711aQNr712T+Y33zTXyfGqxo1h8BbyqnKbDb2vuKJ48L33Lm1/3XUvKIpy0ODLktNXVVW8aq6tiRqIUwr8NEDAWlCA/LVrkfP77zickoKc9HQU5uSgvKICViEMRNjlpMRFzUJBVZdbrdb4CcAeXzeAaYVBHODfyc/vWlVRpirAaV82uSFQIwKEEBD/t9gxDg4MRFjbtmg/YgTajxyJsB490KxnT4T27YsAc5Uxdva7UQBgGYD5iqLsdbYzvTyvqqqf9fjxf2S+9tq0jcuWnZm7cyfvPvCAccQvwzY9emDwuHFrBjz2WAKaNfteURSbB4b2yBCqqnYUUQMA9wNo4ZFBfWCQyqNHUZqZiZI9e1C8fz+ObdyII2lpyNu7FyUF/9feu0DHVZ1332cuGo3uI1my5AsgMCRKwkUhoXEufas2ybJJm6LSpLhpuhBpAiohCxUwsgmgcQLG5hbRUKKEfI3SXOpcoOLLl8T5vmS9SnpzSpuoTQATjBHY2LJly7prRjOa+dZvZ+95j45mNHN0sezxM2tpCawz55z933s/+//cRy2sTErWa6KQMYgxmXzZk0x+LpFIfP0myxrJA2jmHcI5SwxA5QuWtdrn83UkLetmZRHQ8QEwSBZIoLDQKq2utkrXrrXqNm60at/zHitYV2cVhEJWYO1ay19Zme/rY7nGx1783zq24GfL9ZCVum8ymaya+K//uvFXf/d3n3p+z56109GolDxexsmAuLNX3/KXf3n08ra2vw02NHzR4/GcWsZHrsitk8nku7XV4H0Sa7CwKUhMTFixwUFremjIig0PW0O//KV1/N/+zRp97TVrYmDAmjh50opEo6lYMZsb4v/xeDzhT8RiZ22tFTeIndPE4NuW5Ru2rCtXX3HFrWvf+tYPrnnb28rLzj/f8paUWN6yMssfClm+UMjyBoMqk0CCB90srczXJpPJFz0ezy7LsvZ4PJ7I0tz1zLoL+ecn9u7d+qsvfOEjL33/+8UQz+WOmD6zEDg9b2OK3TT8yZ9MXHHLLd+o+L3fe9jj8bx0ep5+ep+STCaDlmV9yLKsdsuyLj29T8/Pp1EfITk9bSVjMSsRiVixY8esof/4D2vw2Wet6dFRa/zIkeix5577n7FTpx4ZmJn5p7BlnbWdOt3M4DlNDAxQr/zTP4XWve99f1FQWnqrZVmXuAFQrnWHQDKZPJRMJh/3er3/l8fjOenu22fX1clk8u3Hnn76rl994Qt/dOAnPymwaJa0wMCns2vkp+dtIQUIsDdefXX80k9+8gfVV199n8fjefb0PH1lnoI1KpFI3ODxeD7l8XguWJm3OGeeemDov/7ra79sb//6+37yk4PnzKh1HMa5NN6MY00mk/gFtuhiIg0CyrIg8KplWX9HbIHH46GwUd5/ksnkVYM/veTh8wAAIABJREFU/OGdzz/xxB/+Zu/eongiITEHSzDrkAK/z2e96Y//eOotn/zk/xv6/d9/0CLH3OP5bb5wHn9Ii00kEh/1eDyftCzr4pyD5/IYk2UYGvUvOi3L+qbH48n7mAInfmIxsCGSTCapafCHlmV9yrKsq8hAXIYFdy7ekkphv9Kk4CmPxzN8LoFA4aPJ//mfW17q7v7Qr7/xjerRwcFUpTYR6rmvBJV5oH8q6uqsSz/60eMXf+xj3ylqaPiCx+N5Lvc7nf1XJpPJ8pmZmT/x+XzIqissy5IyqkszrTHLsn4xMzPzeZ/P9397PJ7ftkI9xz5CDBwTrkrbWlajZVmf0ClCRAPLZ2EIoL0NWpa117KsLsuy/sPj8ZAxdM59KG2bGB//0ODevTe8+NWvXvrqv/xL4fjwsEXYfKqk6yJyrPMRUEUC6IlEdpB2G5SWlVn1/+t/Rd94ww2/qt206e+t0tKnPR7PsXwcf7Yx6aqI70BWJZPJqz0ezznbnjUbVjn8na04kEgkfuD1ep+0LOs/8ymrJYfxz7pEiEEGxPDlWZb1+4lE4kNer/ddlmWtFVae8/KCdR9NJBL/lkwmn/b5fP/7XHEdzIeQJp1vToyO/ungj3/8gcPf//6bj/X1lQ4dPGhBEjCrmPy6c3ljGl8AGKAGQwZWXXKJteZtbxtfe/XVL9a89717veXl37Is69fngusg265LJpOrZmZmft/j8SCryFygIJJYELIB99u/E0xIvYt/tSzrO5Zl/fRcs2img+lclj85LZtkMhmyLOuyRCLxTsuy3ur1eusty4KZF9nkeE73yuOLWEdkFxxPJBKveL3eX1qW9XPLsp7zeDxDeTzuBQ0tmUwitM+3LOsdscOHN44999ybJg4dWhMdHg7NTE35kolE8lx2MeiSth5fUVGioKxstHT9+iPll132QsEFF/y7ZVn7LMt6LV8KYi1oAc2vzFzOukokEo0ej6deWxHIZsj72IscsURWTWlZ9bLX6/1PrAOWZb2QjymuOWIy5zIhBjkip6uPlegOZxAD/ls222/xS202y7IIKpwUTS63hZVMJoljocxttV5bNM2RdfXbNYXbiXoEuKNGPB7POZEqltvKyXyVtkzRopk1xQ//LWvq/8gqmrUdtyyLrKgpkVVz15IQg8XuQvm+ICAICAKCgCCQRwgIMcijyZShCAKCgCAgCAgCi0VAiMFiEZTvCwKCgCAgCAgCeYSAEIM8mkwZiiAgCAgCgoAgsFgEhBgsFkH5viAgCAgCgoAgkEcICDHIo8mUoQgCgoAgIAgIAotFQIjBYhGU7wsCgoAgIAgIAnmEgBCDPJpMGYogIAgIAoKAILBYBIQYLBZB+b4gIAgIAoKAIJBHCAgxyKPJlKEIAoKAICAICAKLRUCIwWIRlO8LAoKAICAICAJ5hIAQgzyaTBmKIJAJgZaWltDExER9LBYb7unp6Rek8h+BD3/4w3RZ5GfgO9/5zkD+j1hGuFQICDFYKiRzuE9LS0twdHS0cXR09JqxsbHmSCQSSiaTu6uqqrp6e3vpTigfQWBJEQiHw8GBgYHrx8bGto2NjdUnEon9Pp8v/Mwzz9C2WD55iMDWrVvrRkZGbh0ZGWkdHx9HxuwNBoM7nn76aTpTykcQyIqAEIOsEC3+gnA4jLbWPDU1ddPw8HDjiRMngqdOnbKmpqYsr9fbFwgEdvzHf/xHz+KfJHcQBP4PAg8++GBdJBJpHxsbax0cHISUqj8GAoEuDoru7m7RIvNswTz44IONExMTHSMjI80nT560xsfHLZ/PFwkEAuFvfvObu/NsuDKcZUJAiMEyActtIQSWZTVblnUr/dGj0ajaqMPDw9bIyIg1MTFh0Xve7/d3lpaW7ujp6RnO5XWwPMRiMawO2yAXiURix09+8hPXxGLLli30aw8ePXq0XywWuSB/9lwDKfD5fO3xeLx1YmIiaNabx+OBGHSXlZXt2LVrl7gUzp4pzfqmkAKv19sRi8WakTPMeSQSgRjwE37iiSd2ZL2JXCAIWL/teS6fJUAgHA7jy4MMDGC+9fl8TR6Pp93j8TR5vV71hEQiYU1PT6vNCimYnJxU/29ZVq/f70eD6832KuFwuGF4eLj91KlTW7A8QAz8fn9PcXExxKIv2/f5uzY13nTq1KlWtMhoNBru7e39Yi7fPdOvufvuu5smJydvHRsba4rFYmCzJxgMPvb444/vP9Pffanej7UYCARYe60+ny84MzPDHFvgwcfv93d5PJ4drNWleqbcZ2URCIfDjQUFBR0+n68Z8hePx9Wc89vr9Ua8Xm/4M5/5jFgMVnaazpqnCzFY5FRBAizL2mxZFtaBvfz2er3tXq93C0LZkAKEM4KZ33zYvBAF/i0ejw8kEonwo48+Ou/h/Mgjj2ycnp7uGBsb23zixAlraGhIEYtAIDBcWFi44xvf+EZntuGgSY6MjLQPDw+3Hj9+PIj1Ah9kQUHBjh/+8IdntQ9y9+7dzfF4vGNycrIR0gW+gUCgn7Ht3LmzOxs2+fD3tra2UFFRUXsymWzz+/3BQCBgFRQUcDikhschsXXrVtEe82HCLcvavn17g2VZHZZlbfH7/VZhYSHkT8kY/emHCN55553nxB7Ik2ld0WEIMVgE/JCCQCDQmkgkauPx+Fcty9qIlcDn8zWwMRHGMHbMevj7OMyxFhQVFVmrVq2yqqqqrOLiYkMSduESCIfDaYMQH3744WbMhDMzM41YCdD0uS9EA8Hv9/vDf/u3fzuvsIcU8H6RSKT11KlTQd4HywUaRUFBwa5AILC7u7v7rAyC3LlzZwMaE8IRzI127PP59mFG3bZt248WMdVnxVdxMYVCodZYLNYei8WUBSsYDFqlpaVqzWmCgPtADomzYkazvyTWv+np6fbp6enWeDyuFBFkSklJiZp75JDP58MSuWPr1q1ZLZLZnyhXnAsICDFY4CxDCkpKSloty3pHPB7/6czMzDuSyaSyEuDTI3YAEsDh+/LLL1svvPCC9frrr6sDCy3u/PPPty6//HLr4osvtiorK9m83TMzMzu2b98+x++7c+dO4hQ6PB4PPkR1b+7DD1oxz0ML7OjoyEgMeN+ysrJbLcvaFovFCIZUxAKLA98vLCzcSxDk/ffff9ZZDTgQ169f315QULCtsLAwiKYERpZlRTwez66pqandmQjXAqf/jPzaLbfc0hyLxTomJiYamdt4PN5XVFQUKS8vb6yoqGC9svb2oj3efffdZ908n5Ggr+BLse7Lyspao9EoAaZ1ExMTkUQi0VdSUhKsqKhoLC8vVwShoKCgKx6Pi+toBefqbHu0EIMFzJghBbgMOHzQ2pPJZL25FRorGj1EYP/+/dZvfvMb9f/6g68b5l6/YcOGpne9613BDRs2wPLTEoO77767OZFIKEsBBx5an91UyL95PJ4BiMHtt9+e1hVhf1+Px1MHmTBaNQcoZMPr9e7H6nDnnXeedWlsN9xwwyairgsLCzeCDURHu2v2oCk98MADeR9fcNttt22MRqMd4+Pjm8l4mZiY2Ds+Pr6jsrLyitLS0nBlZWUdB0VhYWEXBFDiCxaw8c+wr9x2223XRSKR8MjISANzPjk52RWJRHbX1NTcVFJSsg2Fo6ysLMK+3rlzp8QXnGHzdya/jhCDBczOtm3brissLAwHg0HM18oVwAHLYYtvG7fBa6+9Zj3//PPqtzZrYwnosiwLlwNBX5vWr18fvvzyyzdiOaioqAhv3759lsa/ffv2Zh1TQAqSuj8mYQR8WVlZyjzs9/uVubytrW2OudyQAlwIFDsx7wo5MD9A4PV6e7xeLybmnAIYFwDbsnylqakpFAgEOrxebxtzYSMFvT6fb8d3v/vdvDefYk4mtkK7iKxTp071TU5O7ohEIvsqKio6SktLW3FdlZWVDRPk+vDDD2eNRVmWyZKbLhkCd955pyKCExMTm4kTGh0d7Tl16tQOr9eLtaAjFApthhgUFxf3EWPz4IMPus5aWrKXlRuddQgIMXA5ZaT4FRcXd5SUlLRwOOPHM7EEWAUGBgasV155RVkJIAhYFHRQIozdbr5tWr9+fcdll13W9Ja3vGWgqqoqfNddd6U0fqKMR0dHO06cONF89OhRa3BwULkm8B/W1dVZtbW1Kk6BdygsLOwk+PBv/uZvZqU7GlKQTCYVKYC88IOFAxcCP5ANj8fTn0wmdzz00ENnXXDSeeedRxQ2sQXKzcKP3+/vgxS88MILeS8MmePx8XEVVzAxMUFg6cDExET4Bz/4wRd/93d/t7m0tLQDs3JFRQVrRwWZPvjgg+JGcLnvz6TLIYLs6Wg02jo2NkZ9in2jo6PhH//4xz/6gz/4g7aioqKOysrKEHMeDAa7IPwPPfSQZKCcSZN4hr+LEAOXE/TOd75zU3FxcbisrGyj3njqsMWna0jBkSNHVKqQtgygnXHgO2sUXHfhhReG3/rWtzZs2LBhXygUCn/6059WGv8DDzxQPzIyAiloOXjwIDEKkePHj++dmprqLy8v37x+/Xq+Y61bt474hAHe55577pnlRuDAKCoqakWAJJNJRQoMISB4kffldywWg7icrYGHZIJACtrMNHo8nj4E4czMTN6TAsbc3t6+KR6Ph6PR6Mbx8fFIJBLZNTAwAAklpqCjuLi4zfiaA4FAJ77mzs7OnOpluNwacvlpQqC9vf0m5nxqaqpufHy8f2pqasd3vvOd7ve///2NwWAQpaWZOS8uLhYL0Wmak3x7jBADlzNaWVl5E26EsrKyOh3Yo7RuzHnHjx9XUf76oyKBdTzBnKcQLLdu3brwpZdeGqytre0KhUKY8Qc+97nPhcbGxkgnbDt48GDwhRdeiBw9erRrdHQUYU+2Q0ddXV3Tm970JuuCCy4gs0HVMAiHwykXgMmW4NyIx+MqpsCkS/J+FD4ZGxtTbo94PK5iG3p7e8/GYjcqKBNrgQYYDMD8nCAF27Ztq5+ZmemIx+MtWJOi0egeDol//Md/3N/c3NyM5lhcXNzIOi0sLFTZCGeCVYiUSmJsIpHIcFdX19m47lxKjaW7fNu2bU3MeSwWa5qamopEo9HO4eHh3RRHu/baa5W1oKSkJIRlsaCgQLnTdu3alRfuNCwlZNtMT08PPPHEE2IBWbplNedOQgzcg8tBFJ7na2hjmOQfsywrrdCrr6+vO++88zpqa2tbzz///OHy8nIOduX3vf/++1smJyc7jh07Vn/gwIHI4cOHuw4cOAApUHEJwWAwvH79+o0NDQ1kNhBxHt61a1cqsAhS4Pf7W2dmZlTKmq6ToNwGWAggBLg8IAjT09N7cSH8/Oc/P1tNy7hImAtqSZxTpIB5jkQit8bjcZVlEo1G91Go6itf+cqPmpubQ6FQqCMQCLRxQBCQSQwJ2Qg7d+5c0RiS+++/n3RbgiQpEd5Piu6TTz551rmw3IuNxX+DgxG3WSKRIBNBEcHp6WkKo+3/yEc+oqwFhYWFEEKV+eTxeDohivlgIfrsZz/LemHdUEG2l7Xc1dWVF4Rn8Stj6e8gxMAdpuSGQwxIU0z3IfqdQ5po+Iz1AK6++mokd0dNTU1jZWVlL3Xrt2/f3vvAAw80EUQ2MjLSdPjwYVwTXf39/Tv6+/sVO/Z6vTetWrUqvGHDhjpcCatXr+6tqKiAVKQ2CMSClLXJycl6Dn/IgNYm1W+sBNqFsD+ZTIZ/8YtfnHVZCDbgb9LEAAIGQcj7WgVm7LgQmL94PE7Rq+FYLLYrGo0+Rh2KlpYWZS0oKipq1KSAtM3wfffdt6KR6eFwuJ5aE8lkskUfbAynS8e3iAaYRRbhQqAQmtaa98/MzIS/+MUvqv37sY99rA1iUFxcTDAupABZFL7//vvP5v2tEPnsZz/b5PP5sIw1IcPi8TiyNfzggw+u6Hp2d3ScXVcLMXA3X6QkQgxaHF/LFGA45+5NTU3Biy66qL24uJh0oiCBg/h9i4uL6X+gIssJWjx58mTPsWPHMPErDa+kpKSuqqqqo7q6urW+vl7FF5SVlamgw3A4rHzG999//6bp6enw+Pj4RtwF/GAdgAhgMbDVPhhOJpO7JiYmHuvv7z8rCxppYLEUQNYYwzlzsOBCSCaTpLC24MaKx+NdpCbSFIn2ypCCYDCIWdlUwFMalp1Aulv2S3P1X/3VX5FGFw6FQpRsNpX5uokJSVe/Y2memh93wYXAnHM4QgTj8Tj1OQwRbCQguqioSFkLdGZOt57zs9pVg/Wrurq6vaKiglgZrKFmQonJkuqdy7S8hRi4A7ZJEwN+mw8bD7cB5tCsQV2f+MQn1CYuLi5uLikp6ccHiEmwsLDw1mg0uo02qcPDw32jo6M7vv3tb6d85ZdddhkBRR2rV69uXLNmjRUKhShes+Oee+5R19BAJRKJUC65mZxmyMXQ0ND+kZGRPRMTEw0UX+I60hUppoS/ef/+/We10HA3dflxNUVtVq9efWsymdwWj8dDsVisF2JpzKo33nhjKrbA1HRIJpOduqpm1vW5XCjhPiONDmJ73nnnYe1SFRn9fv8uzOHnQgGqhWJrdyHo+iMqLsjEZ3zyk59sI2XXZi0Y1vN91qel1tfXb6yursbtStC1ysQqKioaKCgooJppXvR3Wei6WM7vCTFwh66dGORsJbA/4lOf+pQy+ZWWloYKCwtV7QBKKsdiMaKMN46NjQ3gK/7Sl76UWvRYGcrKyggq2sbGCIVCKkXRCHtKHVPvwOSxa1LQNzY2tuPo0aMcBlg5MMchiHtJWfv1r38t/jl3c39GXH3HHXfQnAs/czrNMUQmAtYCXeUQItjHOjEEcgUHoczB5eXlTQTNanLQR5fHzs7OcyJYdKHYb926FQsl1oL66enp/WQkGBdCS0tLI7IBRcNmIeqJxWKzApIX+uwz4HstrJvq6up6s25WrVrVgwv1oYceWtF4mTMAm2V7BSEG7qDFbH092QGWZeG743DN2RR/yy23NEAKgsHgFkrVUpFsZmbmGUyE09PTWyhpGolEOsfHx+lZkNLuPvShDzWRj15WVtZEimRRUVG/Nr92E4RWWFhIrfRto6OjQawFFLiZmJjYcfjw4X3cO5lMtmpLwQC+5l/96lfCtN3N+xlxtVNznJ6e7qaQUXd3t7L8EFuANaq0tFRlImiza7c+JFbaOrRRE9TNuBFWr14dWbVqVWdlZeXu3t7eeS0ZtC8fHh6GCIUSiUTvuZTJQCEjcEskEpuj0WiEWBKqG5qeJsQWMOfl5eW4kLAGqjLg0Wg0X8qAX6fjhxoIpF2zZs1AZWVl+D//8z9Fhi2jVBJisIzgOm/d1tbWogOE6gsLC6lWuHtmZuYKDvXJyUlaKPdwoD/55JMpJozpmBa6hYWF28rKylS9+4KCglT55AceeKCFkskEG+qYAkUKnnrqqZ53v/vdKlgpkUiohjoej6cLE+Szzz57zvjjT+P0LvujHJpjHwf+l770JaVtY1Ui00XHrqhCWD6fT6UofvrTnz4Tov6JByFol0wSOpB2FRUV7Z6YmJh3LVLTgyydsbGxFtY3lrWvf/3r54RvWbuNqENC5kkwGo32kGXQ3d2t5MOf/umfNmiFYYupqULDJPb4Pffcky8WQWQXawblhroMu9etW0dQds4K2bJvzDx8gBCD0zSpra2t9Zj8CgsLW3SOMf6//dPT022RSKRhcnJyPy6Exx9/fFYU8cc//vEmnZvcpFPPUi1Ud+3atYnI5OnpaYrbkIKo7vGVr3zlW9dcc80mSEEymdxIDQM0LQTGj3/840ULDATW6OgorY0JdqTi4P6ioqKvfu9735u3JwHxFclkMkhznzOpi+NCx3Oalo56zNatW6nVgObYjOY4PT2Nbz6lOb7vfe/DmkSVwyZK4WqLgQo6XK5DAgtGIpEIzczMDOSaEldXV1fPIXfy5ElIS1bhvmvXrptY06dOnarDGsZ/79mzZ9HEgCDNoaGhjZFIhD1U7/f7f+rz+fb84Ac/OGNI8+233646qsbjcVL0+iGC9tTOzZs3U321o6qqqh73onYldOuGSctiIWpra6unURzzd7r2cH19fXB6ero+kUhEBgYGlmVcp3Mvnw3PEmJwmmYJa0FhYSGRw1gLCDrco32GWyhUgolwaGhoVttjDqzS0tL2YDC4jY5plF/GWkDAIrnrWAqi0Sj5vZACYhN2T09P04+BSocqLUwXNxqemZnZdfz48cd6e3uzCuNMkGDSnZiYaB4fH791eHi4UWtwmKwjwWCws6KiYpYLxNwHd8fo6Gjr+Pg4hZv2EUH/gx/8YMX9g5nGU1BQECkqKuosKytLO57TtGRSj2EdEJmtO2NSv6AnGo2mNEcufPvb396G9lhdXR2inbculR2hudZypCkSJU+tfoghMQxf+MIXljzQjfmBFEOeIQUUESPrZjEWA1Imh4eHr8cCMTo6Wk9dD4hzYWHhADVCvvvd754RJmoOYFI7E4lEiy5f3qnnXLldGhsbiVHCbdRGIKdp4V5QULAfd+FypClisSKWiawIlAxjrTrd+yGX55HNMDExAQkNRSKR/n379gmhyAU4fY0QAxdgLfRSrAX4AY21gNa3yWQSrW/z1NQUbHgPm/7xxx+fpXHfcsstTWz+YDCorAWBQAChsCOZTO5JJBIUMGqNRCLByclJKqDtmpycVHm9RUVFt3q93m2YbBF6MzMze9A2KISykDFwsBcXF18Ti8W2cRCYls3URCAFkqDGYDC4D8H6+OOPz6olYKowTk5Otg8ODoZGRkZUyV4ICsINTSCZTDYEAgEwihQWFvaaFM353rWlpYXUUcyMaC6utLz5xkPUN775oqKifXQlfOSRR1a8NsLtt9++CT9rIpFAw+1nrfz93/99yj1AKisHaHl5eSs9NDgotAbZS9Okxx9/PCcrEesUshqPx1ln4JrW90+RIjJgpqammskrxzL1xBNPzNfyG42cRk/9bro6hsNh1gUEdwsWMU1EFTF2G2dAgG4ymbyePRONRuu5nykLDnkm7qGoqGgPVUQfeeSRBe2TheytTN+54447bqJOxczMTF0kEumNRCLs39Q8lpeXb8QtWVlZuZksJYKSdffMbuqidHZ2Zj0ItZsSTZy5YQ9ltAJQYIg5n5ycpEBVP8TAWZgKeQX5n5iYQCbt+v73vz9r79DwLBgM8jNMpcb58GKPUh2zoKCANG7WTU4ZNdu3b28YHx+/aWhoaMvg4CC9Q5B/uCA6g8EgilFO91nKuTwb7yXE4DTMmkknolRpMBhEiyOyGJ9hw9TUFO6EOS4ENm1VVVV7QUHBNmocYC3w+XxUr9tNXXwqG0ajUYQGpIDYgd2UCb3llluuI5XH5/ORosjB3Y9p8YknnliQn/mRRx4h+Ak/52bcABANDk8K1KDJ8P98/H6/CojcuXPnrOc8/PDDzVgvIpFI46lTpwYGBwf3nThxIkIGxtTUVD334R6QC0yhRUVFXQi2TCZdNv7o6Gj75OTklunp6WBBQYEqCf3EE0/kZIHIZTy6vXW/bk+8INyWalndfPPN6tDHx6o1x66hoSFq49vJkCIOPp9vI26EtWvXWjU1NQMQm2eeeSarBsyhSRnuiYmJVgJYNTlSXfm+8IUvzMoY4FpcGtPT0626UBZDpdjMHGJAfEA0Gr2VeguQVEr0ck+KeWXDR6//W4mZKCoqIi1TFeeanp5WpcY7Ozuz3kO9WDiM1W0z3UVxq5kuqNyPtcdviAHrj/eDSK10vQdaaONCIODQFK968cUXndY+VdwrEAjUVVdXqzmvqqraV1ZWFn7qqaeyklnI3cTEhKpACUECA/YS8+PcS+wZCq9Fo1EUGeZAEYPOzs7U3rjzzjubqcNCZcKxsbG9IyMjO374wx/uu+qqq6i+Cv7Xeb1e2qJTiyD8s5/9LGNxovvuu28jTcFmZmY20y3S7/d363WTkezohnEQP1K+68nMOnHihCKT7BtiL6j5snfv3pzWTbb1me9/F2KwzDOMXx2TYDAYJGJcaf0IJyKscSHgK9ZZCLNM/GiJmIGDweBGDsyCggJjLThKAJYmFdxHpSaxmU3Wg8/n28Lhpq0FKnLdrYbFRisrK+M+mLAbdJyCEiC8P/fnw3+jaSSTya5YLPZVu0ZoKt35fD5VEArtEtMtgoj/NlUZdVtqVbo3GAyqSpB27chMETEV9J+ngBP34J0CgUAv9RwefvjheTe82/H4fL4uj8fzVfpXLPMSmff2t912m0pVSyQSpKrtY+6ffPJJp+A3FSBVkGlZWVmksrKys6qqandfX19WzaykpCTVnZE50Qel6lBpb9cLhhUVFe2JRIIaCmhyzL+qQnfPPffMEvTU1cDVFYlEiIlQY8SFhoDPJRjywx/+8HVYoCorKxvQhmmpzfNI18u1oh8kpqCgAM2bZmKpniGMj49jDfdRU2FycvKZlaypYBQCLH5aeVD9LxzWPrRpyCJWQdVRNBQKqWj9l19+OSciSHM1yB3aPXuRjyEG9rLZn/vc51RRN1wauoYC+07NQUdHh4qH2rlzpyL/WBPZl6Rc6+ZOpFHTE8O0nlfWuEAgoKwaPT09cw763bt3N9MLAkWCA52xIRPmI5R6niF+rYlEAoVLlXw3Rd4glFhZUVyeeuqpFbcGraQ8yfXZQgxyRWqB1914442q+Ahajy5PqzYJm4VeBdo/O6tXAU1m0BiodQ8pMNaCZDL501gsdk00GqWBCvfYh7Whq6vrR8YP7ff7txEcpDWjPpj9I4884ipP3C5QMTOy0dhcWmNTQpr3wvSPCdbv96vWrs62z9RsIAdZmw+VUDBdHk1TJ1s1RqW1EUnPgeRs9sNBAyaxWEzFVCA0jDDjensTKedUuRkPc1RQUECcxpzxLHAJLPhrt99+O2mxypSOOZRqd1SrTBP05ezfoQpYZerVYX8hyBYaHNq06auhid+cokiPPPKIIiAejyfVwjuZTKo6Ce3t7amvWzD0AAAgAElEQVQ1xmECKcBSYNp7I+BxoTFX7e3t8/bmuPrqq7EmdXi93s1ow9Q8wIfO+qAbKK6Ljo6OecvhPvzwww0+nw8SA3bqsDBrmAOOdUuAJmnD2kW3e+vWrUseJ+F28lEIcCFYlsV8qLLHTzzxhLOssbMCq+qQqsuxZ40hYh55BnubOddWP6V43HvvvSkMaOimu7O2eTweJVO0YsBc0/StD+2efWlZ1mbGajq4mn3N/BtiYKyLXq+Xgm7EKMw6pB966CFV64IGUcwX86TbqHdhvUtH0tnbWnmB/Kl3tHeShSDwQyGwZDJJFljv6QqadDv3Z9L1QgyWcTbIKGChBwKBJg53DkY2hyYFaf10vA7uADo4FhUVUfdAWRk8Hk93NBrFpNqiSUE/FeO6urqUOa+tra0ZAlJQUMABaqwFKmAp14hx7mPYdzweR4vEV0hdBNVSenBwUJlfaedaVVW15+KLL8ZMu4X4AgTF1q1bU1o7TV1IMyOKnjEghE1DH3DQxZZMyV6lvemfOSl2vJMWPmx+NTYElK7NgJaXsXLeUo1nGZdJ2ltroqcqHOrI/z34mZ3CVMdZ2Pt3KKGtm0rN+9rGouP3+ykik7o23WGP0IakeDweCiwp4Yu1wOv17hobG0vlzGvLjAqUpLmVfa68Xm8npnongbS/5ObNmwkOpF8I67yfmImLLrqo/sILL1Q+dD6JRGLeaomQSPadzuBQFipMy6zhoaEhtXbKysr6a2pqei688EJiW5oLCwtVaea/+Zu/yeqbX661YHcb0Q9gZmZmTk0T/exUTQid2QGRNY3Wss15E3LC7/c3ISdsnx4IHoe9+bcHH3ywRe874oDUviNORGc9dJPZEQwG2z0eDwoAbj1FuMz+NnvaEApw18RCuYPsXR9xO/FelOMwz+K31+tF9iFb5pC2cDhMaW3IXyvWFUgI8km7RRTpY11rywvvrxSxRx999GxtGrdcS2/OfYUYLBPUCHa/39+OBk+AAJuGhc7ChRjMzMx0sUidgXMEgBFUFAgEqHmgzOv4x0jViUQiWAqodzCraQ7foeId3+E5mrmrPHe7KTjbUHWAltpo+O8xxSFMX331Vau/vx+fHcJqb0FBwe4PfOADFTU1NeHq6uqNpaWlw2iC9s3b2NioukRGIhHSm4ybQAkOfhgbgh6fOL91a2CEyl4EtNEqOWgKCgpu5aDx+/1YUszhoKr60YDHrq3ax7iQ8dTU1Kjx8A4rqUG2tbUpUplMJmmzq1LVMsSJGLNyGw2Jcj0gTI48MSwEeDFHCHKv14swpQ5/6rDXOKbIh01wo4XNSoe877778CWHvV4vGntqrpLJpGratX379oxNfXin/v7+9uPHj287fPjwwOjoaPfq1avrL7roopbGxkbVH4T9kEgkuiFJ4XB4ziEOKdB9JFRgJKT2yJEjav2yjkdGRpjb7qKiosf++I//eFNFRQVrmDiOPub8jjvucGVdy7an3PydzCVzEKPZYu3LEDiqLEmUr9DzzbxntRSQ6YBsgQgiJ9hLes5VCvT27dtTMQO7d+9OkQ8OWiwAKCTRaDTlmnzb296mzP6JRAIiZgI4lTXRyC6UAUpf89soR+xbnnfXXXcprNnjBExDgj0ej3OPqw6wTisT3yGQFGsBTaUM+YMAMu8oKxdccEHf2rVrCdJkTShSw73C4fCKxg25WRMrda0Qg2VC/q/+6q+atbVAdbjjYzOrqfr2X//61+f4xQlU9Pv9dvM7MQkDxCRMTk7WocHTNIfvG1Jx66233hQIBIhHqGODaobeSUnkXK0FCH8yHbAUkOmAZvX6669bL7/8shKoY2NjaBKYK59585vfHLrooovo26Ci4Nn0mKO3b9+uAtDIOz5y5AgmwW06BiEtypABhL2pnV9VVaUC5nbv3p3yk4bDYdVxEk3VftBos2Qnvsd0EcsLGQ9tsOvq6kwN//DWrVsXnS+/kOWFKwmB5/V62zCDozkyl5myBLTVAIJAPETWA4J3uvnmm9UBTpCqOSC0BWYPJO+BBx5ImXl37tyZimHgkNCNm6jHvysQCDxmfPIEhlKu2ePxbGGuuK+5nl4iOpgzo0Z+7bXX3jQ4OBg+cOBA8NixY7sSiQTroH3t2rXbfud3fsei1ThEkl4fECVn4yUT14C7iX1C8Nlrr71mHThwgLUMsWa/oVn3XnnllRsvuOCCjjVr1myuqalJVRO98847V+TQID6IDCTjNkJp+PznPz+fawN3Ap+cLByQrpKSEpWt5PP5UoevJoKdFJsy+4g0UTRxDJG67ohyw4yNje0fHx8P/8M//IMhd/O2oGcNQPrZUwRH8hvXUHl5uYo1uffeexXWNH+jzDPuLLNftKUpQrO3QCAwp4oj3UV1p0nKyKcUGOZ5fHx8D+ty06ZN19TW1m5bu3atCt5OJpPKSmsnQAvZn+fCd4QYLMMst7S01LHJfT5fK9oxG4SFrhm38hX7/f45vuK//uu/Vv66QCCwGTLBdxH0OiI7iK8sGo0qc9g3vvENZQ77+Mc/vhFrQVFR0WYWvxbG+9k0n/nMZ3JquYpJDuvGzMxMihQcOnTICNThiYkJNjCNopQQ+p3f+Z2bVq9eHV6/fn0dgjoQCKh8eZvfN1MXSoM291HlpAsKCppqamoaLrjggkhVVVVXTU0NtQNUwB8HJNof/2ksBToAjQNnH/naaQLx0EAWNJ7zzjuPDpbKBElmR3t7+4q0dcUtpK0FBPApEplrymEuy/nGG28kmBRcVWMtW0DpPgieHVNa3nLYo52aiH6dSaKCXjs7O1Om57/+679mnlj36uDhvpDheDyugtW+/OUvZ1yPt9xyyyZIwSuvvNJ46NChrqNHjxrTOLn64be85S3W2972NnXABIPBOcQAUgCBhBSgPeL2MqTg2LFjpHimGp2FQqHQpZde2l5XV9e2bt26oO49sp+x33nnnTntmVxwdnPNbbfdhh8fYkB9EmURcRswPN/zbrjhBhXMTOyCfc6ppwIRtLuoPvOZz8xyIaCBYz0cHx/vHB4eJmjQBLTOSwy0vGCf/3dxcfEVtbW1zRdeeGGorq6uJxQKqYBp9rgmRG265ooJMlWmfw7y7u5uZwxWPeuXGBZkKnP9yiuvMN8DY2NjWE++SL2Yt7zlLR0NDQ2bL7roIlXXg/glLAa33377ipA/N+thpa8VYrAMM/CJT3xCNf4gN9+Y9k3wUywW62Gxf/Ob35yVXgejx1/n8/m2kdIDKUC4mjQtSAGpjUSlP/3000p4mXLJRUVFqlyyaWU7MzOjgs/SmVqdw0U7IMAokUi04T6giAyWgoMHD2KC7RseHlZWAqOJXn755RtXr16NtUAFhmEt8Hg8yqRs8xmGtKkT87b5ICC+qgkBxIBrlFZcVVUVrKmp2YOw+Pd///eUpvrRj360GeuJ1+ul6p86aBBS0WhUaasjIyNzCjYtZjxojpg9SVtDWC5XxcD5lhzVBFk7pCfiw6cw1YkTJ2YVvlrskv2Lv/gLdYAzB8bv6/V6Vbrp1772tZTQ1ARL9drgmZBb7QpTtRTsrg1iSnhvn8/XbGIQdOBhBCI8PDysaleke/dwOKxS544dO9b86quv9hw4cGDH66+/bvYHayR80UUXBd/xjncQb8AcdWJ9MLEKBBrqdLotaI9YCiC2HBbHjh3bS4lwy7JSh8tVV1113apVq8J1dXUq40FXIu3WTcly0sAXOwf279MPgfkgJTiRSCit9tFHH12yw4tiPygP7DWzj5h3r9erKmPaLZcEE2oyroIJsQ4he8bGxnrB0WHlRAHAmkTmDGSePf4iFV31D/9GpgyuwFYIY3l5ec+aNWt2PP/882p+6QaqrUyQ4FRgNpUemY+enp45ONAfQjcSCzHfWl6RCr07kUgotwpjvfDCCzuuuuqq0MUXX2xRMpoGcjqoWFIWsyxgIQZLucMtyyI9kcPM7/cTDJg63LW1QG16u/A1j2eD6O+R3qisDGxKbcLjt6qOSGqjEbAf/ehHVblkmitxoPG8ZDKJ62FWdPF8Q2xvb78JzZsIZTSt48ePI1Qjx44d62GjTUxMpAgMBYnWrl3bXl5erg5zBCrBQWzghx9+2Gn2bNbkgEMdAYG2Yk+luo7nlpeXN9TU1OwvLy8P/+IXv0hpawgzhKXf78e1ktI+SfEkPoNywL29vXNSCRmPLgaUGs/hw4dzGo/uQ6GCne6///4ViVAPh8Mpbc2yLBUQNl/Ghdvl29zc3ET6rM/nU64ZnYEAjrvJxjAR2/hwfT6fiu2AQOiaGCZwlkDYWRrttddeqzJQjLXA1AmIx+PqwN27d2/aA9e4fOgMSlXMEydOOA8fla553nnn1WMxuPjiiyPEBZj0SCLno9EofuY2Uu9wgR09etQ6fPjw8MmTJ7tOnjz5mL0fwzvf+U7WG6Wjt2Dt0mWElc/7vvvuO+3xBeCM28jj8ahgzUQiwbpL6x5zO9fm+muvvbZFy5Z6Q9qMn//rX/96aswQQfacx+NRTdc4qLVCkyqgliaiH7LBOsEi49wzEAdcEipd2RkDwx7HWlBQUKD2uAnMZo9DJmkW5SSTdgLKGkOROXLkyMDx48d3v/766ybWQpHr+vr61quuusrasGGDIgakY2pikFPNk4XinQ/fE2KwhLOIBk8QDVp/QUEBBV1SWi7EgNgABFC6gEOEn9frVUFBCGw2Jd+BEfNDJz2EcW9vb0rAfuQjH2kvKioKc0jr3vZo78rVcPfdd2eNvCXADYGB/95ssuPHj0dGRka6Tp06tfv555+fdfB++MMfps8DFfaI5FakJ5lMKrNnhkprpjMaGxGtzVgD6letWoVwbqmuro4UFxerVCu7EPjgBz+o6sSTZWGEhi5Io/K6e3t75+QjU3mNQ8+MZ3R0FKITGR0dzWk8OgBPFVPJxdqyhEtH3YrIbASax+Np8Xg8SmNaap/3Bz/4QRpyEY+iAmK9Xi8dN3ezNu2kwOv1qoZHpCYaLVNbAFRQq71VcnNzs0olxVpggmz1tco6lqn8tc5gUM8hHZPU27vvvttpygeLjnXr1tVfdtllxK/0YVl64IEH1IFmmogR5Mo+wax87NixASwUJ06cmNVsh0ZTdXV17bQvLy8vV35nfOyZ/NhLPb/p7vfAAw+oPagDCZXbKJcCULm+W1NTU115eTlVV1t1SXXGrAIt7SWNNSkwzYqIV7GnHqrmbs7CR6FQSAV6JhIJFXw8PDyckk3sW6w4yWQSBUERT00MUlaj9773vc1YMoqLi5UypC1S1HZRBdvSFTn78z//85tw+VBJk+tPnTqFvNr12muv7bY1VlIK04YNG5re/va3W7Rr1q4ERbrmy4rJFdd8v06IwRLOcGtrq4okx29uon4RkDr/XwlUO0M3j25tbVVars/noyCL+mdTDIjDbXJyUtUr+Od//udUYZv3v//9jaFQiJKozZhD0Xb1wdapI7bnLWxjaiVgckM74D1HR0cjExMTXbBvpzbe0tJCoSUVy6BNr5CC+WIZVIU8nd8MKUiZBK+66qpU85eSkhJVvOTLX/7yLPPehz70IdwqYV0pzQipvZCjp59+eg7pIXWKhjI+n0/FI0B0xsbGIpOTkzmPRxOXVOGWJVwaOd3qoYceUibSmZkZNPRuLD/OALucbpThone9612NNFoqLy9vRoMqKSkZoMNnaWlplwkg5LA2pAAzsMfjoY0vRFVVRCQQkkPCHtRKMSLmKhAINJj1S6Ms0mn/8R//MaMW/sgjj1ynu3/iVto9NTWVeg/bEFpYd2vXrq2/5JJLrNra2u7KykpFRKneR72EeDzezPrF4jU8PDwwMTGxe2hoqMupbd5www3XFRcXh0tKSlQasN4vikiHw+GsRHox2Kf7LtYO9kg8HifIVBGUpW6X3NTUpA7fiooK5AUWknSFq7AUKFKA1YI512SQwFfVF8FpQYNkFRYWYimgCNpje/fuTe3vP/uzP9s0OTkZHh4e3mhawPf3989ZB5s2bWpnPowbVLsS0rpaeR8sDKxfrIjEYEEMJicnuwcHB50WqRaua2hoqCebZf369SrFGlJw++23r4glcKnXznLfT4jBEiFsAg4LCgpaWbTG/K0r/CnTGMLPaYojeBBti2IuhkxwqCHkIAVUESOu4Gc/+9msimZNTU03YVJds2aNKomq2+wOkBK2bdu2rNXPTNlVv99P2VHltojFYl3adzzLUsDYysrKaObUSnlmnUIJcp1o7+myAjZs2KC64lGZkYPEmHM/8IEPNGprQTMsPhAI7MKKYq82p/sgqLQqXS1SkRDG9uijj6YNDiNwkzxoAjdNsCda8FKNZ4mWScbb2CPqY7GYIpFGK16qZ2/cuPE6XDb41umnUFRUtEsXh1IHAaTA7/dTPY4qcqoPhc/nw7WCCRqyoooZ3XPPPbOEfEtLC4SMuhsqJc3j8bAOlcaeqZgMZXYJIJuenibrBGGdioq3j3f9+vXKwrFq1SriUPrLysp27NmzRx1C9957r7JI0WtDF9ZRabzEnjifi4sPa5epQKqLjSm3W3t7+4ocFlT5MxUDiT2C0D/00ENLauZ+z3veg+svTGR+dXX1ABbGjo6OlHzAlROPx1U2EhkI1L/QGSUqrgd3Fhh9+tOfnvVeWOd0ozYsd1gTlMwIh8PKhUgVxKmpqV7kQ1dX1xyfflNTUz2Hd2lpaYvpDIl7g/WVqSAbyoluRLdZu01VGq+9NLN+5/aqqqrwZZddFrz88ssteknoNvfhtra2rOWil2q/nc33EWKwRLPX0tKCGwDBQ66wMrOjxejYgl5tLZi1QXA9YEbVrgeEsvL5QiYgBfzQB4GD9dlnn00d1vX19aF169Z1rFq1qu38889XKUAIZeodsInthYYyDe+2225TPRWMlufxePbpinKzNg7vWFZWRnYFbgvyvVUuOeZINnG6vG9iH0ZGRmi4QurQjp///Ocpbezmm29u0T3kKWiiXAzOOgQ333yzCmQrLCw0ZaTRWnfFYrE5aUtmfMs5HnNo6t85pQO6WVbGn09659TUFI2lOqk1P096opvbp6698soriQ3pIDJ8zZo1/ZSSduSuq7z0WCzWyEFLcJrOqlHxCF6vV6XJ2ivQYalBoy8sLGzDaqVz1VXwayZrhylmQ7EurGFo+CdPntzrPMzREHWefJsuntNFXwzjirvrrrtUYKLf78fKwThpLgbJnOVmonAQ6zcQCLQWFRXh7lPVOzn00IbtRX3swOpGPhx2yzHnyp9PLv7ExMQwBPbv/u7vlpSgICdqa2vpuNlG0OaqVatUvwDjqtD1A1Q5bGoBEJ/Evg4EAiG/3497iH0Xvv3222dl5+B2oC/CzMwMrgTSi3+k3ULXUC47mUzy7z2sFSehMPiiIGDxDIVCzcR60EOGktTzWUzshd90oLXKWnBae8C1uroaYmCRzUKaZDAYTK1dbamxxKWQWYwIMViQiJ39JXysmslitjNakwncUVqM1+udo8X82Z/92axaBxADNHdjLYBxs/BpN2h/Yn19/cbq6uqO9evXb6YiHMRAa/FKIGer3oagLC4upkGTEpTawtGZrqwxqXNoAD6frzEYDKKxIVSphLYHU/Fdd901x9dPff9IJHLd1NRU91e+8pWUho/lAWtBaWkplgclyBmf8x70ode1HBo14ZlTdtc5bdu3b78JolNYWKjcMT6fb8nGoyvpNSUSib5cSFe2JUXmwczMDPEEFAHidy2FjOLxeAOWlbGxse5Tp049MzY21p8uwDLb/TP9/dJLL1UC841vfCNalOoeeccddygiaJpdaU2PdYiLp4/OnviLsRxw6DqLPpF/rwnxFh0Aq0y28xWHevjhh1XTp1gstpE0uJMnTyqXDwGl9uZQ1LCgNDIlwHkf7mvSNlnDmMj1GlbVQdMVpTItv8m8oUBWcXHxAFYvfNSQzdHR0bRVM8EDS4nX6+3Jtp9ymQ+KC3k8HrDinqTTvpE5j0QiBMn2jY6OfnVkZKR3cnKSOV+SDoD19fX1EMG6urqWN7zhDRCDPZDBO+64Y79uOoSVoJ130F0y6WEwTKE0yEEm8k8RK1phYw0cGBh4rL6+HsWkFXcElqZ4PN6DbMgUNIsboqqqagtWyOrq6gad8jxvsTIwJrDY1GvR1tW09SyIqcCaypj5qa2t7deEqJu9XFBQcH0ikfhvSVsUYpDL3l3QNRTzwdwZDAa3VVZW0mRGae98sBgYE6EzPZEWpGha9EPgkOQ7xsoAMZicnFQuhJ/85Cdz3AI1NTXX1dbWhi+55JIGUnFMkxmE7e233z5vUR60cYQBLjsEJAVIioqK8DXz3VnPuvvuu1Wr1ampqUYsCmVlZQNlZWUbEaqZqs+x8fR3SH2kO1/KWvCRj3xkEya+VatWUY0M68ic0rY8E23E4/EoUqCx7EWjypQ+uH379lSgotZYCahbkvHgx4b0USte+ygX5IsmjdLr9eILvwmNHJ+9rjpnfN2p1DAirYmu52dkZASfOa6FfTMzMz/CR2wLsnK1Zi+++OIOqlW++c1vph5AL9o32iMmbd3NT7XUHhsbg8x2VlRUEDXepi1g+yhCs23btpRFiYJGZATMzMxsKSkpwbKkcsXnKyJDMRu0TDrt8fIcSIwTcjA1NZVKazTlbomQx43EPY0LA4JJ3Q1iIUpLS1UdAirdcWjYTcWmOl4kEmmfmppCQ+9hr+BO0BkZ1KqYs19oCqQzNxhz2hr9uQCPZSQej18XiURaYrGY6naqi0ipOTcygqBJKjSCA78hhFNTU8QV/Zxg4iNHjiyo8U9dXZ0iBmvXrm1505veRMdNFVgbjUYHaJzFWRuPx1X2zvj4OBiTMkz8xRaUBY/HM4f8EyzJ/tRNipSbgPRs4ntCoRDp2bhNUWiw7s1xIWCBHBwcVM8uKyuroy6Fll9KCUoXeMk8RqPR68ncIAXcBFFmInYXXXSRcj/V1tYimxk3Aau7ioqKRiAvED69l5csJTSX9XA2XSMWg0XO1qpVq6izzqZoxGRlcuG1355iRqQnzjERUk4Uc3lJSQkBYbOIAZuOyFy+m05jxCy6bt268BVXXBFE+6MoD5G/NFy56667MsYXkIUwPj7eMTY2prIQsG7ga66qqlKVyOwR8AjH6enpjuHhYdUuGW3u/PPPr6VmAkIjHo/voUeBvUIeDXkw7cbj8XpK6lKoxm4evvrqq9uwGJx33nkhtEuIzKc//WklmNn8gUDg+vHx8W2jo6M04VFV0zhs8Hviq3Smk2kT/PWRSGRbLBZTpZd1PwbVb2Gx47n33ns3IWAQRl6vdzfFUxZiVtYNoKgV0WzrSqhWHuvEVB406WE6iC51UOgAVNMmmHmmTOy3IAvDsIgcPxwSEINLL73UuvDCC/dXVlbuDgaDU8b8aw5pShFPT08/s2rVqusrKiqUFYxaFXZyBmEaHR2lp4EqPcxcIeD9fr8KVrM34zGv99nPflYRzcnJSVWiFtKHSRgCzaE4PDzcx5patWrVvlAodJO2LEFaU+4mSMH4+Dgtx0mpQ/NUpuKKigrVMtlYdPR6ojV0+8mTJ/nOPjBbu3btO+jvodOBdx08eBDXhHIVcGhdeOGF1wcCAcpvq7TVhZZI7uzs3MR+jMfjs5pTmfk2BbtMC3PmGFJgfiAL2g2puhkmEgniOp5xQww5qImrqK2tbWHOzz///L0VFRWPeTyeKygaRooysgZSNjExQdG1/WVlZSg4qlqryTgyGTqm8+Ho6GjD8PBw5/79+3e//PLL7yBuoa6ubiNKCgc9cxqNRvuImbDHC4Dv+Ph468mTJ9tHR0cJJGQdqsMb6xTXp9vjBEXqlFQIoSmfnrGHAnUqILFY5CCNWFRZJ8gSXBak5cbjcYjLinZOzXHbrshlQgwWDzvaN4FXQTaF6QSnLQDK1LVnzx5nDneQAxIrAwuWhctBaWoX0AkM4frjH/84UyEOzINhUnHwobH4Y7FYPxtr586dc1gwQhKtbmhoqP3QoUMNR48epXDRvqqqqkbcEvX19QOY3gypMEFRo6OjjZQYHRoa6ozH48+sWbPm1urq6i0cAlSzowXyrl27voWZtKKi4qbCwkJy8Cma00lmg6Mcc7ChoYEStNvQXiil7PP5+uLx+FepheD3+3E9NB09ejQ4MDCAtsQ1GxEahYWFaJNdx44dS1VFpAGQ3++/dXp6uuXUqVMhauCjjVVWVoYqKysHONBNECYkB3cIveJzGQ+9JxhPUVERVafwt3YSvb8QnySaL8QR7Vand6pUVPNjmgyxDE3TGVPoBaHNgYG5nd/akqSyXHTq5kAikXBDErBOqRgDgrKIT2HdGUsVh9KxY8f2nTx5Eo0+RBGgtWvXNujOhqRPYuF5JhgMXjM5Odl29OjRhiNHjvTCTWpqappwayHsMTFjLTLpbWTA1NTUEIzKd+oOHTrUz3dIe2W/sP75ML6JiQlVERMXRmlp6X7a85rD4lOf+tTGEydOdBw9enQzMQmRSGSgrq5u88UXX4zmiUVLWTSM73xmZqZ9aGio7vXXXx8YGRkJFxQU9FOxc/Xq1RshkHQ3pdQ0TXXa2toITsTyR9Mv0u/mWJxyFRUUCdI1HTabugH2tuVm7u1zbopHgYGZb8gBa8B0hdQVJ9Hse7xeby4kQWU9VFRUtFFOGnJAIB6yycQyUQzqxIkTe6gfUVZWdg2tm6kGyR7HSgi5icViLwaDQVXIKBKJhEj/hRTodEJV/RDZxfxTuhrXgm6TrfoqkEHCnJw8ebL19ddfb3/hhRcGXnnllZ6amprGN7zhDc3EApSXl1OnpWtkZGS3LZCRPQ4JbDlx4gS9W1BgWC/1lZWVqgurs7wx5OPw4cOtIyMjihBCvCC2kNZVq1ZFysvLu8rKylLPyHVOz7XrhBgsfsZVARZaBMCUOfAQdixc/FpPP/10OnOVKhlM3QIOdTQebQ5VEd1stHQuBP2q6vpzUfIAACAASURBVLuVlZUtb33rWy1++G4kEunXaWSznqcLyNwKUz948GCIimP9/f0q5xg//gUXXNBMEZB169Z1VVZWftXv91+jBUAdhWKOHDnS/dJLL+2Ix+NvXLt2LRXozGGtWuCSzkRnNR2wpLQMNMs0dQDUe9fU1LRcccUVqu49B4LJe0c7ooIZAuO///u/vzo9PX3N+vXr1RjJQ/b5fGg1aJT7aGFdXl5OQFw9TVNeffXV/VTMIzp99erVzWgu1dXVBKq5Gs/09DTCKTUeHeC0qLTBtrY21fvCNIAyVgHGqw/CVEc4nsdBjWaDMNMlsZWLges5JGzZKur/jVYZi8Vwn9DW+Bmfz7evv78/nTak1iqmVHpU4FJg7aEdcvgcO3aMokC7fvnLXz5GISsOUUgcBIKDwhREwkLA2jh48OBeqhT29/dvwrXFXDGvHLpTU1N9HPKBQAAXA3EKDczVr371q4Hf/OY3XQMDA/j4WzmoICmmbK1p0ISFAgsA1TS1Sf76wcHBlpdeeqn+hRde6Dt06NAODlMCWS+55JLGxsbG4dra2l2VlZU/peAO1hkKHuliXbs4yIqLi6+HUL/hDW+o08QUcoBVDy2S/gDEHqggOAIiF2IdMmnApM2i3UIMzKFvWgAbYsd+xixu5tyWBqzWhFkjzDkkwawXuyXB4/H0BAKBH4VCob6+vr501iN1cPMcDmwsjBySkEHdY2A/RPDAgQM/r6uro15EC3OIkmPcm0ZE6kZKXUeOHLHXYiF7gWdAvilAZb3nPe9Ra8br9ap0ZkgMxBhLAbVRnnvuuR1UVeV7WDNQcHgmCgD7W+/xetYNdTQouvbaa6/te+21175VWFj4jnXr1m2h0BXuAbJfzDyxTk6dOnXr4cOHW55//vkQ1Vsh1MxBcXFxfygUegx3SgacFn8S5NEdhBgsfjLtFf6UMGdTmXzrDBXfVAtbXdRECQZM+rpmexeEYp6gM3XAFhQUKL/hu971LiXc6RAzMTER/vznP5+KIL7rrrsaS0pKlAl7cHAw+Pzzz+8/cOBAuL+/n4BA05VvG4fElVdeqQQHhxKHF9rj4cOHe1999dUdv/71r9HiWgjqufjii+tNCpARHGw8Pmgy2mqRLuUq1T+BcSIIyEtHG+V5bP4DBw7se+WVV8JDQ0MId/BR74bgQBvRJm0l1Pjwji+++OLwoUOHdr3wwguq4Q5mYK5FC9H5ywseD1HrWHwWWnnw6quvTqWicuCZXHveG00NzZB/s384fMGHg8u4pvh/xm5SYDk07CSBA0MX0FKHd1lZ2fDq1av71q1b1xsKhX6KiV5bb2atO9aq6W7JexD0ODQ0ZHzuqlsnpAyrFGSXdcohx7u//PLLfZjhDx06hIlb1eGoqqqqY21AOHhnu5sEAf3cc89FIAX9/f2sUfo0qLLMvAdzxneZM12sCxcCZZqpBkjxohDNvCC2kJHJyUmeq7oMFhQUbKG6HYST9cK6ZDysqYGBge4XX3wR8oLVroMYF8bDO7LnTBlxvYapJbAoM/PVV1+tajoQaGjPMMJVAm4cxroBWGraeQfjEjGNhrC8mFoLpiKgjv9IkQTmnL9BrkOh0ABWk9ra2p8GAoFe4hK0iySluPBAsIGQc+/x8fHI2NiYqqaqeygQGNzEvmR/moZipo17NBpNW+hIlzdnbeH+aWpsbAxiOdAEpIsiWlS2HBgYGEAp+eEPf8jcpeQPz0H+8Fzm3sRhgB9kcv/+/QOvvvrq7gMHDqD0ELC4jfoEb3rTm/pp/+73+3+K28CyrOuxctI0q6+vjwquPdFolDLsxGgw/0ueXbL44+PMvIMQg8XPyyzGzO3o9U51tkOHDmUKbpnTZAjBX11d3Uuetj6IM71Z6rtsKNN1DuEyMTGxn4IfNC0pLS39PXypREEjUNAgqQ72r//6r/YWraYyYQMaIcQADY7D5dSpU0qT+M1vfmOyCpTLhBa9HBaQEq41hZXIccf9Ya+I5xjArDEjbBDMHDg878SJE33Hjh3bMTY2ZnLkUx39OGR4HoJD+7GV9vTKK69EXn311a4XXnjBNNxJjYfvcNhwwPKsZRjPvCuHoFSC3uLx+Da6VaJlo/m7/YANhzcHpp0omI6daHHcmx/+G6HK3zhYMM+SnTE0NGTcOqbolOp94PioqH9d734WgeDQQqMHSz5mrmxFa1SWAYcLBw6HtEkT4104wGho9PLLL+9BW9SCes6+YQ3yXX7M4cXcQYQ4WA8dOtR3+PBhDnl7HQW1LjloWBt8l9+QzaGhIQL36LtAwGhq7Bw+XMd60vUcFG748SG2zgp/uc4ZWQDE5RBsaLR63sPth73M+CE57DHdkTBlXTOt282aYo1w4GsCqQKJ77nnHhNrlGqfnOY9VBaTPjRTBALMmWtdUErdG8sEJNkZRO24p+p/smHDhrZ3v/vdxGso6xEYkHlBCu7jjz9un7tZexxrhrFoMCZI1MGDByOHDh1S8QyWZWERUXu8tLS0gWsNwWPdGdIKMXj55Zd7jx49iqVT+iK4XYC4NRfwHfnKbARSzNf8M/3eafKCeT8DWHOIAX72wsLCXbW1tY9liTqf9V1MdjSX4VDXAUPqIDRmTITHiRMn9uPz7+vr2+O495z34HsFBQX4rndTQ8HGsmd1UkO4clghQEpKSlQ1te9973vZas1n6sZmSibbvz9HoCHwTXlTzLGDg4OMZ1apZa2FmtrsCodlHM98e2HW4bpUmwYhzWEBoYIoQBqMCdq0OuY3WiRR5driYY9qn6VB6vdy4j/n3Tk4mXOC3yCAJ0+etM/VHMLBIc/6YM4gRENDQz0c6vbeG0bIa80/BRFCnsOQH4gnH7RVDpaXXnrJaY2a866M3e/3q8qLWLH0jeesdbBjPfGORUVFPbguenp6FlNgKB22i556sIQkmP1m3I6sbWOV0WOm7kAngcK2omOqVorueaFKHeuP6htAYK/+/znvbgjKqlWreoj1ePbZZ3PBZlN9fT0BrhtJFeTdURqYizQFu7Lt8Qj9Lg4ePGiIP686a62ZOSToGzx0v5e+U6dO7Th+/Hg2ebToucnXGwgxWJqZTWmqpqyuZVnztW+dQyZ0yWDD3rO91awDloMC0xoMHVeAMf2htYyOjvZRZOipp57KtEns785z09Y11wcumtmsD0WKSHsbHh7OZRPOcrtkOJTM/TMJNP6OSZDnITCcwup0jifTPGV6d96b992LVUdrQNyDQ+uN+jfCkv/P+uEwQCBCElgDHHDMv3bxqNoPaYSx0uqIStfmXEgDOO6xkcBMWmY6Amfec75D0XkI2edYpa5pgT9nzJTn9fv93QR/ZiDaYJ1q9jTPmsrYCrywsLCnvLx8x+DgYC4HX6Z5yXR/tFwsFqR5gjVrgHc2c44JHOuJ6kmR7cPcQgjtxBDCpouOqaZbO3fudI5DuVxMm21tFTLWIfNI574x/55p7tK+KgXeLrnkko7zzz+/RQe3qgZVDz74YDr5kG2Po5jYSYF5ZspCZX8JiIHf76e1MoWScCGI6yDbgsrwdyEGCwTO8TXDYhGOqryrTehnekLKjKYFB4duruU652xiBAZaBT9okLob3pweC2lehs1phDMbidLN6TYVB4nyCdvuMd9BkW7c9kOJv2PmA6tM5r455maNKwKDbm7pAuxO53hyPSTAlTHyzirqPsuyYz1xOCMAaX+blShgJYAYIIxXr15NER/VAyFDSWIw4v4cGBxazoPESR54Xa6bb43yzql6+3p8jBPCwRxnysXnXRgj31W1DWwfnsl3IVLzYWZ/NmNJ957pWoHzKFcH3zzz5rRcQAi4N3OeC+Fgjs18g0NWogAZwGKHJaGqqkoR9G9/+9uZCDrj5x35zRp0WjOd5GE+8p0RhiuvvHIjabHV1dWbcUFhBUV7z1QaW5OiVPCivjH7mj2OOyRTSmE6cpBtjS6NtD8H7iLEYOkmmQ2HkEMgZBP8PNVoZRx+czqPZXkt5yaedTkR/IFAoKewsHA3gWc5DJH3RhDx3pk2ol3wMUYEPkLPbfEVoy3xWrkEBCEwIUI8n+uxxCAA5sP4dI4nHbzmoMJCghCGaGV75/mmifkmW4QDlPViJ2fO76k87XXr1tFtbjF52gZ3nvdzfchlco2Zd2Dc5j1ZI8xVLkSI7zMm9gTPY24NYcllL5nvcw+em6m2g92qwVg4fJibxeBkxm5ILHPF4czYc9l76ead9cv9DJbc0+4GmPUdgvvY67W1tbO6Seaw752X8MzrtSxgDCgqOdfJ+KM/+iPV3bSoqEi1gddVS+lvMm/RNU1Q2ePMP/KEOckFO9YbcoG1yvWsmZzfdwH4nDNfEWKwslPNRmDDL+TQSGeWZzS5sO2FjpqNyCbkGdkOiYU+43R+72wcjxGGHBoIRadmuVQa8Omch9P5LNavahC1RITgdLw7xABSiJaMzLATQ4hTJpP76Xg39Ywbb7wxJY+wXukeG6rQ2KOPPioVBk/bTCzNg4QYLA2OK3UXDgb8q/w2pj/Mb7mw7ZV6Z3nu0iFgNEtzWCCI05mJl+6JcqeVRsBuWVHdEPWcr4imTOGiqamp62kARvVR2kcTqEr2ktfrxQWkCkitNGjyfHcICDFwh5dcLQgIAoKAIKDLmNMdku6M0Wi0joqXsVhsPz1B/H4/DcKoGEoK84qQFpmkhSMgxGDh2Mk3BQFBQBA4JxHQZdZbE4lE++TkJN0Ze+hnMj09rfqlBAIB1ePiySefFDfCWbhChBichZMmrywICAKCwEohACmgxHE8HlddKycnJ/dSjv3kyZP0K6H8N90ZCX4mG0Hcmis1UYt4rhCDRYAnXxUEBAFB4FxDIBwOq+yO6enp+snJSdUR80tf+lLP+9///haIAX0n6Nba09Mzp6vsuYbV2TpeIQZn68zJewsCgoAgcJoR2LFjx6ZkMhlOJpMbp6en+2kN/9BDD3V/4AMfqJuZmelIJpOtPp+P/gVUQnWbynyaRyOPy4SAEANZG4KAICAICAJZEdi+fXuDbiG+JZlMElBId8PH6G547bXXtkAMdG8ISIHEFmRF9My9QIjBmTs38maCgCAgCJwRCLS0tATXr19/q9/v30Yqosfj6dI9GQY+/vGPb4zFYjSP2pxMJunVgBtBMhHOiJlb2EsIMVgYbvItQUAQEATOGQQ+9alPbSwpKekIBoObA4HAXjIO2tvb923dupWMBDITWqPRaC9Nu771rW9J3YKzfGUIMTjLJ1BeXxAQBASB5UbgYx/7WBvEoLy8nC6wO+69995ushM0IYAYRGhZ/bWvfU1cCMs9Gafh/kIMTgPI8ghBQBAQBM5WBK666qq66urqjlAo1BoKhTohBqFQCHfCTVNTU60TExPW1NTU7ng8nqlp19k69HP2vYUYnLNTLwMXBAQBQSA7AqFQqJGOiTU1Nc21tbV71q1b99NgMKh6dUxPT1uxWEzFG3R3dy9FM6rsLyRXLDsCQgyWHWJ5gCAgCJxGBEp075CrVrqPwGkcs3kUzZbom0IPBXpmLFVxIdVZla6Ja9assdauXWtVVFTQPTHi9Xq7ksnk7u985ztCClZgwpfrkUIMlgtZua8gIAicbgQ4EDssy9pmezBFdmj7m+9R8u/WY3+/HvtSdtm0t1y3gsGgVV1dHamoqOgqLi7e/eyzzwopON0rfZmfJ8RgmQGW2wsCgsBpQ6BRH460AOaj2v5alnUuBMS16bGblsyMmbEvRXt0J64QAQgXnVzznXCdtsV7Jj1IiMGZNBvyLoKAILAYBFSpXsuy6vVNvqMPx+cWc9Oz4LuMl3Ezfj7P6nF/f4neHUtMq27xTjXDx7Srglbv8slDBIQYrOykwu4x0/Ebn6CT3cPU+cFXyE+26+v0/fA12j8ICu4/of/R3Id7Oz/Oa/k71/GeLznug0Di340gNvdCi0jn43TepyDD+O1+Yuf7pes/n+l6hBjv4dbUad7TaF8IQHKz+UknDJ3X887MZbo5nW/FpbvPUow303yDC+/oLF1r5tXMo9EKM/27fUzZ1qi5Nte1yvVmfi/JsK7s8/97ek39s9Zof5Jm/s07cm/Gz/gyrXE3EiKXe2TaM+nWarr1kG5t2YkB+/dxy7IgBSdtL58r3kslG3i0z7KsjZZl/a6OezCvk2ndmb/nss7czItc6xIBIQYuAVvCy9mAsHxMgHycpj+7+Y7NDkt/+zzXb9D3+8sM77hLaxHGD2uem44YYII02obzPczfnFqK8z5OH6eb8fyhHgsBZOk+dr9xOr+y/Ttf0+N+Oce5c5pN7V/7nr7Xf9n+cb7r3Zhz57vPYsbrXGdOGDhAmVMOUD7OeTXPXqfn5MP6unS+e+ezMmGf61o1JMy+Hpzryu38O9/x85ZlPWNZ1i2WZeGCWKi2/V6ND4dgpntk2zN2vOZbD055kU2W5Ir3UskGs8bm28fOdWe+43zXcyVGJEfxdHouE2JwenBO9xSnkEBzQUDzm4/TLGr8pMZc6Lz+OsuywpZlOa0F5tl79f1h63azY7p34z68S7r3MH+bFZCU5iZO/66b8fB+PCfTx37gopFw/eYMF6OJca9v5TjVzve0fw3suBe+VfOZ73rnHM33CvPdZzHjzXYYcfgypt365ZzzasZg7mOsQ+lIj3MuMmGf61o1FfTs68G5rtzOvxMPnsE9uY8Zm33957hsrHaNI4crny7bfjP3yLZn7HjNtx64n31tZZMlueK9VLKB98NCwbzhgkj3ca47c43zXY3ckmqKua7EJbhOiMESgLjAW2TbzE7BsEc/Z4v+nY1IOF/LXM8Gc0Zu2691ajvO9zBCM5sm6vTvuiEG2SwGxvqBcMkmbN0GoGUTyMwDpMmY3+e73o22M999FjPebMSAubcfhE48zWHFfbjOHHzpiIHzu5mwz4axc23PRwzczr8TDw5D3pODbDHEwElmc8HHuUfteL3FYaFxXmtfW25lyXLLBu7vdt1lItpuyPUCRbF8zYmAEIOVWxNuN7NhzGg2To2B/3dz8CLceT5ajrFAIJQQZl91xDpkIgY8E3LAfW613YeNjEbt9O27eT8jWK7X97VrqWi2vKsxMzsPBqdlZbHEAPcBnw+6wB0M8Vvz7FyjttPhw33MwbXQ8aZbZ7yXPTZkPmLA+3MIMdd291O6gy/dgZ9O+3a7FtwQg2zzn+7AMrE9CyUG6e6Z7kBzu1ZNXMBNer5YgowPt6J9bbmVJfNZH5dKNrhdd0YSOwmW2/27chI9j54sxGDlJtPtZjYHjAmIy2YxyOZ6YOTzCdxMDN4p6LONI9N9cnm/+UiJua9bYZttxt0eWrm8Y7ZnpiN2mczZbsfrVkCn08Cd1ipzQDnT4Zwpc1yXzmriFuMznRikiwcgaBR8iIlYzFpNN99O3LPtQbd4L4VscLvujKJhj7vi35B7jJd1JJ/ThIAQg9MEdJrHuN3MzlsIMfgtIm4Pymwz7laIngvEwMS9gLX5pLMYpIsNycWykI0knunEIB2ZSqfpLmStnkvEIJP7YSExH9n2ufx9HgSEGKzc8lhqYuAUIGgsxAuYlMSHdaaBSVlcCq2Ae2Qbh0HY7YHL93I5dBcibOebdbfvmcs75rLKcr2P2/G61dwyHXJmrjMRg0xCPZ1JPd1Y/1NbsLi/c60uNzEwbhoTP+H2IMoUM+G8j9u5y0R83VoMVkI2pFt337Us6wLLsshsGUxTayFTvIib7J5c9ppckwUBIQYrt0SyHahuA7TI5UYQ3WEbUqaUIHOJuBLmzv9iiQGaIj+QMmIEci2u43wuB+pP9X3sNSjcHi7OdWbej39P51NPJ5ydByeoOYU12TCsJxMca5AlNoZ1+SMb1LmSoFzW6WLxSCcB3BIDYgD4DjEB9o89aDTdIe+MbcjVyuCWGKyEbMgm39LhvknjaOKozDXOgN+Vk9rnyJOFGKzcRGfbOG6JASNx1kvn3+ar/ibEYOmJgf2O6VLWMq24TPPtzBJZ7oMwW5R/JotBpu+lO+zyjRhkSq91kqds2C4XMVgJ2ZBNvqXbB5n2gGQmnOZzSojBaQbc9rhsG2chxIDbO1P9EDaYZhFSdjcC1woxWF5i4MYEOt98z5c1sJAofPuonbUGsh1emYhBplz5dPnq+UQM5svXd+bgZ8M2Xc7+UsQYmDk7nbIhm3xLJ3mdtSDMNW5rkaycVM+TJwsxWLmJzLZxFkoMMBvyXVwKxlScqRKbEIPlIwZuK+ithMUAgUu1PYo/mcqQ2Q6vTMTAbk43JaiNad1pUs8nYpDJhQJOTjfKfNiyXu7TcUAztmW5lMTgdMqGbPLNufOcFSztWVjpCoutnOQ+B54sxGDlJjnbxlkIMTC11WOWZVEz3pSvZZTp0saEGCw9MXDrnzZvkC62wdSUsPfQWEpXQjrf7UKJgXMtMS57/Qm7XzwdMSA3n2en6xuy3MGHzlXgZg7nw8vpGpjvWid5Mu+0VMTgdMuGTPKNA58xpeu7Yq/IutjaEisn2fPgyUIMVm4Sl5oYOHsR/IvurUDtdj7p/HRCDM5cYrBcdQzsI84l1z7TDrG7SbJVwXT2N3ASA5OjnqlvyJlMDOivwPula0jmzMGfjxg4MVpKYrASsiGdfKMnBQpLup4U2XpDuKkiunJSPU+eLMRg5SZyqYmB22h6Ri7E4NwjBnYTbTr//0IsBplSFQ26i625sZzEwKmZ8s5uLAbZLHvzxYfYV18mP/pSWAxWQjYsRZqsHR838TorJ9Xz5MlCDFZuIt0SA2fK2GKFrRCD9HPvVoi69ZdnWnG53mexrgSsBHyMhuvMnFgIMcj2ncU01Mq2TheLR7riTW6IgZuGX853zUbSGPu5QgyyESzJTDiNZ5UQg9MItuNRbomBadpjuidmIwZOgXemuRJyeb9cDkun4HTe122tdecz3faoMPUHeC7/bY8PmG+15TLWdAdFtvGmW2fmPulcTNkOeTMGuwbnNKfzTqbBFUFlTpN6upoN872TG4vBYvFwYzFwulDYozyfPQqOfOwuAie2zrWVS+OldNe4lSW57L3FWhPdWgzs5bRZO7wja8fgmM7ttXLSO8+fLMRg5SbY7WYmlYmPaS+cjRg4R3amEYNc3i+XwzLbQbZYYuB8T6eGPZ+m48b8mctY0xED5/s5x5uNGDgjvp14Ei1v/1yl/8c+tnTv/qp2VaUrouRWO3RDDBaCh53EuCEG6bAlYBQ/OmN0Eq9s1o10xaCWw2KQy95bamKQTtLaLTPpnkeVRNN+3e0+XjnJngdPFmKwcpPolhg4A7ScB/18QVBOzcWMerGbn/tkG4d51kLeL5fDMlvQkltNY75DK9295rvejfkzl7GCpdvxppsfNFsOHGN9sgd2pTuICBrjPtc4uvyZTAN7/rmxDiDI7UF5dkLldi3Mt06XAg/mlXEb90qurgQq9PFuhqxjHSC7ApxMIKU9diAdtpAS5j6dZSUdEVyIxcAt3jx3sbIhW0Cq3YrkrAVh9plZu9wrXTzMyknvPH+yEIOVm2Bn3q4z6tbej93kxJsNi9bmvH6d3syfSDOkTDn19oInmSokpnuP79uekW0c5tKFvF+2Z5t7Owu32CF4Utdkfz3HqbY/0/4VhBX34pC03yvT9XzXTSR1rmPlvm7Gm25+vq5bZf+lHqA9Vc4p0M3fzH3MgWf/znv12iMD5v/TeBtiYNaj/Xq3ayHbOl0sHl/WePCubupPZMLK4ME+pU4EBIo6EemuJ3sIYmXH7l9tCy/TM0zMEZdm24Nu8XausYXKhvnmxawTxup8f7NnDTF4v2VZ2cq757i95bJcEBBikAtKy3eN6X3Ob3t/dfNEmDSbA3OvPXoaYZHuenM/Z812Ux8/3Ui4P9dzjSlM47wu3XvYr8k2DnPtQt4v27PNvRmHMVubfzO42YVoLrNpnmma6vD9XPAx1/MMNKJ0czTf83MdK/dwM95088Ma4h5mbHaMMv1tvu+kW0fzXe92LWRbp0uFh5m3XNYJ12QaY6b3TXd9tnmfD0fn3sokS9zibdbYYmWDcy9l2huZZEg2bHKdJ7nOBQJCDFyAJZcKAoKAICAICAL5joAQg3yfYRmfICAICAKCgCDgAgEhBi7AkksFAUFAEBAEBIF8R0CIQb7PsIxPEBAEBAFBQBBwgYAQAxdgyaWCgCAgCAgCgkC+IyDEIN9nWMYnCAgCgoAgIAi4QECIgQuw5FJBQBAQBAQBQSDfERBikO8zLOMTBAQBQUAQEARcICDEwAVYcqkgIAgIAoKAIJDvCAgxyPcZlvEJAoKAICAICAIuEBBi4AIsuVQQEAQEAUFAEMh3BIQY5PsMy/gEAUFAEBAEBAEXCAgxcAGWXCoICAKCgCAgCOQ7AkIM8n2GZXyCgCAgCAgCgoALBIQYuABLLhUEBAFBQBAQBPIdASEG+T7DMj5BQBAQBAQBQcAFAkIMXIAllwoCgoAgIAgIAvmOgBCDfJ9hGZ8gIAgIAoKAIOACASEGLsCSSwUBQUAQEAQEgXxHQIhBvs+wjE8QEAQEAUFAEHCBgBADF2DJpYKAICAICAKCQL4jIMQg32dYxicICAKCgCAgCLhAQIiBC7DkUkFAEBAEBAFBIN8REGKQ7zMs4xMEBAFBQBAQBFwgIMTABVhyqSAgCAgCgoAgkO8ICDHI9xmW8QkCgoAgIAgIAi4QEGLgAiy5VBAQBAQBQUAQyHcEhBjk+wzL+AQBQUAQEAQEARcICDFwAZZcKggIAoKAICAI5DsCQgzyfYZlfIKAICAICAKCgAsEhBi4AEsuFQQEAUFAEBAE8h0BIQb5PsMyPkFAEBAEBAFBwAUCQgxcgCWXCgKCgCAgCAgC+Y6AEIN8n2EZnyAgCAgCgoAg4AIBIQYuwJJLBQFBQBAQBASBfEdAiEG+z7CMTxAQBAQBQUAQcIGAEAMXYMmlgoAgIAgIAoJAviMgxCDfZ1jGJwgIAoKAICAIuEBAiIELYQwy+QAAAlNJREFUsORSQUAQEAQEAUEg3xEQYpDvMyzjEwQEAUFAEBAEXCAgxMAFWHKpICAICAKCgCCQ7wgIMcj3GZbxCQKCgCAgCAgCLhAQYuACLLlUEBAEBAFBQBDIdwSEGOT7DMv4BAFBQBAQBAQBFwgIMXABllwqCAgCgoAgIAjkOwJCDPJ9hmV8goAgIAgIAoKACwSEGLgASy4VBAQBQUAQEATyHQEhBvk+wzI+QUAQEAQEAUHABQJCDFyAJZcKAoKAICAICAL5joAQg3yfYRmfICAICAKCgCDgAgEhBi7AkksFAUFAEBAEBIF8R0CIQb7PsIxPEBAEBAFBQBBwgYAQAxdgyaWCgCAgCAgCgkC+IyDEIN9nWMYnCAgCgoAgIAi4QECIgQuw5FJBQBAQBAQBQSDfERBikO8zLOMTBAQBQUAQEARcICDEwAVYcqkgIAgIAoKAIJDvCAgxyPcZlvEJAoKAICAICAIuEBBi4AIsuVQQEAQEAUFAEMh3BIQY5PsMy/gEAUFAEBAEBAEXCAgxcAGWXCoICAKCgCAgCOQ7AkIM8n2GZXyCgCAgCAgCgoALBIQYuABLLhUEBAFBQBAQBPIdASEG+T7DMj5BQBAQBAQBQcAFAkIMXIAllwoCgoAgIAgIAvmOgBCDfJ9hGZ8gIAgIAoKAIOACASEGLsCSSwUBQUAQEAQEgXxHQIhBvs+wjE8QEAQEAUFAEHCBgBADF2DJpYKAICAICAKCQL4jIMQg32dYxicICAKCgCAgCLhAQIiBC7DkUkFAEBAEBAFBIN8R+P8BVp3zEAAL2zQAAAAASUVORK5CYII=',
          //#endregion
          width: 60, height: 60,float: "left",margin:[30,0,0,0]
        },
        {
        text: 'LISTA SEGUNDA INSTANCIA 2022 - '+this.CursoSeleccionado.toString(),
        fontSize: 15,
        alignment: 'center',
        bold: true,margin:[0,-30,0,0]
        },
        // {
        //   text: 'GESTIÓN 2022    Nº LIBRO 18. \nNº FÓLIO',
        //   fontSize: 7,
        //   alignment: 'right',
        //   bold: true,
        //   margin: [0,0,120,0]
        // },
        {
          columns: [
            {
              width: 50,
              text: 'GESTIÓN 2022',fontSize: 7,
              bold:true
            },
          ],
          bold: true,
          margin: [600,0,0,0]
        },
        {
          columns: [
            {
              width: 250,
              text: 'NOMBRE DE LA INSTITUCION: INSTITUTO DE FORMACIÓN ARTÍSTICA "MARÍA LUISA LUZIO"',
              bold:true
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
  //#endregion

  //#region PARA CENTRALIZADOR FINAL
  cursosEsts=[]

  //ESTO ES PARA ESTADISTICAS
  cantidadVaronesInscritos=0;
  cantidadMujeresInscritos=0;
  cantidadVaronesRetirados=0;
  cantidadMujeresRetirados=0;
  cantidadVaronesEfectivos=0;
  cantidadMujeresEfectivos=0;
  cantidadVaronesReprobados=0;
  cantidadMujeresReprobados=0;
  cantidadVaronesAprobados=0;
  cantidadMujeresAprobados=0;
  //HASTA ACA ESTADISTICAS

  CursoSeleccionado;
  btnCentralizador=false;

  CentralizadorFinal=[]
  cantMaterias=0;
  forHeaders=[]
  conjdata=[] //ACA COLOCAREMOS LOS TITULOS COMO JSON
  CantAprobados=0; CantReprobados=0; CantRetirados=0; CantTotal=0; //PARA ESTADISTICAS
  TitlesColums: Array<{titulo: string}> = [];
  ListarForCentralizadorFinal(NivelCursoTxt){
    this.CantAprobados=0; this.CantReprobados=0; this.CantRetirados=0; this.CantTotal=0


    //HASTA ACA EXTRA PARA SACAR FECHA DE RETIRO


    //EMPEZANDO A CONTRUIR EL CENTRALIZADOR
    //LIMPIEZA
    this.TitlesColums=[]
    this.CentralizadorFinal=[]
    this.cantMaterias=0;
    this.forHeaders=[]
    this.conjdata=[] //ACA COLOCAREMOS LOS TITULOS COMO JSON
    let data = {
      // ejemplo: atributo:this.newnombreCrud?.value.atributo,
      NivelCurso:NivelCursoTxt
    };
    // FASE 1
    // OBTENER LA LISTA DE FECHAS BAJA
    //EXTRA PARA SACAR FECHA DE RETIRO
    var FechRetiroList=[]

    axios.post(this.ruta+'api/ListarForCentralizadorFinal',data)
    .then(res=>{
      var ListaCentralizadorFinal= res.data.lista2;
      axios.post(this.ruta+'api/ObtenerFechaRetiro',ListaCentralizadorFinal)
      .then(res2=>{
        console.table(res2.data)

        FechRetiroList=res2.data
        console.log('FECHAS RETIRO OBTENIDAS',FechRetiroList[12])

      })
    })

    //FASE 2 --> es necesario retardar 1segundo /ESTADISTICAS TAMBIEN

    setTimeout(() => {
    axios.post(this.ruta+'api/ListarForCentralizadorFinal',data)
    .then(res=>{
      // var conjdata=[] //ACA COLOCAREMOS LOS TITULOS COMO JSON
      console.log('RETORNACION',res)



      //OBTENER LOS TITULOS DEL res.data[0]
      var keyNames = Object.keys(res.data.lista2[0]);
      keyNames.forEach(element => {
        this.TitlesColums.push({'titulo':element});
      });
      console.log('los tittles', this.TitlesColums)
      this.TitlesColums.forEach(e => {
        this.conjdata.push(e.titulo);
      });
            //ESTO ES APARTE... ES PARA CONSTRUIR SUS HEADERS DEL GENERADOR PDF MAKEÇ
              let matsdate={
                course:NivelCursoTxt
              }

              axios.post(this.ruta+'api/ListarForHeaderFinal',matsdate)
              .then(res1=>{
                console.table(res1.data)
                this.forHeaders = res1.data;
                console.log('getCoso',this.forHeaders['0']['1'])
                this.btnCentralizador=true //UNA VEZ TERMINADO DE CARGAR TODO LO NECESARIO RECIEN HABILITAR BOTON GENERAR
              })
              // ArrayHeader.push({'ASIGNATURA':})
            //HASTA ACA
      console.log('res titulos CONVERTIDOS', this.conjdata)

      //PROCEDER A CONTRUIR EL DATA DEL CENTRALIZADOR FINAL LCCH
      var p=0; //CONTADOR PARA FECHA BAJA
      this.cantMaterias=this.conjdata.length-6 //OBTENER CANTIDAD DE MATERIAS EN NIVEL //SI SE AUMENTA UN ATRIBUTO EN LA SUPER CONSULTA AUMENTAR ACA
      res.data.lista2.forEach(e => {
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

        //REALIZANDO DISTINTAS PRUEBAS PARA EL ORIGINAL
        if (contRetirado==this.cantMaterias) {
          //PRUEBA DEL RETIRADO => TODO CERO o CANTIDAD DE CEROS = cantMaterias
          //RETIRADO
          e.Promovido = 'NO';
          e.Observacion = 'RETIRADO';
          // var strFechBaja:string = FechRetiroList[p]
          e.FechBaja= FechRetiroList[p];
          // e.FechBaja = '04/03/2022'; //DETERMINAR FECHA HACIENDO CONSULTA APARTE REVIZANDO SUS CALIFICACIONES DEL REGISTRO
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
        p++
      });

      //HACIENDO
      res.data.lista1.forEach(e => {
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

        //REALIZANDO DISTINTAS PRUEBAS PARA EL ORIGINAL
        if (contRetirado==this.cantMaterias) {
          //PRUEBA DEL RETIRADO => TODO CERO o CANTIDAD DE CEROS = cantMaterias
          //RETIRADO
          e.Promovido = 'NO';
          e.Observacion = 'RETIRADO';
          // var strFechBaja:string = FechRetiroList[p]
          e.FechBaja= FechRetiroList[p];
          // e.FechBaja = '04/03/2022'; //DETERMINAR FECHA HACIENDO CONSULTA APARTE REVIZANDO SUS CALIFICACIONES DEL REGISTRO
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
        p++
      });
      this.CentralizadorFinal=res.data.lista2
      console.table(res.data.lista1)
      //DESDE ACA ES PARA ESTADISTICAS HOMBRES MUJERES APROBADOS ETC

       //INSCRITOS
      this.cantidadVaronesInscritos = res.data.lista1.filter(a => (a.Sexo.indexOf('MASCULINO')) > -1).length
      this.cantidadMujeresInscritos = res.data.lista1.filter(a => (a.Sexo.indexOf('FEMENINO')) > -1).length
      //RETIRADOS
      var datacantidadRetirados = res.data.lista1.filter(a => (a.Observacion.indexOf('RETIRADO')) > -1)
      this.cantidadVaronesRetirados = datacantidadRetirados.filter(a => (a.Sexo.indexOf('MASCULINO')) > -1).length
      this.cantidadMujeresRetirados = datacantidadRetirados.filter(a => (a.Sexo.indexOf('FEMENINO')) > -1).length

      //EFECTIVOS
      var datacantidadEfectivos = res.data.lista1.filter(a => (a.Observacion.indexOf('REPROBADO')) > -1 || (a.Observacion.indexOf('APROBÓ')) > -1)
      this.cantidadVaronesEfectivos=datacantidadEfectivos.filter(a => (a.Sexo.indexOf('MASCULINO')) > -1).length
      this.cantidadMujeresEfectivos=datacantidadEfectivos.filter(a => (a.Sexo.indexOf('FEMENINO')) > -1).length
      //REPROBADOS
      var datacantidadReprobados = res.data.lista1.filter(a => (a.Observacion.indexOf('REPROBADO')) > -1)
      this.cantidadVaronesReprobados=datacantidadReprobados.filter(a => (a.Sexo.indexOf('MASCULINO')) > -1).length
      this.cantidadMujeresReprobados=datacantidadReprobados.filter(a => (a.Sexo.indexOf('FEMENINO')) > -1).length
      //APROBADOS
      var datacantidadAprobados = res.data.lista1.filter(a => (a.Observacion.indexOf('APROBÓ')) > -1)
      this.cantidadVaronesAprobados=datacantidadAprobados.filter(a => (a.Sexo.indexOf('MASCULINO')) > -1).length
      this.cantidadMujeresAprobados=datacantidadAprobados.filter(a => (a.Sexo.indexOf('FEMENINO')) > -1).length

      console.log('Varones Inscritos',this.cantidadVaronesInscritos);
      console.log('Mujeres Inscritos',this.cantidadMujeresInscritos);
      console.log('Varones Retirados',this.cantidadVaronesRetirados);
      console.log('Mujeres Retirados',this.cantidadMujeresRetirados);
      console.log('Varones Efectivos',this.cantidadVaronesEfectivos);
      console.log('Mujeres Efectivos',this.cantidadMujeresEfectivos);
      console.log('Varones Reprobados',this.cantidadVaronesReprobados);
      console.log('Mujeres Reprobados',this.cantidadMujeresReprobados);
      console.log('Varones Aprobados',this.cantidadVaronesAprobados);
      console.log('Mujeres Aprobados',this.cantidadMujeresAprobados);
      //HASTA ACA ES PARA ESTADISTICAS HOMBRES MUJERES APROBADOS ETC

      // this.CentralizadorFinal=res.data
      // this.CentralizadorFinal.forEach(e => {
      //   e.Sexo
      // });
      // this.CentralizadorFinal.
      console.table('SIN SEXO',this.CentralizadorFinal) //QUITANDO EL SEXO
      // PARA OBTENER ESTADISTICAS
      this.CantTotal = this.CentralizadorFinal.length
      res.data.lista2.forEach(e => {
        switch (e.Observacion) {
          case 'REPROBADO':
            this.CantReprobados++
            break;
          case 'RETIRADO':
            this.CantRetirados++
            break;
          default:
            this.CantAprobados++
            break;
        }
      });

      setTimeout(() => {
        // this.btnCentralizador=true
      }, 500);
      // console.log('tittles',JSON.stringify(this.TitlesColums)) //PARA CONVERTIR JSON UN ARRAY
    })
    .catch(error=>{
      console.log(error)
    })
    }, 1000);


  }
  numLibro='';
  openCentralizadorFinal(){
    //DETERMINANDO NIVEL
    var lvlCurso;
    if (this.CursoSeleccionado.indexOf("SUPERIOR") !== -1) {
      lvlCurso = 'TECNICO SUPERIOR'
    }else{
      lvlCurso = 'CAPACITACIÓN'
    }

    var body=[]
    var headers = this.forHeaders
    console.log("CABEZAS",this.forHeaders);

    var contColumsHeader=0   //SIRVE PARA RECORRER LA FILA [contColumsHeader][i]
    for(var key in headers){
      if (headers.hasOwnProperty(key)) {
        var header = headers[key]
        var fila = new Array();
        if(contColumsHeader==0){
          fila.push(
            {
              // border: [false ,false,false ,false],
              text: '\n\n\n\n\nCURSO: '+this.CursoSeleccionado.toString(),
              colSpan: 2,
              rowSpan:4,
              style:'tittlefijosHeader',
              margin: [20,0,0,0],
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
        var contacion=0
        for (let num = 0; num < this.cantMaterias; num++) {
          if(this.forHeaders[contColumsHeader][num]==''){
            if (this.CursoSeleccionado.includes('SUPERIOR')) {
              fila.push({text:'PRUEBA DE ADMISIÓN',alignment: 'center',style:'tittlefijosHeader'}); //n....
            } else {
              fila.push({text:'NINGUNA',alignment: 'center',style:'tittlefijosHeader'}); //n....
            }



          }else{

            if(this.forHeaders[3][num].length>35){

              if (this.forHeaders[0][num].length>35) {
                console.log("SIN ENTER."+contacion+".."+this.forHeaders[0][num],this.forHeaders[0][num].length);

                fila.push({text:this.forHeaders[contColumsHeader][num],alignment: 'center',style:'tittlefijosHeader'}); //n....
              } else {
                console.log("ENTER."+contacion+".."+this.forHeaders[0][num],this.forHeaders[0][num].length);
                fila.push({text:this.forHeaders[contColumsHeader][num]+'\n ',alignment: 'center',style:'tittlefijosHeader'}); //n....
              }
              contacion++

            }else{
              if (this.forHeaders[0][num].length>35) {
                console.log("SIN ENTER2."+contacion+".."+this.forHeaders[0][num],this.forHeaders[0][num].length);
                fila.push({text:this.forHeaders[contColumsHeader][num],alignment: 'center',style:'tittlefijosHeader'}); //n....
              } else {
                console.log("ENTER2."+contacion+".."+this.forHeaders[0][num],this.forHeaders[0][num].length);
                fila.push({text:this.forHeaders[contColumsHeader][num]+'\n ',alignment: 'center',style:'tittlefijosHeader'}); //n....
              }
              contacion++

            }

          }
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

    console.log("283 xd")
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
          if (this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]]<61) {
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',bold:true,color:'red',style:'tittlefijosHeader'}); //n....
          } else {
            row.push({text:this.CentralizadorFinal[contador-1][this.conjdata[numTituloMateria]].toString(),alignment: 'center',style:'tittlefijosHeader'}); //n....
          }

        } //n...
        contColumsHeader++

        row.push({ text: data.Area.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+1
        row.push({ text: data.Especialidad.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+2
        if (data.Observacion.toString()=='REPROBADO' ||data.Observacion.toString()=='RETIRADO' ) {
          row.push({ text: data.Observacion.toString(),alignment: 'center',bold:true,color:'red',style:'tittlefijosBody'}); //n+3
        } else {
          row.push({ text: data.Observacion.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+3
        }

        row.push({ text: data.FechBaja.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+4
        row.push({ text: data.Promovido.toString(),alignment: 'center',style:'tittlefijosBody'}); //n+5

        body1.push(row);
      }
    }

    var dd = {

      // pageMargins: [ 20, 10, 10 ,10],
      //izq, arriba,derecha,abajo
      pageMargins: [20, 80, 20, 155],
      pageOrientation: 'landscape',
      pageSize: 'A4',
      content: [
        {
          //#region
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgYAAAIGCAYAAAAvP0egAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQd4VNXWhr8z6SEQSuih9xYI1YK9XHv3XutVwYZiBeUqkAaCREAFEYWrgL2LomLvXoSEJISe0EILhADpfeb8z95J+CFMkjOZds6cb56Hx//+7LPLu9Ycvll77bUV8EMCJEACJEACJEACNQQUkiABEiABEiABEiCBWgIUBvQFEiABEiABEiCBEwQoDOgMJEACJEACJEACFAb0ARIgARIgARIggdMJMGJAryABEiABEiABEmDEgD5AAiRAAiRAAiTAiAF9gARIgARIgARIoAEC3Eqge5AACZAACZAACXArgT5AAiRAAiRAAiTArQT6AAmQAAmQAAmQALcS6AMkQAIkQAIkQAJaCDDHQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCoAFKqqoGAOgH4HJVVS9QFKUvgLYAmgHw0wLYRG2sAIoBHFFVdZui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',
          //#endregion
          width: 60, height: 60,float: "left",margin:[30,0,0,0]
        },
        {
        text: 'CENTRALIZADOR DE CALIFICACIONES',
        fontSize: 15,
        alignment: 'center',
        bold: true,margin:[0,-30,0,0]
        },
        // {
        //   text: 'GESTIÓN 2022    Nº LIBRO 18. \nNº FÓLIO',
        //   fontSize: 7,
        //   alignment: 'right',
        //   bold: true,
        //   margin: [0,0,120,0]
        // },
        {
          columns: [
            {
              width: 50,
              text: 'GESTIÓN 2022',fontSize: 7,
              bold:true
            },
            {
              width: 50,
              text: 'Nº LIBRO '+this.numLibro.toString()+' \nNº FÓLIO',fontSize: 7,
              bold:true
            },
            // {
            //   width: 'auto',
            //   text: '12312300',
            //   fontSize: 14,
            // },
          ],
          bold: true,
          margin: [600,0,0,0]
        },
        {
          columns: [
            {
              width: 250,
              text: 'NOMBRE DE LA INSTITUCION: INSTITUTO DE FORMACIÓN ARTÍSTICA "MARÍA LUISA LUZIO"',
              bold:true
            },
            {
              width: 80,
              text: 'RESOLUCIÓN MINISTERIAL:',
              bold:true
            },
            {
              width: 200,
              text: 'Nº 0695/2019 - Nº 1295/2018'
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
              text: lvlCurso.toString()
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

        {
          style: 'tableExample', pageBreak: 'before',
          table: {
            widths: [80, 40,80],
            body: [
              [{text:'RESUMEN', fontSize:5, bold:true,alignment:'center'},{text:'TOTAL', fontSize:5, bold:true,alignment:'center'},{text:'PORCENTAJE', fontSize:5, bold:true,alignment:'center'}],
              [{text:'ESTUDIANTES INSCRITOS', fontSize:5, bold:false}, {text:this.CantTotal.toString(), fontSize:5, bold:false,alignment:'center'},{text:'100%', fontSize:5, bold:false,alignment:'center'}],
              [{text:'ESTUDIANTES APROBADOS', fontSize:5, bold:false}, {text:this.CantAprobados.toString(), fontSize:5, bold:false,alignment:'center'},{text:(Math.round((this.CantAprobados*100)/this.CantTotal)).toString()+'%', fontSize:5, bold:false,alignment:'center'}],
              [{text:'ESTUDIANTES REPROBADOS', fontSize:5, bold:false}, {text:this.CantReprobados.toString(), fontSize:5, bold:false,alignment:'center'},{text:(Math.round((this.CantReprobados*100)/this.CantTotal)).toString()+'%', fontSize:5, bold:false,alignment:'center'}],
              [{text:'ESTUDIANTES RETIRADOS', fontSize:5, bold:false}, {text:this.CantRetirados.toString(), fontSize:5, bold:false,alignment:'center'},{text:(Math.round((this.CantRetirados*100)/this.CantTotal)).toString()+'%', fontSize:5, bold:false,alignment:'center'}]
            ]
          },
          margin: [270,250,0,0],
          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
          }
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

  //#endregion
  CargarCursoUnique() {
    //Cargar todos los cursos
    axios.get(this.ruta + 'api/cursoUnique')
      .then(res => {
        console.log('CURSO UNIQUE', res.data);
        this.cursoUnique = res.data;
        console.log('cursoUnique cargado', this.cursoUnique);

      }).catch(err => {
        console.log("err");
      });
  }
  CargarNivelUnique() {
    //cargar los cursos que estan desde ApisController
    axios.get(this.ruta + 'api/ListarCursosPostulantesApi')
      .then(res => {
        console.log('LISTA DE CURSOS APIs', res.data);
        this.nivelUnique = res.data;
        console.log('LISTA DE CURSOS APIs cargado', this.nivelUnique);

      }).catch(err => {
        console.log("err");
      });
    //SI SIRVE
    // //Cargar todos los cursos desde la tabla y eliminando cursos repetidos
    // axios.get(this.ruta + 'api/cursoUnique')
    //   .then(res => {
    //     console.log('CURSO UNIQUE',res.data);
    //     this.cursoUnique = res.data;
    //     console.log('cursoUnique cargado',this.cursoUnique);

    //   }).catch(err => {
    //     console.log("err");
    //   });
  }
  CargarListadoEstudiantes() {
    // NiveldeCurso='SEGUNDO MEDIO';
    axios.post(this.ruta + 'api/ListaEstudiantes', {
        // NivelCurso:NiveldeCurso.toString()
        // NivelCurso:'SEGUNDO SUPERIOR'
        NivelCurso: this.CursoListar
      })
      .then(res => {

        console.log('LA LISTA DE ESTUDIANTES:');
        console.log(res.data);
        this.est = res.data;
        // this.Cargarcalificacion();
      })
      .catch(error => {
        console.log('HAY ERROR AL CARGAR LISTADO DE ESTUDIANTES');
        console.log(error);
      })
  }
  AbrirEstadistico() {
    var dd = {
      //izq, arriba,derecha,abajo
      pageMargins: [80, 135, 80, 130],
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      header: [{
          text: '\n\n\nRESUMEN ESTADÍSTICO INICIO DE GESTIÓN',
          fontSize: 15,
          alignment: 'center',
          bold: true
        },
        {
          text: 'INSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'R.M. Nº 718/2016 - R.M. Nº 0695/2019',
          fontSize: 7,
          alignment: 'center',
          bold: true
        },
        {
          text: 'ORURO - BOLIVIA',
          fontSize: 7,
          alignment: 'center',
          bold: true
        },
        {
          text: '\nGESTION: 2022',
          fontSize: 8,
          alignment: 'center',
          bold: true
        },
        {
          text: 'TURNO TARDE Y NOCHE\n\n',
          fontSize: 10,
          bold: true,
          marginLeft: 100
        },
      ],
      // header: function() {
      //     return {
      //         // margin: 40,

      //         // columns: [

      //         //   { },
      //         //   { text:['Resumen disciplinario'],alignment: 'left',bold:true,margin:[-405,80,0,0],fontSize: 24}
      //         // ]
      //     }
      // },
      footer: function (currentPage, pageCount) {
        //,left,updown,nose
        return {
          text: '' + (currentPage + 2).toString() + '',
          alignment: 'right',
          margin: [0, -400, 50, 0],
          fontSize: 8
        };
        // return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right',margin:[0,0,0,0] };
      },
      defaultStyle: {
        fontSize: 7,
        aligment: 'center',
        // columnGap : 20
      },
      content: [

        {
          style: 'tableExample',
          table: {
            columnPadding: 0,
            widths: [40, '*', 70, '*', 50, 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            // widths: ['auto', 'auto', 'auto','auto', 'auto', 'auto','auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: [
              [{
                  text: '\nCARRERA',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '\nNIVEL',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '\nMODALIDAD',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '\nCURSO',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '\nTURNO',
                  style: 'tableHeader',
                  rowSpan: 2,
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'NUEVOS',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                  bold: true
                }, {}, {},
                {
                  text: 'ANTIGUOS',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                  bold: true
                }, {}, {},
                {
                  text: 'TOTAL INSCRITOS',
                  style: 'tableHeader',
                  colSpan: 3,
                  alignment: 'center',
                  bold: true
                }, {}, {}
              ],
              // {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],

              [{},
                {},
                {},
                {},
                {},
                {
                  text: 'VAR',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'MUJ',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'TOTAL',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },

                {
                  text: 'VAR',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'MUJ',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'TOTAL',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },

                {
                  text: 'VAR',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'MUJ',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: 'TOTAL',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true
                }
              ],

              [{
                  text: '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nMUSICA',
                  alignment: 'center',
                  rowSpan: 20
                },
                {
                  text: '\n\n\n\nTECNICO SUPERIOR',
                  alignment: 'center',
                  rowSpan: 6
                },
                {
                  text: '\n\n\n\nANUAL',
                  alignment: 'center',
                  rowSpan: 6
                },
                {
                  text: '1º SUPERIOR "A"',
                  alignment: 'center'
                },
                {
                  text: '\n\n\nNOCHE',
                  alignment: 'center',
                  rowSpan: 5
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //Espacio TECNICO SUPERIOR
                {}, //Espacion ANUAL
                {
                  text: '1º SUPERIOR "B"',
                  alignment: 'center'
                },
                {}, //Espacio NOCHE
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //Espacio TECNICO SUPERIOR
                {}, //Espacion ANUAL
                {
                  text: '1º SUPERIOR "C"',
                  alignment: 'center'
                },
                {}, //Espacio NOCHE
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //Espacio TECNICO SUPERIOR
                {}, //Espacion ANUAL
                {
                  text: '2º SUPERIOR',
                  alignment: 'center'
                },
                {}, //Espacio NOCHE
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //Espacio TECNICO SUPERIOR
                {}, //Espacion ANUAL
                {
                  text: '3º SUPERIOR',
                  alignment: 'center'
                },
                {}, //Espacio NOCHE
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //Espacio TECNICO SUPERIOR
                {}, //Espacion ANUAL
                {
                  text: 'SUB TOTAL',
                  alignment: 'center',
                  colSpan: 2
                },
                {}, //Espacio SUB TOTAL
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {
                  text: '\n\n\n\n\n\n\n\n\nCAPACITACION',
                  alignment: 'center',
                  rowSpan: 14
                },
                {
                  text: '\n\n\n\n\n\n\n\n\nANUAL',
                  alignment: 'center',
                  rowSpan: 14
                },
                {
                  text: 'PREPARATORIO TARDE "A"',
                  alignment: 'center'
                },
                {
                  text: '\n\nDIURNO',
                  alignment: 'center',
                  rowSpan: 4
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: 'PREPARATORIO TARDE "B"',
                  alignment: 'center'
                },
                {}, //espacio DIURNO
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: 'PREPARATORIO NOCHE "A"',
                  alignment: 'center'
                },
                {}, //espacio DIURNO
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '1º TARDE "A',
                  alignment: 'center'
                },
                {}, //espacio DIURNO
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '1º "A"',
                  alignment: 'center'
                },
                {
                  text: '\n\n\n\n\n\nNOCHE',
                  alignment: 'center',
                  rowSpan: 10
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '1º "B"',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{},
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '1º "C"',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{},
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '1º "D"',
                  alignment: 'center'
                },
                {
                  text: 'NOCHE',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '2º "A"',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '2º "B"',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '3º',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '2º MEDIO',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: '3º MEDIO',
                  alignment: 'center'
                },
                {}, //espcio NOCHE2
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{}, //espacio MUSICA
                {}, //espacio CAPACITACION
                {}, //espacio ANUAL2
                {
                  text: 'SUB TOTAL',
                  alignment: 'center',
                  colSpan: 2
                },
                {}, //espacio SUB TOTAL
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                },
                {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }, {
                  text: '15',
                  alignment: 'center'
                }
              ],
              [{
                  text: 'TOTAL GENERAL',
                  alignment: 'center',
                  colSpan: 5
                }, //espacio MUSICA
                {}, //espacio TOTAL GENERAL
                {}, //espacio TOTAL GENERAL
                {}, //espacio TOTAL GENERAL
                {}, //espacio TOTAL GENERAL
                {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                },
                {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }, {
                  text: '15',
                  alignment: 'center',
                  bold: true
                }
              ]

            ]
          },

          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex < 2) ? '#CCCCCC' : null;
            },
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },

            //PARA PADDING HORIZONTAL
            // paddingLeft: function (i) {
            //   return i === 0 ? 0 : 8;
            // },
            // paddingRight: function (i, node) {
            //   return (i === node.table.widths.length - 1) ? 0 : 8;
            // }
            // AL QUITAR ESTO TODO ESTA EN NEGRILLA INCLUIDO LOS BORDES EXTERIORES
            // hLineColor: function (i, node) {
            //   return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            // },
            // vLineColor: function (i, node) {
            //   return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            // },
            //HASTA ACÁ

            // TODO ESTO ES PARA PUNTOS SUSPENSIVOS EN LA TABLA
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],

      styles: {
        headers: {
          fontSize: 28,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        }
      }
    };
    pdfMake.createPdf(dd).open();
  }

  async openListaAlumnos() {
    this.CargarListadoEstudiantes();
    // //PONER LOS TITULOS DE LOS HEADER TABLAS
    // const headersTabla = ['Ap_Paterno','Ap_Materno','Nombre','Sexo'];
    // //PONER LOS NOMBRES DE LOS ATRIBUTOS QUE SE QUIEREN
    // const col = ['Ap_Paterno','Ap_Materno','Nombre','Sexo'];
    // this.DatosPDF= buildTableBody(this.est,col,headersTabla);
    // console.log(this.bodyData);

    // const documentDefinition = {
    //   // TAMAÑO DE LA HOJA(CARTA)
    //   pageSize: 'LETTER',

    //   //ORIENTACION DE LA HOJA
    //   pageOrientation: 'landscape',

    //   // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
    //   // pageMargins: [ 40, 60, 40, 60 ],
    //   defaultStyle : {
    //     fontSize  : 10,
    //     columnGap : 20
    //   },
    //     content: [
    //       {text:'INSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"', fontSize:10, alignment: 'center', bold:true},
    //       {text:'R.M. Nº 718/2016 - R.M. Nº 0695/2019', fontSize:10, alignment: 'center', bold:true},
    //       {text:'CARRERA: MÚSICA', fontSize:10, alignment: 'center', bold:true},
    //       {text:'ÁREA: ARTÍSTICA\n\n\n\n', fontSize:10, alignment: 'center', bold:true},
    //       {text:'CUADRO DE INSCRIPCIONES DE ALUMNOS NUEVOS Y ANTIGUOS', fontSize:18, alignment: 'center', bold:true},
    //       {text:'GESTION: 2021', fontSize:15, alignment: 'center', bold:true},

    //       {
    //         table: {
    //           body:[
    //             ['Column 1', 'Column 2', 'Column 3'],
    //             this.DatosPDF
    //           ],
    //             // body: this.DatosPDF
    //         }
    //       }
    //     ]

    //   };
    //   // console.log(this.bodyData);
    //   pdfMake.createPdf(documentDefinition).open();
    // var headers = {
    //   fila_0:{
    //       col_1:{ text: 'Faltas', style: 'tableHeader',colSpan: 2, alignment: 'center',margin: [0, 8, 0, 0] },
    //       col_3:{ text: 'Fecha', style: 'tableHeader',rowSpan: 2, alignment: 'center',margin: [0, 8, 0, 0] },
    //       col_4:{ text: 'Descripción', style: 'tableHeader',rowSpan: 2, alignment: 'center',margin: [0, 8, 0, 0] },
    //       col_5:{ text: 'Cita con acudientes', style: 'tableHeader',rowSpan: 2, alignment: 'center' }
    //   },
    //   fila_1:{
    //       col_1:{ text: 'Header 1', style: 'tableHeader', alignment: 'center' },
    //       col_2:{ text: 'Header 2', style: 'tableHeader', alignment: 'center' },
    //       col_3:{ text: 'Header 3', style: 'tableHeader', alignment: 'center' },
    //       col_4:{ text: 'Citación', style: 'tableHeader', alignment: 'center' },
    //       col_5:{ text: 'Cumplimiento', style: 'tableHeader', alignment: 'center'}
    //   }
    // }
    var headers = {
      fila_0: {
        col_0: {
          text: 'Nº',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_1: {
          text: 'APELLIDOS Y NOMBRES',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        }
      }
    }


    var rows = this.est;

    var body = [];
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        var header = headers[key];
        var row = new Array();
        row.push(header.col_0);
        row.push(header.col_1);
        body.push(row);
      }
    }
    //HASTA ACA TODO BIEN
    var contador = 0;
    for (var key in rows) {

      if (rows.hasOwnProperty(key)) {
        var data = rows[key];
        if (data.Estado.toString() == 'ACTIVO') {
          var row = new Array();
          contador = contador + 1;
          row.push(contador);
          // row.push( data.id.toString()  ); //0

          //PARA NOMBRE COMPLETO
          var apPa = data.Ap_Paterno.toString();
          var apMa = data.Ap_Materno.toString();
          var nom = data.Nombre.toString();
          var NomComplet = apPa + ' ' + apMa + ' ' + nom;
          row.push(NomComplet); //1
          body.push(row);

        }

      }
    }
    var paginaInicial = this.numeroPaginaCurso - 1;
    var dd = {
      //izq, arriba,derecha

      pageSize: 'LETTER',
      pageMargins: [100, 170, 40, 50],
      // pageOrientation: 'landscape',
      header: [

        {
          text: '\n\n\n\n\nINSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'R.M. Nº 718/2016 - R.M. Nº 0695/2019',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'CARRERA: MÚSICA',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'ÁREA: ARTÍSTICA\n',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'LISTA DE ESTUDIANTES POR CURSO',
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: 'GESTION: 2022',
          fontSize: 15,
          alignment: 'center',
          bold: true
        },
        {
          text: this.CursoListar,
          fontSize: 10,
          bold: true,
          margin: [100, 0, 50, 50]
        },

      ],
      // header: function() {
      //     return {
      //         // margin: 40,

      //         // columns: [

      //         //   { },
      //         //   { text:['Resumen disciplinario'],alignment: 'left',bold:true,margin:[-405,80,0,0],fontSize: 24}
      //         // ]
      //     }
      // },
      // footer: function(currentPage, pageCount) {
      //   //,left,updown,nose
      //     return { text:''+ (currentPage+2).toString() + '' , alignment: 'right',margin:[0,-400,50,0] };
      //     // return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right',margin:[0,0,0,0] };
      // },
      footer: function (currentPage, pageCount) {
        return [{
            text: '' + (currentPage + paginaInicial).toString() + '',
            alignment: 'right',
            margin: [0, -700, 50, 0],fontSize: 9
          },

        ];
      },
      defaultStyle: {
        fontSize: 8,
        columnGap: 20
      },
      content: [

        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto'],
            headerRows: 1,
            // keepWithHeaderRows: 1,
            body: body
          },

          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],

      styles: {
        headers: {
          fontSize: 28,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        }
      }
    };
    pdfMake.createPdf(dd).open();
  }

  numeroPaginaCuadroCTS = 0;
  TipoPaginaCuadroCTS = '';
  SizePaginaCuadroCTS = '';

  // NIVEL CAPACITACIÓN O TÉCNICO SUPERIOR
  ConsultarForCuadroCTS(CTS) {

    if (this.SizePaginaCuadroCTS=='CARTA') {
      //HACER CARTA
      if (this.TipoPaginaCuadroCTS == 'SUPERIOR') {
        axios.post(this.ruta + 'api/ConsultarApi', {
            consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") and (Curso_Solicitado like "%' + CTS + '%") order by created_at asc'
          })
          .then(res => {
            this.TipoPaginaCuadroCTS = 'TÉCNICO SUPERIOR';
            console.log(res.data);
            this.estCuadro = res.data;
            this.openCuadroAlumnos();
          }).catch(err => {
            console.log("err");
          });
      } else {
        axios.post(this.ruta + 'api/ConsultarApi', {
            consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") and (Curso_Solicitado like "%BASICO%" or Curso_Solicitado like "%INTERMEDIO%" or Curso_Solicitado like "%INICIACION%") order by created_at asc'
          })
          .then(res => {
            this.TipoPaginaCuadroCTS = ' CAPACITACIÓN';
            console.log(res.data);
            this.estCuadro = res.data;
            this.openCuadroAlumnos();
          }).catch(err => {
            console.log("err");
          });
      }
    } else {
      //HACER OFICIO
      if (this.TipoPaginaCuadroCTS == 'SUPERIOR') {
        axios.post(this.ruta + 'api/ConsultarApi', {
            consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") and (Curso_Solicitado like "%' + CTS + '%") order by created_at asc'
          })
          .then(res => {
            this.TipoPaginaCuadroCTS = 'TÉCNICO SUPERIOR';
            console.log(res.data);
            this.estCuadro = res.data;
            this.openCuadroAlumnosCTSOficio();
          }).catch(err => {
            console.log("err");
          });
      } else {
        axios.post(this.ruta + 'api/ConsultarApi', {
            consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") and (Curso_Solicitado like "%BASICO%" or Curso_Solicitado like "%INTERMEDIO%" or Curso_Solicitado like "%INICIACION%") order by created_at asc'
          })
          .then(res => {
            console.log(res.data);
            this.TipoPaginaCuadroCTS = ' CAPACITACIÓN';
            this.estCuadro = res.data;
            this.openCuadroAlumnosCTSOficio();
          }).catch(err => {
            console.log("err");
          });
      }
    }

  }
  SizePaginaCuadro = '';
  ConsultarForCuadro() {

    this.TipoPaginaCuadroCTS=' CAPACITACIÓN Y SUPERIOR';
    if (this.SizePaginaCuadro=='CARTA') {
      //ES CARTA
      axios.post(this.ruta + 'api/ConsultarApi', {
        consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") order by created_at asc'
      })
      .then(res => {
        console.log(res.data);
        this.estCuadro = res.data;
        this.openCuadroAlumnos();
      }).catch(err => {
        console.log("err");
      });
    } else {
      //ES OFICIO
      axios.post(this.ruta + 'api/ConsultarApi', {
        consultasql: 'select Ap_Paterno,Ap_Materno,Nombre,CI,FechNac,Sexo,Direccion, Carrera, Curso_Solicitado,Turno, Matricula,Categoria, created_at,updated_at from estudiantes where (Categoria = "NUEVO" or Categoria ="ANTIGUO") order by created_at asc'
      })
      .then(res => {
        console.log(res.data);
        this.estCuadro = res.data;
        this.openCuadroAlumnosCTSOficio();
      }).catch(err => {
        console.log("err");
      });
    }
  }
// CUADRO ALUMNOS GENERAL TODO
  async openCuadroAlumnos() {

    var headers = {
      fila_0: {
        col_0: {
          text: 'Nº',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_1: {
          text: 'APELLIDOS Y NOMBRES',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_2: {
          text: 'CÉDULA DE IDENTIDAD',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_3: {
          text: 'FECHA DE NACIMIENTO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_4: {
          text: 'SEXO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_5: {
          text: 'DIRECCIÓN ACTUAL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_6: {
          text: 'CARRERA',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_7: {
          text: 'NIVEL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_8: {
          text: 'TURNO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_9: {
          text: 'MATRÍCULA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_10: {
          text: 'CATEGORIA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_11: {
          text: 'FECHA DE INSCRIPCION',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },

      }
    }


    var rows = this.estCuadro;

    var body = [];
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        var header = headers[key];
        var row = new Array();
        row.push(header.col_0);
        row.push(header.col_1);
        row.push(header.col_2);
        row.push(header.col_3);
        row.push(header.col_4);
        row.push(header.col_5);
        row.push(header.col_6);
        row.push(header.col_7);
        row.push(header.col_8);
        row.push(header.col_9);
        row.push(header.col_10);
        row.push(header.col_11);
        body.push(row);
      }
    }
    var num = 0;
    // var heightlcch="";
    // var numheight="90,";
    //HASTA ACA TODO BIEN
    for (var key in rows) {
      if (rows.hasOwnProperty(key)) {
        var data = rows[key];
        // if (data.Estado.toString()=='INACTIVO') {
        if (data.Categoria.toString() == 'NUEVO' || data.Categoria.toString() == 'ANTIGUO') {
          var row = new Array();
          // heightlcch = heightlcch+numheight;
          //row.push( data.id.toString()  ); //0
          num = num + 1;
          row.push(num);
          //PARA NOMBRE COMPLETO
          var apPa = data.Ap_Paterno.toString();
          var apMa = data.Ap_Materno.toString();
          var nom = data.Nombre.toString();
          var NomComplet = apPa + ' ' + apMa + ' ' + nom;
          // row.push( data.Ap_Paterno.toString() );
          // row.push( data.Ap_Materno.toString()  );
          // row.push( data.Nombre.toString() );
          row.push(NomComplet); //1
          //CONTINUANDO
          // row.push(data.CI.toString()); //2
          row.push({ text: data.CI.toString()+'                 .', alignment: 'left'}); //2

          var dateFech = new Date(data.FechNac.toString());
          let strFech = dateFech.toLocaleDateString('Es-es');
          row.push({ text: strFech, alignment: 'center'}); //3
          row.push({ text: data.Sexo.toString(), alignment: 'center'}); //4
          row.push({ text: data.Direccion.toString(), alignment: 'left'}); //5
          row.push({ text: data.Carrera.toString(), alignment: 'center'}); //6
          // var NivelDato = 'Tecnico Superior';


          // var NivelDato= await this.EncontrarNivelCurso(data.id.toString());
          // console.log('NIVEL DE DATO TABLA');
          // console.log(NivelDato.data);

          if (data.Curso_Solicitado.toString() == 'PRIMERO SUPERIOR' || data.Curso_Solicitado.toString() == 'SEGUNDO SUPERIOR' || data.Curso_Solicitado.toString() == 'TERCERO SUPERIOR') {
            var Nivel = 'TÉCNICO SUPERIOR';
          } else {
            var Nivel = 'CAPACITACIÓN';
          }
          row.push({ text: Nivel, alignment: 'center'}); //7
          row.push({ text: data.Turno.toString(), alignment: 'center'}); //8

          // var concatenarMatricula = num.toString();
          // var guion= ' - ';
          // row.push(concatenarMatricula + guion + data.Matricula.toString()); //9
          row.push({ text: data.Matricula.toString(), alignment: 'center'}); //9
          row.push({ text: data.Categoria.toString(), alignment: 'center'}); //10
          var date = new Date(data.created_at.toString());
          let str = date.toLocaleDateString('Es-es');
          row.push({ text: str, alignment: 'center'}); //11


          body.push(row);

        }
        // console.log(heightlcch);
      }
    }
    var paginaInicial = this.numeroPaginaCuadro - 1;
    var dd = {
      //izq, arriba,derecha,abajo
      pageMargins: [40, 120, 40, 158],
      pageSize: 'LETTER',

      pageOrientation: 'landscape',
      header: [

        {
          text: '\n\n\n\n\nINSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'R.M. Nº 718/2016 - R.M. Nº 0695/2019',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'CARRERA: MÚSICA',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'ÁREA: ARTÍSTICA\n\n\n\n',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },

      ],
      // header: function() {
      //     return {
      //         // margin: 40,

      //         // columns: [

      //         //   { },
      //         //   { text:['Resumen disciplinario'],alignment: 'left',bold:true,margin:[-405,80,0,0],fontSize: 24}
      //         // ]
      //     }
      // },
      footer: function (currentPage, pageCount) {
        return [{
            text: '' + (currentPage + paginaInicial).toString() + '',
            alignment: 'right',
            margin: [0, -410, 50, 0],fontSize: 9
          },

        ];
      },
      // footer: [function(currentPage, pageCount) {

      //   //,left,updown,nose
      //     return { text:''+ (currentPage+paginaInicial).toString() + '' , alignment: 'right',margin:[0,-400,50,0] };
      //     // return { text:''+ (currentPage+2).toString() + '' , alignment: 'right',margin:[0,-400,50,0] }; // ESTO ESTABA ANTES
      //     // return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right',margin:[0,0,0,0] };
      // },

      // ],
      defaultStyle: {
        fontSize: 8,
        columnGap: 20
      },
      content: [{
          text: 'CUADRO DE INSCRIPCIONES DE ALUMNOS NUEVOS Y ANTIGUOS A NIVEL',
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: this.TipoPaginaCuadroCTS,
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: 'GESTION: 2022',
          fontSize: 15,
          alignment: 'center',
          bold: true
        },

        {
          style: 'tableExample',

          table: {
            widths: [14, '*', 43, 49, 46, 90, 36, 56, 35, 55, 43, 50,],
            // paddings:[10,10,10,10,10,10,10,],
            headerRows: 1,

            // keepWithHeaderRows: 1,
            body: body
          },

          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 4; },
            // paddingBottom: function(i, node) { return 4; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],

      styles: {
        headers: {
          fontSize: 28,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        }
      }
    };
    pdfMake.createPdf(dd).open();
  }

  async openCuadroAlumnosCTSOficio() {

    var headers = {
      fila_0: {
        col_0: {
          text: 'Nº',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_1: {
          text: 'APELLIDOS Y NOMBRES',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_2: {
          text: 'CÉDULA DE IDENTIDAD',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_3: {
          text: 'FECHA DE NACIMIENTO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_4: {
          text: 'SEXO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_5: {
          text: 'DIRECCIÓN ACTUAL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_6: {
          text: 'CARRERA',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_7: {
          text: 'NIVEL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_8: {
          text: 'TURNO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_9: {
          text: 'MATRÍCULA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_10: {
          text: 'CATEGORIA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_11: {
          text: 'FECHA DE INSCRIPCION',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },

      }
    }


    var rows = this.estCuadro;

    var body = [];
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        var header = headers[key];
        var row = new Array();
        row.push(header.col_0);
        row.push(header.col_1);
        row.push(header.col_2);
        row.push(header.col_3);
        row.push(header.col_4);
        row.push(header.col_5);
        row.push(header.col_6);
        row.push(header.col_7);
        row.push(header.col_8);
        row.push(header.col_9);
        row.push(header.col_10);
        row.push(header.col_11);
        body.push(row);
      }
    }
    var num = 0;
    //HASTA ACA TODO BIEN
    for (var key in rows) {
      if (rows.hasOwnProperty(key)) {
        var data = rows[key];
        // if (data.Estado.toString()=='INACTIVO') {
        if (data.Categoria.toString() == 'NUEVO' || data.Categoria.toString() == 'ANTIGUO') {
          var row = new Array();
          //row.push( data.id.toString()  ); //0
          num = num + 1;
          row.push({ text: num, alignment: 'center'});
          //PARA NOMBRE COMPLETO
          var apPa = data.Ap_Paterno.toString();
          var apMa = data.Ap_Materno.toString();
          var nom = data.Nombre.toString();
          var NomComplet = apPa + ' ' + apMa + ' ' + nom;
          // row.push( data.Ap_Paterno.toString() );
          // row.push( data.Ap_Materno.toString()  );
          // row.push( data.Nombre.toString() );
          row.push(NomComplet); //1
          //CONTINUANDO
          // row.push(data.CI.toString()); //2
          row.push({ text: data.CI.toString(), alignment: 'center'}); //2

          var dateFech = new Date(data.FechNac.toString());
          let strFech = dateFech.toLocaleDateString('Es-es');
          row.push({ text: strFech, alignment: 'center'}); //3
          // row.push(data.Sexo.toString()); //4
          row.push({ text: data.Sexo.toString(), alignment: 'center'}); //4
          row.push(data.Direccion.toString()); //5
          // row.push({ text: data.Direccion.toString(), alignment: 'center'}); //5
          row.push({ text: data.Carrera.toString(), alignment: 'center'}); //6
          // var NivelDato = 'Tecnico Superior';


          // var NivelDato= await this.EncontrarNivelCurso(data.id.toString());
          // console.log('NIVEL DE DATO TABLA');
          // console.log(NivelDato.data);

          if (data.Curso_Solicitado.toString() == 'PRIMERO SUPERIOR' || data.Curso_Solicitado.toString() == 'SEGUNDO SUPERIOR' || data.Curso_Solicitado.toString() == 'TERCERO SUPERIOR') {
            var Nivel = 'TÉCNICO SUPERIOR';
          } else {
            var Nivel = 'CAPACITACIÓN     .';
          }
          row.push({ text: Nivel, alignment: 'center'}); //7
          // row.push(data.Turno.toString()); //8
          row.push({ text: data.Turno.toString(), alignment: 'center'}); //8
          row.push(data.Matricula.toString()); //9
          // row.push(data.Categoria.toString()); //10
          row.push({ text: data.Categoria.toString(), alignment: 'center'}); //10
          var date = new Date(data.created_at.toString());
          let str = date.toLocaleDateString('Es-es');
          row.push({ text: str, alignment: 'center'}); //11

          body.push(row);

        }

      }
    }
    var paginaInicial = this.numeroPaginaCuadro - 1;
    var dd = {
      // pageSize: {
      //   width: 1247.244,
      //   height: 816.377
      // },
      // pageSize: {
      //   width: 950,
      //   height: 616
      // },
      //izq, arriba,derecha,abajo
      pageMargins: [130, 120, 60, 135],
      pageSize: 'LEGAL',

      pageOrientation: 'landscape',
      header: [

        {
          text: '\n\n\n\n\nINSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"',
          fontSize: 10,
          alignment: 'center',
          margin:[100,0,0,0],
          bold: true
        },
        {
          text: 'R.M. Nº 718/2016 - R.M. Nº 0695/2019',
          fontSize: 10,
          alignment: 'center',
          margin:[100,0,0,0],
          bold: true
        },
        {
          text: 'CARRERA: MÚSICA',
          fontSize: 10,
          alignment: 'center',
          margin:[100,0,0,0],
          bold: true
        },
        {
          text: 'ÁREA: ARTÍSTICA\n\n\n\n',
          fontSize: 10,
          alignment: 'center',
          margin:[100,0,0,0],
          bold: true
        },

      ],
      // header: function() {
      //     return {
      //         // margin: 40,

      //         // columns: [

      //         //   { },
      //         //   { text:['Resumen disciplinario'],alignment: 'left',bold:true,margin:[-405,80,0,0],fontSize: 24}
      //         // ]
      //     }
      // },
      footer: function (currentPage, pageCount) {
        return [{
            text: '' + (currentPage + paginaInicial).toString() + '',
            alignment: 'right',fontSize: 11,
            margin: [0, -400, 65, 0]
          },

        ];
      },
      // footer: [function(currentPage, pageCount) {

      //   //,left,updown,nose
      //     return { text:''+ (currentPage+paginaInicial).toString() + '' , alignment: 'right',margin:[0,-400,50,0] };
      //     // return { text:''+ (currentPage+2).toString() + '' , alignment: 'right',margin:[0,-400,50,0] }; // ESTO ESTABA ANTES
      //     // return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right',margin:[0,0,0,0] };
      // },

      // ],
      defaultStyle: {
        fontSize: 8,
        columnGap: 20
      },
      content: [{
          text: 'CUADRO DE INSCRIPCIONES DE ALUMNOS NUEVOS Y ANTIGUOS A NIVEL',
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: this.TipoPaginaCuadroCTS,
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: 'GESTION: 2022',
          fontSize: 15,
          alignment: 'center',
          bold: true
        },
        {

          style: 'tableExample',
          // alignment:'center',

          table: {
            widths: [14, 115, 55, 49, 46, '*', 36, 65, 35, 55, 43, 50],
            heights: function (row,node) {

              var nod = node;
               return 'auto';
            },
            // heights:3,
            headerRows: 1,

            // keepWithHeaderRows: 1,
            body: body,
          },

          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },


            // paddingLeft: function (i,node) {
            //   return (i === node.table.widths.length) ? 0 : 0;
            // },
            // paddingRight: function (i,node) {
            //   return (i === node.table.widths.length) ? 0 : 0;
            // },
            // paddingTop: function (i, node) {
            //   console.log('ROW ES',node.table.heights.length);
            //   console.log('ROW ES',node);
            //   // node._margin = 5;
            //   // if (node.table.heights.length==2) {
            //   //   return 0;
            //   // } else {
            //   //   return 50;
            //   // }
            // },
            // paddingBottom: function (i, node) {
            //   return (i === node.table.widths.length) ? 2 : 2;
            // }
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            paddingTop: function(i, node) { return 4; },
            paddingBottom: function(i, node) { return 4; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],
      styles: {
        headers: {
          fontSize: 28,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        },
        tableExample: {
          // alignment:'center'
        },
      }
    };
    pdfMake.createPdf(dd).open();
  }
  async openCuadroAlumnosCTS() {

    var headers = {
      fila_0: {
        col_0: {
          text: 'Nº',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_1: {
          text: 'APELLIDOS Y NOMBRES',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_2: {
          text: 'CÉDULA DE IDENTIDAD',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_3: {
          text: 'FECHA DE NACIMIENTO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_4: {
          text: 'SEXO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_5: {
          text: 'DIRECCIÓN ACTUAL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_6: {
          text: 'CARRERA',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_7: {
          text: 'NIVEL',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_8: {
          text: 'TURNO',
          style: 'tableHeader',
          colSpan: 1,
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_9: {
          text: 'MATRÍCULA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_10: {
          text: 'CATEGORIA',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },
        col_11: {
          text: 'FECHA DE INSCRIPCION',
          style: 'tableHeader',
          alignment: 'center',
          margin: [0, 4, 0, 0],
          bold: true
        },

      }
    }


    var rows = this.estCuadro;

    var body = [];
    for (var key in headers) {
      if (headers.hasOwnProperty(key)) {
        var header = headers[key];
        var row = new Array();
        row.push(header.col_0);
        row.push(header.col_1);
        row.push(header.col_2);
        row.push(header.col_3);
        row.push(header.col_4);
        row.push(header.col_5);
        row.push(header.col_6);
        row.push(header.col_7);
        row.push(header.col_8);
        row.push(header.col_9);
        row.push(header.col_10);
        row.push(header.col_11);
        body.push(row);
      }
    }
    var num = 0;
    //HASTA ACA TODO BIEN
    for (var key in rows) {
      if (rows.hasOwnProperty(key)) {
        var data = rows[key];
        // if (data.Estado.toString()=='INACTIVO') {
        if (data.Categoria.toString() == 'NUEVO' || data.Categoria.toString() == 'ANTIGUO') {
          var row = new Array();
          //row.push( data.id.toString()  ); //0
          num = num + 1;
          row.push(num);
          //PARA NOMBRE COMPLETO
          var apPa = data.Ap_Paterno.toString();
          var apMa = data.Ap_Materno.toString();
          var nom = data.Nombre.toString();
          var NomComplet = apPa + ' ' + apMa + ' ' + nom;
          // row.push( data.Ap_Paterno.toString() );
          // row.push( data.Ap_Materno.toString()  );
          // row.push( data.Nombre.toString() );
          row.push(NomComplet); //1
          //CONTINUANDO
          row.push(data.CI.toString()); //2

          var dateFech = new Date(data.FechNac.toString());
          let strFech = dateFech.toLocaleDateString('Es-es');
          row.push(strFech); //3
          row.push(data.Sexo.toString()); //4
          row.push(data.Direccion.toString()); //5
          row.push(data.Carrera.toString()); //6
          // var NivelDato = 'Tecnico Superior';


          // var NivelDato= await this.EncontrarNivelCurso(data.id.toString());
          // console.log('NIVEL DE DATO TABLA');
          // console.log(NivelDato.data);

          if (data.Curso_Solicitado.toString() == 'PRIMERO SUPERIOR' || data.Curso_Solicitado.toString() == 'SEGUNDO SUPERIOR' || data.Curso_Solicitado.toString() == 'TERCERO SUPERIOR') {
            var Nivel = 'TÉCNICO SUPERIOR';
          } else {
            var Nivel = 'CAPACITACIÓN';
          }
          row.push(Nivel); //7
          row.push(data.Turno.toString()); //8
          row.push(data.Matricula.toString()); //9
          row.push(data.Categoria.toString()); //10
          var date = new Date(data.created_at.toString());
          let str = date.toLocaleDateString('Es-es');
          row.push(str); //11

          body.push(row);

        }

      }
    }
    var paginaInicial = this.numeroPaginaCuadro - 1;
    var dd = {
      //izq, arriba,derecha,abajo
      pageMargins: [55, 120, 50, 130],
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      header: [

        {
          text: '\n\n\n\n\nINSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'R.M. Nº 718/2016 - R.M. Nº 0695/2019',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'CARRERA: MÚSICA',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        {
          text: 'ÁREA: ARTÍSTICA\n\n\n\n',
          fontSize: 10,
          alignment: 'center',
          bold: true
        },

      ],
      // header: function() {
      //     return {
      //         // margin: 40,

      //         // columns: [

      //         //   { },
      //         //   { text:['Resumen disciplinario'],alignment: 'left',bold:true,margin:[-405,80,0,0],fontSize: 24}
      //         // ]
      //     }
      // },
      footer: function (currentPage, pageCount) {
        return [{
            text: '' + (currentPage + paginaInicial).toString() + '',
            alignment: 'right',
            margin: [0, -410, 50, 0]
          },
          {
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgYAAAIGCAYAAAAvP0egAAAAAXNSR0IArs4c6QAAIABJREFUeF7snQd4VNXWhr8z6SEQSuih9xYI1YK9XHv3XutVwYZiBeUqkAaCREAFEYWrgL2LomLvXoSEJISe0EILhADpfeb8z95J+CFMkjOZds6cb56Hx//+7LPLu9Ycvll77bUV8EMCJEACJEACJEACNQQUkiABEiABEiABEiCBWgIUBvQFEiABEiABEiCBEwQoDOgMJEACJEACJEACFAb0ARIgARIgARIggdMJMGJAryABEiABEiABEmDEgD5AAiRAAiRAAiTAiAF9gARIgARIgARIoAEC3Eqge5AACZAACZAACXArgT5AAiRAAiRAAiTArQT6AAmQAAmQAAmQALcS6AMkQAIkQAIkQAJaCDDHQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCQAsltiEBEiABEiABkxCgMDCJoblMEiABEiABEtBCgMJACyW2IQESIAESIAGTEKAwMImhuUwSIAESIAES0EKAwkALJbYhARIgARIgAZMQoDAwiaG5TBIgARIgARLQQoDCoAFKqqoGAOgH4HJVVS9QFKUvgLYAmgHw0wLYRG2sAIoBHFFVdZui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',
            width: 70,
            height: 70,
            float: "left",
            margin: [30, -30, 0, 0]
          },
        ];
      },
      // footer: [function(currentPage, pageCount) {

      //   //,left,updown,nose
      //     return { text:''+ (currentPage+paginaInicial).toString() + '' , alignment: 'right',margin:[0,-400,50,0] };
      //     // return { text:''+ (currentPage+2).toString() + '' , alignment: 'right',margin:[0,-400,50,0] }; // ESTO ESTABA ANTES
      //     // return { text:'Pagina '+ currentPage.toString() + ' de ' + pageCount, alignment: 'right',margin:[0,0,0,0] };
      // },

      // ],
      defaultStyle: {
        fontSize: 8,
        columnGap: 20
      },
      content: [{
          text: 'CUADRO DE INSCRIPCIONES DE ALUMNOS NUEVOS Y ANTIGUOS',
          fontSize: 18,
          alignment: 'center',
          bold: true
        },
        {
          text: 'GESTION: 2022',
          fontSize: 15,
          alignment: 'center',
          bold: true
        },
        {
          style: 'tableExample',

          table: {
            widths: [14, 80, 48, 49, 46, '*', 36, 56, 35, 55, 43, 50],

            headerRows: 1,

            // keepWithHeaderRows: 1,
            body: body
          },

          layout: {
            hLineWidth: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 2 : 1;
            },
            vLineWidth: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            hLineColor: function (i, node) {
              return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
            },
            vLineColor: function (i, node) {
              return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
            },
            // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
            // paddingLeft: function(i, node) { return 4; },
            // paddingRight: function(i, node) { return 4; },
            // paddingTop: function(i, node) { return 2; },
            // paddingBottom: function(i, node) { return 2; },
            // fillColor: function (rowIndex, node, columnIndex) { return null; }
          }
        }
      ],

      styles: {
        headers: {
          fontSize: 28,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        sta: {
          fontSize: 11,
          bold: false,
          alignment: 'justify'
        }
      }
    };
    pdfMake.createPdf(dd).open();
  }
  GenerarCentralizadorFinal(Curso){

  }
}
