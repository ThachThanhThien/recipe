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
};
