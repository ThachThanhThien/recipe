import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { GithubStore } from '../../core/services/github-store.service';

/**
 * Recipes are saved as commits to the GitHub repo, so editing needs a token.
 * It is stored only in this browser (localStorage).
 */
@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [FormsModule, ButtonModule, PasswordModule, MessageModule],
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
  `,
})
export class Connect {
  protected store = inject(GithubStore);
  private router = inject(Router);

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
