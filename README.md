# Survey Platform

## Copyright Management

This project automatically adds copyright headers to all TypeScript files.

### Automatic Copyright Addition

The project includes scripts to automatically add copyright headers:

```bash
# Add copyright to a specific file
npm run add-copyright src/path/to/file.ts

# Add copyright to all TypeScript files
npm run add-copyright-all
```

### Git Hook Integration

A pre-commit hook automatically adds copyright headers to any new or modified TypeScript files when you commit.

### Manual Usage

To manually add copyright headers to files:

```bash
node scripts/add-copyright.js src/path/to/file.ts
```

The copyright header format:

```typescript
/**
 * Copyright (c) 2025 Webapp Software Solutions. All rights reserved.
 * This file belongs to Webapp Software Solutions and is proprietary and confidential.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Website: https://webappssoft.com
 */
```

## Commit Message Standards

Use conventional commit format for consistent and professional commit messages:

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

```bash
# New features
feat: add user authentication system
feat(auth): implement JWT token validation

# Bug fixes
fix: resolve database connection timeout
fix(api): handle null response in user endpoint

# Documentation
docs: update API documentation
docs(readme): add installation instructions

# Code style/formatting
style: fix indentation in user service
style(lint): resolve ESLint warnings

# Code refactoring
refactor: restructure user module architecture
refactor(db): optimize database queries

# Performance improvements
perf: improve API response time
perf(cache): implement Redis caching

# Tests
test: add unit tests for auth service
test(e2e): add integration tests for user API

# Build/CI changes
build: update webpack configuration
ci: add GitHub Actions workflow

# Dependency updates
chore: update dependencies to latest versions
chore(deps): bump @nestjs/core to v11.0.0

# Configuration changes
config: update database connection settings
config(env): add new environment variables

# Security fixes
security: fix SQL injection vulnerability
security(auth): implement rate limiting

# Database changes
db: add user profile migration
db(migration): create survey tables

# API changes
api: add new survey endpoints
api(v2): implement pagination for user list
```

### Examples

```bash
# Good commit messages
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(survey): resolve validation error for empty responses"
git commit -m "docs: update API endpoint documentation"
git commit -m "refactor(user): extract validation logic to separate service"
git commit -m "test(auth): add unit tests for login endpoint"
git commit -m "chore(deps): update NestJS to version 11.0.0"

# Bad commit messages (avoid these)
git commit -m "fix stuff"
git commit -m "update code"
git commit -m "changes"
git commit -m "wip"
```

### Scopes (Optional)

- `auth` - Authentication related
- `user` - User management
- `survey` - Survey functionality
- `api` - API endpoints
- `db` - Database related
- `config` - Configuration
- `test` - Testing
- `docs` - Documentation
- `deps` - Dependencies

### Enforcing Commit Standards

This project uses git hooks to enforce commit message standards. Commits that don't follow the conventional format will be rejected.

#### Setup Git Hooks

```bash
# Install husky for git hooks
npm install --save-dev husky

# Initialize husky
npx husky install

# Add commit message validation hook
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

#### Install Commitlint

```bash
# Install commitlint
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

#### Configuration

Create `.commitlintrc.json` in project root:

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "config",
        "security",
        "db",
        "api"
      ]
    ],
    "scope-enum": [
      2,
      "always",
      ["auth", "user", "survey", "api", "db", "config", "test", "docs", "deps"]
    ]
  }
}
```

#### What Happens

- **Valid commits** will be accepted normally
- **Invalid commits** will be rejected with an error message
- Developers must fix their commit message to follow the standard
- This ensures consistent commit history across the entire project

#### Example Rejection

```bash
$ git commit -m "fix stuff"
⧗   input: fix stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
husky - commit-msg hook exited with code 1 (error)
```

## Available Scripts

### Build & Development

```bash
# Build the project for production
npm run build
# Purpose: Compiles TypeScript to JavaScript in the dist/ folder

# Start the application
npm run start
# Purpose: Runs the compiled application from dist/main.js

# Start in development mode with auto-reload
npm run start:dev
# Purpose: Runs the app with file watching for development

# Start in debug mode
npm run start:debug
# Purpose: Runs with debugger attached for debugging

# Start in production mode
npm run start:prod
# Purpose: Runs the production build from dist/main.js
```

### Code Quality & Formatting

```bash
# Format code with Prettier
npm run format
# Purpose: Auto-formats all TypeScript files in src/ and test/

# Lint and auto-fix code issues
npm run lint
# Purpose: Runs ESLint with automatic fixes for code quality

# Check linting without fixing
npm run lint:check
# Purpose: Reports linting issues without making changes
```

### Testing

```bash
# Run all tests
npm run test
# Purpose: Executes unit tests using Jest

# Run tests in watch mode
npm run test:watch
# Purpose: Runs tests continuously, re-running on file changes

# Run tests with coverage report
npm run test:cov
# Purpose: Generates code coverage report in coverage/ folder

# Debug tests
npm run test:debug
# Purpose: Runs tests with Node.js debugger attached

# Run end-to-end tests
npm run test:e2e
# Purpose: Executes integration tests using e2e configuration
```

### Database Operations

```bash
# Generate new migration
npm run migration:generate -- -n MigrationName
# Purpose: Creates a new database migration file based on entity changes

# Run pending migrations
npm run migration:run
# Purpose: Executes all pending migrations against the database

# Revert last migration
npm run migration:revert
# Purpose: Rolls back the most recent migration

# Synchronize database schema
npm run schema:sync
# Purpose: Updates database schema to match entities (use with caution in production)

# Drop database schema
npm run schema:drop
# Purpose: Removes all database tables and data (destructive operation)
```

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build project
npm run build
```

# NestGlobalServer

# SurveyServer
