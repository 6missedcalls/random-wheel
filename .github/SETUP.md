# CI/CD Setup Guide

This guide will help you get the GitHub Actions workflows up and running for The Wheel of Misfortune PWA.

## Quick Start

### 1. Push to GitHub

First, ensure your repository is pushed to GitHub:

```bash
cd ~/development/random-wheel
git init
git add .
git commit -m "Initial commit with CI/CD setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/random-wheel.git
git push -u origin main
```

### 2. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify by:
1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. You should see the workflows listed

### 3. Configure GitHub Pages Deployment

To deploy your app:

1. Go to **Settings** > **Pages**
2. Under "Source", select: **Deploy from a branch**
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**
5. Click **Save**

After the first deployment, your app will be available at:
`https://YOUR_USERNAME.github.io/random-wheel/`

### 4. Enable Security Features

1. Go to **Settings** > **Security** > **Code security and analysis**
2. Enable:
   - Dependency graph (should be on by default)
   - Dependabot alerts
   - Dependabot security updates
   - CodeQL analysis (click "Set up" and use the default configuration)

### 5. Configure Branch Protection (Recommended)

1. Go to **Settings** > **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable these options:
   - ✅ Require a pull request before merging
     - Require approvals: 1 (adjust as needed)
   - ✅ Require status checks to pass before merging
     - Search and add these checks:
       - `build` (from CI workflow)
       - `lint-and-format` (from PR checks)
       - `dependency-audit` (from security workflow)
   - ✅ Require conversation resolution before merging
   - ✅ Require linear history
   - ✅ Include administrators (optional, but recommended)
5. Click **Create**

## Workflow Descriptions

### CI Workflow (ci.yml)
Runs on every push and pull request to main:
- Installs dependencies
- Runs linter
- Type checks TypeScript
- Builds the application
- Uploads build artifacts

### Deploy Workflow (deploy.yml)
Runs on push to main:
- Builds the application
- Deploys to GitHub Pages
- Includes commented alternatives for Vercel and Netlify

### PR Checks Workflow (pr-checks.yml)
Runs on pull requests:
- Validates PR size
- Checks for merge conflicts
- Runs linting and type checking
- Verifies build succeeds
- Reports build size

### Security Scan Workflow (security.yml)
Runs weekly and on pushes:
- npm audit for vulnerabilities
- CodeQL security analysis
- Dependency review for PRs

## Alternative Deployment Options

### Option 1: Deploy to Vercel

1. Create a Vercel account at https://vercel.com
2. Import your GitHub repository
3. Get your credentials:
   - Go to Account Settings > Tokens
   - Create a new token
   - Get your Team/User ID and Project ID from project settings
4. Add GitHub secrets:
   - Go to repository **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Add:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your team/user ID
     - `VERCEL_PROJECT_ID`: Your project ID
5. Edit `.github/workflows/deploy.yml`:
   - Comment out the GitHub Pages section
   - Uncomment the Vercel section

### Option 2: Deploy to Netlify

1. Create a Netlify account at https://netlify.com
2. Create a new site
3. Get your credentials:
   - Go to User settings > Applications > Personal access tokens
   - Create a new token
   - Get your Site ID from Site settings > Site details
4. Add GitHub secrets:
   - Go to repository **Settings** > **Secrets and variables** > **Actions**
   - Add:
     - `NETLIFY_AUTH_TOKEN`: Your personal access token
     - `NETLIFY_SITE_ID`: Your site ID
5. Edit `.github/workflows/deploy.yml`:
   - Comment out the GitHub Pages section
   - Uncomment the Netlify section

## Testing the Workflows

### Test CI Workflow

1. Create a new branch:
   ```bash
   git checkout -b test-ci
   ```

2. Make a small change (e.g., add a comment to a file)

3. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify CI workflow"
   git push origin test-ci
   ```

4. Create a pull request on GitHub

5. Watch the workflows run in the "Actions" tab

### Test Deployment

1. Merge your PR to main or push directly to main

2. Go to the "Actions" tab

3. Watch the "Deploy" workflow run

4. Once complete, visit your GitHub Pages URL

## Monitoring and Maintenance

### View Workflow Status

- Go to the **Actions** tab in your repository
- Click on any workflow to see its runs
- Click on a specific run to see detailed logs

### Dependabot PRs

Dependabot will automatically create PRs for dependency updates:
- Review the changes in each PR
- Check that CI passes
- Merge when ready

### Security Alerts

Check for security issues:
- Go to **Security** tab
- Review any Dependabot alerts
- Review CodeQL findings
- Address issues by updating dependencies or fixing code

## Troubleshooting

### Workflows Not Running

**Problem:** Workflows don't appear or run

**Solution:**
1. Check that GitHub Actions is enabled (Settings > Actions > General)
2. Verify workflow files are in `.github/workflows/` directory
3. Check workflow syntax using the Actions tab

### Deployment Fails

**Problem:** Deploy workflow fails

**Solution:**
1. Check that GitHub Pages is enabled
2. Verify the `gh-pages` branch exists after first run
3. Check workflow logs for specific errors
4. Ensure repository has correct permissions

### Build Fails

**Problem:** Build step fails in CI

**Solution:**
1. Run `npm run build` locally to reproduce
2. Check for TypeScript errors: `npm run typecheck`
3. Fix any linting errors: `npm run lint`
4. Ensure all dependencies are installed: `npm ci`

### CodeQL Analysis Fails

**Problem:** Security scan workflow fails on CodeQL

**Solution:**
1. Ensure CodeQL is properly configured in repository settings
2. Check that the JavaScript codebase is being detected
3. Review CodeQL logs for specific errors

## Next Steps

1. Add workflow status badges to your main README.md (see `.github/README.md`)
2. Set up branch protection rules
3. Configure notification preferences for workflow failures
4. Review and adjust Dependabot settings
5. Set up deployment environment URLs in repository settings

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)

## Getting Help

If you encounter issues:
1. Check the workflow logs in the Actions tab
2. Review this setup guide
3. Check the main `.github/README.md` for detailed documentation
4. Search GitHub Actions documentation
5. Open an issue in the repository
