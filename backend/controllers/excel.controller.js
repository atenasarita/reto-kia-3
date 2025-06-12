// routes/excel.js o controllers/excelController.js

const ExcelJS = require('exceljs');

const exportManifestExcel = async (req, res) => {
  try {
    const { manifestData, wasteRecords, summaryData } = req.body;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Manifiesto');

    // Encabezados
    sheet.addRow(['Manifiesto de residuos peligrosos']);
    sheet.addRow([]);
    sheet.addRow(['Transportista', manifestData.transportista]);
    sheet.addRow(['Placas', manifestData.placas]);
    sheet.addRow(['Fecha', manifestData.fecha]);
    sheet.addRow(['Número de remisión', manifestData.numeroRemision]);
    sheet.addRow(['']);
    sheet.addRow(['Resumen de residuos']);
    sheet.addRow(['Tipo', 'Contenedor', 'Cantidad total (kg)']);

    summaryData.forEach((s) => {
      sheet.addRow([s.tipo, s.contenedor, s.totalKg]);
    });

    sheet.addRow(['']);
    sheet.addRow(['Detalle de residuos']);
    sheet.addRow([
      'Tipo', 'Contenedor', 'Cantidad (kg)',
      'Químico', 'Fecha registro',
      'Responsable', 'Generador', 'Gestor'
    ]);

    wasteRecords.forEach((r) => {
      sheet.addRow([
        r.tipo, r.contenedor, r.kg,
        r.quimico, r.fechaRegistro,
        r.responsable, r.generador, r.gestor
      ]);
    });

    // Configura headers
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=manifiesto.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error generando Excel:', err);
    res.status(500).json({ error: 'Error generando Excel' });
  }
};

module.exports = { exportManifestExcel };
