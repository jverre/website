# Jacques' Blog

> [!Note]
> This website is deployed at [jacquesverre.com](https://jacquesverre.com).

This is my personal blog, I use it to write about my explorations in the LLM space.

This website is built with Next.js, Cursor and deployed on Vercel.

## Development

You can run the development server with:

```bash
yarn run dev
```

### Environment Variables

To use the ASCII Art Generator feature, you need to set up your Anthropic API key:

1. Create a `.env.local` file in the root directory
2. Add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```
3. Restart the development server if it's already running

## Deployment

To deploy the website, simply push to the `main` branch and Vercel will automatically deploy the changes.

Make sure to add the `ANTHROPIC_API_KEY` environment variable in your Vercel project settings.