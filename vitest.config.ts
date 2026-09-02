import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'app/**/*.{test,spec}.ts',
            'server/**/*.{test,spec}.ts'
          ],
          exclude: ['**/*.nuxt.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: [
            'test/nuxt/**/*.{test,spec}.ts',
            '**/*.nuxt.{test,spec}.ts'
          ],
          environment: 'nuxt'
        }
      })
    ]
  }
})
