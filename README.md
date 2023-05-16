# leasing-app

## Preconditions needed to run the application

### TechnicalConstraints

Make sure you have installed or instal:

* Node version v18.16.0
* Angular version 14
* Docker
* OpenAPI Generator `npm install @openapitools/openapi-generator-cli -g`

### StartTheBackend

**Use a docker image**

* The docker image can be pulled with the following command: `docker pull walterallane/leasing-api:latest`
* The docker image can be started as follows:
`docker run -p 8080:8080 --name leasing-api -d walterallane/leasing-api:latest`
* After the container is up and running you could access the api over the swagger ui: [http://localhost:8080/swagger-ui/index.html]
* The backend implementation is based on the OpenAPI specification which could be found here: [https://github.com/walter-business/leasing-contract/blob/main/leasing.yaml]

### Dependencies and Environment setup

```
npm install
```

**Generate client code**

```
npx openapi-generator generate -i https://raw.githubusercontent.com/walter-business/leasing-contract/main/leasing.yaml -g typescript-angular -o /path/to/output/folder
```

__Note:__ In the current implementation, the client code was generated to the `src/app/api` folder, so the step with it generated should be missed.

## Start the application

### Developer mode

```
ng serve
```

### Product mode

```
ng build
```

Then inside the project directory (in the terminal), run:

```
http-server dist/leasing-app
```

## Reason of chosen solution

### Solution detais:

It is a single page application built on the principle of usability. When the user natively understands what he needs to do and where to click to get the desired result.

The list of contracts is placed in a table for better visibility, each row has an icon by clicking on which opens a section with detailed information on the selected contract.

Under the table on the right is a button that makes it easy to add a new contact.

After the panel with the contract has opened before it is closed, the choice of the next contract is impossible. This eliminates confusion and allows the user to concentrate on editing the selected contract.

In the field editing mode, the Customer and Vehicles can be either edited by clicking on the field or icon or cleared and re-filled by clicking the trash can icon.

All actions for editing these fields will take effect only after clicking the Save button from the contract panel. This is done so that the user can cancel his changes at any time.

After pressing the Save button, the contract panel closes, and the Contracts table accepts updated data.

### OpenAPI:

*** Standardization:** OpenAPI provides a standard, language-agnostic interface to RESTful APIs, which allows both humans and computers to discover and understand the capabilities of the service.

### Angular Material:

*** Consistent, Modern Look and Feel:** Angular Material provides a set of reusable, well-tested, and accessible UI components based on Material Design.
*** Responsive:** Angular Material components are designed to work for both web and mobile, ensuring that your application is accessible on all kinds of devices.
*** Easy Integration with Angular:** Angular Material is built specifically for Angular, so it integrates well and follows the same development philosophy.

### Lodash:

*** Utility Functions:** Lodash provides a wealth of utility functions that deal with the manipulation and combination of arrays, objects, and functions.
*** Performance:** Many Lodash functions are highly optimized for performance.

### http-server:

*** Simplicity:** It's a simple, zero-configuration command-line HTTP server, making it quick and easy to get a server running.

