import { PrerrequisitosComponent } from './Gestiones/prerrequisitos/prerrequisitos.component';
import { PruebasComponent } from './Paginas_publicas/pruebas/pruebas.component';
import { AdquisicionesComponent } from './Gestiones/adquisiciones/adquisiciones.component';
import { AdminDocenteGuard } from './services/admin-docente.guard';
import { MnavComponent } from './Components/mnav/mnav.component';
import { VideosComponent } from './Gestiones/videos/videos.component';
import { TablaDocenteEstComponent } from './Paginas_privadas/tabla-docente-est/tabla-docente-est.component';
import { ParalelosComponent } from './Paginas_publicas/paralelos/paralelos.component';
import { HorariosComponent } from './Paginas_publicas/horarios/horarios.component';
import { TablaCursosGeneralComponent } from './Paginas_publicas/tabla-cursos-general/tabla-cursos-general.component';
import { ListaPostulantesComponent } from './Paginas_publicas/lista-postulantes/lista-postulantes.component';
import { EstadisticasComponent } from './Paginas_privadas/estadisticas/estadisticas.component';
import { ListaNuevosComponent } from './Paginas_publicas/lista-nuevos/lista-nuevos.component';
import { ListaAntiguosComponent } from './Paginas_publicas/lista-antiguos/lista-antiguos.component';
import { SeccionConsultasComponent } from './Paginas_privadas/seccion-consultas/seccion-consultas.component';
import { GuardInscripcionesNuevosGuard } from './services/guard-inscripciones-nuevos.guard';
import { GuardInscripcionesGuard } from './services/guard-inscripciones.guard';
import { GuardAdminService } from './services/guard-admin.service';
import { PdfmakepruebaComponent } from './Paginas_publicas/pdfmakeprueba/pdfmakeprueba.component';
import { CursosComponent } from './Gestiones/cursos/cursos.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent }from './Paginas_publicas/inicio/inicio.component';
import { SuperusuarioComponent }from './Components/superusuario/superusuario.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { EstudiantesComponent } from './Gestiones/estudiantes/estudiantes.component';
import { LoginComponent } from './Paginas_publicas/login/login.component';
import { AdministrativosComponent } from './Gestiones/administrativos/administrativos.component';
import { PublicacionesComponent } from './Gestiones/publicaciones/publicaciones.component';
import { NoticiasComponent } from './Paginas_publicas/noticias/noticias.component';
import { DocumentosComponent } from './Paginas_publicas/documentos/documentos.component';
import { CalificacionesComponent } from './Gestiones/calificaciones/calificaciones.component';
import { PaginainscripcionesComponent } from './Paginas_publicas/paginainscripciones/paginainscripciones.component';
import { VisorPDFComponent } from './Paginas_publicas/visor-pdf/visor-pdf.component';
import { TarjetasPDFComponent } from './Paginas_privadas/tarjetas-pdf/tarjetas-pdf.component';
import { ContactosComponent } from './Normales/contactos/contactos.component';
import { PaginaDetalleInscripcionesComponent } from './Normales/pagina-detalle-inscripciones/pagina-detalle-inscripciones.component';
import { InformacionComponent } from './Normales/informacion/informacion.component';
import { NotFoundComponent } from './Normales/not-found/not-found.component';
import { SidebarEstudiantesComponent } from './Components/sidebar-estudiantes/sidebar-estudiantes.component';
import { PlantelDocenteComponent } from './Paginas_publicas/plantel-docente/plantel-docente.component';
import { PlantelAdministrativoComponent } from './Paginas_publicas/plantel-administrativo/plantel-administrativo.component';
import { HistoriaComponent } from './Normales/historia/historia.component';
import { MisionVisionComponent } from './Normales/mision-vision/mision-vision.component';
import { ObjetivoComponent } from './Normales/objetivo/objetivo.component';
import { PaginaNuevosComponent } from './Paginas_publicas/pagina-nuevos/pagina-nuevos.component';
import { GestionInicioComponent } from './Gestiones/gestion-inicio/gestion-inicio.component';
import { PerfilComponent } from './Paginas_privadas/perfil/perfil.component';
import { InscripcionEventosComponent } from './Paginas_publicas/EVENTOS/inscripcion-eventos/inscripcion-eventos.component';
import { ListaInsEventosComponent } from './Paginas_publicas/EVENTOS/lista-ins-eventos/lista-ins-eventos.component';
import { EventosComponent } from './Gestiones/eventos/eventos.component';


const routes: Routes = [

  // {path: 'superusuario', component: SuperusuarioComponent},
  // {path: 'sidebar', component: SidebarComponent},
  {path: 'cursos', component: CursosComponent,canActivate: [GuardAdminService]},
  {path: 'calificaciones', component: CalificacionesComponent,canActivate: [AdminDocenteGuard]},
  {path: 'estudiantes', component: EstudiantesComponent,canActivate: [GuardAdminService]},
  {path: 'Estadisticas', component: EstadisticasComponent,canActivate: [GuardAdminService]},
  {path: 'login', component: LoginComponent},
  {path: 'administrativos', component: AdministrativosComponent,canActivate: [GuardAdminService]},
  {path: 'publicacion', component: PublicacionesComponent},
  {path: 'noticias', component: NoticiasComponent},
  {path: 'documentos', component: DocumentosComponent,canActivate: [GuardAdminService]},
  {path: 'TablaCursosGeneral', component: TablaCursosGeneralComponent,canActivate: [GuardAdminService]},
  {path: 'DocenteEstudiante', component: TablaDocenteEstComponent,canActivate: [AdminDocenteGuard]},
  {path: 'GestionarInicio', component: GestionInicioComponent,canActivate: [GuardAdminService]},
  {path: 'pdfmakeprueba', component: PdfmakepruebaComponent},
  {path: 'Inscripciones', component: PaginainscripcionesComponent,canActivate: [GuardInscripcionesGuard]},
  {path: 'InscripcionesNuevos', component: PaginaNuevosComponent,canActivate: [GuardInscripcionesNuevosGuard]},
  {path: 'ListaAntiguos', component: ListaAntiguosComponent},
  {path: 'ListaNuevos', component: ListaNuevosComponent},
  {path: 'ListaPostulantes', component: ListaPostulantesComponent},
  {path: 'Horarios', component: HorariosComponent},
  {path: 'Documento', component: VisorPDFComponent},
  {path: 'TarjPDF', component: TarjetasPDFComponent,canActivate: [GuardAdminService]},
  {path: 'Contactos', component: ContactosComponent},
  {path: 'Perfil', component: PerfilComponent},
  {path: 'Detalleinscripciones', component: PaginaDetalleInscripcionesComponent},
  {path: 'Informacion', component: InformacionComponent},
  {path: 'PlantelAdministrativo', component: PlantelAdministrativoComponent},
  {path: 'PlantelDocente', component: PlantelDocenteComponent},
  {path: 'Historia', component: HistoriaComponent},
  {path: 'Mision_Vision', component: MisionVisionComponent},
  {path: 'Objetivo', component: ObjetivoComponent},
  {path: 'NotFound', component: NotFoundComponent},
  {path: 'Paralelos', component: ParalelosComponent},
  {path: 'Consultas', component: SeccionConsultasComponent,canActivate: [GuardAdminService]},
  {path: 'Video', component: VideosComponent,canActivate: [AdminDocenteGuard]},
  {path: 'Adquisiciones', component: AdquisicionesComponent,canActivate: [AdminDocenteGuard]},
  {path: 'Pruebas', component: PruebasComponent,canActivate: [AdminDocenteGuard]},
  {path: 'Prerrequisitos', component:PrerrequisitosComponent,canActivate: [GuardAdminService]},
  // {path: 'Sidebar', component: SidebarEstudiantesComponent}, //SI FUNCIONA PERO MEJOR NO
  {path: 'InscripcionesEventos', component:InscripcionEventosComponent},
  {path: 'ListaInscripcionesEventos', component:ListaInsEventosComponent},
  {path: 'Eventos', component:EventosComponent,canActivate: [GuardAdminService]},
  {path: '**', component: InicioComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



