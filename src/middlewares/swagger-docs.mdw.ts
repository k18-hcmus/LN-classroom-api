import swaggerDocument from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Classroom Management Express API with Swagger",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8081/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export default swaggerDocument(options);
