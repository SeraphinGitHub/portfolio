import { Document, Schema, model } from "mongoose";

// {
//   sessionTime: '0 min 25 s',
//   date: '13/09/2024',
//   time: '13:15:36',
//   projects: [
//     { title: 'Empire Rising',  hasOpenLink: false },  
//     { title: 'A* Pathfinding', hasOpenLink: true }    
//   ],
//   lang: [ 'FR', 'EN', 'JP' ],
//   starsExplode: [ 1, 1.3 ]
// }

interface IProject {
   title:       string;
   hasOpenLink: boolean;
}

interface IReport extends Document {
   sessionTime:   string,
   date:          string,
   time:          string,
   projects:      IProject[],
   lang:          string[],
   starsExplode:  number[],
}

const ProjectSchema = new Schema<IProject>({

   title: {
      type:     String,
   },

   hasOpenLink: {
      type:     Boolean,
   },

}, { _id: false });


const ReportSchema: Schema<IReport> = new Schema({
   
   sessionTime: {
      type:     String,
      required: true,
      trim:     true,
   },

   date: {
      type:     String,
      required: true,
      trim:     true,
   },

   time: {
      type:     String,
      required: true,
      trim:     true,
   },

   projects: {
      type:     [ProjectSchema],
   },

   lang: {
      type:     [String],
   },

   starsExplode: {
      type:     [Number],
   },

});


export default model<IReport>("Report", ReportSchema);
