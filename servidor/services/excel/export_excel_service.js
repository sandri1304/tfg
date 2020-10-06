var xl = require('excel4node');
var ExcelSrv = {};

//npm install excel4node
//https://www.npmjs.com/package/excel4node

const headerStyle = {
    alignment: {
        horizontal: 'center',
        vertical: 'center'
    },
    font: {
        bold: true,
        color: '#000000',
        size: 12,
    },
    fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: '#cccccc'
    }
}
const cellStyle = {
    alignment: {
        horizontal: 'left'
    },
    font: {
        color: '#000000',
        size: 12,
    }
}

ExcelSrv.exportTable = function (nombreHoja, metadata, data) {

    var wb = new xl.Workbook();
    var ws = wb.addWorksheet(nombreHoja);

    var hs = wb.createStyle(headerStyle);
    var cs = wb.createStyle(cellStyle);

    var row = 1;
    var col = 1;

    for (let i = 0; i < metadata.length; i++ , col++) {
        ws.cell(row, col)
            .string(metadata[i].header)
            .style(hs);
        ws.column(col).setWidth(30);
    }
    row++;
    col = 1;

    if (data && data.items) {
        for (let i = 0; i < data.items.length; i++ , row++) {
            for (let j = 0; j < metadata.length; j++ , col++) {
                switch (metadata[j].type) {
                    case 'number':
                        ws.cell(row, col)
                            .number(data.items[i][metadata[j].field])
                            .style(cs);
                        break;
                    case 'date':
                        ws.cell(row, col)
                            .date(data.items[i][metadata[j].field])
                            .style(cs)
                            .style({ numberFormat: 'yyyy-mm-dd' });
                        break;
                    default:
                        ws.cell(row, col)
                            .string(String(data.items[i][metadata[j].field]))
                            .style(cs);
                        break;
                }
            }
            col = 1;
        }
    }
    return wb;
};

module.exports = ExcelSrv;