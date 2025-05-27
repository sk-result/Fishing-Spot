import express from "express";
import fishSpeciesRoutes from "./routes/FishSpeciesRoute.js";
import fishingRoutes from "./routes/FishingSpotRoute.js";
import UsersRoutes from "./routes/UsersRoute.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

const swaggerDocument = YAML.load("./swagger.yaml");
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/fishing", fishingRoutes);
app.use("/api/species", fishSpeciesRoutes);
app.use("/api/users", UsersRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
