# Frontend Development Guidelines

## Project Structure

This frontend application follows the Next.js 16+ App Router pattern with TypeScript and Tailwind CSS.

## Technology Stack
- Next.js 16+ (App Router)
- TypeScript 5.0+
- React 19+
- Tailwind CSS
- Better Auth (for JWT-based authentication)

## Development Guidelines

### Authentication
- Use Better Auth for JWT-based authentication
- Store JWT tokens in browser storage
- Ensure all API calls include proper Authorization headers
- Implement route protection using Next.js middleware

### Component Structure
- Place UI components in `components/ui/`
- Place layout components in `components/layout/`
- Use consistent naming conventions (PascalCase for components)
- Follow accessibility best practices

### API Communication
- Use centralized API client in `lib/api.ts`
- Attach JWT to all authenticated requests
- Handle 401 responses by redirecting to login
- Show appropriate loading and error states

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design approach
- Maintain consistent design language throughout
- Ensure proper contrast ratios for accessibility

### TypeScript
- Use strict typing throughout the application
- Define proper interfaces for data structures
- Leverage TypeScript's type inference where appropriate

## File Organization
- Pages in `app/` directory using App Router structure
- Components in `components/` directory
- Utilities and services in `lib/` directory
- Shared UI components in `components/ui/`
- Layout components in `components/layout/`

## Security Practices
- Validate user input on the frontend
- Never trust user-generated data
- Implement proper error handling
- Sanitize data before displaying
- Use secure storage for sensitive information