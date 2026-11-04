import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

// SWC compiles the Nest decorators of @nick-lukashik/auth/nest for the tests.
export default defineConfig({
    plugins: [
        swc.vite(),
    ],
    test: {
        include: [
            '*/src/**/*.test.ts',
        ],
    },
})
