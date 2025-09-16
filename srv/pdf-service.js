const { Readable } = require('stream');
const PDFDocument = require('pdfkit');

module.exports = cds.service.impl(async function() {
    this.on('downloadPDF', async (req) => {
        let inputData;
        try {
            inputData = JSON.parse(req.data.input);
        } catch (error) {
            req.error(400, "Invalid JSON input");
        }

        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));

        const pdfGeneration = new Promise((resolve) => {
            doc.on('end', resolve);
        });

        doc.fontSize(16).text('Input JSON Data:', { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(JSON.stringify(inputData, null, 2));
        doc.end();

        await pdfGeneration;

        const pdfBuffer = Buffer.concat(buffers);

        // 5. Set the Content-Disposition header to trigger download
        // This is the crucial step for making the file downloadable.
        const fileName = `output_${Date.now()}.pdf`;
        req._.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Convert Buffer to Readable stream before returning
        const stream = new Readable();
        stream.push(pdfBuffer);
        stream.push(null); // Signal end of stream

        return stream;
    });
});
