# Phonebook-Backend
Online link: https://phonebook-wij6.onrender.com/

## Local frontend
Api is on the 3000 port, the frontend is on the 5173 port.
The proxy for the Vite was added like this:
```js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000/',
    }
  }
})
```