# GitHub Actions CI/CD Configuration

This directory contains the GitHub Actions workflows and configurations for the Random Wheel PWA.

## Workflows

### 1. CI Workflow (`ci.yml`)
**Triggers:** Push to main, Pull Requests to main

**Purpose:** Validates code quality and builds the application

**Steps:**
- Checkout code
- Setup Node.js 20 with npm caching
- Install dependencies with `npm ci`
- Run ESLint for code quality
- Run TypeScript type checking
- Build the application
- Upload build artifacts

### 2. Deploy Workflow (`deploy.yml`)
**Triggers:** Push to main, Manual workflow dispatch

**Purpose:** Builds and deploys the application

**Default Deployment:** GitHub Pages

**Alternative Deployments (commented out, ready to use):**
- Vercel: Uncomment and configure `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets
- Netlify: Uncomment and configure `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets

**Permissions Required:**
- contents: write
- pages: write
- id-token: write

### 3. PR Checks Workflow (`pr-checks.yml`)
**Triggers:** Pull Request opened, synchronized, or reopened

**Purpose:** Additional validation for pull requests

**Checks:**
- PR size validation (warns if >50 files changed)
- Merge conflict detection
- Linting and type checking
- Build verification
- Build size reporting

### 4. Security Scan Workflow (`security.yml`)
**Triggers:** Weekly schedule (Monday midnight), Push to main, Pull Requests, Manual dispatch

**Purpose:** Security scanning and vulnerability detection

**Scans:**
- npm audit for dependency vulnerabilities
- CodeQL analysis for code security issues
- Dependency review for PRs (checks licenses and vulnerabilities)

**Security Levels:**
- npm audit: High severity threshold
- Dependency review: Moderate severity threshold
- License blocking: GPL-3.0, AGPL-3.0

## Dependabot Configuration (`dependabot.yml`)

**Schedule:** Weekly on Monday at 9:00 AM

**Features:**
- Automatic dependency updates
- Groups minor and patch updates together
- Separate grouping for dev dependencies
- Ignores major version updates for React
- Creates PRs with proper labels and commit messages
- Limits to 10 open PRs at once

**Commit Message Format:** `chore(deps): <description>`

**Labels:** `dependencies`, `automated`

## Repository Setup

### Required Actions

1. **Enable GitHub Pages** (for deployment):
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

2. **Enable Dependabot** (should be automatic):
   - Go to Settings > Security > Dependabot
   - Enable Dependabot alerts
   - Enable Dependabot security updates

3. **Enable CodeQL** (for security scanning):
   - Go to Settings > Security > Code security and analysis
   - Enable CodeQL analysis

### Optional Configurations

#### Deploy to Vercel
1. Create Vercel account and project
2. Add repository secrets:
   - `VERCEL_TOKEN`: Your Vercel token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
3. Uncomment Vercel deployment section in `deploy.yml`

#### Deploy to Netlify
1. Create Netlify account and site
2. Add repository secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
3. Uncomment Netlify deployment section in `deploy.yml`

### Branch Protection Rules (Recommended)

Configure branch protection for `main`:
1. Go to Settings > Branches > Add rule
2. Branch name pattern: `main`
3. Enable:
   - Require a pull request before merging
   - Require status checks to pass before merging
     - Select: `build`, `lint-and-format`, `dependency-audit`
   - Require conversation resolution before merging
   - Require linear history
   - Do not allow bypassing the above settings

## Workflow Status Badges

Add these badges to your main README.md:

```markdown
[![CI](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/ci.yml)
[![Deploy](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/deploy.yml)
[![Security Scan](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/security.yml/badge.svg)](https://github.com/YOUR_USERNAME/random-wheel/actions/workflows/security.yml)
```

Replace `YOUR_USERNAME` with your GitHub username.

## Troubleshooting

### Build Failures
- Check Node.js version compatibility (workflow uses Node 20)
- Verify all dependencies are in package.json
- Review TypeScript errors in the type check step

### Deployment Failures
- Ensure GitHub Pages is enabled
- Check repository permissions for workflows
- Verify build artifacts are generated correctly

### Security Scan Failures
- Review npm audit output for vulnerable dependencies
- Check CodeQL findings for security issues
- Update dependencies using Dependabot PRs

### Dependabot Issues
- Verify Dependabot is enabled in repository settings
- Check for conflicting PRs (max 10 open at once)
- Review ignored dependencies in `dependabot.yml`

## Maintenance

### Regular Tasks
- Review and merge Dependabot PRs weekly
- Monitor security scan results
- Update workflow actions versions quarterly
- Review and adjust security thresholds as needed

### Updating Workflows
When modifying workflows:
1. Test changes on a feature branch first
2. Use `workflow_dispatch` trigger for manual testing
3. Monitor workflow runs in the Actions tab
4. Update this documentation if behavior changes
