import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

// Handle API errors
export function handleError(error: HttpErrorResponse) {
    return throwError(error.error);
}
