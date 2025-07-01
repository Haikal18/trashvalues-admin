import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionPDF from './TransactionPDF';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

const PDFExport = ({ isOpen, onClose, transactions }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Transaksi ke PDF</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Data yang akan diekspor: {transactions.length} transaksi
          </p>
          
          <PDFDownloadLink
            document={<TransactionPDF transactions={transactions} />}
            fileName="transaction-history.pdf"
            className="w-full"
          >
            {({ loading, error }) => (
              <Button
                className="w-full bg-[#4CAF50] hover:bg-[#45A049] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyiapkan PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4 " />
                    Download PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>
          
          {/* Error handling */}
          <div className="mt-2 text-xs text-red-500">
            {/* React-PDF error would be shown here */}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PDFExport;