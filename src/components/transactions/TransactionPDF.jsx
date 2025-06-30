import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf",
  fontWeight: "normal",
});

Font.register({
  family: "Open Sans",
  src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottom: "2px solid #4CAF50",
    paddingBottom: 10,
  },
  companyInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  companyDetail: {
    fontSize: 10,
    color: "#666",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  summaryItem: {
    flexDirection: "column",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  table: {
    display: "flex",
    width: "auto",
    marginBottom: 30,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderBottomStyle: "solid",
    alignItems: "center",
    minHeight: 28,
  },
  tableRowEven: {
    backgroundColor: "#F9F9F9",
  },
  tableHeader: {
    backgroundColor: "#4CAF50",
  },
  tableCell: {
    padding: 8,
    textAlign: "left",
    fontSize: 9,
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
  },
  idCell: { width: "15%" },
  userCell: { width: "20%" },
  typeCell: { width: "15%" },
  amountCell: { width: "15%", textAlign: "right" },
  statusCell: { width: "15%" },
  dateCell: { width: "20%" },
  statusPending: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  statusCompleted: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  statusFailed: {
    color: "#F44336",
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    borderTopStyle: "solid",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 8,
    color: "#666",
  },
  watermark: {
    position: "absolute",
    top: "45%",
    left: "25%",
    transform: "rotate(-45deg)",
    fontSize: 60,
    color: "rgba(211, 211, 211, 0.3)",
  },
  reportInfoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    borderLeftStyle: "solid",
  },
  reportInfoText: {
    fontSize: 9,
    color: "#555",
  },
});

const TransactionPDF = ({ transactions }) => {
  const getTotalAmount = () => {
    return transactions
      .filter((t) => typeof t.amount === "number")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return styles.statusCompleted;
      case "pending":
        return styles.statusPending;
      case "failed":
        return styles.statusFailed;
      default:
        return {};
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCompletedTransactionsCount = () => {
    return transactions.filter(
      (t) => t.status && t.status.toLowerCase() === "completed"
    ).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>Trash4Cash</Text>
            <Text style={styles.companyDetail}>
              Konversi Sampah Menjadi Uang
            </Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyDetail}>
              Tanggal: {getCurrentDate()}
            </Text>
            <Text style={styles.companyDetail}>
              Ref: T4C-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Laporan Riwayat Transaksi</Text>

        <View style={styles.reportInfoContainer}>
          <Text style={styles.reportInfoText}>
            Laporan ini berisi ringkasan transaksi yang diproses dalam sistem
            Trash4Cash. Semua nilai dalam Rupiah (IDR).
          </Text>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL TRANSAKSI</Text>
            <Text style={styles.summaryValue}>{transactions.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL NOMINAL</Text>
            <Text style={styles.summaryValue}>
              Rp {getTotalAmount().toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TRANSAKSI SELESAI</Text>
            <Text style={styles.summaryValue}>
              {getCompletedTransactionsCount()}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PERIODE</Text>
            <Text style={styles.summaryValue}>All Time</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.headerCell, styles.idCell]}>
              ID TRANSAKSI
            </Text>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.userCell]}
            >
              PENGGUNA
            </Text>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.typeCell]}
            >
              TIPE
            </Text>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.amountCell]}
            >
              JUMLAH
            </Text>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.statusCell]}
            >
              STATUS
            </Text>
            <Text
              style={[styles.tableCell, styles.headerCell, styles.dateCell]}
            >
              TANGGAL
            </Text>
          </View>

          {transactions.map((transaction, index) => (
            <View
              key={`tr-${index}`}
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.tableRowEven : {},
              ]}
            >
              <Text style={[styles.tableCell, styles.idCell]}>
                {transaction.id ? transaction.id.slice(0, 8) : "-"}
              </Text>
              <Text style={[styles.tableCell, styles.userCell]}>
                {transaction.user?.name || "N/A"}
              </Text>
              <Text style={[styles.tableCell, styles.typeCell]}>
                {transaction.type || "-"}
              </Text>
              <Text style={[styles.tableCell, styles.amountCell]}>
                {typeof transaction.amount === "number"
                  ? `Rp ${transaction.amount.toLocaleString("id-ID")}`
                  : "-"}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.statusCell,
                  getStatusStyle(transaction.status),
                ]}
              >
                {transaction.status || "-"}
              </Text>
              <Text style={[styles.tableCell, styles.dateCell]}>
                {formatDate(transaction.createdAt)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.watermark}>Trash4Cash</Text>

        <Text style={styles.footer}>
          Dokumen ini dibuat secara otomatis oleh sistem Trash4Cash pada{" "}
          {new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
          . Laporan ini bersifat rahasia dan hanya untuk penggunaan internal.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default TransactionPDF;
