// Recipes are stored as JSON in this GitHub repo. The portal reads and commits them
// through the GitHub API; the public site (recipe-site) rebuilds on every commit.
export const environment = {
  production: false,
  github: {
    owner: 'ThachThanhThien',
    repo: 'recipe',
    branch: 'main',
    dataDir: 'recipe-site/data',
    // Served by recipe-site at "/" — uploaded photos go to <publicDir>/uploads/.
    publicDir: 'recipe-site/public',
  },
  // Recipe photos are uploaded to Google Drive and shared as "Anyone with the link"
  // (setup: DEPLOY.md, section 4). The OAuth client id is public, not a secret.
  // Leave it empty to commit photos to <publicDir>/uploads/ in the repo instead.
  googleDrive: {
    clientId: '',
    folderName: 'TastyFresh recipe photos',
  },
};
