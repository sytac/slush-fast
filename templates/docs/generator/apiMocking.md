#### API Mocking

In order to mock api requests place your files inside `./test/mock`. When running the development
server you can access those files using regular http requests.

For example, placing `test.json` inside `./test/mock/api` will make it available by requesting
`http://localhost:3001/api/test.json`.
