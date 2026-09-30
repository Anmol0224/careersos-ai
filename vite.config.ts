import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-routes',
        configureServer(server) {
          server.middlewares.use('/api/evaluate-challenge', async (req, res, next) => {
            try {
              const module = await server.ssrLoadModule('/api/evaluate-challenge.ts');
              let body = '';
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', async () => {
                if (body) {
                  try {
                    Object.assign(req, { body: JSON.parse(body) });
                  } catch {
                    // ignore parse error
                  }
                }
                
                const resExt = res as unknown as Record<string, unknown>;
                resExt.status = (code: number) => {
                  res.statusCode = code;
                  return res;
                };
                resExt.json = (data: unknown) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                };
                
                try {
                  await module.default(req, res);
                } catch {
                  (resExt.status as (code: number) => typeof res)(500);
                  (resExt.json as (data: unknown) => void)({ success: false, error: 'Internal Server Error' });
                }
              });
            } catch (e) {
              next(e);
            }
          });
        }
      }
    ]
  };
});
