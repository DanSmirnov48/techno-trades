import React, { useRef } from 'react';
import html2canvas from 'html2canvas'
import jspdf from 'jspdf'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PDFExportComponentProps {
    orderName: string;
    invoiceComponent: React.ReactNode;
}

const PDFExportComponent: React.FC<PDFExportComponentProps> = ({ orderName, invoiceComponent }) => {
    const pdfContainerRef = useRef(null);

    const handleExportPDF = () => {
        const content = pdfContainerRef.current;

        //@ts-ignore
        content.classList.remove('hidden');

        html2canvas(content!, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL('imgage/png')
            const pdf = new jspdf('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height + 100;
            const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * scale) / 2;
            const imgY = 15;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * scale - 20, imgHeight * scale - 60);
            pdf.save(`${orderName}.pdf`);
        })
        //@ts-ignore
        content.classList.add('hidden');
    };

    return (
        <div>
            <Button onClick={handleExportPDF} className={cn("text-blue-800/80 dark:text-blue-500 text-left p-0 m-0 w-fit h-5")} variant={"link"}>Invoice</Button>

            <div ref={pdfContainerRef} className='hidden'>
                {invoiceComponent}
            </div>
        </div>
    );
};

export default PDFExportComponent;