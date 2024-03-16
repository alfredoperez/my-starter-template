# My Starter Template



# Features 

## All the Features from the original template

- Nx Angular Standalone App
- Component Testing with Cypress and Testing Library
- StoryBook for Component Documentation
- Esbuild Bundler
- GitHub Actions with Nx Cloud
- 🐙Testing Library for Cypress and StoryBook
- [Sheriff](https://github.com/softarc-consulting/sheriff) to enforce enforces module boundaries and dependency rules in
  TypeScript


# Features specific to this library
- [PrimeNG](https://primeng.org/installation), [PrimeFlex](https://primeflex.org/) and [PrimeIcons](https://primefaces.org/primeicons)
- [AG grid](https://www.ag-grid.com/) 
- [JSON Server](https://github.com/typicode/json-server/tree/v0) for Mocking API


# Sheriff Configuration

```
| - 📁 { domain }
|   | - 📁 containers  // Container Components like pages, modals, etc
|   | - 📁 data        // This includes services, models, and state management related to the server state
|   | - 📁 ui          // Presentational Components and directives
|   | {domain}.routing.ts
|   | index.ts 
| - 📁 shared  
|   | - 📁 ui          // Reusable Presentational Components, directives, animations and pipes
```

## Guidelines

- **Containers** are components that have access to data and state. They should have a suffix name of page, modal, or drawer.
- Domains should be added to the paths in the TypeScript configuration file.
