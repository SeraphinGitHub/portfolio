
"use strict"

// =================================================================================
// Server
// =================================================================================
import express,{ Request, Response, NextFunction } from "express";
import { Server , Socket }  from "socket.io";
import http                from "http";
import cors                from "cors";
import dotenv              from "dotenv";
import bodyParser          from "body-parser";
import mongoose            from "mongoose";
import axios               from "axios";

import Report              from "./Model-Report";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const socketIO   = new Server(httpServer, {
   cors: {
      origin:         "https://fatet-seraphin-portfolio.netlify.app/",
      methods:        ["GET", "POST", "PUT", "DELETE"],
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
let isRuning: boolean = false;
let inter_0:  any     = null;

const fillReport = (
   emptyReport: any,
   data:        any,
): any => {

   const {
      openSession,
      update,
      selectedLang,
      title,
      hasOpenLink,
      lang,
      starsExplode,
   }:any = data;


   if(update && typeof(update) === "boolean") {
      emptyReport.lastUpdate = Date.now();
   }

   if(openSession  && typeof(openSession ) === "number"
   && selectedLang && typeof(selectedLang) === "string") {

      emptyReport.openSession = openSession;
      emptyReport.lang.push(selectedLang);
   }

   if(title && typeof(title      ) === "string"
   &&          typeof(hasOpenLink) === "boolean") {

      if(!hasOpenLink) return emptyReport.projects.push(data);
      emptyReport.projects[emptyReport.projects.length -1].hasOpenLink = hasOpenLink;
   }

   if(lang && typeof(lang) === "string") {
      emptyReport.lang.push(lang);
   }

   if(starsExplode && typeof(starsExplode) === "number") {
      emptyReport.starsExplode.push(starsExplode);
   }

   return emptyReport;
}

const formatDuration = (
   openSession: number,
   lastUpdate:  number,
): string => {

   let minutes = 0;
   let seconds = 0;

   const sessionSeconds = Math.floor( (lastUpdate -openSession) /1000 );

   if(sessionSeconds >= 60) {
      minutes = Math.floor(sessionSeconds /60);
      seconds = sessionSeconds % 60;
   }
   else seconds = sessionSeconds;

   return `${minutes} min ${seconds} s`;
}

const formatDate = (
   timestamp: number,
): any => {

   const date = new Date(timestamp);

   const dateOptions: any = {
      timeZone:   "Asia/Tokyo",
      year:       "numeric",
      month:      "2-digit",
      day:        "2-digit",
   };

   const timeOptions: any = {
      timeZone:   "Asia/Tokyo",
      hour:       "2-digit",
      minute:     "2-digit",
      second:     "2-digit",
      hour12:     false,
   };
   
   return {
      date: date.toLocaleString("fr-FR", dateOptions),
      time: date.toLocaleString("fr-FR", timeOptions),
   }
}

const setReportDate = (
   completeReport: any,
) => {
   const { openSession, lastUpdate, ...rest } = completeReport;

   return {
      sessionTime: formatDuration(openSession, lastUpdate),
      date:        formatDate(openSession).date,
      time:        formatDate(openSession).time,
      ...rest,
   };
}

const organizeReport = (
   reportPackage: any,
   report:        any,
): any => {

   const monthSection: string = report.date.slice(3);

   if(!reportPackage[monthSection]) reportPackage[monthSection] = [];
   
   reportPackage[monthSection].push(report);

   return reportPackage;
}

const startAxios = () => {

   axios.get("https://psf-manager.onrender.com/wake")
   .then((response) => {

      console.log(response.data, formatDate(Date.now()));
      
      const { message } = response.data;
      if(message !== "Waking psf-manager !") isRuning = true;
      
   }).catch((error) => console.log(error));
}


// =================================================================================
// SocketIO
// =================================================================================
socketIO.on("connection", (socket: Socket) => {
   console.log("SocketIO: User connected !");

   const emptyReport: any = {
      openSession:  0,
      lastUpdate:   0,
      projects:     [],
      lang:         [],
      starsExplode: [],
   };

   let completeReport: any     = null;
   let isLogEnabled:   boolean = true;
   

   // ==> User connected to server
   socket.emit("socketConnected");

   
   // ==> Disable analytics
   socket.on("logData", () => {
      isLogEnabled = false;
   });
   

   // ==> Session data
   socket.on("socketSend", (data: any) => {
      completeReport = fillReport(emptyReport, data);
   });


   // ==> User disconnected from server
   socket.on("disconnect", () => {
      console.log("SocketIO: User disconnected !");

      const formatData: any = setReportDate(completeReport);
      const report:     any = new Report({ ...formatData, });

      if(!isLogEnabled) return;

      report.save()
      .then(     ()       => console.log("Report saved to DB !"))
      .catch((error: any) => console.log(error));
   });
});


// =================================================================================
// Routes
// =================================================================================
app.get("/start", (
   req:  Request,
   res:  Response,
   next: NextFunction,
) => {
   
   startAxios();

   if(isRuning) return res.status(200).json({ message: "Server already runing !" });

   isRuning = true;

   inter_0 = setInterval(() => startAxios(), 1000 *60 *5);

   res.status(200).json({ message: "Start server loop !" });
});


app.get("/stop", (
   req:  Request,
   res:  Response,
   next: NextFunction,
) => {
   
   if(inter_0 === null) return res.status(350).json({ message: "Server not runing !" });
   
   clearInterval(inter_0);
   res.status(200).json({ message: "Stop server loop !" });
});


app.get("/wake", (
   req:  Request,
   res:  Response,
   next: NextFunction,
) => {
   
   res.status(200).json({ message: "Waking psf-manager !" });
});


app.get("/reports", (
   req:  Request,
   res:  Response,
   next: NextFunction
) => {

   Report.find().lean()
   .then((data) => {
   
      let reportPackage: any = {};
      
      for(let i = 0; i < data.length; i++) {
         const originalReport: any = data[i];

         delete originalReport._id;
         delete originalReport.__v;

         const { ...rest }: any = originalReport;

         const report: any = {
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
mongoose.connect(process.env.ATLAS_URI!)
.then(() => {
   console.log("Connected to MongoDB !");

   httpServer.listen(process.env.PORT || 3000, () => {
      console.log(`Listening on port ${process.env.PORT}`);
   });

}).catch(() => console.log("Failed to connect to MongoDB !"));


module.exports = app;