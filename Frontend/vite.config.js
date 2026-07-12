import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Load React Compiler config if it exists
const loadCompilerConfig = () => {
  const configPath = path.resolve(__dirname, 'react-compiler.config.json')
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      return config
    } catch (error) {
      console.warn('Failed to load react-compiler.config.json:', error.message)
      return {}
    }
  }
  return {}
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  const isDevelopment = mode === 'development'
  const isTest = mode === 'test'

  const compilerConfig = loadCompilerConfig()

  return {
    resolve: {},
    plugins: [
      react({
        // Enable React Compiler only in production and development (not in test)
        babel: {
          plugins: isTest 
            ? [] 
            : [
                [
                  'babel-plugin-react-compiler',
                  {
                    ...compilerConfig,
                    // Override based on environment
                    environment: {
                      ...compilerConfig.environment,
                      log: isDevelopment ? 'warn' : 'error',
                      enableDebugMode: isDevelopment && env.VITE_REACT_COMPILER_DEBUG === 'true'
                    },
                    performance: {
                      ...compilerConfig.performance,
                      enableProfiling: isDevelopment && env.VITE_REACT_COMPILER_PROFILING === 'true',
                      trackRenderCount: isDevelopment && env.VITE_REACT_COMPILER_TRACK_RENDERS === 'true',
                      trackRenderTime: isDevelopment && env.VITE_REACT_COMPILER_TRACK_TIME === 'true'
                    },
                    errorHandling: {
                      ...compilerConfig.errorHandling,
                      continueOnError: isDevelopment,
                      throwOnError: isProduction,
                      logErrors: true
                    }
                  }
                ]
              ]
        },
        // Fast refresh for development
        fastRefresh: isDevelopment,
        // Remove React props in production
        removeImportAssertions: isProduction
      })
    ],
    // Build optimizations
    build: {
      sourcemap: isDevelopment ? 'inline' : false,
      minify: isProduction ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: isProduction ? (id) => {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router-vendor'
            }
          } : undefined
        }
      },
      // Increase chunk size warning limit for enterprise apps
      chunkSizeWarningLimit: 1000
    },
    // Define environment variables
    define: {
      __REACT_COMPILER_ENABLED__: JSON.stringify(!isTest),
      __REACT_COMPILER_MODE__: JSON.stringify(mode)
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
      exclude: isTest ? ['@testing-library/react'] : []
    },
    // Server configuration for development
    server: {
      hmr: isDevelopment,
      watch: {
        // Ignore node_modules and build directories
        ignored: ['**/node_modules/**', '**/dist/**', '**/.react-compiler-cache/**']
      }
    }
  }
})