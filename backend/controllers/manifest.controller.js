const manifestModel = require('../models/manifest.model');

exports.generateManifestData = async (req, res) => {
  const { referralId } = req.params;

  try {
    const tiposResiduos = await manifestModel.getDistinctWasteTypes(referralId);

    for (const tipo of tiposResiduos) {
      const manifestId = await manifestModel.insertReferralManifest(referralId, tipo.tipo_residuo);

      const contenedores = await manifestModel.getGroupedContainers(referralId, tipo.tipo_residuo);

      for (const c of contenedores) {
        await manifestModel.insertManifestContainer(manifestId, c);
      }
    }

    res.status(200).json({ message: 'Manifest generado correctamente' });
  } catch (error) {
    console.error('Error al generar manifiesto:', error);
    res.status(500).json({ error: 'Error al generar manifiesto' });
  }
};

const ExcelJS = require("exceljs");

exports.exportManifestExcel = async (req, res) => {
  try {
    const { manifestData, wasteRecords, summaryData } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Manifiesto");

    // Estilos comunes
    const titleFont = { size: 16, bold: true };
    const headerFill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFB0C4DE" }, // color azul claro
    };
    const headerFont = { bold: true, color: { argb: "FF000000" } };
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Ajustar anchos de columnas
    sheet.columns = [
      { header: "Tipo", key: "tipo", width: 20 },
      { header: "Contenedor", key: "contenedor", width: 20 },
      { header: "Cantidad total (kg)", key: "totalKg", width: 22 },
      { header: "Cantidad (kg)", key: "kg", width: 15 },
      { header: "Químico", key: "quimico", width: 25 },
      { header: "Fecha registro", key: "fechaRegistro", width: 18 },
      { header: "Responsable", key: "responsable", width: 25 },
      { header: "Generador", key: "generador", width: 25 },
      { header: "Gestor", key: "gestor", width: 25 },
      { header: "Transportista", key: "transportista", width: 30 },
      { header: "Placas", key: "placas", width: 20 },
      { header: "Fecha", key: "fecha", width: 18 },
      { header: "Número de remisión", key: "numeroRemision", width: 22 },
    ];

    // Título principal
    const titleRow = sheet.addRow(["Manifiesto de residuos peligrosos"]);
    titleRow.font = titleFont;
    sheet.mergeCells(`A${titleRow.number}:C${titleRow.number}`);
    sheet.addRow([]);

    // Datos del manifiesto
    const manifestInfo = [
      ["Transportista", manifestData.transportista],
      ["Placas", manifestData.placas],
      ["Fecha", manifestData.fecha],
      ["Número de remisión", manifestData.numeroRemision],
    ];
    manifestInfo.forEach((item) => {
      const row = sheet.addRow(item);
      row.getCell(1).font = { bold: true };
    });

    sheet.addRow([]);

    // Resumen
    const resumenTitle = sheet.addRow(["Resumen de residuos"]);
    resumenTitle.font = { bold: true, size: 14 };
    sheet.addRow([]);

    // Encabezado resumen
    const resumenHeader = sheet.addRow(["Tipo", "Contenedor", "Cantidad total (kg)"]);
    resumenHeader.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Datos resumen
    summaryData.forEach((item) => {
      const row = sheet.addRow([item.tipo, item.contenedor, item.totalKg]);
      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    sheet.addRow([]);

    // Detalle
    const detalleTitle = sheet.addRow(["Detalle de residuos"]);
    detalleTitle.font = { bold: true, size: 14 };
    sheet.addRow([]);

    // Encabezado detalle
    const detalleHeader = sheet.addRow([
      "Tipo", "Contenedor", "Cantidad (kg)",
      "Químico", "Fecha registro",
      "Responsable", "Generador", "Gestor"
    ]);
    detalleHeader.eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Datos detalle
    wasteRecords.forEach((record) => {
      const row = sheet.addRow([
        record.tipo, record.contenedor, record.kg,
        record.quimico, record.fechaRegistro,
        record.responsable, record.generador, record.gestor
      ]);
      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    // Ajustar altura de filas para el título y encabezados para mejor apariencia
    titleRow.height = 25;
    resumenHeader.height = 20;
    detalleHeader.height = 20;

    // Headers para descarga
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=manifiesto.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generando Excel:", error);
    res.status(500).json({ error: "Error generando el archivo Excel" });
  }
};

