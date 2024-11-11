# clip-wise

> A chrome extension that simplifies the learning process on YouTube

## TODO
- [ ] Convert the codebase completely to typescript
- [ ] Use tailwindcss for styling and remove the custom css
- [ ] Try and improve the prompt
- [ ] Make it available also for firefox
- [ ] Fix: The sidebar closes when switching to a different tab
- [ ] Remove //@ts-ignore and fix the issue.
- [ ] Handle and display error when there is no transcript available for the video 
- [ ] Fix: Input field not working for entering the API key for Gemini AI
- [ ] Add the common loader for flashcards
- [ ] Inform the user that they cannot do anything without an API key, whenever they try to use some feature, redirect them to the settings page with a message. 

## Available Scripts

In the project directory, you can run the following scripts:

### pnpm dev

**Development Mode**: This command runs your extension in development mode. It will launch a new browser instance with your extension loaded. The page will automatically reload whenever you make changes to your code, allowing for a smooth development experience.

```bash
pnpm dev
```

### pnpm start

**Production Preview**: This command runs your extension in production mode. It will launch a new browser instance with your extension loaded, simulating the environment and behavior of your extension as it will appear once published.

```bash
pnpm start
```

### pnpm build

**Build for Production**: This command builds your extension for production. It optimizes and bundles your extension, preparing it for deployment to the target browser's store.

```bash
pnpm build
```

## Learn More

To learn more about creating cross-browser extensions with Extension.js, visit the [official documentation](https://extension.js.org).
