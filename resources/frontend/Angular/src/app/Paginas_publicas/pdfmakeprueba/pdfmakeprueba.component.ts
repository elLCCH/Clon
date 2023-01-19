import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Utils } from 'src/app/utils';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-pdfmakeprueba',
  templateUrl: './pdfmakeprueba.component.html',
  styleUrls: ['./pdfmakeprueba.component.css']
})
export class PdfmakepruebaComponent implements OnInit {
  @Inject(DOCUMENT) document
  someSvg = '<svg width="300" height="200" viewBox="0 0 300 200">' +
    '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
    '</svg>';

  public var = 2

  xd : HTMLElement;
  public classEval = {
    
    
    "style-1": this.var = 10,
    "style-2": this.var < 10
  }
  data: SafeHtml;
  logoDataUrl: string;
  

  constructor(private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
   
    this.data = this.sanitizer.bypassSecurityTrustHtml(this.someSvg);

    Utils.getImageDataUrlFromLocalPath1('assets/0.png').then(
      result => this.logoDataUrl = result
    )
    //Utils.getImageDataUrlFromLocalPath('assets/0.png').subscribe(
    //  result => this.logoDataUrl = result
    //)

  }

  ngOnChanges(){

  }
  openCalificaciones()
  {
    const documentDefinition = {
      pageSize: 'LETTER',
      pageMargins: [ 40, 60, 40, 60 ],
      defaultStyle : {
        fontSize  : 8,
        columnGap : 20
      },
      content:[
        {text:'INSTITUTO DE FORMACIÓN ARTISTICA', fontSize:15, alignment: 'center', bold:true},
        {text:'" MARÍA LUISA LUZIO \n"', fontSize:15, alignment: 'center', bold:true},
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'DOCENTE:'
            },
            {
              width: '*',
              text: 'CHINO CHOQUE AMILCAR'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'MATERIA:'
            },
            {
              width: '*',
              text: 'LENGUAJES MUSICALES SUPERIOR'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'GRADO:'
            },
            {
              width: '*',
              text: 'PRIMERO SUPERIOR - B'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'GESTION:'
            },
            {
              width: '*',
              text: '2021'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'CARRERA:'
            },
            {
              width: '*',
              text: 'MÚSICA'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'AREA:'
            },
            {
              width: '*',
              text: 'ARTISTICA'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          columns: [
            {
              width: 90,
              text: ''
            },
            {
              width: 90,
              text: 'SIGLA:'
            },
            {
              width: '*',
              text: 'LMS - 105'
            },
            {
              width: 90,
              text: ''
            }
          ]
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: [
              
              [
                {text:'Nº', alignment: 'center', bold:true},
              ],
              [
                {text:'NOMINA', alignment: 'center', bold:true},
              ],
              [
                {text:'Promedio Evaluacion Teorica', alignment: 'center', bold:true},
              ],
              [
                {text:'Promedio Evaluacion Práctica', alignment: 'center', bold:true},
              ],
              [
                {text:'Calificación Final', alignment: 'center', bold:true},
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombre de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'CHOQUE FLORES MARIA', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Nº Celular de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                    {text: '12345678', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Domicilio\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'AVENIDA ILLINIOS ESQUINO SUD Nº6', fontSize: 14}], colSpan: 2 
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Correo Electronico\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'AVENIDA ILLINIOS ESQUINO SUD Nº6', fontSize: 14}], colSpan: 2 
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Turno\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'MAÑANA', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Instrumento de Especialidad\n', fontSize:15, alignment: 'left', bold:true},
                    {text: 'PIANO', fontSize: 14,alignment: 'right'}]
                }
              ],
              
            ]
            
          }
        },
        
      ]
    }
    pdfMake.createPdf(documentDefinition).open();
  }
  openFormIns()
  {
    const documentDefinition = {
      //TAMAÑO DE LA HOJA(CARTA)
      pageSize: 'LETTER',

      //ORIENTACION DE LA HOJA
      // pageOrientation: 'landscape',
    
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 40, 60, 40, 60 ],
      // lineHeight:5,
      content:[
        'Texto libre',

        {text:'FORMULARIO DE INSCRIPCIÓN ESTUDIANTES', fontSize:15, alignment: 'center', bold:true},
        {text:'I.F.A. "MARIA LUISA LUZIO" \n\n', fontSize:15, alignment: 'center', bold:true},
        // {
        //   columns: [
        //     {
        //       width: 'auto',
        //       text: 'First column'
        //     },
        //   ]
        // },
        {
          // table: {
          //   // headers are automatically repeated if the table spans over multiple pages
          //   // you can declare how many rows should be treated as headers
          //   headerRows: 1,
          //   widths: ['*', '*'],

          //   body: [
          //     [{ text: 'Apellido Paterno \b asdasd', bold: true } , { text: 'Apellido Materno', bold: true }],
          //     [{columns: [
          //           {
          //             width: 'auto',
          //             text: 'Apellido Paterno'
          //           },
          //           {
          //             width: 'auto',
          //             text: 'CHOQUE'
          //           },
          //         ]}, 'Value 2'],
          //     [{ text: 'Bold value', bold: true }, 'Val 2']
          //   ]
          // }
          table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: [
              
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Apellido Paterno\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'CHOQUE', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Apellido Materno\n', fontSize:15, alignment: 'left', bold:true},
                    {text: 'CHOQUE', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombres\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'LUIS', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Sexo\n', fontSize:15, alignment: 'left', bold:true},
                    {text: 'MASCULINO', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Numero de celular del Estudiante\n', fontSize:15, alignment: 'left', bold:true},
                  {text: '75142268', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Fecha de Nacimiento\n', fontSize:15, alignment: 'left', bold:true},
                    {text: '17/07/1998', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Numero de Carnet\n', fontSize:15, alignment: 'left', bold:true},
                  {text: '7362600', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Edad\n', fontSize:15, alignment: 'left', bold:true},
                    {text: '14 Años', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombre del Padre\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'CHOQUE GUTIERREZ PEDRO', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Nº Celular del Padre\n', fontSize:15, alignment: 'left', bold:true},
                    {text: '12345678', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Nombre de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'CHOQUE FLORES MARIA', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Nº Celular de la Madre\n', fontSize:15, alignment: 'left', bold:true},
                    {text: '12345678', fontSize: 14,alignment: 'right'}]
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Domicilio\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'AVENIDA ILLINIOS ESQUINO SUD Nº6', fontSize: 14}], colSpan: 2 
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Correo Electronico\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'AVENIDA ILLINIOS ESQUINO SUD Nº6', fontSize: 14}], colSpan: 2 
                }
              ],
              [
                {text: [
                  // 'Inlines can be ',
                  {text:'Turno\n', fontSize:15, alignment: 'left', bold:true},
                  {text: 'MAÑANA', fontSize: 14,alignment: 'right'}]
                },
                
                {text: [
                    // 'Inlines can be ',
                    {text:'Instrumento de Especialidad\n', fontSize:15, alignment: 'left', bold:true},
                    {text: 'PIANO', fontSize: 14,alignment: 'right'}]
                }
              ],
              
            ]
            
          }
          
        },
        {text:' ',fontSize:15, alignment: 'left', bold:true},
        {text:'Solo para estudiantes antiguos', lineHeight:1.2,fontSize:15, alignment: 'left', bold:true},
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Curso:'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'PRIMERO SUPERIOR'
            }
          ],
          
          // optional space between columnsç
          lineHeight:1.2,
          columnGap: 110
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Nombre del Docente:'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'AMPARO CUBA MURILLO'
            }
          ],
          
          // optional space between columns
          lineHeight:1.2,
          columnGap: 30
        },
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'Instrumento::'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'PIANO'
            }
          ],
          
          // optional space between columns
          lineHeight:1.2,
          columnGap: 75
        },
        {text:'\n\n\n\n\n\n\n_______________________', fontSize:15, alignment: 'center', bold:true},
        {text:'Firma del Estudiante o Padre/Tutor',fontSize:10, alignment: 'center', bold:true},
        {text:'Nºcarnet: 7362600',fontSize:8, alignment: 'center', bold:true}
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
    
  }
  openCuadroAlumnos(){
    const documentDefinition = {
      //TAMAÑO DE LA HOJA(CARTA)
      pageSize: 'LETTER',

      //ORIENTACION DE LA HOJA
      pageOrientation: 'landscape',

      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      // pageMargins: [ 40, 60, 40, 60 ],
      defaultStyle : {
        fontSize  : 10,
        columnGap : 20
      },

      content:[
        // 'Texto libre',
        
        {text:'INSTITUTO DE FORMACIÓN ARTÍSTICA "MARIA LUISA LUZIO"', fontSize:10, alignment: 'center', bold:true},
        {text:'R.M. Nº 718/2016 - R.M. Nº 0695/2019', fontSize:10, alignment: 'center', bold:true},
        {text:'CARRERA: MÚSICA', fontSize:10, alignment: 'center', bold:true},
        {text:'ÁREA: ARTÍSTICA\n\n\n\n', fontSize:10, alignment: 'center', bold:true},
        {text:'CUADRO DE INSCRIPCIONES DE ALUMNOS NUEVOS Y ANTIGUOS', fontSize:18, alignment: 'center', bold:true},
        {text:'GESTION: 2021', fontSize:15, alignment: 'center', bold:true},
        {
          style: 'tableExample',

          table: {
            headerRows: 1,
            body: [
              [
                {text: 'Nº', style: 'tableHeader'}, 
                {text: 'APELLIDOS Y NOMBRES', style: 'tableHeader'}, 
                {text: 'CÉDULA DE IDENTIDAD', style: 'tableHeader'},
                {text: 'FECHA DE NACIMIENTO', style: 'tableHeader'}, 
                {text: 'SEXO', style: 'tableHeader'}, 
                {text: 'DIRECCIÓN ACTUAL', style: 'tableHeader'}, 
                {text: 'CARRERA', style: 'tableHeader'}, 
                {text: 'NIVEL', style: 'tableHeader'}, 
                {text: 'TURNO', style: 'tableHeader'}, 
                {text: 'MATRÍCULA', style: 'tableHeader'}, 
                {text: 'CATEGORIA', style: 'tableHeader'}, 
                {text: 'FECHA DE INSCRIPCION', style: 'tableHeader'} 
              ],
              [
                '1',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '2',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '3',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '4',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '5',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '6',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ],
              [
                '7',
                'OCAÑA FLORES WILDE EDGAR',
                '4060916 -OR',
                '31/7/1982',
                'MASCULINO',
                'GENOVEBA RIOS Nº 11 Y CALATAYUD',
                'MÚSICA',
                'TÉCNICO SUPERIOR',
                'NOCHE',
                '001 - 0782OFW',
                'NUEVO',
                '23/1/2021'
              ]
            ]
          },
          //PARA EL BORDE EXTERIOR
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
        },
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }
  openFreeStyle(){
    const documentDefinition = {
      content:[
        'Texto libre',

        {text:'Texto personalizado', fontSize:30, alignment: 'right', bold:true},
        {text:'Texto personalizado', fontSize:30, alignment: 'right', bold:true},
        
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }




  openPdfStyle() {
    const documentDefinition = {
      content: [
        // if you don't need styles, you can use a simple string to define a paragraph
        'This is a standard paragraph, using default style',

        // using a { text: '...' } object lets you set styling properties
        { text: 'This paragraph will have a bigger font', fontSize: 15 },

        // if you set pass an array instead of a string, you'll be able
        // to style any fragment individually
        {
          text: [
            'This paragraph is defined as an array of elements to make it possible to ',
            { text: 'restyle part of it and make it bigger ', fontSize: 40 },
            'than the rest.'
          ]
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfStyleDict() {
    const documentDefinition = {
      content: [
        { text: 'This is a header', style: 'header' },
        'No styling here, this is a standard paragraph',
        { text: 'Another text', style: 'anotherStyle' },
        { text: 'Multiple styles applied', style: ['header', 'anotherStyle'] }
      ],

      styles: {
        header: {
          fontSize: 10,
          bold: true
        },
        anotherStyle: {
          fontSize: 100,
          italic: true,
          alignment: 'right'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfColumns() {
    const documentDefinition = {
      content: [
        'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
        {
          columns: [
            {
              // auto-sized columns have their widths based on their content
              width: 'auto',
              text: 'First column'
            },
            {
              // star-sized columns fill the remaining space
              // if there's more than one star-column, available width is divided equally
              width: '*',
              text: 'Second column'
            },
            {
              // fixed width
              width: 100,
              text: 'Third column'
            },
            {
              // percentage width
              width: '10%',
              text: 'Last column'
            }
          ],
          // optional space between columns
          columnGap: 10
        },
        'This paragraph goes below all columns and has full width'
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfTables() {
    const documentDefinition = {
      content: [
        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],

            body: [
              ['First', 'Second', 'Third', 'The last one'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4']
            ]
          }
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfLists() {
    const documentDefinition = {
      content: [
        'Bulleted list example:',
        {
          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          ul: [
            'Item 1',
            'Item 2',
            'Item 3',
            { text: 'Item 4', bold: true },
          ]
        },

        'Numbered list example:',
        {
          // for numbered lists set the ol key
          ol: [
            'Item 1',
            'Item 2',
            'Item 3'
          ]
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfHeadersAndFootersStatic() {
    const documentDefinition = {
      header: 'simple text',

      footer: {
        columns: [
          'Left part',
          { text: 'Right part', alignment: 'right' }
        ]
      },
      content: 'This is an sample PDF printed with pdfMake'
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfHeadersAndFootersDynamic() {
    const documentDefinition = {
      footer: function (currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      header: function (currentPage, pageCount) {
        // you can apply any logic and return any valid pdfmake element

        return { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' };
      },
      content: 'This is an sample PDF printed with pdfMake'
    };

    pdfMake.createPdf(documentDefinition).open();

  }

  openPdfBackgroundLayer() {
    // The background-layer will be added on every page.
    var documentDefinition = {
      // background: 'simple text',
      background: function (currentPage) {
        return 'simple text on page ' + currentPage
      },
      content: 'This is an sample PDF printed with pdfMake'
    };
    pdfMake.createPdf(documentDefinition).open();

  }

  openPdfMargins() {
    const documentDefinition = {
      content: [
        'This is a standard paragraph, using default style',

        // margin: [left, top, right, bottom]
        { text: 'sample', margin: [5, 2, 10, 20] },

        // margin: [horizontal, vertical]
        { text: 'another text', margin: [5, 2] },

        // margin: equalLeftTopRightBottom
        { text: 'last one', margin: 5 }

      ]
    };
    pdfMake.createPdf(documentDefinition).open();

  }


  openPdfStackOfParagrahps() {
    var documentDefinition = {
      content: [
        'paragraph 1',
        'paragraph 2',
        {
          columns: [
            'first column is a simple text',
            {
              stack: [
                // second column consists of paragraphs
                'paragraph A',
                'paragraph B',
                'these paragraphs will be rendered one below another inside the column'
              ],
              fontSize: 15
            }
          ]
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfImages() {
    // JPEG and PNG formats are supported.
    var documentDefinition = {
      content: [
        {
          // you'll most often use dataURI images on the browser side
          // if no width/height/fit is provided, the original size will be used
          image: this.logoDataUrl
        },

        //{
        // under NodeJS (or in case you use virtual file system provided by pdfmake)
        // you can also pass file names here
        //  image: 'myImageDictionary/image1.jpg'
        //}
      ],

      images: {
        mySuperImage: 'data:image/jpeg;base64,...content...'
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }

  openPdfSVGs() {
    var documentDefinition = {
      content: [
        {
          // If no width/height/fit is used, then dimensions from the svg element is used.
          svg: '<svg width="300" height="200" viewBox="0 0 300 200">' +
            '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />' +
            '</svg>'
        },
        {
          // if you specify width, svg will scale proportionally
          svg: '<svg width="300" height="200" viewBox="0 0 300 200">' +
            '  <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />' +
            '</svg>',
          width: 150
        },
        {
          // if you specify both width and height - svg will be stretched
          svg: '<svg width="300" height="200" viewBox="0 0 300 200">' +
            '  <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />' +
            '</svg>',
          width: 60,
          height: 40
        },
        {
          // you can also fit the svg inside a rectangle
          svg: '<svg																																																								' +
            '   xmlns:dc="http://purl.org/dc/elements/1.1/"                                                                                                                                                                                    ' +
            '   xmlns:cc="http://creativecommons.org/ns#"                                                                                                                                                                                      ' +
            '   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"                                                                                                                                                                        ' +
            '   xmlns:svg="http://www.w3.org/2000/svg"                                                                                                                                                                                         ' +
            '   xmlns="http://www.w3.org/2000/svg"                                                                                                                                                                                             ' +
            '   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"                                                                                                                                                            ' +
            '   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"                                                                                                                                                                   ' +
            '   width="210mm"                                                                                                                                                                                                                  ' +
            '   height="297mm"                                                                                                                                                                                                                 ' +
            '   viewBox="0 0 210 297"                                                                                                                                                                                                          ' +
            '   version="1.1"                                                                                                                                                                                                                  ' +
            '   id="svg670"                                                                                                                                                                                                                    ' +
            '   inkscape:version="0.92.4 (5da689c313, 2019-01-14)"                                                                                                                                                                             ' +
            '   sodipodi:docname="Configuracion 1.svg">                                                                                                                                                                                        ' +
            '  <defs                                                                                                                                                                                                                           ' +
            '     id="defs664" />                                                                                                                                                                                                              ' +
            '  <sodipodi:namedview                                                                                                                                                                                                             ' +
            '     id="base"                                                                                                                                                                                                                    ' +
            '     pagecolor="#ffffff"                                                                                                                                                                                                          ' +
            '     bordercolor="#666666"                                                                                                                                                                                                        ' +
            '     borderopacity="1.0"                                                                                                                                                                                                          ' +
            '     inkscape:pageopacity="0.0"                                                                                                                                                                                                   ' +
            '     inkscape:pageshadow="2"                                                                                                                                                                                                      ' +
            '     inkscape:zoom="0.98994949"                                                                                                                                                                                                   ' +
            '     inkscape:cx="600.27706"                                                                                                                                                                                                      ' +
            '     inkscape:cy="510.19682"                                                                                                                                                                                                      ' +
            '     inkscape:document-units="mm"                                                                                                                                                                                                 ' +
            '     inkscape:current-layer="layer1"                                                                                                                                                                                              ' +
            '     showgrid="false"                                                                                                                                                                                                             ' +
            '     inkscape:window-width="1920"                                                                                                                                                                                                 ' +
            '     inkscape:window-height="1017"                                                                                                                                                                                                ' +
            '     inkscape:window-x="-8"                                                                                                                                                                                                       ' +
            '     inkscape:window-y="-8"                                                                                                                                                                                                       ' +
            '     inkscape:window-maximized="1" />                                                                                                                                                                                             ' +
            '  <metadata                                                                                                                                                                                                                       ' +
            '     id="metadata667">                                                                                                                                                                                                            ' +
            '    <rdf:RDF>                                                                                                                                                                                                                     ' +
            '      <cc:Work                                                                                                                                                                                                                    ' +
            '         rdf:about="">                                                                                                                                                                                                            ' +
            '        <dc:format>image/svg+xml</dc:format>                                                                                                                                                                                      ' +
            '        <dc:type                                                                                                                                                                                                                  ' +
            '           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />                                                                                                                                                               ' +
            '        <dc:title />                                                                                                                                                                                                              ' +
            '      </cc:Work>                                                                                                                                                                                                                  ' +
            '    </rdf:RDF>                                                                                                                                                                                                                    ' +
            '  </metadata>                                                                                                                                                                                                                     ' +
            '  <g                                                                                                                                                                                                                              ' +
            '     inkscape:label="Capa 1"                                                                                                                                                                                                      ' +
            '     inkscape:groupmode="layer"                                                                                                                                                                                                   ' +
            '     id="layer1">                                                                                                                                                                                                                 ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="68.262619"                                                                                                                                                                                                              ' +
            '       y="248.11998"                                                                                                                                                                                                              ' +
            '       id="text363"><tspan                                                                                                                                                                                                        ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan361"                                                                                                                                                                                                            ' +
            '         x="68.262619"                                                                                                                                                                                                            ' +
            '         y="248.11998"                                                                                                                                                                                                            ' +
            '         style="stroke-width:0.26458332">Configuración 1</tspan></text>                                                                                                                                                           ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect338"                                                                                                                                                                                                               ' +
            '       width="0.26726952"                                                                                                                                                                                                         ' +
            '       height="3.4745038"                                                                                                                                                                                                         ' +
            '       x="46.122608"                                                                                                                                                                                                              ' +
            '       y="55.930874"                                                                                                                                                                                                              ' +
            '       ry="0.13363476"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect355"                                                                                                                                                                                                               ' +
            '       width="73.23185"                                                                                                                                                                                                           ' +
            '       height="4.543582"                                                                                                                                                                                                          ' +
            '       x="57.080658"                                                                                                                                                                                                              ' +
            '       y="50.318211"                                                                                                                                                                                                              ' +
            '       ry="0.13363469"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="170.2981"                                                                                                                                                                                                               ' +
            '       y="56.684345"                                                                                                                                                                                                              ' +
            '       id="text359"><tspan                                                                                                                                                                                                        ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan357"                                                                                                                                                                                                            ' +
            '         x="170.2981"                                                                                                                                                                                                             ' +
            '         y="56.684345"                                                                                                                                                                                                            ' +
            '         style="stroke-width:0.26458332">Eje 1</tspan></text>                                                                                                                                                                     ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5"                                                                                                                                                                                                         ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="34.983921"                                                                                                                                                                                                              ' +
            '       y="35.047993"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="44.412098"                                                                                                                                                                                                              ' +
            '       y="55.449795"                                                                                                                                                                                                              ' +
            '       id="text2203"><tspan                                                                                                                                                                                                       ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201"                                                                                                                                                                                                           ' +
            '         x="44.412098"                                                                                                                                                                                                            ' +
            '         y="55.449795"                                                                                                                                                                                                            ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">1</tspan></text>                                                                                                                                                            ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5-1"                                                                                                                                                                                                       ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="124.04748"                                                                                                                                                                                                              ' +
            '       y="33.362591"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="133.46629"                                                                                                                                                                                                              ' +
            '       y="53.32761"                                                                                                                                                                                                               ' +
            '       id="text2203-1"><tspan                                                                                                                                                                                                     ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201-5"                                                                                                                                                                                                         ' +
            '         x="133.46629"                                                                                                                                                                                                            ' +
            '         y="53.32761"                                                                                                                                                                                                             ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">2</tspan></text>                                                                                                                                                            ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect338-3"                                                                                                                                                                                                             ' +
            '       width="0.26726952"                                                                                                                                                                                                         ' +
            '       height="3.4745038"                                                                                                                                                                                                         ' +
            '       x="46.122612"                                                                                                                                                                                                              ' +
            '       y="114.4629"                                                                                                                                                                                                               ' +
            '       ry="0.13363476"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect355-1"                                                                                                                                                                                                             ' +
            '       width="73.23185"                                                                                                                                                                                                           ' +
            '       height="4.543582"                                                                                                                                                                                                          ' +
            '       x="57.080666"                                                                                                                                                                                                              ' +
            '       y="108.85025"                                                                                                                                                                                                              ' +
            '       ry="0.13363469"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="170.29808"                                                                                                                                                                                                              ' +
            '       y="115.21637"                                                                                                                                                                                                              ' +
            '       id="text359-8"><tspan                                                                                                                                                                                                      ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan357-8"                                                                                                                                                                                                          ' +
            '         x="170.29808"                                                                                                                                                                                                            ' +
            '         y="115.21637"                                                                                                                                                                                                            ' +
            '         style="stroke-width:0.26458332">Eje 2</tspan></text>                                                                                                                                                                     ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5-7"                                                                                                                                                                                                       ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="34.696865"                                                                                                                                                                                                              ' +
            '       y="93.579323"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="44.412102"                                                                                                                                                                                                              ' +
            '       y="113.98182"                                                                                                                                                                                                              ' +
            '       id="text2203-9"><tspan                                                                                                                                                                                                     ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201-8"                                                                                                                                                                                                         ' +
            '         x="44.412102"                                                                                                                                                                                                            ' +
            '         y="113.98182"                                                                                                                                                                                                            ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">3</tspan></text>                                                                                                                                                            ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5-1-1"                                                                                                                                                                                                     ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="123.76041"                                                                                                                                                                                                              ' +
            '       y="91.893921"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="133.46629"                                                                                                                                                                                                              ' +
            '       y="111.85963"                                                                                                                                                                                                              ' +
            '       id="text2203-1-1"><tspan                                                                                                                                                                                                   ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201-5-0"                                                                                                                                                                                                       ' +
            '         x="133.46629"                                                                                                                                                                                                            ' +
            '         y="111.85963"                                                                                                                                                                                                            ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">4</tspan></text>                                                                                                                                                            ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect338-6"                                                                                                                                                                                                             ' +
            '       width="0.26726952"                                                                                                                                                                                                         ' +
            '       height="3.4745038"                                                                                                                                                                                                         ' +
            '       x="45.855339"                                                                                                                                                                                                              ' +
            '       y="172.19312"                                                                                                                                                                                                              ' +
            '       ry="0.13363476"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect355-0"                                                                                                                                                                                                             ' +
            '       width="73.23185"                                                                                                                                                                                                           ' +
            '       height="4.543582"                                                                                                                                                                                                          ' +
            '       x="56.813385"                                                                                                                                                                                                              ' +
            '       y="166.58044"                                                                                                                                                                                                              ' +
            '       ry="0.13363469"                                                                                                                                                                                                            ' +
            '       style="stroke-width:0.26458332" />                                                                                                                                                                                         ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="170.03084"                                                                                                                                                                                                              ' +
            '       y="172.94659"                                                                                                                                                                                                              ' +
            '       id="text359-4"><tspan                                                                                                                                                                                                      ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan357-1"                                                                                                                                                                                                          ' +
            '         x="170.03084"                                                                                                                                                                                                            ' +
            '         y="172.94659"                                                                                                                                                                                                            ' +
            '         style="stroke-width:0.26458332">Eje 3</tspan></text>                                                                                                                                                                     ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5-4"                                                                                                                                                                                                       ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="34.146465"                                                                                                                                                                                                              ' +
            '       y="151.30753"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="44.144829"                                                                                                                                                                                                              ' +
            '       y="171.71204"                                                                                                                                                                                                              ' +
            '       id="text2203-5"><tspan                                                                                                                                                                                                     ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201-2"                                                                                                                                                                                                         ' +
            '         x="44.144829"                                                                                                                                                                                                            ' +
            '         y="171.71204"                                                                                                                                                                                                            ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">5</tspan></text>                                                                                                                                                            ' +
            '    <rect                                                                                                                                                                                                                         ' +
            '       id="rect336-6-2-5-1-4"                                                                                                                                                                                                     ' +
            '       width="23.576702"                                                                                                                                                                                                          ' +
            '       height="35.779388"                                                                                                                                                                                                         ' +
            '       x="123.21003"                                                                                                                                                                                                              ' +
            '       y="149.62213"                                                                                                                                                                                                              ' +
            '       style="stroke-width:0.33957967"                                                                                                                                                                                            ' +
            '       ry="8.1385536"                                                                                                                                                                                                             ' +
            '       transform="rotate(-0.28099868)"                                                                                                                                                                                            ' +
            '       rx="3.7425721" />                                                                                                                                                                                                          ' +
            '    <text                                                                                                                                                                                                                         ' +
            '       xml:space="preserve"                                                                                                                                                                                                       ' +
            '       style="font-style:normal;font-weight:normal;font-size:10.58333302px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.26458332"           ' +
            '       x="133.19904"                                                                                                                                                                                                              ' +
            '       y="169.58984"                                                                                                                                                                                                              ' +
            '       id="text2203-1-7"><tspan                                                                                                                                                                                                   ' +
            '         sodipodi:role="line"                                                                                                                                                                                                     ' +
            '         id="tspan2201-5-1"                                                                                                                                                                                                       ' +
            '         x="133.19904"                                                                                                                                                                                                            ' +
            '         y="169.58984"                                                                                                                                                                                                            ' +
            '         style="fill:#ffffff;stroke-width:0.26458332">6</tspan></text>                                                                                                                                                            ' +
            '  </g>                                                                                                                                                                                                                            ' +
            '</svg>                                                                                                                                                                                                                            ',
          fit: [60, 40]
        }
      ]
    };
    pdfMake.createPdf(documentDefinition).open();

  }

}
