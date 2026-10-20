import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GithubStore } from '../services/github-store.service';

/** Data pages need a GitHub token; without one, send the user to connect first. */
export const githubGuard: CanActivateFn = () =>
  inject(GithubStore).token() ? true : inject(Router).createUrlTree(['/connect']);
