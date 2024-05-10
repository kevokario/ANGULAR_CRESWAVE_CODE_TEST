import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private _snackBar: MatSnackBar) { }

  success(message: string) {
    this._snackBar.open(message, "",{
      duration: 5000,
      verticalPosition: "top",
      horizontalPosition: "right"
    });
  }

  error(error: string) {
    this._snackBar.open(error, "Dismiss",{
      verticalPosition: "top",
      horizontalPosition: "right"
    });
  }
}
