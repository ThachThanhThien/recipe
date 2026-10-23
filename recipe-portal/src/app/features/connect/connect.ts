import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { GithubStore } from '../../core/services/github-store.service';
import { GoogleDrive } from '../../core/services/google-drive.service';

/**
 * Recipes are saved as commits to the GitHub repo, so editing needs a token.
 * It is stored only in this browser (localStorage). Recipe photos go to Google
 * Drive once it is set up, which needs a Google sign-in on this browser too.
 */
@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [DatePipe, FormsModule, ButtonModule, PasswordModule, MessageModule],
  template: `
    <div class="card max-w-2xl">
      <h2 class="text-2xl font-semibold mb-2">Connect to GitHub</h2>
      <p class="text-surface-600 mb-6">
        Your recipes are stored in <b>{{ store.repoName }}</b>. Saving here commits the change, and the public
        site rebuilds about a minute later.
      </p>

      @if (store.token()) {
        <p-message severity="success" styleClass="mb-4">This browser is connected and can edit recipes.</p-message>
        <p-button label="Disconnect this browser" icon="pi pi-sign-out" severity="secondary" (click)="disconnect()" />
      } @else {
        <ol class="list-decimal pl-5 mb-6 flex flex-col gap-1 text-surface-700">
          <li>
            Open
            <a class="text-primary underline" href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">
              GitHub → new fine-grained token</a>.
          </li>
          <li>Repository access: <b>Only select repositories</b> → <b>{{ store.repoName }}</b>.</li>
          <li>Repository permissions: <b>Contents → Read and write</b>. Nothing else is needed.</li>
          <li>Generate, copy the token and paste it below.</li>
        </ol>

        <form class="flex flex-col gap-3" (ngSubmit)="connect()">
          <label for="token" class="font-medium">Personal access token</label>
          <p-password inputId="token" name="token" [(ngModel)]="token" [feedback]="false" [toggleMask]="true"
            placeholder="github_pat_…" [fluid]="true" />
          @if (error) {
            <p-message severity="error" size="small" variant="simple">{{ error }}</p-message>
          }
          <div>
            <p-button type="submit" label="Connect" icon="pi pi-github" [loading]="connecting" [disabled]="!token.trim()" />
          </div>
        </form>
      }
    </div>

    <div class="card max-w-2xl">
      <h2 class="text-2xl font-semibold mb-2">Google Drive (recipe photos)</h2>
      @if (!drive.isConfigured) {
        <p class="text-surface-600">
          Photos are committed to the repo for now. To keep them in Google Drive instead, add a Google OAuth
          client id to <code>recipe-portal/src/environments/</code> — see <b>DEPLOY.md, section 4</b>. You can
          already paste the share link of a photo you uploaded to Drive yourself.
        </p>
      } @else if (drive.isConnected()) {
        <p-message severity="success" styleClass="mb-4">
          Signed in until {{ drive.token()?.expiresAt | date: 'shortTime' }}. New photos go to the Drive folder
          “{{ drive.folderName }}”.
        </p-message>
        <p-button label="Sign out of Google" icon="pi pi-sign-out" severity="secondary" (click)="drive.disconnect()" />
      } @else {
        <p class="text-surface-600 mb-4">
          New photos are uploaded to the Drive folder “{{ drive.folderName }}” and shared with anyone who has the
          link, so the public site can show them. The portal can only see files it uploaded. Google keeps this
          browser signed in for an hour at a time.
        </p>
        <div class="flex flex-col gap-3">
          <div>
            <p-button label="Sign in with Google" icon="pi pi-google" [loading]="driveSigningIn" (click)="connectDrive()" />
          </div>
          @if (driveError) {
            <p-message severity="error" size="small" variant="simple">{{ driveError }}</p-message>
          }
        </div>
      }
    </div>
  `,
})
export class Connect implements OnInit {
  protected store = inject(GithubStore);
  protected drive = inject(GoogleDrive);
  private router = inject(Router);

  driveSigningIn = false;
  driveError: string | null = null;

  ngOnInit(): void {
    this.drive.preload();
  }

  connectDrive(): void {
    this.driveSigningIn = true;
    this.driveError = null;
    this.drive
      .connect()
      .catch((err: Error) => (this.driveError = err.message))
      .finally(() => (this.driveSigningIn = false));
  }

  token = '';
  connecting = false;
  error: string | null = null;

  connect(): void {
    this.connecting = true;
    this.error = null;
    this.store.connect(this.token.trim()).subscribe({
      next: () => {
        this.connecting = false;
        this.token = '';
        this.router.navigate(['/recipes']);
      },
      error: (err) => {
        this.connecting = false;
        this.error =
          err?.status === 401
            ? 'GitHub rejected this token. Check that it was copied completely and has not expired.'
            : err?.message || 'Could not reach GitHub.';
      },
    });
  }

  disconnect(): void {
    this.store.disconnect();
  }
}
