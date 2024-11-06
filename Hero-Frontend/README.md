## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI](https://nextui.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)
- [next-themes](https://github.com/pacocoursey/next-themes)

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

### env example

# Frontend Migration Guide

This guide provides instructions for migrating and setting up the Next.js frontend of the Hero-WOT project.

## Prerequisites

Before beginning, ensure you have:

- [ ] GitHub account/organization
- [ ] Vercel account
- [ ] Node.js and npm/yarn installed
- [ ] Git installed
- [ ] Access to required service accounts (Google, Auth0, Mailgun)

## Project Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd Hero-Frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file for development. Below is a complete list of all required environment variables:

### Environment Variables Description

GOOGLE_CLOUD_PROJECT_ID=project-name-in-google-cloud
GOOGLE_CLOUD_CLIENT_EMAIL=username@project-name.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY_ID=123examplekey123
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\long-example-key\n-----END PRIVATE KEY-----\n"
GOOGLE_CLOUD_STORAGE_BUCKET=cloud-storage-bucket-name
NEXT_PUBLIC_API_URL=https://project-name-in-google-cloud.appspot.com

## Local Development

1. Start the development server:

```bash
npm run dev
```

2. View the application at `http://localhost:3000`

## Production Deployment (Vercel)

### 1. Repository Preparation

```bash
# Create new repository (if needed)
git remote remove origin
git remote add origin <your-new-repo-url>
git push -u origin main
```

### 2. Vercel Setup

1. Log in to Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Environment Variables in Vercel

Add all environment variables in Vercel project settings:

1. Go to Project Settings → Environment Variables
2. Add each environment variable from the list above
3. Ensure all variables prefixed with `NEXT_PUBLIC_` are properly set
4. Set `NODE_ENV` to `production`

### 4. Domain Configuration

1. Go to Vercel project settings → Domains
2. Add your custom domain
3. Configure DNS records:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

## Troubleshooting

### Environment Variables Issues

1. Verify all environment variables are properly set in Vercel
2. Check variable naming (case sensitive)
3. Verify secret values are correctly formatted
4. Check for missing environment variables

### Build Errors

1. Check Vercel build logs
2. Verify all dependencies are properly listed in `package.json`
3. Check for any TypeScript errors

### Runtime Errors

1. Check browser console for errors
2. Verify API endpoint configuration
3. Check authentication setup
4. Verify email service configuration

### API Connection Issues

1. Check CORS configuration
2. Verify API endpoint URLs
3. Check network request format
4. Verify authentication tokens

## Post-Deployment Checklist

- [ ] Verify all environment variables
- [ ] Test authentication flow
- [ ] Test API connections
- [ ] Test email functionality
- [ ] Check all major user flows
- [ ] Verify custom domain setup
- [ ] Test responsiveness
- [ ] Check browser compatibility
- [ ] Verify SEO meta tags

## Security Notes

- Keep environment variables secure
- Never commit sensitive data
- Regularly update dependencies
- Use proper encryption for sensitive data
- Follow security best practices
- Regularly rotate API keys and secrets

## Support Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Auth0 Documentation](https://auth0.com/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Mailgun Documentation](https://documentation.mailgun.com)

---

For additional support or questions, please refer to the project documentation or contact the development team.
