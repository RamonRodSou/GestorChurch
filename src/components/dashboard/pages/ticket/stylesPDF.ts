import { StyleSheet } from "@react-pdf/renderer";

export const ticketPdfStyles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#fff",
        padding: 20,
    },

    ticket: {
        margin: 10,
        padding: 20,
        borderRadius: 16,
        backgroundColor: "#fce4ec",
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#ec407a",
        position: "relative",
        fontFamily: "Helvetica",
        color: "#880e4f",
    },

    dataContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    infoContainer: {
        flexDirection: "column",
    },

    title: {
        fontSize: 16,
        marginBottom: 8,
        color: "#ad1457",
        fontWeight: "bold",
        fontFamily: "Helvetica-Bold",
    },

    text: {
        fontSize: 11,
        marginBottom: 4,
        color: "#880e4f",
    },

    qrCode: {
        width: 90,
        height: 90,
    },

    ticketInfo: {
        position: "absolute",
        top: 5,
        left: 20,
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Helvetica-Bold",
        color: "#ad1457",
        textAlign: "right",
    },

    lotInfo: {
        position: "absolute",
        top: 5,
        right: 20,
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Helvetica-Bold",
        color: "#ad1457",
        textAlign: "right"
    },

    lotText: {
        marginBottom: 2,
    }
});