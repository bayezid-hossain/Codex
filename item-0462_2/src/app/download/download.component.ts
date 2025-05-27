// import { Component } from '@angular/core';
// import { interval, Subscription } from 'rxjs';
// import { environment } from "../../environments"; // Adjust the import path
// import { FolderService } from '../services/folder.service';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-download',
//   imports: [CommonModule],
//   templateUrl: './download.component.html',
//   styleUrl: './download.component.css'
// })
// export class DownloadComponent {
//   constructor(private folderservice: FolderService) { }
//   progress: number = 0;
//   progressVisible: boolean = false;
//   downloadResponse: any = null;
//   private progressIntervalSubscription: Subscription | null = null;

//   ngOnDestroy(): void {
//     if (this.progressIntervalSubscription) {
//       this.progressIntervalSubscription.unsubscribe();
//     }
//   }
//   downloadDocument(objectid: any, objectname: any) {
//     this.progressVisible = true;
//     this.progress = 0;

//     // Estimate the total number of steps (adjust as needed)
//     const totalSteps = 100;
//     const intervalDuration = 50; // Adjust for speed

//     if (this.progressIntervalSubscription) {
//       this.progressIntervalSubscription.unsubscribe();
//     }

//     this.progressIntervalSubscription = interval(intervalDuration)
//       .subscribe(count => {
//         if (this.progress < 53) { // Initial phase (API calls)
//           this.progress = Math.min(53, (count + 1) * (53 / (2809 / intervalDuration))); // Adjust timing
//         } else if (this.progress < 100 && this.downloadResponse) { // Download phase
//           this.progress = Math.min(100, 53 + (count - Math.floor(2809 / intervalDuration)) * ((100 - 53) / (2350 / intervalDuration))); // Adjust timing
//         }

//         if (this.progress >= 100) {
//           this.progressVisible = false;
//           if (this.progressIntervalSubscription) {
//             this.progressIntervalSubscription.unsubscribe();
//             this.progressIntervalSubscription = null;
//           }
//         }
//       });

//     let stringngI13 = {
//       repoName: environment.REPOSITORY,
//       typeName: "dm_document",
//       viewAttributes: ["object_name", "a_content_type"],
//       searchAttributes: ["r_object_id", objectid],
//     };

//     this.folderservice.getAdvanceDataSearch(JSON.stringify(stringngI13)).subscribe(async (data) => {
//       let resultdataset13: any = data["searchresult"];
//       console.log("resultdataset - ", resultdataset13);
//       if (resultdataset13.length > 0) {
//         const content_type = resultdataset13[0].a_content_type;
//         let stringInputmimtype14 = {
//           repoName: environment.REPOSITORY,
//           typeName: "dm_format",
//           viewAttributes: ["name", "mime_type", "dos_extension"],
//           searchAttributes: ["name", content_type],
//         };

//         this.folderservice
//           .getAdvanceDataSearch(JSON.stringify(stringInputmimtype14))
//           .subscribe(async (data) => {
//             let resultdataset14: any = data["searchresult"];
//             console.log("resultdataset - ", resultdataset14);
//             if (resultdataset14.length > 0) {
//               const extension14 = resultdataset14[0].dos_extension;
//               this.folderservice.downloadPDF(objectid).subscribe(
//                 (response) => {
//                   this.downloadResponse = response; // Indicate download started
//                   let dataType46 = response.type;
//                   let binaryData46 = [];
//                   binaryData46.push(response);
//                   let downloadLink46 = document.createElement('a');
//                   downloadLink46.href = window.URL.createObjectURL(new Blob(binaryData46, { type: dataType46 }));
//                   downloadLink46.setAttribute('download', objectname + "." + extension14);
//                   document.body.appendChild(downloadLink46);
//                   downloadLink46.click();
//                 },
//                 (error) => {
//                   this.progressVisible = false;
//                   if (this.progressIntervalSubscription) {
//                     this.progressIntervalSubscription.unsubscribe();
//                     this.progressIntervalSubscription = null;
//                   }
//                 }
//               );
//             } else {
//               this.progressVisible = false;
//               if (this.progressIntervalSubscription) {
//                 this.progressIntervalSubscription.unsubscribe();
//                 this.progressIntervalSubscription = null;
//               }
//             }
//           });
//       } else {
//         this.progressVisible = false;
//         if (this.progressIntervalSubscription) {
//           this.progressIntervalSubscription.unsubscribe();
//           this.progressIntervalSubscription = null;
//         }
//       }
//     });
//   }

//   conicGradient(progress: number): string {
//     return `conic-gradient(blue 0% ${progress}%, lightgrey ${progress}% 100%)`;
//   }

// }

// Response 2 working code
import { Component } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { environment } from "../../environments"; // Adjust the import path
import { FolderService } from '../services/folder.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-download',
  imports: [CommonModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.css'
})
export class DownloadComponent {
  constructor(private folderservice: FolderService) { }

  progress: number = 0;
  progressVisible: boolean = false;
  downloadResponse: any = null;
  private progressIntervalSubscription: Subscription | null = null;
  downloadDocument(objectid: any, objectname: any) {
    this.progressVisible = true;
    this.progress = 0;

    // Create a single interval for the entire download process
    const progressInterval$ = interval(30).subscribe(() => {
      // First phase: 0% to 50% (simulating fetching data)
      if (this.progress < 50) {
        this.progress += 1;
      }
    });

    let stringngI13 = {
      repoName: environment.REPOSITORY,
      typeName: "dm_document",
      viewAttributes: ["object_name", "a_content_type"],
      searchAttributes: ["r_object_id", objectid],
    };

    this.folderservice.getAdvanceDataSearch(JSON.stringify(stringngI13)).subscribe(async (data) => {
      let resultdataset13: any = data["searchresult"];
      console.log("resultdataset - ", resultdataset13);
      if (resultdataset13.length > 0) {
        const content_type = resultdataset13[0].a_content_type;
        let stringInputmimtype14 = {
          repoName: environment.REPOSITORY,
          typeName: "dm_format",
          viewAttributes: ["name", "mime_type", "dos_extension"],
          searchAttributes: ["name", content_type],
        };
        this.folderservice.downloadPDF(objectid).subscribe(
          (response) => {
            // Second phase: 50% to 100% (actual download)
            progressInterval$.unsubscribe(); // Stop the first phase interval
            // console.log('hi')
            const extension14 = resultdataset13[0].dos_extension;
            const downloadInterval$ = interval(30).subscribe(() => {
              if (this.progress < 100) {
                this.progress += 2; // Faster increment for download completion
              } else {
                downloadInterval$.unsubscribe();
                this.progressVisible = false;

                // Create download link and trigger download
                let dataType46 = response.type;
                let binaryData46 = [];
                binaryData46.push(response);
                let downloadLink46 = document.createElement('a');
                downloadLink46.href = window.URL.createObjectURL(new Blob(binaryData46, { type: dataType46 }));
                downloadLink46.setAttribute('download', objectname + "." + extension14);
                document.body.appendChild(downloadLink46);
                downloadLink46.click();
              }
            });
          },
          (error) => {
            progressInterval$.unsubscribe();
            this.progressVisible = false;
          }
        );
      } else {
        progressInterval$.unsubscribe();
        this.progressVisible = false;
      }
    }, error => {
      progressInterval$.unsubscribe();
      this.progressVisible = false;
    });
  }

  conicGradient(progress: number): string {
    return `conic-gradient(blue 0% ${progress}%, lightgrey ${progress}% 100%)`;
  }
  ngOnDestroy(): void {
    if (this.progressIntervalSubscription) {
      this.progressIntervalSubscription.unsubscribe();
    }
  }
}
