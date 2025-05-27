import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }
  getAdvanceDataSearch(query: string): Observable<any> {
    const mockApiResponse = {
      "searchresult": [
        {
          "a_content_type": "pdf",
          "name": "SampleDocument1",
          "mime_type": "application/pdf",
          "dos_extension": ".pdf"
        },
        {
          "a_content_type": "txt",
          "name": "SampleDocument2",
          "mime_type": "text/plain",
          "dos_extension": ".txt"
        },
        {
          "a_content_type": "jpg",
          "name": "SampleImage1",
          "mime_type": "image/jpeg",
          "dos_extension": ".jpg"
        }
      ]
    };

    // Return an observable with the mock data
    return of(mockApiResponse);
  }
  downloadPDF(objectId: string): Observable<Blob> {
    const url = 'http://localhost:3000/api/download';  // A publicly accessible PDF URL (no CORS issue)
    console.log(url);
    // console.log(url)
    return this.http.get(url, {
      responseType: 'blob',
    });
  }
}
