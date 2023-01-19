import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { SuperusuarioComponent } from './Components/superusuario/superusuario.component';
import { InicioComponent } from './Paginas_publicas/inicio/inicio.component';
import { MnavComponent } from './Components/mnav/mnav.component';
import { FooterComponent } from './Components/footer/footer.component';
import { CursosComponent } from './Gestiones/cursos/cursos.component';
import { EstudiantesComponent } from './Gestiones/estudiantes/estudiantes.component';
import { LoginComponent } from './Paginas_publicas/login/login.component';
import { AdministrativosComponent } from './Gestiones/administrativos/administrativos.component';
import { PublicacionesComponent } from './Gestiones/publicaciones/publicaciones.component';
import { DocumentosComponent } from './Paginas_publicas/documentos/documentos.component';
import { NoticiasComponent } from './Paginas_publicas/noticias/noticias.component';
import { CalificacionesComponent } from './Gestiones/calificaciones/calificaciones.component';
import { PdfmakepruebaComponent } from './Paginas_publicas/pdfmakeprueba/pdfmakeprueba.component';
import { PaginainscripcionesComponent } from './Paginas_publicas/paginainscripciones/paginainscripciones.component';
// import  {  PdfViewerModule  }  from  'ng2-pdf-viewer';
import { VisorPDFComponent } from './Paginas_publicas/visor-pdf/visor-pdf.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { TarjetasPDFComponent } from './Paginas_privadas/tarjetas-pdf/tarjetas-pdf.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe } from './pipes/filter.pipe';
import { PaginaDetalleInscripcionesComponent } from './Normales/pagina-detalle-inscripciones/pagina-detalle-inscripciones.component';
import { ContactosComponent } from './Normales/contactos/contactos.component';
import { InformacionComponent } from './Normales/informacion/informacion.component';
import { NotFoundComponent } from './Normales/not-found/not-found.component';
import { SidebarEstudiantesComponent } from './Components/sidebar-estudiantes/sidebar-estudiantes.component';
import { PlantelDocenteComponent } from './Paginas_publicas/plantel-docente/plantel-docente.component';
import { PlantelAdministrativoComponent } from './Paginas_publicas/plantel-administrativo/plantel-administrativo.component';
import { MisionVisionComponent } from './Normales/mision-vision/mision-vision.component';
import { ObjetivoComponent } from './Normales/objetivo/objetivo.component';
import { HistoriaComponent } from './Normales/historia/historia.component';
import { PaginaNuevosComponent } from './Paginas_publicas/pagina-nuevos/pagina-nuevos.component';
import { GestionInicioComponent } from './Gestiones/gestion-inicio/gestion-inicio.component';
import { FilterEstudiantesPipe } from './pipes/filter-estudiantes.pipe';
import { PerfilComponent } from './Paginas_privadas/perfil/perfil.component';
import { SeccionConsultasComponent } from './Paginas_privadas/seccion-consultas/seccion-consultas.component';
import { ListaAntiguosComponent } from './Paginas_publicas/lista-antiguos/lista-antiguos.component';
import { ListaNuevosComponent } from './Paginas_publicas/lista-nuevos/lista-nuevos.component';
import { FilterEstCiPipe } from './pipes/filter-est-ci.pipe';
import { EstadisticasComponent } from './Paginas_privadas/estadisticas/estadisticas.component';
import { ListaPostulantesComponent } from './Paginas_publicas/lista-postulantes/lista-postulantes.component';
import { TablaCursosGeneralComponent } from './Paginas_publicas/tabla-cursos-general/tabla-cursos-general.component';
import { FilterlistacursosPipe } from './pipes/filterlistacursos.pipe';
import { HorariosComponent } from './Paginas_publicas/horarios/horarios.component';
import { ParalelosComponent } from './Paginas_publicas/paralelos/paralelos.component';
import { TablaDocenteEstComponent } from './Paginas_privadas/tabla-docente-est/tabla-docente-est.component';
import { VideosComponent } from './Gestiones/videos/videos.component';
import { FilterCursosPipe } from './pipes/filter-cursos.pipe';
import { AdquisicionesComponent } from './Gestiones/adquisiciones/adquisiciones.component';
import { PruebasComponent } from './Paginas_publicas/pruebas/pruebas.component';
import { FilterPracticasPipe } from './pipes/perfil/filter-practicas.pipe';
import { FilterTeoricasPipe } from './pipes/perfil/filter-teoricas.pipe';
import { FilterVideosPipe } from './pipes/perfil/filter-videos.pipe';
import { PrerrequisitosComponent } from './Gestiones/prerrequisitos/prerrequisitos.component';
import { InscripcionEventosComponent } from './Paginas_publicas/EVENTOS/inscripcion-eventos/inscripcion-eventos.component';
import { EventosComponent } from './Gestiones/eventos/eventos.component';
import { ListaInsEventosComponent } from './Paginas_publicas/EVENTOS/lista-ins-eventos/lista-ins-eventos.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    SuperusuarioComponent,
    InicioComponent,
    MnavComponent,
    FooterComponent,
    CursosComponent,
    EstudiantesComponent,
    LoginComponent,
    AdministrativosComponent,
    PublicacionesComponent,
    DocumentosComponent,
    NoticiasComponent,
    CalificacionesComponent,
    PdfmakepruebaComponent,
    PaginainscripcionesComponent,
    VisorPDFComponent,
    TarjetasPDFComponent,
    FilterPipe,
    PaginaDetalleInscripcionesComponent,
    ContactosComponent,
    InformacionComponent,
    NotFoundComponent,
    SidebarEstudiantesComponent,
    PlantelDocenteComponent,
    PlantelAdministrativoComponent,
    MisionVisionComponent,
    ObjetivoComponent,
    HistoriaComponent,
    PaginaNuevosComponent,
    GestionInicioComponent,
    FilterEstudiantesPipe,
    PerfilComponent,
    SeccionConsultasComponent,
    ListaAntiguosComponent,
    ListaNuevosComponent,
    FilterEstCiPipe,
    EstadisticasComponent,
    ListaPostulantesComponent,
    TablaCursosGeneralComponent,
    FilterlistacursosPipe,
    HorariosComponent,
    ParalelosComponent,
    TablaDocenteEstComponent,
    VideosComponent,
    FilterCursosPipe,
    AdquisicionesComponent,
    PruebasComponent,
    FilterPracticasPipe,
    FilterTeoricasPipe,
    FilterVideosPipe,
    PrerrequisitosComponent,
    InscripcionEventosComponent,
    EventosComponent,
    ListaInsEventosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxPaginationModule
    // YoutubePlayerModule
    // PdfViewerModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
