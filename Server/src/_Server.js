"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// =================================================================================
// Server
// =================================================================================
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const Model_Report_1 = __importDefault(require("./Model-Report"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const httpServer = http_1.default.createServer(app);
const socketIO = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "https://fatet-seraphin-portfolio.netlify.app/",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content",
            "Accept",
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    }
});
// =================================================================================
// Methods
// =================================================================================
const fillReport = (emptyReport, data) => {
    const { openSession, update, selectedLang, title, hasOpenLink, lang, starsExplode, } = data;
    if (update && typeof (update) === "boolean") {
        emptyReport.lastUpdate = Date.now();
    }
    if (openSession && typeof (openSession) === "number"
        && selectedLang && typeof (selectedLang) === "string") {
        emptyReport.openSession = openSession;
        emptyReport.lang.push(selectedLang);
    }
    if (title && typeof (title) === "string"
        && typeof (hasOpenLink) === "boolean") {
        if (!hasOpenLink)
            return emptyReport.projects.push(data);
        emptyReport.projects[emptyReport.projects.length - 1].hasOpenLink = hasOpenLink;
    }
    if (lang && typeof (lang) === "string") {
        emptyReport.lang.push(lang);
    }
    if (starsExplode && typeof (starsExplode) === "number") {
        emptyReport.starsExplode.push(starsExplode);
    }
    return emptyReport;
};
const formatDuration = (openSession, lastUpdate) => {
    let minutes = 0;
    let seconds = 0;
    const sessionSeconds = Math.floor((lastUpdate - openSession) / 1000);
    if (sessionSeconds >= 60) {
        minutes = Math.floor(sessionSeconds / 60);
        seconds = sessionSeconds % 60;
    }
    else
        seconds = sessionSeconds;
    return `${minutes} min ${seconds} s`;
};
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const dateOptions = {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const timeOptions = {
        timeZone: "Asia/Tokyo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    return {
        date: date.toLocaleString("fr-FR", dateOptions),
        time: date.toLocaleString("fr-FR", timeOptions),
    };
};
const setReportDate = (completeReport) => {
    const { openSession, lastUpdate, ...rest } = completeReport;
    return {
        sessionTime: formatDuration(openSession, lastUpdate),
        date: formatDate(openSession).date,
        time: formatDate(openSession).time,
        ...rest,
    };
};
const organizeReport = (reportPackage, report) => {
    const monthSection = report.date.slice(3);
    if (!reportPackage[monthSection])
        reportPackage[monthSection] = [];
    reportPackage[monthSection].push(report);
    return reportPackage;
};
// =================================================================================
// SocketIO
// =================================================================================
socketIO.on("connection", (socket) => {
    console.log("SocketIO: User connected !");
    const emptyReport = {
        openSession: 0,
        lastUpdate: 0,
        projects: [],
        lang: [],
        starsExplode: [],
    };
    let completeReport = null;
    let isLogEnabled = true;
    // ==> User connected to server
    socket.emit("socketConnected");
    // ==> Disable analytics
    socket.on("logData", () => {
        isLogEnabled = false;
    });
    // ==> Session data
    socket.on("socketSend", (data) => {
        completeReport = fillReport(emptyReport, data);
    });
    // ==> User disconnected from server
    socket.on("disconnect", () => {
        console.log("SocketIO: User disconnected !");
        const formatData = setReportDate(completeReport);
        const report = new Model_Report_1.default({ ...formatData, });
        if (!isLogEnabled)
            return;
        report.save()
            .then(() => console.log("Report saved to DB !"))
            .catch((error) => console.log(error));
    });
});
// =================================================================================
// Routes
// =================================================================================
app.get("/wake", (req, res, next) => {
    res.status(200).json({ message: "Waking psf-manager !" });
});
app.get("/reports", (req, res, next) => {
    Model_Report_1.default.find().lean()
        .then((data) => {
        let reportPackage = {};
        for (let i = 0; i < data.length; i++) {
            const originalReport = data[i];
            delete originalReport._id;
            delete originalReport.__v;
            const { ...rest } = originalReport;
            const report = {
                _Session_: "**************************************************************************************",
                ...rest,
            };
            reportPackage = organizeReport(reportPackage, report);
        }
        res.status(200).json(reportPackage);
    }).catch((error) => {
        res.status(500).json({ message: "Failed to send reports !", error });
    });
});
// =================================================================================
// MongoDB connect then ==> Start Server
// =================================================================================
mongoose_1.default.connect(process.env.ATLAS_URI)
    .then(() => {
    console.log("Connected to MongoDB !");
    httpServer.listen(process.env.PORT || 3000, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
}).catch(() => console.log("Failed to connect to MongoDB !"));
module.exports = app;
