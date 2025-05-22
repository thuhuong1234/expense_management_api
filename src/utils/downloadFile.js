const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

const generateExcel = async ({
  rows = [],
  columns = [],
  sheetName = "Sheet1",
  customLayout = false,
  rowTitle = [],
  fillWorksheetRows: fillWorksheetRows = () => {},
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: "landscape" },
    headerFooter: { oddFooter: "Page &P of &N", oddHeader: "Odd Page" },
  });
  worksheet.columns = columns;

  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = {
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF6FF00" },
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  headerRow.commit();

  if (!customLayout) {
    worksheet.addRows(rows);
  } else {
    await renderRows(worksheet, rows, rowTitle, fillWorksheetRows);
  }

  const fileName = `${sheetName}_${Date.now()}.xlsx`;
  const filePath = path.join(__dirname, `../uploads/${fileName}`);
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);

  return { filePath, worksheet };
};

const renderRows = async (
  worksheet,
  rows,
  rowTitle,
  fillWorksheetRows,
  currentRow
) => {
  worksheet.addRow(rowTitle);
  worksheet.mergeCells("A1:A2");
  worksheet.mergeCells("B1:B2");
  worksheet.mergeCells("C1:C2");
  worksheet.mergeCells("D1:D2");
  worksheet.mergeCells("E1:F1");
  worksheet.mergeCells("G1:G2");
  const formatHeader = (row, color) => {
    row.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: color },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  };

  formatHeader(worksheet.getRow(1), "FFFFFF00");
  formatHeader(worksheet.getRow(2), "FFCCFFFF");

  currentRow = 3;
  await fillWorksheetRows(worksheet, rows, currentRow);
};
module.exports = generateExcel;
