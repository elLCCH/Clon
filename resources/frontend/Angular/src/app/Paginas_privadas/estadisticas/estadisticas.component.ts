import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  ruta = 'http://localhost:8000/';
  TotalA;
  TotalN;
  TotalP;


  T1roNSuperior;
  T1roNIntermedio;
  T1roNBasico;
  T1roNIniciacion;

  T3roSuperior;  //TOTAL EN NIVEL
  T2doSuperior;  //TOTAL EN NIVEL
  T1roSuperior;  //TOTAL EN NIVEL
  T3roIntermedio; //TOTAL EN NIVEL
  T2doIntermedio; //TOTAL EN NIVEL
  T1roIntermedio; //TOTAL EN NIVEL
  T3roBasico; //TOTAL EN NIVEL
  T2doBasico; //TOTAL EN NIVEL
  T1roBasico; //TOTAL EN NIVEL
  T3roIniciacion; //TOTAL EN NIVEL
  T2doIniciacion; //TOTAL EN NIVEL
  T1roIniciacion; //TOTAL EN NIVEL



  THN3roSuperior=0; //total hombres nuevos
  TMN3roSuperior=0; //total mujeres nuevos
  THA3roSuperior=0; //total hombres antiguos
  TMA3roSuperior=0; //total mujeres antiguos
  THN2doSuperior=0; //total hombres nuevos
  TMN2doSuperior=0; //total mujeres nuevos
  THA2doSuperior=0; //total hombres antiguos
  TMA2doSuperior=0; //total mujeres antiguos
  THN1roSuperior=0; //total hombres nuevos
  TMN1roSuperior=0; //total mujeres nuevos
  THA1roSuperior=0; //total hombres antiguos
  TMA1roSuperior=0; //total mujeres antiguos

  
  THN3roIntermedio=0; //total hombres nuevos
  TMN3roIntermedio=0; //total mujeres nuevos
  THA3roIntermedio=0; //total hombres antiguos
  TMA3roIntermedio=0; //total mujeres antiguos
  THN2doIntermedio=0; //total hombres nuevos
  TMN2doIntermedio=0; //total mujeres nuevos
  THA2doIntermedio=0; //total hombres antiguos
  TMA2doIntermedio=0; //total mujeres antiguos
  THN1roIntermedio=0; //total hombres nuevos
  TMN1roIntermedio=0; //total mujeres nuevos
  THA1roIntermedio=0; //total hombres antiguos
  TMA1roIntermedio=0; //total mujeres antiguos

  THN3roBasico=0; //total hombres nuevos
  TMN3roBasico=0; //total mujeres nuevos
  THA3roBasico=0; //total hombres antiguos
  TMA3roBasico=0; //total mujeres antiguos
  THN2doBasico=0; //total hombres nuevos
  TMN2doBasico=0; //total mujeres nuevos
  THA2doBasico=0; //total hombres antiguos
  TMA2doBasico=0; //total mujeres antiguos
  THN1roBasico=0; //total hombres nuevos
  TMN1roBasico=0; //total mujeres nuevos
  THA1roBasico=0; //total hombres antiguos
  TMA1roBasico=0; //total mujeres antiguos

  THN3roIniciacion=0; //total hombres nuevos
  TMN3roIniciacion=0; //total mujeres nuevos
  THA3roIniciacion=0; //total hombres antiguos
  TMA3roIniciacion=0; //total mujeres antiguos
  THN2doIniciacion=0; //total hombres nuevos
  TMN2doIniciacion=0; //total mujeres nuevos
  THA2doIniciacion=0; //total hombres antiguos
  TMA2doIniciacion=0; //total mujeres antiguos
  THN1roIniciacion=0; //total hombres nuevos
  TMN1roIniciacion=0; //total mujeres nuevos
  THA1roIniciacion=0; //total hombres antiguos
  TMA1roIniciacion=0; //total mujeres antiguos

  //PARA LOS TURNOS
  TT1roSuperior=0;
  TM1roSuperior=0;
  TT2doSuperior=0;
  TM2doSuperior=0;
  TT3roSuperior=0;
  TM3roSuperior=0;

  TT1roIntermedio=0;
  TM1roIntermedio=0;
  TT2doIntermedio=0;
  TM2doIntermedio=0;
  TT3roIntermedio=0;
  TM3roIntermedio=0;

  TT1roBasico=0;
  TM1roBasico=0;
  TT2doBasico=0;
  TM2doBasico=0;
  TT3roBasico=0;
  TM3roBasico=0;

  TT1roIniciacion=0;
  TM1roIniciacion=0;
  TT2doIniciacion=0;
  TM2doIniciacion=0;
  TT3roIniciacion=0;
  TM3roIniciacion=0;
  constructor() { }

  ngOnInit(): void {
    let rootVar = window['rutacion'];
    this.ruta = rootVar;
    // var myObject = { a: 'c', b: 'a', c: 'b' };
    // var keyNames = Object.keys(myObject);
    // console.log(keyNames); // Outputs ["a","b","c"]
    this.ConsultarTotalAntiguos();
    this.ConsultarTotalNuevos();
    this.ConsultarTotalPostulantes();
    this.ConsultarCantidadAlumnos();
    this.ConsultarCantidadAlumnosTurno();
  }
  ConsultarCantidadAlumnosTurno(){
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT Curso_Solicitado,Turno, count(id) as Total from estudiantes where Categoria = 'NUEVO' or Categoria = 'ANTIGUO' group by Curso_Solicitado, Turno"
    })
    .then(res => {
      console.log('RESULTADO TOTAL TURNOS',res.data);
      res.data.forEach(element => {
        switch (element.Curso_Solicitado) {
          case 'PRIMERO SUPERIOR':
            if(element.Turno == 'TARDE')
            {
              this.TT1roSuperior = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM1roSuperior = element.Total;
            }
            break;
        
          case 'SEGUNDO SUPERIOR':
            if(element.Turno == 'TARDE')
            {
              this.TT2doSuperior = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM2doSuperior = element.Total;
            }
            break;
          case 'TERCERO SUPERIOR':
            if(element.Turno == 'TARDE')
            {
              this.TT3roSuperior = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM3roSuperior = element.Total;
            }
            break;

          //INTERMEDIO
          case 'PRIMERO INTERMEDIO':
            if(element.Turno == 'TARDE')
            {
              this.TT1roIntermedio = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM1roIntermedio = element.Total;
            }
            break;
        
          case 'SEGUNDO INTERMEDIO':
            if(element.Turno == 'TARDE')
            {
              this.TT2doIntermedio = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM2doIntermedio = element.Total;
            }
            break;
          case 'TERCERO INTERMEDIO':
            if(element.Turno == 'TARDE')
            {
              this.TT3roIntermedio = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM3roIntermedio = element.Total;
            }
            break;
          
          //BASICO
          case 'PRIMERO BASICO':
            if(element.Turno == 'TARDE')
            {
              this.TT1roBasico = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM1roBasico = element.Total;
            }
            break;
        
          case 'SEGUNDO BASICO':
            if(element.Turno == 'TARDE')
            {
              this.TT2doBasico = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM2doBasico = element.Total;
            }
            break;
          case 'TERCERO BASICO':
            if(element.Turno == 'TARDE')
            {
              this.TT3roBasico = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM3roBasico = element.Total;
            }
            break;
          
          //INICIACION
          case 'PRIMERO INICIACION':
            if(element.Turno == 'TARDE')
            {
              this.TT1roIniciacion = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM1roIniciacion = element.Total;
            }
            break;
        
          case 'SEGUNDO INICIACION':
            if(element.Turno == 'TARDE')
            {
              this.TT2doIniciacion = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM2doIniciacion = element.Total;
            }
            break;
          case 'TERCERO INICIACION':
            if(element.Turno == 'TARDE')
            {
              this.TT3roIniciacion = element.Total;
            }else if(element.Turno == 'MAÑANA'){
              this.TM3roIniciacion = element.Total;
            }
            break;
          default:
            break;
        }
      })
    });
  }
  ConsultarCantidadAlumnos() {
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT Curso_Solicitado,Sexo,Categoria, count(id) as Total from estudiantes where Categoria = 'NUEVO' or Categoria = 'ANTIGUO' group by Curso_Solicitado,Sexo, Categoria"
    })
    .then(res => {
      console.log('RESULTADO TOTAL DE TODO',res.data);
      res.data.forEach(element => {
        switch (element.Curso_Solicitado) {
          
            case 'PRIMERO SUPERIOR':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA1roSuperior=element.Total;   
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN1roSuperior=element.Total;    
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA1roSuperior=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN1roSuperior=element.Total;    
              }
              break;
            }  
            

            case 'SEGUNDO SUPERIOR':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA2doSuperior=element.Total;  
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN2doSuperior=element.Total;   
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA2doSuperior=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN2doSuperior=element.Total;   
              }
              break;
            }  
            

            case 'TERCERO SUPERIOR':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA3roSuperior=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.TMN3roSuperior=element.Total;    
              }
              break;
            }
            else if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA3roSuperior=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.THN3roSuperior=element.Total;    
              }
              break;
            }  
            
            //INTERMEDIO
            case 'PRIMERO INTERMEDIO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA1roIntermedio=element.Total;   
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN1roIntermedio=element.Total;    
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA1roIntermedio=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN1roIntermedio=element.Total;    
              }
              break;
            }  
            

            case 'SEGUNDO INTERMEDIO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA2doIntermedio=element.Total;  
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN2doIntermedio=element.Total;   
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA2doIntermedio=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN2doIntermedio=element.Total;   
              }
              break;
            }  
            

            case 'TERCERO INTERMEDIO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA3roIntermedio=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.TMN3roIntermedio=element.Total;    
              }
              break;
            }
            else if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA3roIntermedio=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.THN3roIntermedio=element.Total;    
              }
              break;
            }  


            //BASICO
            case 'PRIMERO BASICO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA1roBasico=element.Total;   
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN1roBasico=element.Total;    
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA1roBasico=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN1roBasico=element.Total;    
              }
              break;
            }  
            

            case 'SEGUNDO BASICO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA2doBasico=element.Total;  
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN2doBasico=element.Total;   
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA2doBasico=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN2doBasico=element.Total;   
              }
              break;
            }  
            

            case 'TERCERO BASICO':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA3roBasico=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.TMN3roBasico=element.Total;    
              }
              break;
            }
            else if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA3roBasico=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.THN3roBasico=element.Total;    
              }
              break;
            }  

            //INICIACION
            case 'PRIMERO INICIACION':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA1roIniciacion=element.Total;   
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN1roIniciacion=element.Total;    
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA1roIniciacion=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN1roIniciacion=element.Total;    
              }
              break;
            }  
            

            case 'SEGUNDO INICIACION':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA2doIniciacion=element.Total;  
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.TMN2doIniciacion=element.Total;   
              }
              break;
            }
            if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA2doIniciacion=element.Total; 
              }
              else if(element.Categoria == 'NUEVO')
              {
                this.THN2doIniciacion=element.Total;   
              }
              break;
            }  
            

            case 'TERCERO INICIACION':
            if (element.Sexo == 'FEMENINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.TMA3roIniciacion=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.TMN3roIniciacion=element.Total;    
              }
              break;
            }
            else if (element.Sexo == 'MASCULINO') {
              if(element.Categoria == 'ANTIGUO')
              {
                this.THA3roIniciacion=element.Total;    
              }
              if(element.Categoria == 'NUEVO')
              {
                this.THN3roIniciacion=element.Total;    
              }
              break;
            }  
          default:
            console.log('NO COINCIDE', element.Curso_Solicitado)
            break;
        }
        
      });
      
      // this.TotalA = res.data[0].TotalAntiguos;
    }).catch(err =>  {
    console.log("err");
    });
  }
  
  ConsultarTotalAntiguos() {
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT count(id) as TotalAntiguos FROM estudiantes WHERE Categoria='ANTIGUO'"
    })
    .then(res => {
      console.log(res.data);
      this.TotalA = res.data[0].TotalAntiguos;
    }).catch(err =>  {
    console.log("err");
    });
  }
  ConsultarTotalNuevos() {
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT count(id) as TotalNuevos FROM estudiantes WHERE Categoria='NUEVO'"
    })
    .then(res => {
      console.log(res.data);
      this.TotalN = res.data[0].TotalNuevos;
    }).catch(err =>  {
    console.log("err");
    });
  }




  ConsultarTotalPostulantes() {
    axios.post(this.ruta+'api/ConsultarApi',{
      consultasql:"SELECT count(id) as TotalPos FROM estudiantes WHERE Categoria='POSTULANTE'"
    })
    .then(res => {
      console.log(res.data);
      this.TotalP = res.data[0].TotalPos;
    }).catch(err =>  {
    console.log("err");
    });
  }
  OpenTabla(Curso_Sol)
  {
    sessionStorage.setItem('Curso_Sol', Curso_Sol);
    window.open('TablaCursosGeneral', '_blank');
    // console.log('NIVELCURSORETIRADO ---',sessionStorage.getItem('SessionNivel'));  
    
  }
  
}

